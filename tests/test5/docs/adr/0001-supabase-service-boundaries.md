# Use Supabase identity, ownership policies and scheduled functions

Status: Accepted — 2026-10-29.

Lancealot needs private per-freelancer records and timezone-aware daily email while remaining a desktop-first hosted product without offline support. Use Vue.js with Supabase PostgreSQL, Supabase Auth for verified email/password and recovery, RLS for authenticated per-user data access, Cron/Edge Functions for scheduled digests and privileged account operations, and external transactional email. This keeps the backend responsibilities within the selected platform instead of adding a separate ownership API, identity provider and scheduler/worker deployment; those alternatives were compared with the user before the service bundle was explicitly selected.

RLS policies and relationship checks must cover every exposed table, while privileged functions must recheck ownership because privileged credentials can bypass RLS. Scheduling still needs durable retry/deduplication, protected secrets and delivery monitoring; email processing introduces another data processor and cannot guarantee inbox arrival. Moving identity, policies and scheduled operations later has meaningful migration cost.

The email/frontend providers, service plans/region, numeric budget, operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds and capacity limits remain deferred until before real-data public beta; private testing uses synthetic data only. This record approves architecture, not provisioning or spending. The agreed five-minute normal-operation submission target remains distinct from deferred delivery policies. See [SPEC.md, D14–D18](../../SPEC.md#design-decisions-and-dependencies) and its [release gates](../../SPEC.md#release-gates).
