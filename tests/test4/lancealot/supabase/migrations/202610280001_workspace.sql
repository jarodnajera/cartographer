-- Lancealot: account lifecycle, owned records and authoritative read/mutation interfaces.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.currencies (
  code text primary key, name text not null, digits smallint not null check (digits between 0 and 8), historical boolean not null
);
create table public.accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  state text not null default 'active' check (state in ('active','deleting')),
  created_at timestamptz not null default now()
);
create table public.workspace_settings (
  owner_id uuid primary key references public.accounts(id),
  timezone text, digest_time time, email_enabled boolean not null default false,
  version integer not null default 1,
  check (not email_enabled or (timezone is not null and digest_time is not null))
);
create table public.clients (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.accounts(id),
  name text not null check (length(btrim(name)) between 1 and 160), version integer not null default 1,
  unique (owner_id,id)
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.accounts(id), client_id uuid not null,
  name text not null check (length(btrim(name)) between 1 and 160), deadline date,
  status text not null default 'active' check (status in ('active','completed','archived')), version integer not null default 1,
  foreign key (owner_id,client_id) references public.clients(owner_id,id),
  unique (owner_id,id), unique (owner_id,id,client_id)
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.accounts(id), project_id uuid not null,
  title text not null check (length(btrim(title)) between 1 and 240), followup_date date, completed boolean not null default false,
  version integer not null default 1,
  foreign key (owner_id,project_id) references public.projects(owner_id,id)
);
create table public.invoices (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.accounts(id), project_id uuid not null, client_id uuid not null,
  reference text not null check (length(btrim(reference)) between 1 and 120),
  normalized_reference text generated always as (lower(btrim(reference))) stored,
  amount numeric not null check (amount > 0 and amount < 1000000000000000000),
  currency text not null references public.currencies(code), currency_digits smallint not null,
  due_date date not null, paid boolean not null default false, version integer not null default 1,
  foreign key (owner_id,project_id,client_id) references public.projects(owner_id,id,client_id) on update cascade,
  unique (owner_id,client_id,normalized_reference)
);
create index projects_owner on public.projects(owner_id);
create index tasks_owner on public.tasks(owner_id,project_id);
create index invoices_owner on public.invoices(owner_id,project_id);
create index clients_owner on public.clients(owner_id);

create function private.is_active() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.accounts a join auth.users u on u.id=a.id
    where a.id=auth.uid() and a.state='active' and u.email_confirmed_at is not null)
$$;
revoke all on function private.is_active() from public;
grant execute on function private.is_active() to authenticated;

-- Serialize mutations with the irreversible deletion lock. Recheck AFTER acquiring the row lock.
create function private.lock_account() returns uuid language plpgsql security definer set search_path='' as $$
declare caller uuid:=auth.uid(); account_state text;
begin
  select state into account_state from public.accounts where id=caller for share;
  if account_state is distinct from 'active' or not private.is_active() then
    raise exception 'Your workspace is unavailable. Sign in again or contact support.' using errcode='42501';
  end if;
  return caller;
end $$;
revoke all on function private.lock_account() from public;

create function public.bootstrap_workspace() returns void language plpgsql security definer set search_path='' as $$
declare caller uuid:=auth.uid();
begin
  if not exists(select 1 from auth.users where id=caller and email_confirmed_at is not null) then
    raise exception 'Verify your email before opening your workspace.' using errcode='42501';
  end if;
  insert into public.accounts(id) values(caller) on conflict do nothing;
  perform private.lock_account();
  insert into public.workspace_settings(owner_id) values(caller) on conflict do nothing;
end $$;

create function private.bump_version() returns trigger language plpgsql set search_path='' as $$
begin new.version:=old.version+1;return new;end $$;
create trigger clients_version before update on public.clients for each row execute function private.bump_version();
create trigger projects_version before update on public.projects for each row execute function private.bump_version();
create trigger tasks_version before update on public.tasks for each row execute function private.bump_version();
create trigger invoices_version before update on public.invoices for each row execute function private.bump_version();
create trigger settings_version before update on public.workspace_settings for each row execute function private.bump_version();

-- All writes use explicit allowlisted fields, owner derived from Auth, and a compare-and-set revision.
create function public.save_record(p_kind text,p_id uuid,p_version integer,p_data jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare caller uuid; target uuid:=coalesce(p_id,gen_random_uuid()); related_client uuid; digits integer; val numeric;
begin
  caller:=private.lock_account();
  if p_kind='client' then
    if p_id is null then insert into public.clients(id,owner_id,name) values(target,caller,btrim(p_data->>'name'));
    else update public.clients set name=btrim(p_data->>'name') where id=target and owner_id=caller and version=p_version; end if;
  elsif p_kind='project' then
    if p_id is null then
      insert into public.projects(id,owner_id,client_id,name,deadline,status) values(target,caller,(p_data->>'client_id')::uuid,btrim(p_data->>'name'),nullif(p_data->>'deadline','')::date,p_data->>'status');
    else update public.projects set client_id=(p_data->>'client_id')::uuid,name=btrim(p_data->>'name'),deadline=nullif(p_data->>'deadline','')::date,status=p_data->>'status'
      where id=target and owner_id=caller and version=p_version; end if;
  elsif p_kind='task' then
    if p_id is null then
      insert into public.tasks(id,owner_id,project_id,title,followup_date,completed) values(target,caller,(p_data->>'project_id')::uuid,btrim(p_data->>'title'),nullif(p_data->>'followup_date','')::date,(p_data->>'completed')::boolean);
    else update public.tasks set project_id=(p_data->>'project_id')::uuid,title=btrim(p_data->>'title'),followup_date=nullif(p_data->>'followup_date','')::date,completed=(p_data->>'completed')::boolean
      where id=target and owner_id=caller and version=p_version; end if;
  elsif p_kind='invoice' then
    if coalesce(p_data->>'amount','') !~ '^[0-9]{1,18}(\.[0-9]{1,8})?$' then raise exception 'Enter a positive decimal amount without an exponent.' using errcode='22023';end if;
    val:=(p_data->>'amount')::numeric;
    select i.currency_digits into digits from public.invoices i where i.id=p_id and i.owner_id=caller and i.currency=p_data->>'currency';
    if not found then select c.digits into digits from public.currencies c where c.code=p_data->>'currency';end if;
    if digits is null or val<=0 or val<>round(val,digits) then raise exception 'Use the precision for the selected currency and a positive amount.' using errcode='22023';end if;
    select client_id into related_client from public.projects where id=(p_data->>'project_id')::uuid and owner_id=caller for share;
    if related_client is null then raise exception 'Choose one of your projects.' using errcode='42501';end if;
    if p_id is null then
      insert into public.invoices(id,owner_id,project_id,client_id,reference,amount,currency,currency_digits,due_date,paid)
      values(target,caller,(p_data->>'project_id')::uuid,related_client,btrim(p_data->>'reference'),val,p_data->>'currency',digits,(p_data->>'due_date')::date,(p_data->>'paid')::boolean);
    else update public.invoices set project_id=(p_data->>'project_id')::uuid,client_id=related_client,reference=btrim(p_data->>'reference'),amount=val,currency=p_data->>'currency',currency_digits=digits,due_date=(p_data->>'due_date')::date,paid=(p_data->>'paid')::boolean
      where id=target and owner_id=caller and version=p_version; end if;
  else raise exception 'Unknown record type.' using errcode='22023';
  end if;
  if not found then raise exception 'This record changed or is unavailable. Reload before saving.' using errcode='40001';end if;
end $$;

create function public.delete_record(p_kind text,p_id uuid,p_version integer) returns void
language plpgsql security definer set search_path='' as $$
declare caller uuid;
begin
  caller:=private.lock_account();
  case p_kind
    when 'client' then delete from public.clients where owner_id=caller and id=p_id and version=p_version;
    when 'project' then delete from public.projects where owner_id=caller and id=p_id and version=p_version;
    when 'task' then delete from public.tasks where owner_id=caller and id=p_id and version=p_version;
    when 'invoice' then delete from public.invoices where owner_id=caller and id=p_id and version=p_version;
    else raise exception 'Unknown record type.' using errcode='22023';
  end case;
  if not found then raise exception 'This record changed or is unavailable. Reload before deleting.' using errcode='40001';end if;
end $$;

create function public.save_settings(p_timezone text,p_time time,p_enabled boolean,p_version integer) returns void
language plpgsql security definer set search_path='' as $$
declare caller uuid;
begin
 caller:=private.lock_account();
 if not exists(select 1 from pg_timezone_names where name=p_timezone) then raise exception 'Choose a valid timezone.' using errcode='22023';end if;
 update public.workspace_settings set timezone=p_timezone,digest_time=p_time,email_enabled=p_enabled where owner_id=caller and version=p_version;
 if not found then raise exception 'Settings changed. Reload before saving.' using errcode='40001';end if;
end $$;

create function public.workspace_snapshot() returns jsonb language sql stable security definer set search_path='' as $$
 select case when private.is_active() then jsonb_build_object(
 'clients',coalesce((select jsonb_agg(to_jsonb(c) order by c.name) from public.clients c where owner_id=auth.uid()),'[]'::jsonb),
 'projects',coalesce((select jsonb_agg(to_jsonb(p) order by p.name) from public.projects p where owner_id=auth.uid()),'[]'::jsonb),
 'tasks',coalesce((select jsonb_agg(to_jsonb(t) order by t.title) from public.tasks t where owner_id=auth.uid()),'[]'::jsonb),
 'invoices',coalesce((select jsonb_agg(to_jsonb(i)||jsonb_build_object('amount',i.amount::text) order by i.reference) from public.invoices i where owner_id=auth.uid()),'[]'::jsonb),
 'settings',(select to_jsonb(s) from public.workspace_settings s where owner_id=auth.uid())
 ) else null end
$$;

-- One read interface for Today and, later, the privileged digest adapter. No UI-specific rule copy.
create function public.attention_items(p_date date default null) returns jsonb language sql stable security definer set search_path='' as $$
 with local_day as(select coalesce(p_date,(now() at time zone coalesce(s.timezone,'UTC'))::date) as d from public.workspace_settings s where owner_id=auth.uid() and private.is_active()),
 items as (
 select 'task' as kind,t.id,t.title,t.followup_date as relevant_date,p.id as project_id,p.name as project_name,c.name as client_name,p.status as project_status
 from public.tasks t join public.projects p on p.id=t.project_id and p.owner_id=t.owner_id join public.clients c on c.id=p.client_id and c.owner_id=p.owner_id cross join local_day
 where t.owner_id=auth.uid() and not t.completed and t.followup_date<=d
 union all
 select 'project',p.id,p.name,p.deadline,p.id,p.name,c.name,p.status from public.projects p join public.clients c on c.id=p.client_id and c.owner_id=p.owner_id cross join local_day
 where p.owner_id=auth.uid() and p.status='active' and p.deadline<=d+3
 union all
 select 'invoice',i.id,i.reference,i.due_date,p.id,p.name,c.name,p.status from public.invoices i join public.projects p on p.id=i.project_id and p.owner_id=i.owner_id join public.clients c on c.id=p.client_id and c.owner_id=p.owner_id cross join local_day
 where i.owner_id=auth.uid() and not i.paid and i.due_date<d)
 select coalesce(jsonb_agg(to_jsonb(items) order by relevant_date,title),'[]'::jsonb) from items
$$;
create function public.export_workspace() returns jsonb language sql stable security definer set search_path='' as $$
 select case when private.is_active() then jsonb_build_object('formatVersion',1,'exportedAt',now(),'profile',jsonb_build_object('id',auth.uid(),'email',(select email from auth.users where id=auth.uid())),'workspace',public.workspace_snapshot()) else null end
$$;

-- RLS applies even to direct Data API reads. Ordinary clients cannot issue raw writes.
alter table public.accounts enable row level security;
alter table public.workspace_settings enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.invoices enable row level security;
alter table public.currencies enable row level security;
create policy own_account on public.accounts for select to authenticated using(id=auth.uid() and private.is_active());
create policy own_settings on public.workspace_settings for select to authenticated using(owner_id=auth.uid() and private.is_active());
create policy own_clients on public.clients for select to authenticated using(owner_id=auth.uid() and private.is_active());
create policy own_projects on public.projects for select to authenticated using(owner_id=auth.uid() and private.is_active());
create policy own_tasks on public.tasks for select to authenticated using(owner_id=auth.uid() and private.is_active());
create policy own_invoices on public.invoices for select to authenticated using(owner_id=auth.uid() and private.is_active());
create policy currency_read on public.currencies for select to authenticated using(true);
revoke all on public.accounts,public.workspace_settings,public.clients,public.projects,public.tasks,public.invoices,public.currencies from anon,authenticated;
grant select on public.accounts,public.workspace_settings,public.clients,public.projects,public.tasks,public.invoices,public.currencies to authenticated;
revoke all on function public.bootstrap_workspace(),public.save_record(text,uuid,integer,jsonb),public.delete_record(text,uuid,integer),public.save_settings(text,time,boolean,integer),public.workspace_snapshot(),public.attention_items(date),public.export_workspace() from public,anon;
grant execute on function public.bootstrap_workspace(),public.save_record(text,uuid,integer,jsonb),public.delete_record(text,uuid,integer),public.save_settings(text,time,boolean,integer),public.workspace_snapshot(),public.attention_items(date),public.export_workspace() to authenticated;
