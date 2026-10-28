-- Disabled-by-default service gates. An operator enables these only after D18 setup/verification.
create table private.feature_gates(singleton boolean primary key default true check(singleton),digest_ready boolean not null default false,deletion_ready boolean not null default false,cleanup_max_attempts integer not null default 5 check(cleanup_max_attempts between 1 and 10),cleanup_retry_seconds integer not null default 300 check(cleanup_retry_seconds between 30 and 86400));
insert into private.feature_gates(singleton) values(true);
revoke all on private.feature_gates from public,anon,authenticated;
create function public.feature_status() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce((select jsonb_build_object('digest',digest_ready and private.is_active(),'deletion',deletion_ready and private.is_active()) from private.feature_gates where singleton),jsonb_build_object('digest',false,'deletion',false,'status',null))
$$;
revoke all on function public.feature_status() from public,anon;
grant execute on function public.feature_status() to authenticated;

alter table public.workspace_settings add column next_digest_date date;
create or replace function public.save_settings(p_timezone text,p_time time,p_enabled boolean,p_version integer) returns void
language plpgsql security definer set search_path='' as $$
declare caller uuid; old_settings public.workspace_settings; local_now timestamp;
begin
 caller:=private.lock_account();
 if not exists(select 1 from pg_timezone_names where name=p_timezone) then raise exception 'Choose a valid timezone.' using errcode='22023';end if;
 select * into old_settings from public.workspace_settings where owner_id=caller for update;
 if old_settings.version<>p_version then raise exception 'Settings changed. Reload before saving.' using errcode='40001';end if;
 if old_settings.timezone is not distinct from p_timezone and old_settings.digest_time is not distinct from p_time and old_settings.email_enabled=p_enabled then return;end if;
 local_now:=now() at time zone p_timezone;
 update public.workspace_settings set timezone=p_timezone,digest_time=p_time,email_enabled=p_enabled,
 next_digest_date=local_now::date+case when p_time is null or p_time<=local_now::time then 1 else 0 end where owner_id=caller;
end $$;

create function private.attention_for(p_owner uuid,p_date date) returns jsonb language sql stable security definer set search_path='' as $$
 with eligible_owner as(select a.id from public.accounts a join auth.users u on u.id=a.id where a.id=p_owner and a.state='active' and u.email_confirmed_at is not null),items as (
 select 'task' as kind,t.id,t.title,t.followup_date as relevant_date,p.id as project_id,p.name as project_name,c.name as client_name,p.status as project_status
 from public.tasks t join public.projects p on p.id=t.project_id and p.owner_id=t.owner_id join public.clients c on c.id=p.client_id and c.owner_id=p.owner_id join eligible_owner a on a.id=t.owner_id
 where not t.completed and t.followup_date<=p_date
 union all select 'project',p.id,p.name,p.deadline,p.id,p.name,c.name,p.status from public.projects p join public.clients c on c.id=p.client_id and c.owner_id=p.owner_id join eligible_owner a on a.id=p.owner_id where p.status='active' and p.deadline<=p_date+3
 union all select 'invoice',i.id,i.reference,i.due_date,p.id,p.name,c.name,p.status from public.invoices i join public.projects p on p.id=i.project_id and p.owner_id=i.owner_id join public.clients c on c.id=p.client_id and c.owner_id=p.owner_id join eligible_owner a on a.id=i.owner_id where not i.paid and i.due_date<p_date)
 select coalesce(jsonb_agg(to_jsonb(items) order by relevant_date,title),'[]'::jsonb) from items
$$;
revoke all on function private.attention_for(uuid,date) from public;
create or replace function public.attention_items(p_date date default null) returns jsonb language sql stable security definer set search_path='' as $$
 select private.attention_for(auth.uid(),coalesce(p_date,(now() at time zone coalesce((select timezone from public.workspace_settings where owner_id=auth.uid()),'UTC'))::date))
$$;
create table private.digest_jobs (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null references public.accounts(id) on delete cascade,local_date date not null,timezone text not null,settings_version integer not null,
 state text not null default 'ready' check(state in ('ready','claimed','sending','accepted','unknown','failed','skipped')),attempts integer not null default 0,
 claim_token uuid,lease_until timestamptz,next_attempt timestamptz,first_attempt timestamptz,unique(owner_id,local_date)
);
create table private.deletion_jobs (
 id uuid primary key default gen_random_uuid(),owner_id uuid unique,state text not null default 'ready' check(state in('ready','claimed','done','needs_operator')),
 claim_token uuid,lease_until timestamptz,attempts integer not null default 0,next_attempt timestamptz,created_at timestamptz not null default now(),check((state='done')=(owner_id is null))
);
revoke all on private.digest_jobs,private.deletion_jobs from public,anon,authenticated;

create function public.claim_digests(p_limit integer default 25,p_now timestamptz default now()) returns jsonb language plpgsql security definer set search_path='' as $$
declare item record; job private.digest_jobs; result jsonb:='[]'; token uuid; day date;
begin
 if not coalesce((select digest_ready from private.feature_gates where singleton),false) then return result;end if;
 -- A crash after dispatch authorization is ambiguous. Never blindly reclaim it as a fresh send.
 update private.digest_jobs set state='unknown' where state='sending' and lease_until<p_now;
 for item in select s.* from public.workspace_settings s join public.accounts a on a.id=s.owner_id join auth.users u on u.id=a.id
 where a.state='active' and u.email_confirmed_at is not null and s.email_enabled and s.timezone is not null and s.digest_time is not null
 and (p_now at time zone s.timezone)::time>=s.digest_time
 and (s.next_digest_date is null or (p_now at time zone s.timezone)::date>=s.next_digest_date)
 and not exists(select 1 from private.digest_jobs j where j.owner_id=s.owner_id and j.local_date=(p_now at time zone s.timezone)::date and (j.state in('accepted','unknown','failed','skipped','sending') or j.attempts>=3 or j.next_attempt>p_now or (j.state='claimed' and j.lease_until>p_now)))
 order by s.owner_id limit least(greatest(p_limit,1),100) loop
   perform 1 from public.accounts where id=item.owner_id and state='active' for share;
   if not found then continue;end if;
   day:=(p_now at time zone item.timezone)::date;
   insert into private.digest_jobs(owner_id,local_date,timezone,settings_version) values(item.owner_id,day,item.timezone,item.version) on conflict do nothing;
   select * into job from private.digest_jobs where owner_id=item.owner_id and local_date=day for update skip locked;
   if not found or job.state not in('ready','claimed') or (job.state='claimed' and job.lease_until>p_now) or job.next_attempt>p_now or job.attempts>=3 then continue;end if;
   token:=gen_random_uuid();
   update private.digest_jobs set state='claimed',claim_token=token,lease_until=p_now+interval '2 minutes',timezone=item.timezone,settings_version=item.version where id=job.id;
   result:=result||jsonb_build_array(jsonb_build_object('id',job.id,'token',token));
 end loop;
 return result;
end $$;

create function public.authorize_digest(p_job uuid,p_token uuid,p_now timestamptz default now()) returns jsonb language plpgsql security definer set search_path='' as $$
declare job private.digest_jobs; prefs public.workspace_settings; items jsonb; address text; owner_state text; owner uuid;
begin
 select owner_id into owner from private.digest_jobs where id=p_job;
 select state into owner_state from public.accounts where id=owner for share;
 select * into job from private.digest_jobs where id=p_job and claim_token=p_token and state='claimed' and lease_until>p_now for update;
 if not found then return null;end if;
 select * into prefs from public.workspace_settings where owner_id=job.owner_id for share;
 if owner_state is distinct from 'active' or not prefs.email_enabled or not coalesce((select digest_ready from private.feature_gates where singleton),false) then
   update private.digest_jobs set state='skipped',claim_token=null where id=p_job;return null;
 end if;
 if prefs.version<>job.settings_version then update private.digest_jobs set state='ready',claim_token=null,lease_until=null where id=p_job;return null;end if;
 if (p_now at time zone job.timezone)::date<>job.local_date or (p_now at time zone job.timezone)::time<prefs.digest_time then
   update private.digest_jobs set state='skipped',claim_token=null where id=p_job;return null;
 end if;
 select email into address from auth.users where id=job.owner_id and email_confirmed_at is not null;
 items:=private.attention_for(job.owner_id,job.local_date);
 if address is null or jsonb_array_length(items)=0 then update private.digest_jobs set state='skipped',claim_token=null where id=p_job;return null;end if;
 update private.digest_jobs set state='sending',attempts=attempts+1,first_attempt=coalesce(first_attempt,p_now),lease_until=p_now+interval '2 minutes' where id=p_job;
 return jsonb_build_object('id',job.id,'token',p_token,'to',address,'date',job.local_date,'timezone',job.timezone,'items',items,'attempt',job.attempts+1);
end $$;
create function public.finish_digest(p_job uuid,p_token uuid,p_outcome text,p_retry_seconds integer default 0,p_now timestamptz default now()) returns void language plpgsql security definer set search_path='' as $$
declare job private.digest_jobs; retry_at timestamptz;
begin
 select * into job from private.digest_jobs where id=p_job and claim_token=p_token and state in('sending','unknown') for update;
 if not found then return;end if;
 if p_outcome='temporary' and job.attempts<3 and (p_now at time zone job.timezone)::date=job.local_date then
   retry_at:=greatest(job.first_attempt+case when job.attempts=1 then interval '5 minutes' else interval '30 minutes' end,p_now+make_interval(secs=>least(greatest(p_retry_seconds,0),86400)));
   if (retry_at at time zone job.timezone)::date=job.local_date then
     update private.digest_jobs set state='ready',next_attempt=retry_at,claim_token=null,lease_until=null where id=p_job;return;
   end if;
 end if;
 update private.digest_jobs set state=case p_outcome when 'accepted' then 'accepted' when 'permanent' then 'failed' when 'temporary' then 'failed' else 'unknown' end,claim_token=null,lease_until=null where id=p_job;
end $$;

create function public.begin_account_deletion(p_owner uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare job uuid; owner_state text;
begin
 if not coalesce((select deletion_ready from private.feature_gates where singleton),false) then raise exception 'Account removal is not available yet.' using errcode='55000';end if;
 select state into owner_state from public.accounts where id=p_owner for update;
 if owner_state is null then raise exception 'Account unavailable.' using errcode='42501';end if;
 if not exists(select 1 from auth.users where id=p_owner and email_confirmed_at is not null) then raise exception 'Account unavailable.' using errcode='42501';end if;
 update public.accounts set state='deleting' where id=p_owner;
 insert into private.deletion_jobs(owner_id) values(p_owner) on conflict(owner_id) do update set owner_id=excluded.owner_id returning id into job;
 update private.digest_jobs set state='skipped',claim_token=null where owner_id=p_owner and state in('ready','claimed');
 return job;
end $$;
create function public.claim_deletions(p_limit integer default 25) returns jsonb language plpgsql security definer set search_path='' as $$
declare job private.deletion_jobs; result jsonb:='[]'; token uuid;
begin
 for job in select * from private.deletion_jobs where state in('ready','claimed') and (next_attempt is null or next_attempt<=now()) and (lease_until is null or lease_until<now()) for update skip locked limit least(greatest(p_limit,1),100) loop
   if job.attempts>=coalesce((select cleanup_max_attempts from private.feature_gates where singleton),5) then update private.deletion_jobs set state='needs_operator',claim_token=null where id=job.id;continue;end if;
   token:=gen_random_uuid();
   update private.deletion_jobs set state='claimed',claim_token=token,lease_until=now()+interval '2 minutes',attempts=attempts+1 where id=job.id;
   result:=result||jsonb_build_array(jsonb_build_object('id',job.id,'token',token,'owner',job.owner_id));
 end loop;
 return result;
end $$;
create function public.purge_account_records(p_job uuid,p_token uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare job private.deletion_jobs; owner_state text; owner uuid;
begin
 select owner_id into owner from private.deletion_jobs where id=p_job;
 select state into owner_state from public.accounts where id=owner for update;
 select * into job from private.deletion_jobs where id=p_job and state='claimed' and claim_token=p_token and lease_until>now() for update;
 if not found then return false;end if;
 if owner_state is not null and owner_state<>'deleting' then raise exception 'Account is not being deleted.';end if;
 delete from private.digest_jobs where owner_id=job.owner_id;
 delete from public.invoices where owner_id=job.owner_id;
 delete from public.tasks where owner_id=job.owner_id;
 delete from public.projects where owner_id=job.owner_id;
 delete from public.clients where owner_id=job.owner_id;
 delete from public.workspace_settings where owner_id=job.owner_id;
 return true;
end $$;
create function public.finish_account_deletion(p_job uuid,p_token uuid,p_success boolean) returns void language plpgsql security definer set search_path='' as $$
declare job private.deletion_jobs;
begin
 select * into job from private.deletion_jobs where id=p_job and claim_token=p_token and state='claimed' for update;
 if not found then return;end if;
 if p_success then
   if exists(select 1 from auth.users where id=job.owner_id) then raise exception 'Identity removal is not complete.';end if;
   update private.deletion_jobs set state='done',owner_id=null,claim_token=null,lease_until=null,next_attempt=null where id=p_job;
 else
   update private.deletion_jobs set state=case when attempts>=coalesce((select cleanup_max_attempts from private.feature_gates where singleton),5) then 'needs_operator' else 'ready' end,claim_token=null,lease_until=null,next_attempt=now()+make_interval(secs=>coalesce((select cleanup_retry_seconds from private.feature_gates where singleton),300)) where id=p_job;
 end if;
end $$;

revoke all on function public.claim_digests(integer,timestamptz),public.authorize_digest(uuid,uuid,timestamptz),public.finish_digest(uuid,uuid,text,integer,timestamptz),public.begin_account_deletion(uuid),public.claim_deletions(integer),public.purge_account_records(uuid,uuid),public.finish_account_deletion(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.claim_digests(integer,timestamptz),public.authorize_digest(uuid,uuid,timestamptz),public.finish_digest(uuid,uuid,text,integer,timestamptz),public.begin_account_deletion(uuid),public.claim_deletions(integer),public.purge_account_records(uuid,uuid),public.finish_account_deletion(uuid,uuid,boolean) to service_role;

create or replace function public.feature_status() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce((select jsonb_build_object('digest',digest_ready and private.is_active(),'deletion',deletion_ready and private.is_active(),
 'status',case when private.is_active() then (select jsonb_build_object('state',j.state,'date',j.local_date,'attempts',j.attempts) from private.digest_jobs j where j.owner_id=auth.uid() order by j.local_date desc limit 1) else null end)
 from private.feature_gates where singleton),jsonb_build_object('digest',false,'deletion',false,'status',null))
$$;
