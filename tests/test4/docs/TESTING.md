# Lancealot verification

## Working directory and runtime

Run commands from `tests/test4/lancealot/`, with a Node version accepted by package.json. `.nvmrc` records the runtime used during development. Install locked dependencies with `npm ci`. Scripts and pinned dependency versions live in package.json/package-lock.json; session results belong in plans/HANDOVER.md.

## Automated local checks

- `npm test`: Vitest one-shot run. No external accounts, email credentials or server required.
- `npm run test:watch`: Vitest watch mode.
- `npm run build`: Vue type checking plus Vite production bundling.
- `npm run type-check`: focused Vue/TypeScript check.

Vitest explicitly replaces Supabase public config with blank values, preventing `.env.local` from connecting tests to a real project. Database tests initialize an isolated in-memory PGlite PostgreSQL engine, create test Auth roles/users/auth.uid(), and execute all actual migrations. They exercise RLS/grants, same-owner links, revisions, exact money, reference-conflict rollback, reminder boundaries, service gates, claim fencing, DST gap/repeated-hour behavior, unknown outcomes and cleanup failure bounds. The Auth shim does not verify real JWTs or reproduce hosted Supabase infrastructure.

Other suites cover amount/calendar rules, sample adapter atomicity, fixed-token gateway dispatch, app boot/navigation and sample deletion, email rendering/provider outcome classification, worker-secret checks and identity/password-confirmed deletion authorization. Happy DOM dialog methods are stubbed for component tests; native focus trapping, layout and browser accessibility need separate verification.

## Browser flows

`npm run test:e2e` runs authored Playwright desktop/mobile-emulation flows in `tests/e2e/`. Install compatible Playwright browser engines through the normal approved development procedure first. The configuration starts an isolated Vite server on 127.0.0.1:4173 with blank Supabase config and does not reuse an arbitrary existing server. Flows use sample records; they do not create/delete real accounts or send email.

Use the permitted browser tool for agent-driven interactive review. If no browser connection is available, record browser checks as not run rather than substituting DOM-stub success for visual evidence. Inspect 1280px/390px layouts and reflow at 320 CSS pixels, long names/references, keyboard navigation/dialog focus/error announcements, reduced motion and the accepted contrast/target requirements in DESIGN.md. Build success is not rendered visual approval.

## Local Supabase and hosted integration

`supabase/tests/database/ownership.test.sql` is an authored pgTAP smoke suite for an isolated local Supabase stack, run with `supabase test db` after the CLI/local-stack prerequisites and migrations are configured. Do not run verification fixtures against production or add --linked to the documented test command. The CLI/Docker stack has not been set up by this task.

Before real-data/public use, verify two synthetic users against actual Supabase Auth/Data API: verification/recovery/expired links/sign-out, stale JWTs after account lock/identity removal, direct and RPC ownership attacks, revision collisions and privileged function grants. Validate Edge/Deno deployment, provider limits/idempotency/429/ambiguous response handling, Cron authentication and real delivery to approved synthetic recipients. Exercise overlapping workers/crashes as actual concurrent requests; deterministic local state-order tests alone do not prove hosted concurrency behavior.

Demonstrate export snapshot consistency and restore/erase-on-restore under the approved retention/recovery policy. Resolve D18 costs/region/vendor/operator gates before enabling either private runtime gate. No real erasure or external email is part of the default test run.
