-- Run only against an isolated local Supabase stack: supabase test db.
begin;
create extension if not exists pgtap with schema extensions;
set search_path=public,extensions;
select plan(6);
insert into auth.users(id,email,email_confirmed_at) values
 ('a1111111-1111-4111-8111-111111111111','lancealot-a@example.test',now()),
 ('b2222222-2222-4222-8222-222222222222','lancealot-b@example.test',now());
set local role authenticated;
select set_config('request.jwt.claim.sub','a1111111-1111-4111-8111-111111111111',true);
select public.bootstrap_workspace();
select public.save_record('client',null,null,'{"name":"Policy fixture"}'::jsonb);
select set_config('test.client_id',(select id::text from public.clients where name='Policy fixture'),true);
select is((select count(*) from public.clients),1::bigint,'owner reads own client');
select set_config('request.jwt.claim.sub','b2222222-2222-4222-8222-222222222222',true);
select public.bootstrap_workspace();
select is((select count(*) from public.clients),0::bigint,'another owner cannot read client');
select throws_ok($$select public.save_record('client',current_setting('test.client_id')::uuid,1,'{"name":"Unauthorized"}')$$,'40001',null,'cross-owner mutation fails');
select throws_ok($$insert into public.clients(owner_id,name) values(auth.uid(),'Bypass')$$,'42501',null,'raw table write bypass denied');
reset role;
update public.accounts set state='deleting' where id='a1111111-1111-4111-8111-111111111111';
set local role authenticated;
select set_config('request.jwt.claim.sub','a1111111-1111-4111-8111-111111111111',true);
select ok(public.workspace_snapshot() is null,'locked account cannot read snapshot');
select throws_ok('select public.bootstrap_workspace()','42501',null,'locked account cannot bootstrap again');
select * from finish();
rollback;
