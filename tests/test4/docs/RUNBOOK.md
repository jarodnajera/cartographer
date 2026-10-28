# Lancealot runbook

## Local interface

From `tests/test4/lancealot/`, use the Node version in `.nvmrc` (or a compatible version from package.json), install locked dependencies with `npm ci`, then run `npm run dev`. Open the printed HTTP URL, normally http://127.0.0.1:5173/. Opening the package's index.html as a local file does not run Vite modules.

Choose Explore sample workspace for an explicit fictional-data preview. Sample changes are in memory and reset on reload/exit; no authentication, persistence, real email or real account deletion happens in sample mode. Account deletion uses the displayed demo password only. The older standalone HTML prototype remains under docs/prototypes for design history; it is not the production app.

## Private project connection — manual, not performed here

The current app has no live configuration. Before activation, select an isolated Supabase test project and settle the applicable D18 cost/region/operating decisions. Existing-project use must preserve its data; new-project provisioning and remote migrations require their own reviewed procedure.

Proposed human setup stages, awaiting project/procedure confirmation:

1. Choose the test project and confirm region, service plan/limits and operator. No credential value is needed in chat.
2. Review/apply the three ordered migrations from lancealot/supabase/migrations/ using the approved isolated-project migration workflow. Migration SQL and tests are supplied; remote application has not been verified/performed.
3. Copy `.env.example` to ignored `.env.local`; populate only VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY from that project's public connection settings. Restart Vite. Never put an admin/service-role/email secret in VITE variables.
4. Configure verified email/password Auth, recovery redirects to the app's /auth/password path, verification redirects to /auth/callback, allowed app origin and suitable password/rate controls. Production Auth email needs a separately approved SMTP configuration; default sender suitability is not assumed.
5. Verify two synthetic users, recovery/expired links and owner isolation against the actual service before introducing real client data.

Installed wizard instructions/template have been inspected for these human-only stages. No interactive helper was generated or executed: project selection, destinations and the exact stage procedure must first be confirmed under that workflow. Do not silently provision a project or write credentials as a substitute.

## Worker configuration and activation

Edge source: process-jobs and delete-account. Supabase supplies server-only SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY and its public Auth key; delete-account also requires SUPABASE_ANON_KEY and APP_URL. The worker requires a random WORKER_SECRET of at least 32 characters. Keep these secrets in the service's approved secret store; no secret values belong in repository files, browser config, chat or logs.

The worker accepts POST with Authorization: Bearer WORKER_SECRET, not an ordinary user's JWT. config.toml disables platform JWT verification for both handlers; their explicit secret/identity/password/origin checks are mandatory. Validate the deployed Edge runtime before treating the source as operational.

Digest sending has no default provider. EMAIL_PROVIDER must be explicitly selected; an optional resend adapter consumes server-only EMAIL_API_KEY, EMAIL_FROM and APP_URL. That adapter's existence is not agreement on Resend or any paid service. Approve the sender/domain, provider plan/limits, Auth SMTP and privacy/retention responsibilities before configuring it. Empty configuration means no digest claims or fake send successes.

Register authenticated Cron execution only after the worker/secret procedure, cadence and operating limits are reviewed, following the current official Supabase scheduling guidance. No Cron registration or remote deployment was run. Do not paste a worker token into publicly readable SQL, app source or frontend environment variables; use the service's reviewed Vault/secret configuration.

`private.feature_gates` starts with digest_ready=false and deletion_ready=false. An operator may enable them only after proving the corresponding service path and D18 safeguards. The table is inaccessible to ordinary app roles; feature_status() exposes only readiness and the owning user's safe last-send status. A missing gate row fails closed. cleanup_max_attempts (default 5) and cleanup_retry_seconds (default 300) are bounded configuration defaults, not an erasure SLA; review them and retention/recovery/support policy before activation.

## Operations and recovery

- Digest jobs: inspect private.digest_jobs as an authorized operator. accepted means provider acceptance, not inbox receipt. Unknown/expired sending outcomes must not be blindly reset/replayed. Preserve logical date and attempt/idempotency context when reconciling with the approved vendor. Known rejected requests retry within the same local day; old dates do not generate backlog bursts.
- Disable digest_ready to stop new digest claims/authorizations. An already-authorized external request may still arrive. Never promise recall.
- Disable deletion_ready to prevent new erasures; this intentionally does not cancel cleanup already started. Deleting accounts remain locked and existing cleanup jobs continue through the worker.
- Cleanup jobs: ready/claimed operations retry within the configured bound; needs_operator requires investigation. Fix the cause and use a narrowly scoped reviewed retry procedure. Do not reactivate a partially erased account or blindly recreate deleted records. done clears the stored owner identifier only after identity/active-data cleanup is confirmed.
- A worker crash after sending authorization becomes Unknown rather than an automatic resend. Cleanup steps are idempotent/fenced, but no external Auth/email operation shares a database transaction.
- Decide backup retention, deletion-operation metadata expiry, restore-erasure handling, recovery targets and support ownership before real-data/public use. No recovery/retention deadline or backup-restore success has been established here.

## Troubleshooting

A configuration-free app offers sample mode; this is expected. For connection failures, verify public project URL/key and migration order without exposing secret values. An unavailable/locked account must sign out or use the agreed support path; do not remove database ownership checks to get around an error.

A stale-edit conflict preserves the form input: close, refresh and reopen with current data. Duplicate invoice references are checked per client across projects. Parent deletion fails when linked records exist; archive the project if appropriate. Amount precision errors must be corrected without silent rounding/conversion.

If local scripts report an incompatible Node runtime, select the package's supported runtime before retrying; do not downgrade tool requirements or suppress runtime checks. Browser/layout, deployed Deno/Auth, pgTAP/local Supabase and actual provider validation remain separate checks in TESTING.md.
