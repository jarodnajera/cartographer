# Agent Instructions

## Project and scope

Lancealot tracks individual freelancers’ client work, deadlines and unpaid invoices. [SPEC.md](SPEC.md) owns product scope; [DESIGN.md](docs/DESIGN.md) and its prototype own selected structure A / appearance C. Use docs/GLOSSARY.md terms in code, UI text and tests. For substantial feature work, follow [PLANS.md](docs/plans/PLANS.md) and the selected plan.

The account frontend and SDK adapter exist; real Supabase auth/RLS enforcement is unverified. Record tracking, Today/delivery and deletion are accepted plans, not completed features. [HANDOVER.md](HANDOVER.md) records current progress and review boundaries.

## Commands

Run commands from `lancealot/`. Use Node matching package.json (`^22.22.2 || ^24.15.0 || >=26.0.0`); ensure npm child processes use that runtime too. npm manages the lockfile.

| Command | Purpose |
| --- | --- |
| `npm ci --ignore-scripts` | Install locked dependencies without lifecycle scripts |
| `npm run dev -- --host 127.0.0.1` | Start the local Vite app |
| `npm test` | Run account/configuration unit tests |
| `npm run test:integration` | Run explicitly enabled isolated-backend tests; otherwise skipped |
| `npm run build` | Type-check and build production assets |
| `npm run preview` | Preview an existing production build |

For test setup, opt-in variables, browser checks and coverage limits, read [TESTING.md](docs/TESTING.md). For local configuration/runtime issues or connecting a backend, read [RUNBOOK.md](docs/RUNBOOK.md).

## Navigation and conventions

- `lancealot/src/accounts/`: account service, external Supabase adapter and runtime composition.
- `src/router/`: protected routes; `src/views/`: real Vue account/workspace screens and the development-only review page.
- `src/lib/config.ts`: public configuration validation. `src/styles/app.css` and local Manrope assets apply the accepted guide.
- `lancealot/supabase/`: prepared migrations/config/seed, not evidence of applied database rules. [ARCHITECTURE.md](docs/ARCHITECTURE.md) distinguishes implemented code from deployed enforcement.

Keep TypeScript/ES modules, Vue `<script setup lang="ts">` and the `@` alias. Keep dependency/lock changes consistent. Generated dependencies, build output and TypeScript caches stay untracked.

## Verification and access pitfalls

For source/config changes run unit tests and `npm run build`; build-only omits type checking. Use the accepted public account/ownership seams for meaningful tests. Fake SDK results do not establish auth or RLS. Backend and browser checks remain distinct from source/build success.

The `/__preview` route is development-only and fictional; never use its state as authenticated access or promote preview handlers into production. Every real data path must enforce per-user ownership. Privileged credentials stay outside browser code and `VITE_` variables. Local environment files are ignored; examples contain no credentials. D16 gates and synthetic-only private testing remain in force.
