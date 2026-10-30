-- Prepared account/ownership foundation. Not applied to a running Supabase project.
-- Real auth/RLS integration tests are required before claiming enforcement.
begin;

create schema if not exists private;
revoke all on schema private from public, anon;

create table private.signup_allowlist (
  email text primary key check (email = lower(btrim(email)))
);
revoke all on private.signup_allowlist from public, anon, authenticated;

create table public.workspaces (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'deleting')),
  timezone text,
  digest_time time,
  email_enabled boolean not null default false,
  constraint email_requires_schedule check (not email_enabled or (timezone is not null and digest_time is not null))
);
alter table public.workspaces enable row level security;
revoke all on public.workspaces from public, anon, authenticated;
grant select on public.workspaces to authenticated;
grant update (timezone, digest_time, email_enabled) on public.workspaces to authenticated;

-- Migration owner must be a trusted role able to inspect auth users and bypass RLS.
-- This narrowly returns a boolean; callers cannot supply a different acting identity.
create function private.can_access_workspace(target_owner uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    join public.workspaces w on w.owner_id = u.id
    join private.signup_allowlist a on a.email = lower(u.email)
    where u.id = auth.uid()
      and u.id = target_owner
      and u.email_confirmed_at is not null
      and w.status = 'active'
  );
$$;
revoke all on function private.can_access_workspace(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.can_access_workspace(uuid) to authenticated;

create policy owner_read on public.workspaces
for select to authenticated using (private.can_access_workspace(owner_id));
create policy owner_update_preferences on public.workspaces
for update to authenticated
using (private.can_access_workspace(owner_id))
with check (private.can_access_workspace(owner_id));

-- Supabase's Before User Created Hook provides a useful rejection before signup.
create function public.before_user_created(event jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from private.signup_allowlist
    where email = lower(btrim(event->'user'->>'email'))
  ) then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403, 'message', 'Registration is limited to approved email addresses during private testing.'
    ));
  end if;
  return '{}'::jsonb;
end;
$$;
revoke all on function public.before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.before_user_created(jsonb) to supabase_auth_admin;

-- Database backstop: signup remains restricted if hook configuration is omitted.
create function private.enforce_private_registration()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from private.signup_allowlist where email = lower(btrim(new.email))) then
    raise exception 'Registration is limited to approved email addresses during private testing.';
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_private_registration() from public, anon, authenticated;
create trigger enforce_private_registration
before insert or update of email on auth.users
for each row execute function private.enforce_private_registration();

create function private.create_workspace()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.workspaces (owner_id) values (new.id);
  return new;
end;
$$;
revoke all on function private.create_workspace() from public, anon, authenticated;
create trigger create_private_workspace after insert on auth.users
for each row execute function private.create_workspace();

commit;
