import { PGlite } from '@electric-sql/pglite'
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import type { Snapshot, Attention } from '../src/lib/types'
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002',U='00000000-0000-4000-8000-000000000003'
let db:PGlite
async function actor(id:string){await db.exec(`reset role;set role authenticated;select set_config('request.jwt.claim.sub','${id}',false);`)}
async function bootstrap(id:string){await actor(id);await db.query('select public.bootstrap_workspace()')}
async function save(kind:string,data:Record<string,unknown>,id:string|null=null,version:number|null=null){return db.query('select public.save_record($1,$2::uuid,$3::integer,$4::jsonb)',[kind,id,version,JSON.stringify(data)])}
async function snapshot(){return (await db.query<{value:Snapshot}>('select public.workspace_snapshot() as value')).rows[0]!.value}
async function addClient(name='Client'){await save('client',{name});return (await snapshot()).clients.find(c=>c.name===name)!}
async function addProject(client:string,name='Project',deadline:string|null=null,status='active'){await save('project',{client_id:client,name,deadline,status});return (await snapshot()).projects.find(p=>p.name===name)!}
async function invoice(project_id:string,reference:string,amount='10.00',currency='USD',due_date='2026-10-27'){await save('invoice',{project_id,reference,amount,currency,due_date,paid:false})}
beforeAll(async()=>{
  db=new PGlite()
  await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth,public to authenticated,anon;`)
  for(const file of ['202610280001_workspace.sql','202610280002_currencies.sql','202610280003_jobs.sql'])await db.exec(readFileSync(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'))
})
afterAll(async()=>{await db?.close()})
beforeEach(async()=>{
  await db.exec(`reset role;truncate private.deletion_jobs;insert into private.feature_gates(singleton) values(true) on conflict do nothing;update private.feature_gates set digest_ready=false,deletion_ready=false,cleanup_max_attempts=5,cleanup_retry_seconds=300;truncate auth.users cascade;insert into auth.users values ('${A}','a@example.test',now()),('${B}','b@example.test',now()),('${U}','unverified@example.test',null);`)
  await bootstrap(A);await bootstrap(B);await actor(A)
})
describe('database authority and lifecycle',()=>{
  it('denies anonymous/unverified workspaces and binds owner to the caller',async()=>{
    await actor(U);await expect(db.query('select public.bootstrap_workspace()')).rejects.toMatchObject({code:'42501'})
    await db.exec('reset role;set role anon');await expect(db.query('select public.workspace_snapshot()')).rejects.toMatchObject({code:'42501'})
    await actor(A);await save('client',{name:'Owned',owner_id:B});expect((await snapshot()).clients[0]!.owner_id).toBe(A)
    await expect(db.query("insert into public.clients(owner_id,name) values($1,'raw bypass')",[A])).rejects.toMatchObject({code:'42501'})
  })
  it('enforces direct-read RLS, foreign-key ownership and non-enumerating mutation failures',async()=>{
    const mine=await addClient('A client');await actor(B);const other=await addClient('B client');await actor(A)
    const rows=await db.query<{id:string}>('select id from public.clients');expect(rows.rows.map(r=>r.id)).toEqual([mine.id])
    await expect(addProject(other.id)).rejects.toMatchObject({code:'23503'})
    await expect(save('client',{name:'stolen'},other.id,other.version)).rejects.toMatchObject({code:'40001'})
  })
  it('rejects stale edits and protected parent deletion without partial changes',async()=>{
    const c=await addClient(),p=await addProject(c.id)
    await save('client',{name:'Renamed'},c.id,c.version)
    await expect(save('client',{name:'stale'},c.id,c.version)).rejects.toMatchObject({code:'40001'})
    await expect(db.query("select public.delete_record('client',$1,2)",[c.id])).rejects.toMatchObject({code:'23503'})
    expect((await snapshot()).projects[0]!.id).toBe(p.id)
    expect((await snapshot()).clients[0]!.name).toBe('Renamed')
  })
  it('closes stale-token access immediately at account lock and prevents bootstrap resurrection',async()=>{
    await addClient();await db.exec(`reset role;update public.accounts set state='deleting' where id='${A}'`);await actor(A)
    expect(await snapshot()).toBeNull()
    expect((await db.query('select id from public.clients')).rows).toHaveLength(0)
    await expect(save('client',{name:'resurrection'})).rejects.toMatchObject({code:'42501'})
    await expect(db.query('select public.bootstrap_workspace()')).rejects.toMatchObject({code:'42501'})
    await actor(B);expect(await snapshot()).not.toBeNull()
  })
})
describe('invoice integrity and shared attention',()=>{
  it('retains exact monetary strings and validates currency precision/positive amounts',async()=>{
    const c=await addClient(),p=await addProject(c.id)
    await invoice(p.id,'large','9007199254740993.01');await invoice(p.id,'historic','14.50','DEM')
    for(const amount of ['0','-2','NaN','Infinity','1e3','1.001'])await expect(invoice(p.id,'bad',amount)).rejects.toBeDefined()
    await expect(invoice(p.id,'yen','1.5','JPY')).rejects.toMatchObject({code:'22023'})
    const data=await snapshot();expect(data.invoices.find(i=>i.reference==='large')!.amount).toBe('9007199254740993.01')
    expect(data.invoices.find(i=>i.reference==='historic')!.currency).toBe('DEM')
    const exported=(await db.query<{v:{workspace:Snapshot}}>('select public.export_workspace() as v')).rows[0]!.v
    expect(exported.workspace.invoices.find(i=>i.reference==='large')!.amount).toBe('9007199254740993.01')
    expect(JSON.stringify(exported)).not.toContain('password')
  })
  it('enforces per-client references and atomically rejects conflicting project moves',async()=>{
    const c1=await addClient('One'),c2=await addClient('Two'),p1=await addProject(c1.id,'First'),p2=await addProject(c1.id,'Second'),p3=await addProject(c2.id,'Third')
    await invoice(p1.id,' INV-1 ');await expect(invoice(p2.id,'inv-1')).rejects.toMatchObject({code:'23505'})
    await invoice(p3.id,'INV-1')
    await expect(save('project',{...p3,client_id:c1.id},p3.id,p3.version)).rejects.toMatchObject({code:'23505'})
    const data=await snapshot();expect(data.projects.find(p=>p.id===p3.id)!.client_id).toBe(c2.id)
    expect(data.invoices.find(i=>i.project_id===p3.id)!.client_id).toBe(c2.id)
  })
  it('keeps outstanding children independent of project state and honors exact date boundaries',async()=>{
    const c=await addClient(),done=await addProject(c.id,'Delivered','2026-10-20','completed'),soon=await addProject(c.id,'Soon','2026-10-31'),later=await addProject(c.id,'Later','2026-11-01')
    await save('task',{project_id:done.id,title:'Follow up',followup_date:'2026-10-28',completed:false})
    await save('task',{project_id:done.id,title:'No date',followup_date:null,completed:false})
    await invoice(done.id,'overdue','10.00','USD','2026-10-27');await invoice(done.id,'due-today','10.00','USD','2026-10-28')
    let items=(await db.query<{v:Attention[]}>('select public.attention_items($1::date) as v',['2026-10-28'])).rows[0]!.v
    expect(items.map(i=>i.title).sort()).toEqual(['Follow up','Soon','overdue'])
    expect(items.some(i=>i.id===later.id)).toBe(false);expect(items.some(i=>i.id===done.id)).toBe(false)
    const data=await snapshot(),task=data.tasks.find(t=>t.title==='Follow up')!,inv=data.invoices.find(i=>i.reference==='overdue')!
    await save('task',{...task,completed:true},task.id,task.version);await save('invoice',{...inv,paid:true},inv.id,inv.version)
    items=(await db.query<{v:Attention[]}>('select public.attention_items($1::date) as v',['2026-10-28'])).rows[0]!.v
    expect(items.map(i=>i.id)).toEqual([soon.id])
  })
})

async function service(){await db.exec('reset role;set role service_role')}
async function prepareDueDigest(){
  const c=await addClient(),p=await addProject(c.id)
  await invoice(p.id,'due','10.00','USD','2000-01-01')
  await db.exec(`reset role;update private.feature_gates set digest_ready=true;update public.workspace_settings set timezone='UTC',digest_time='00:00',email_enabled=true,next_digest_date=current_date where owner_id='${A}'`)
  await service()
}
async function claimDigest(){return (await db.query<{v:{id:string;token:string}[]}>('select public.claim_digests() as v')).rows[0]!.v}
async function authorizeDigest(c:{id:string;token:string}){return (await db.query<{v:unknown}>('select public.authorize_digest($1,$2) as v',[c.id,c.token])).rows[0]!.v}
describe('durable worker rules',()=>{
  it('gates privileged jobs and never blindly reclaims an unknown send',async()=>{
    await expect(db.query('select public.claim_digests()')).rejects.toMatchObject({code:'42501'})
    await prepareDueDigest();const c=(await claimDigest())[0]!
    expect(await claimDigest()).toEqual([]);expect(await authorizeDigest(c)).not.toBeNull()
    await db.query("select public.finish_digest($1,$2,'unknown')",[c.id,c.token])
    expect(await claimDigest()).toEqual([])
    await db.exec('reset role');expect((await db.query<{state:string}>('select state from private.digest_jobs')).rows[0]!.state).toBe('unknown')
  })
  it('fences expired claimants and closes dispatch after account lock',async()=>{
    await prepareDueDigest();const old=(await claimDigest())[0]!
    await db.exec("reset role;update private.digest_jobs set lease_until=now()-interval '1 minute'");await service();const current=(await claimDigest())[0]!
    expect(current.token).not.toBe(old.token);expect(await authorizeDigest(old)).toBeNull()
    await db.exec(`reset role;update public.accounts set state='deleting' where id='${A}'`);await service()
    expect(await authorizeDigest(current)).toBeNull()
  })
  it('bounds known-failure attempts and skips empty digests',async()=>{
    await prepareDueDigest()
    for(let n=1;n<=3;n++){
      const c=(await claimDigest())[0]!;expect(await authorizeDigest(c)).not.toBeNull()
      await db.query("select public.finish_digest($1,$2,'temporary',0)",[c.id,c.token])
      await db.exec("reset role;update private.digest_jobs set next_attempt=now()-interval '1 minute'");await service()
    }
    expect(await claimDigest()).toEqual([])
    await db.exec("reset role;delete from private.digest_jobs;update public.invoices set paid=true");await service()
    const empty=(await claimDigest())[0]!;expect(await authorizeDigest(empty)).toBeNull();expect(await claimDigest()).toEqual([])
  })
  it('preserves future scheduling after settings edits rather than replaying a past time',async()=>{
    await db.query("select public.save_settings('UTC','00:00',true,1)")
    const next=(await db.query<{v:string}>("select next_digest_date::text as v from public.workspace_settings")).rows[0]!.v
    const tomorrow=(await db.query<{v:string}>("select (current_date+1)::text as v")).rows[0]!.v
    expect(next).toBe(tomorrow)
  })
  it('locks, purges and completes erasure without changing another owner, even with an old JWT',async()=>{
    const mine=await addClient('Erase me');await actor(B);await addClient('Keep me');await actor(A)
    await service();await expect(db.query('select public.begin_account_deletion($1) as id',[A])).rejects.toMatchObject({code:'55000'})
    await db.exec('reset role;update private.feature_gates set deletion_ready=true');await service();await db.query('select public.begin_account_deletion($1)',[A])
    await actor(A);expect(await snapshot()).toBeNull();await expect(save('client',{name:'new'})).rejects.toMatchObject({code:'42501'})
    await service();const claim=(await db.query<{v:{id:string;token:string;owner:string}[]}>('select public.claim_deletions() as v')).rows[0]!.v[0]!
    expect((await db.query<{v:boolean}>('select public.purge_account_records($1,$2) as v',[claim.id,claim.token])).rows[0]!.v).toBe(true)
    await expect(db.query('select public.finish_account_deletion($1,$2,true)',[claim.id,claim.token])).rejects.toThrow('Identity removal is not complete')
    await db.exec(`reset role;delete from auth.users where id='${A}'`);await service();await db.query('select public.finish_account_deletion($1,$2,true)',[claim.id,claim.token])
    await actor(B);expect((await snapshot()).clients[0]!.name).toBe('Keep me')
    await actor(A);expect(await snapshot()).toBeNull();await expect(db.query('select public.bootstrap_workspace()')).rejects.toMatchObject({code:'42501'})
    await db.exec('reset role');expect((await db.query('select * from public.clients where id=$1',[mine.id])).rows).toHaveLength(0)
    expect((await db.query<{state:string;owner_id:null}>('select state,owner_id from private.deletion_jobs')).rows[0]).toMatchObject({state:'done',owner_id:null})
  })
})

describe('local-day scheduling and cleanup recovery',()=>{
  it('sends at the first valid local time after a DST gap, not thirty minutes later',async()=>{
    await prepareDueDigest();await db.exec("reset role;update public.workspace_settings set timezone='America/Los_Angeles',digest_time='02:30',next_digest_date=null");await service()
    const claimAt=async(instant:string)=>(await db.query<{v:{id:string;token:string}[]}>('select public.claim_digests(25,$1::timestamptz) as v',[instant])).rows[0]!.v
    expect(await claimAt('2026-03-08T09:59:00Z')).toEqual([])
    const c=(await claimAt('2026-03-08T10:00:00Z'))[0]!
    const envelope=(await db.query<{v:{date:string}}> ('select public.authorize_digest($1,$2,$3::timestamptz) as v',[c.id,c.token,'2026-03-08T10:00:00Z'])).rows[0]!.v
    expect(envelope.date).toBe('2026-03-08')
    await db.query("select public.finish_digest($1,$2,'accepted',0,$3::timestamptz)",[c.id,c.token,'2026-03-08T10:00:00Z'])
    expect(await claimAt('2026-03-08T10:30:00Z')).toEqual([])
  })
  it('processes one logical date through both instances of a repeated local hour',async()=>{
    await prepareDueDigest();await db.exec("reset role;update public.workspace_settings set timezone='America/Los_Angeles',digest_time='01:30',next_digest_date=null");await service()
    const rows=(await db.query<{v:{id:string;token:string}[]}>('select public.claim_digests(25,$1::timestamptz) as v',['2026-11-01T08:30:00Z'])).rows[0]!.v,c=rows[0]!
    expect((await db.query<{v:unknown}>('select public.authorize_digest($1,$2,$3::timestamptz) as v',[c.id,c.token,'2026-11-01T08:30:00Z'])).rows[0]!.v).not.toBeNull()
    await db.query("select public.finish_digest($1,$2,'accepted',0,$3::timestamptz)",[c.id,c.token,'2026-11-01T08:30:00Z'])
    expect((await db.query<{v:unknown[]}>('select public.claim_digests(25,$1::timestamptz) as v',['2026-11-01T09:30:00Z'])).rows[0]!.v).toEqual([])
  })
  it('invalidates a claim on settings changes and creates no historical backlog after outage',async()=>{
    await prepareDueDigest();const c=(await claimDigest())[0]!
    await actor(A);const settings=(await snapshot()).settings
    await db.query("select public.save_settings('Pacific/Kiritimati','23:59',true,$1)",[settings.version])
    await service();expect(await authorizeDigest(c)).toBeNull()
    await db.exec("reset role;delete from private.digest_jobs;update public.workspace_settings set timezone='UTC',digest_time='00:00',next_digest_date=null");await service()
    await db.query('select public.claim_digests(25,$1::timestamptz)',['2030-02-03T12:00:00Z'])
    await db.exec('reset role');expect((await db.query<{d:string}>('select local_date::text as d from private.digest_jobs')).rows.map(x=>x.d)).toEqual(['2030-02-03'])
  })
  it('retries partial erasure only to the configured bound and keeps the account locked',async()=>{
    await addClient();await db.exec('reset role;update private.feature_gates set deletion_ready=true,cleanup_max_attempts=2');await service();await db.query('select public.begin_account_deletion($1)',[A])
    for(let i=0;i<2;i++){
      const c=(await db.query<{v:{id:string;token:string}[]}>('select public.claim_deletions() as v')).rows[0]!.v[0]!
      await db.query('select public.finish_account_deletion($1,$2,false)',[c.id,c.token])
      await db.exec("reset role;update private.deletion_jobs set next_attempt=now()-interval '1 minute'");await service()
    }
    expect((await db.query<{v:unknown[]}>('select public.claim_deletions() as v')).rows[0]!.v).toEqual([])
    await db.exec('reset role');expect((await db.query<{state:string}>('select state from private.deletion_jobs')).rows[0]!.state).toBe('needs_operator')
    await actor(A);expect(await snapshot()).toBeNull()
  })
})


it('fails closed when the runtime gate row is missing',async()=>{
 await db.exec('reset role;update private.feature_gates set deletion_ready=true');await service();await db.query('select public.begin_account_deletion($1)',[A]);await db.exec('reset role;delete from private.feature_gates');await service()
 expect(await claimDigest()).toEqual([])
 for(let i=0;i<5;i++){const c=(await db.query<{v:{id:string;token:string}[]}>('select public.claim_deletions() as v')).rows[0]!.v[0]!;await db.query('select public.finish_account_deletion($1,$2,false)',[c.id,c.token]);await db.exec("reset role;update private.deletion_jobs set next_attempt=now()-interval '1 minute'");await service()}
 expect((await db.query<{v:unknown[]}>('select public.claim_deletions() as v')).rows[0]!.v).toEqual([])
 await expect(db.query('select public.begin_account_deletion($1)',[A])).rejects.toMatchObject({code:'55000'})
 await actor(A);expect((await db.query<{v:{digest:boolean;deletion:boolean}}>('select public.feature_status() as v')).rows[0]!.v).toMatchObject({digest:false,deletion:false})
})
