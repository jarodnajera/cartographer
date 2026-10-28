# Lancealot

A responsive private workspace for individual freelancers: client projects, follow-up tasks, deadlines and unpaid invoices. Layout A follows the approved [design](../docs/DESIGN.md).

## Run locally

Use the Node version in `.nvmrc` (or another version accepted by `package.json`). From this directory:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally http://127.0.0.1:5173/. Opening `index.html` directly does not load the Vite application.

Without Supabase configuration, choose **Explore sample workspace**. Fictional data lives only in memory and resets on reload/exit; this is an explicit preview, not a fallback storage system for real client records.

## Private workspace connection

Copy `.env.example` to an ignored `.env.local`, then set the public project URL and publishable key for an approved Supabase test project. Never use a service-role/secret key in a VITE variable. Apply all SQL migrations in `supabase/migrations/` to that isolated project using a reviewed migration procedure; restart Vite after changing environment variables.

Verified email/password signup, recovery and login use Supabase Auth. The database checks verified active ownership and uses fixed-field RPC mutations with revision checks. See [architecture](../docs/ARCHITECTURE.md) and [runbook](../docs/RUNBOOK.md).

## Verify

```sh
npm test
npm run build
```

Unit/component, gateway, worker/deletion handler and isolated PostgreSQL tests run without external accounts. Vitest forces blank Supabase config, even if local configuration exists. `npm run build` includes Vue type checking and production bundling.

Browser flows are authored in `tests/e2e/`; see [TESTING.md](../docs/TESTING.md) for prerequisites and limitations. No browser-rendering or hosted-service success is implied by the local tests.

## Scheduled email and account erasure

The source includes an authenticated Edge worker, durable/fenced digest jobs and password-confirmed account-removal handler with bounded cleanup retries. Both runtime gates default to **off**. Settings shows their actual readiness; an unavailable service is not presented as working.

An optional Resend adapter is included behind explicit server configuration; it is not a vendor selection or approval of a paid plan. No email is sent unless a provider and the database gate are deliberately configured. Cron registration, sender/domain credentials, Auth SMTP, region/cost/limit decisions, retention/recovery policy and operating ownership remain launch gates. Read the [runbook](../docs/RUNBOOK.md) before any live activation. No service was provisioned/deployed by this implementation.

Accepted [plans](../docs/plans/PLANS.md), [SPEC](../SPEC.md), [GLOSSARY](../docs/GLOSSARY.md) and [handover](../HANDOVER.md) describe scope and current verification status.
