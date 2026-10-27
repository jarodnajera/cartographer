# Agent Instructions

## Project

Lancealot is a planned freelancer project/deadline/invoice tracker. SPEC.md is
Accepted for its stated scope and explicit D15 operating deferrals. The application
currently consists of a Vue 3/Vite/TypeScript starter in `lancealot-test/`, rendering
the generated welcome screen. Product tracking, accounts, persistence, reminders,
export and deletion are not implemented.

Supabase PostgreSQL/Auth/RLS/Cron/Edge Functions are agreed design, not configured
functionality. Vue Router is a spec default but is not installed. Do not assume
planned paths, dependencies or services exist.

## Setup and commands

Run application commands from `lancealot-test/`, not this documentation root.
`package.json` requires Node `^22.18.0 || >=24.12.0`. Use a compatible runtime.
The project uses npm, with a version-3 `package-lock.json`; preserve the lockfile
when intentionally changing dependencies. Dependencies are present in the inspected
checkout, but this does not establish a reproducible install or successful build.

| Command | Purpose/evidence |
| --- | --- |
| `npm ci` | Install from the existing npm lockfile; replaces node_modules |
| `npm run dev` | Declared script: Vite development server |
| `npm run type-check` | Declared script: `vue-tsc --build` |
| `npm run build` | Declared script: parallel type-check and build-only via npm-run-all2 |
| `npm run build-only` | Declared script: Vite build, without type-checking |
| `npm run preview` | Declared script: preview a built Vite application |

These commands are configuration-backed guidance; no install, application check,
server or build was run while seeding this file. There is no test or lint script,
test suite, test runner, ESLint configuration or CI workflow in this project.
Do not substitute nonexistent `npm test` or `npm run lint` commands.

## Code navigation

- `lancealot-test/index.html` — HTML entry, root #app, generated title/language defaults.
- `lancealot-test/src/main.ts` — creates and mounts the Vue application.
- `lancealot-test/src/App.vue` — generated welcome screen; script setup uses TypeScript,
  template and scoped-style sections.
- `lancealot-test/vite.config.ts` — Vue and Vue DevTools plugins; `@` resolves to src/.
- `lancealot-test/tsconfig.json` — app/Node TypeScript project references.
- `lancealot-test/tsconfig.app.json` — app includes, `@/*` alias and
  `noUncheckedIndexedAccess`; excludes src/**/__tests__/* from this app config.
- `lancealot-test/tsconfig.node.json` — Node-side configuration files, noEmit and
  bundler module resolution. Its include patterns do not establish test tooling.
- `lancealot-test/env.d.ts` — Vite client typings.
- `lancealot-test/public/` — static assets, currently favicon.ico.
- `lancealot-test/package.json` / `package-lock.json` — dependency/script/runtime evidence.

No router, data layer, Supabase migrations/functions or application test directories
exist yet. The nested starter folder is intentional current evidence; do not rename
or move it as part of an unrelated change.

## Working conventions

Use the existing ES-module and Vue single-file component setup. Sample source uses
single-quoted imports and no semicolons; no formatter enforces this. Preserve the
matching Vite and TypeScript `@` aliases. Keep app and Node-side configuration typing
separate; use vue-tsc for Vue type checks.

Do not edit node_modules or build output as source. The app .gitignore excludes
node_modules/, dist/, dist-ssr/, coverage/, *.local, logs and TypeScript build info.
Incremental type-check metadata is configured under node_modules/.tmp/.
Do not add secret values or privileged keys to documentation, exports or browser
configuration. In future authorized Supabase work, only public URL/publishable keys
may enter VITE_ variables; ownership must be enforced in database policies and
privileged functions, not merely Vue filters.

## Verification

For authorized source or configuration changes, run `npm run build` from
`lancealot-test/` under a compatible Node runtime; this covers type-check and bundle.
Use `npm run type-check` for focused type verification. UI behavior needs a running
application and browser review; builds alone do not validate behavior or accessibility.
No automated behavior tests currently exist. Add meaningful feature-specific
verification when implementing product functionality rather than claiming coverage
from the starter. Record actual results and limitations; documented commands are
not proof they passed.

For documentation-only work, check factual consistency against observed files and
verify local links. docs/TESTING.md is still a scaffold, not an established procedure.

## Project documentation

- [SPEC.md](SPEC.md) — accepted requirements, defaults, acceptance criteria and D15 gates.
  Its original folder inventory predates the nested starter; use observed files for
  current implementation state.
- [HANDOVER.md](HANDOVER.md) — latest observed state, checks and next action.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — unpopulated architecture scaffold.
- [docs/TESTING.md](docs/TESTING.md), [docs/RUNBOOK.md](docs/RUNBOOK.md), and
  [docs/COMPENDIUM.md](docs/COMPENDIUM.md) — scaffolds, not tested operational facts.
- [docs/plans/PLANS.md](docs/plans/PLANS.md) — feature planning conventions.
- docs/adr/ — reserved for significant architectural decisions; no ADR exists yet.
- [Current backend research](docs/research/vue-supabase-foundation.md) — selected design
  and primary sources; research capability is not working functionality.
- [Setup research](docs/research/vue-setup.md) — original scaffold guidance, not a log
  of how the subsequently observed starter was created.

## Project-specific pitfalls

The documentation root has no package manifest. Commands run there will not target
the nested application. The starter package name is `lancealot-test`; the product
name remains Lancealot. No authentication or workspace isolation is implemented.
The generated HTML still uses `lang=""` and title `Vite App`; the starter does not
establish the spec's accessibility or branding acceptance criteria.

D15 defers frontend/mail providers, service plans/region, numeric budget,
operator/support ownership, backup/retention/recovery targets, delivery/retry
thresholds and capacity. These must be resolved before real-data public beta;
accepting the foundation does not imply production readiness or free-tier suitability.

## Feature planning

Read docs/plans/PLANS.md before planning complex features or significant refactors.
No feature plan has been selected or created. Preserve accepted spec scope; resolve
routine implementation choices within it and ask about material product changes.
During authorized implementation, keep plan progress and verification evidence current.
A document or plan's acceptance does not authorize implementation, purchases,
commits, publication or deployment; follow the user's requested scope and Git workflow.
