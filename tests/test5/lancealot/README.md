# Lancealot

Vue/TypeScript frontend for private freelancer accounts. The first account/readiness slice is implemented; record tracking, Today/delivery and export/deletion remain subsequent milestones. Real Supabase auth/RLS checks are deferred, so prepared backend code is not a verified deployed service.

## Run locally

Use package.json’s supported Node version for npm and its child processes, then:

```sh
npm ci --ignore-scripts
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `/__preview?screen=sign-in` or `/__preview?screen=workspace` for selected-C visual review with fictional data. Preview is development-only and does not grant actual workspace access. The real `/sign-in` remains unavailable until valid public backend configuration is supplied; no demo-auth fallback exists.

## Checks and configuration

`npm test` runs unit tests. `npm run build` type-checks and builds. `npm run test:integration` runs only explicitly enabled isolated-backend checks; skipped means unverified. Copy `.env.example` to ignored `.env.local` only when connecting a backend; never put privileged keys in VITE_ variables.

Canonical [runbook](../docs/RUNBOOK.md), [testing guide](../docs/TESTING.md), [architecture](../docs/ARCHITECTURE.md), [design guide](../docs/DESIGN.md) and [active plan](../docs/plans/private-accounts-and-project-tracking.md) describe setup, behavior, gaps and next work. Preview fixtures do not establish real auth, RLS, persistence or visual parity.
