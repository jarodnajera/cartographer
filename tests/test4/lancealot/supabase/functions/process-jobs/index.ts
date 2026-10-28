import { createClient } from 'npm:@supabase/supabase-js@2.118.0'
import { runJobs, resendDriver, type Claim, type DeletionClaim, type Envelope, type Outcome } from '../_shared/jobs.ts'
import { json, secretMatches } from '../_shared/http.ts'
Deno.serve(async req => {
  if(req.method!=='POST')return json({error:'Method not allowed.'},405)
  const token=req.headers.get('Authorization')?.replace(/^Bearer /,'')||''
  if(!await secretMatches(token,Deno.env.get('WORKER_SECRET')||''))return json({error:'Unauthorized.'},401)
  const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if(!url||!key)return json({error:'Worker configuration is incomplete.'},503)
  const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  async function rpc<T>(name:string,args:Record<string,unknown>={}){const {data,error}=await admin.rpc(name,args);if(error)throw error;return data as T}
  const mailKey=Deno.env.get('EMAIL_API_KEY'),from=Deno.env.get('EMAIL_FROM'),appUrl=Deno.env.get('APP_URL')
  const provider=Deno.env.get('EMAIL_PROVIDER')
  const driver=provider==='resend'&&mailKey&&from&&appUrl?resendDriver(mailKey,from,appUrl):null
  try {
    const result=await runJobs({
      claimDigests:()=>rpc<Claim[]>('claim_digests',{p_limit:5}),
      authorize:(c:Claim)=>rpc<Envelope|null>('authorize_digest',{p_job:c.id,p_token:c.token}),
      finishDigest:(c:Claim,o:Outcome)=>rpc<void>('finish_digest',{p_job:c.id,p_token:c.token,p_outcome:o.outcome,p_retry_seconds:o.retrySeconds||0}),
      claimDeletions:()=>rpc<DeletionClaim[]>('claim_deletions',{p_limit:5}),
      purge:(c:DeletionClaim)=>rpc<boolean>('purge_account_records',{p_job:c.id,p_token:c.token}),
      async deleteIdentity(owner:string){const {error}=await admin.auth.admin.deleteUser(owner);if(error&&error.status!==404)throw error},
      finishDeletion:(c:DeletionClaim,success:boolean)=>rpc<void>('finish_account_deletion',{p_job:c.id,p_token:c.token,p_success:success}),
    },driver)
    return json({...result,emailConfigured:driver!==null})
  }catch{return json({error:'Job processing did not finish. Inspect job states before retrying.'},500)}
})
