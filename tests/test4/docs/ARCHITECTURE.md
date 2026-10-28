# Lancealot architecture

Status: implemented source with isolated local verification; hosted integration and final review pending. Product intent is in [SPEC](../SPEC.md); current milestone evidence is in the [plans](plans/PLANS.md) and [HANDOVER](../HANDOVER.md).

## Application and entry points

The application package lives in `../lancealot/`. `src/main.ts` mounts Vue and Vue Router; `src/App.vue` coordinates account initialization and workspace identity changes. `src/router.ts` defines account, Today, Clients, Projects/detail and Settings routes. `components/WorkspaceShell.vue` renders selected Layout A: desktop sidebar and compact ledger, with stacked narrow-screen records/navigation disclosure. Shared visual tokens are in `src/tokens.css`, behavior/layout styling in `src/style.css`.

Views use small native-dialog form/confirmation modules rather than prototype DOM-string rendering. Vue escapes record text. Supabase configuration is public browser configuration; all privileged credentials are confined to Edge execution.

## Account and request identity

`src/lib/account.ts` owns Auth restoration/events, recovery, sign-out, explicit sample mode and the known deletion-pending state. `src/lib/supabase.ts` creates the public Auth client and fixed-token request clients using the SDK accessToken callback. No request client opens another persistent Auth store.

`src/lib/gateway.ts` verifies a captured session token against the expected user and pins RPC/function dispatch to that same token. A cross-tab user change must not save a pending form under the new user. `src/lib/workspace.ts` clears state on actor changes and rejects obsolete async results with a generation token. Authorization failures clear private cached state; recoverable fetch errors retain records with an explicit stale indication.

The live gateway never silently switches to sample storage. `src/lib/sample.ts` is a separate, explicitly selected in-memory adapter with fictional fixtures, including an outstanding child under a completed project. Preview deletion is clearly labeled as a simulation and does not claim real erasure.

## Database interface

Migrations are under `lancealot/supabase/migrations/`:

- `202610280001_workspace.sql`: account-control/settings, clients, projects, tasks, invoices, version triggers, RLS/grants and fixed-field bootstrap/save/delete/snapshot/export interfaces.
- `202610280002_currencies.sql`: dated current/historical currency metadata; provenance/precision policy in `lancealot/src/data/CURRENCIES.md`.
- `202610280003_jobs.sql`: shared eligibility module, schedule floors, service gates, fenced digest/deletion jobs and service-only operations.

Account creation is allowed only for a verified Auth identity. An active account row and current verified identity are required on private reads/mutations; absent/deleting accounts cannot bootstrap themselves back to active. `private.lock_account()` serializes ordinary mutations with the irreversible deletion lock.

Every relationship includes ownership. Invoices reference the same owning project/client through a composite foreign key; project client moves propagate transactionally. The per-owner/client normalized-reference uniqueness constraint rejects conflicting moves atomically. Ordinary browser roles have owner-filtered SELECT access but no raw table-write grant; mutations go through explicit field allowlists and expected revisions. Privileged functions use an empty search path, fully qualified objects and scoped owner checks; service-only job methods have no authenticated/anonymous execution grant.

Invoice amounts are PostgreSQL numeric values, delivered to JavaScript/JSON as decimal strings. Existing invoices retain their saved precision when their currency stays unchanged. Neither client nor database silently rounds an invalid amount or converts currencies.

## Read and reminder data flow

`workspace_snapshot()` and `export_workspace()` assemble owned data in one stable database read context. Export includes a narrow profile, domain collections and settings, never password/token/Auth tables or internal job logs.

`private.attention_for(owner,date)` is the live shared eligibility rule used by Today and digest authorization. It preserves independent task/invoice reminders beneath completed/archived projects. The sample-only TypeScript equivalent supports preview; it is not the production rule authority.

Local dates come from the confirmed timezone. Settings changes choose the next future local occurrence, with no settings-triggered replay of a past time. Due polling compares local wall time so DST gaps become eligible at the first valid time; a unique owner/local-date job prevents duplicate repeated-hour digests. Injected clock parameters exist only on service-only SQL methods for deterministic verification; the deployed worker uses their current-time defaults.

## Privileged worker and erasure

`supabase/functions/process-jobs/index.ts` authenticates a minimum-length worker secret using hashed comparison before creating an admin client. `delete-account/index.ts` delegates to a tested handler that verifies origin, caller identity, password proof and explicit confirmation; a submitted owner ID is ignored. `config.toml` disables platform JWT checks for these handlers because they explicitly authenticate their own request types; bypassing the handlers' checks would be a security bug.

`_shared/jobs.ts` coordinates claims/authorization/outcomes and renders escaped HTML/plain-text email without invoice amounts. A dispatch is durable before external sending. Known rejected requests have bounded same-local-day retries; ambiguous results and abandoned sending leases become Unknown and are never blindly resent. Fenced claim tokens prevent obsolete workers from authorizing a newer claim.

Account deletion commits an irreversible account lock and private operation before cleanup. New access and sends are denied. The worker purges domain/settings/digest rows, removes the Auth identity, and only then marks cleanup done. Partial failures remain locked and retry to an operator-configured bound; exhausted jobs require operator attention. Completed cleanup clears the stored owner identifier. Already-authorized external email cannot be recalled.

Both runtime gates in `private.feature_gates` default false and fail closed if missing. An optional Resend adapter exists, but no vendor/plan is selected or activated. No Cron job, email credentials, deployed Edge runtime or hosted database was configured here. D18 activation/retention/recovery/operator gates remain open.

## Verification limits

The isolated runner executes actual migration SQL with PGlite/PostgreSQL and a small Auth identity shim, not a hosted Supabase stack. Component tests use Happy DOM, not rendered-browser layout. Pure Edge handler/coordinator logic is exercised with controlled adapters; deployed Deno entry points, SMTP, actual token/email flows, simultaneous hosted workers and restore/erasure policy still need final integration review. See [TESTING](TESTING.md) and [RUNBOOK](RUNBOOK.md).
