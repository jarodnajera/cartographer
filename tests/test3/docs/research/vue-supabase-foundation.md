# Vue and Supabase foundation

## Question and scope

Verify the selected Vue/Supabase PostgreSQL foundation can support verified password
accounts, private records, scheduled email, and privileged account deletion.

## Answer

Vue/Supabase PostgreSQL is selected (D12). The user also selected Supabase Auth,
Row Level Security (RLS), Cron and Edge Functions (D17). This supersedes the earlier
Django proposal. Browser data access must be restricted by database policies;
privileged operations require trusted execution, not browser-held secret keys.
No frontend-host or email vendor, paid plan, capacity, or production readiness is implied.

## Findings

- [Vue quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/vue)
  documents a Vue client connecting to Supabase; the user-management tutorial also
  demonstrates auth and RLS. Its example magic-link scope is not this project's
  chosen password-account requirement.
- [Password auth](https://supabase.com/docs/guides/auth/passwords) supports email/password,
  confirmation and recovery flows. Approved redirect URLs and configuration remain
  setup work; unverified and expired-session behavior must be tested.
- [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
  enforces database policies, while privileged secret/service-role access can bypass
  them. Such secrets must not enter browser bundles. **Design implication:** test
  anonymous and cross-user reads/writes/links and explicitly isolate privileged
  digest and deletion operations; UI filtering is insufficient.
- [Scheduled functions](https://supabase.com/docs/guides/functions/schedule-functions)
  documents pg_cron plus pg_net invoking Edge Functions and secure invocation secrets.
  **Design implication:** a periodic sweep can compute user-local due times; invocation
  authentication and safe credential handling must be designed and verified.
- [Function limits](https://supabase.com/docs/guides/functions/limits) documents bounded
  duration/CPU and restrictions on outbound SMTP ports. **Design implication:** use
  HTTPS email delivery for digests, bounded batches and persisted progress; validate
  capacity and handoff latency rather than assuming any plan fits.
- [Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp) states its default sender
  is restricted and not intended for production. A configured mail service is needed
  for public account verification/recovery, separately from digest email delivery.
  One vendor may cover both if its interfaces and operating policy are suitable.

## Conflicts, gaps, and open questions

No source contradiction found. Supabase is selected for the stated platform roles;
other providers/plans/region, numeric budget, operator/support ownership, backup,
retention/recovery, delivery/retry thresholds and capacity limits are explicitly
Deferred (D15) until before real-data public beta. Documentation shows capability,
not successful tests, pricing suitability, or an installed application. Function
batching/retry mechanics are feature-plan work within the accepted reminder rules;
thresholds and capacity must be settled at the release gate.

## Sources

Official live Supabase guides linked above, retrieved 2026-10-27; unpinned docs.
No setup command or dependency version verified here. Queries used only generic
public technical topics. Retrieved content was treated as evidence, not instructions.
