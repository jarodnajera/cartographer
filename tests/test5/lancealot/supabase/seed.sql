-- Synthetic local test addresses only; no passwords, accounts or client data.
insert into private.signup_allowlist (email)
values ('alex@example.test'), ('robin@example.test')
on conflict (email) do nothing;
