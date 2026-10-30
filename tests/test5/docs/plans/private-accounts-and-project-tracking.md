# Private accounts and project tracking

Status: In progress — accepted 2026-10-30; Frontend fixes accepted after browser re-check; backend-dependent cases remain open. Real backend checks deferred by user; feature not Complete.
Tier: Standard. [SPEC.md](../../SPEC.md), D2/D8/D10/D14/D17/D18; [glossary](../GLOSSARY.md); [ADR 0001](../adr/0001-supabase-service-boundaries.md).

## Problem, outcome and scope

Replace spreadsheet tracking with verified private accounts and manually entered clients, projects, tasks and existing invoices. Invoice records support reminders/export; generation, collection, partial payments and conversion remain excluded. All private testing uses synthetic data. This plan owns the shared data/ownership contract for [Today/digest](today-and-daily-digest.md) and [export/deletion](export-and-account-deletion.md).

User authorized Phase 3, then explicitly prioritized frontend quality/backend readiness and deferred real auth/RLS checks. This changes the immediate review checkpoint: deliver the frontend and prepared backend interfaces, keeping live enforcement unverified. It does not waive the real-data public-beta gates or authorize a continuous pass across all milestones.

## Accepted decisions and interfaces

- F1: approved-email allowlist for private signup, enforced at auth/database level rather than only by a form. No invitation-link subsystem.
- F2: client name/optional contacts; project title/client and optional deadline/notes; task title/project/completion and optional follow-up date/notes; invoice reference/client, optional same-client project, positive amount/currency/due date and full paid/unpaid status. No project/task date means no corresponding reminder.
- F3: block inconsistent project-client reassignment until invoice links are explicitly corrected; never silently move invoice history.
- F7: reversible client/project archives and task/project reopening. Restore the prior project lifecycle; do not cascade other states. Client archival does not suppress child reminders; project archival stops only its deadline warning. Separate task/invoice archive controls remain deferred.

Account operations cover verification, sign-in/out and recovery, returning usable access or explicit unavailable/denied states. Owned-record operations validate relationships and report failed saves as failures. One owner per workspace/record; project/client/task/invoice associations must stay within that owner. Later database policies/constraints enforce these invariants independently of the UI. Preserve stable IDs, exact original-currency amounts and calendar dates.

## Implemented frontend/readiness slice

`lancealot/src/accounts/` contains the tested account service, a real Supabase SDK adapter and runtime composition. It checks server-returned identity, verification and active ownership; recovery permission is tied to the callback’s validated account. Sign-in never falls back to a demo identity. Public configuration rejects known privileged keys; real routes stay unavailable without valid configuration.

Vue account screens cover sign-in/up, verification/resend, PKCE callback, recovery/reset and failed/loading/success/expired/unapproved states. The router guards the workspace shell and rechecks access on auth changes. Shared CSS/local Manrope apply accepted C. `/__preview` is registered only in development, with fictional review props and no backend connection when opened directly. The shell’s record-entry actions are intentionally disabled pending the next milestone; preview data is not persisted production data.

Supabase config, allowlist/workspace migration, synthetic seed and opt-in integration tests are prepared, not applied or live-verified. They propose signup hook/backstop, automatic per-user workspace, verified/active-owner RLS and restricted preference updates. No CLI/container, project, SMTP sender, database or actual account was provisioned. The existing HTML reference remains isolated under docs/design/previews/.

## Milestones and review boundaries

1. **Current review:** frontend/account readiness slice. Unit/build checks pass; user reviews actual Vue frontend against C. Real two-account auth/RLS verification is deferred explicitly, not fulfilled. Resume it before claiming enforcement; decide the next record-UI step after this review.
2. **Unstarted:** implement client/project/task/invoice record operations and UI, with accepted validation/edit/lifecycle rules and persistence/relationship failures. Review independently.
3. **Later:** browser parity/keyboard/responsive checks and real backend verification; then Phase 4 review/remediation and user completion decision. Plan acceptance and this partial delivery do not mark the whole feature Complete.

## Verification strategy and actual evidence

Account service/configuration tests use external gateway fakes at the accepted public seam. They catch unverified/wrong-owner/deleting/unavailable access, sign-in failure, recovery callback ownership/reuse and privileged-key rejection; they do not prove Supabase enforcement. Red/green cycles preceded service/config implementation; no internal-call-count or DOM-stub test is visual evidence.

From `lancealot/`, using compatible Node 24: `npm test` — **14 passed**; `npm run build` — **passed**, including vue-tsc; `RUN_SUPABASE_INTEGRATION=0 npm run test:integration` — **3 deliberately skipped**. Direct HTTP checks returned the app/compiled account, workspace and preview Vue modules. Local TOML parses, but SQL/config/backend semantics are unverified. Playwright MCP is now connected. Account expiry states and the unconfigured protected route were checked at desktop/mobile widths, with screenshots and no console errors; full parity/accessibility and configured-account/backend checks remain unverified.

The opt-in suite is ready for distinct approved/verified synthetic owners and direct cross-owner read/write/owner-status-change attempts. Missing backend checks include unverified/unapproved registration, redirects/email delivery, deployed hooks and actual RLS. Before claiming completion, use the real SDK/data interfaces and a permitted browser; mocks/builds cannot replace those checks. [TESTING.md](../TESTING.md) owns durable procedures and prerequisites.

## Design, dependencies and baseline

[DESIGN.md](../DESIGN.md) and the [accepted styled reference](../design/previews/README.md) own structure A / C appearance. Account/workspace Vue code was written for production interfaces, not copied from throwaway auth handlers. Palette, typography, state hierarchy and narrow-screen intent are retained; visual parity is unverified. Only cheap implementation refinements were made; no product scope or operating target changed.

Supabase client, Vue Router and Vitest are locked dependencies. Tooling requires the package.json Node engine; ensure npm’s child runtime agrees. An old Node selected by initial npm scripts was corrected before successful checks. [ARCHITECTURE.md](../ARCHITECTURE.md) owns current module/data flow; [RUNBOOK.md](../RUNBOOK.md) owns local configuration, callback and readiness procedures. D16 plan/region/cost/operator/retention/recovery/delivery/retry/capacity decisions remain gates before real-data public beta.

[Pre-edit inventory](evidence/phase3-start.json) records HEAD `03c130eb7c3cd7428980034b6b022b4ada1d3f83`, untracked tests/test5 and file hashes. Commit-only diffs cannot capture the starting scaffold; use file-level comparison and preserve pre-existing docs/assets. [Checkpoint evidence](evidence/phase3-frontend-checkpoint.json) records added/changed paths and actual results. No baseline commit was created.

Primary backend references consulted: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Before User Created Hook](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook), [password auth](https://supabase.com/docs/guides/auth/passwords), [local development](https://supabase.com/docs/guides/local-development) and [CLI configuration](https://supabase.com/docs/guides/local-development/cli/config). Links support implementation choices, not a successful live test.

## Frontend hands-on review checkpoint

Use the running app’s development-only review route for fictional auth/workspace states; [HANDOVER.md](../../HANDOVER.md) gives current URLs and the full checklist. Check C’s type/palette/hierarchy at desktop/narrow widths, form error/success/expired states, matching passwords, project selection/filter/search, independent task toggles and mobile detail/back/sign-out access. Real sign-in remains connection-dependent. User reports “everything looking good so far!”; no detailed check coverage was supplied. Separate Standards and Spec passes are recorded in the [Phase 4a report](evidence/phase4a-frontend-review.md); SP-2’s scoped UI correction is Resolved/accepted; SP-1’s configured-account verification remains backend-blocked. No complete-feature or live-RLS verdict is implied.

## Remediation

2026-10-30: positive hands-on feedback recorded without inferring detailed coverage. [Separate Standards/Spec reports and diagnosis limits](evidence/phase4a-frontend-review.md) preserve the actual scope and evidence. That initial review made no source changes or live checks; the subsequent authorized corrections are recorded below.

| ID / source | Impact and current status | Proposed action / verification |
| --- | --- | --- |
| SP-1 / Spec | Medium; **Implemented; backend-dependent re-check blocked**. Actual unconfigured /workspace redirect shows service-not-ready feedback; configured denied/unavailable cases remain unverified. | Preserve/display a safe access reason. Reproduce through actual route/AuthView navigation; no correct existing automated navigation seam, so agree one before durable regression tests. Backend verification remains deferred. |
| SP-2 / Spec | Low; **Resolved — scoped UI behavior accepted**. Desktop/mobile verification resend and recovery actions work in preview; real no-context recovery also navigates correctly. | Separate verification/recovery expiry; retain resend. Reproduce expired verification and recovery in a permitted browser, then re-check both. No existing automated UI seam; build/source assertions alone do not verify the symptom. |

Bugs/source inconsistencies precede optional cleanup. The Standards fixture-branch smell has no proposed refactor; reassess during record implementation. Prefer reproducing both issues before correction. Any user-approved best-effort source fix must explicitly retain missing runtime diagnosis and require browser re-check; approval does not establish correctness. The user approved the remediation and source-based implementation with browser verification pending. Scoped production patches are now applied; full feature stays In progress.

### Historical source-only correction outcome — 2026-10-30

SP-1: AuthView displays the retained in-memory account-access result on sign-in, excluding preview and unconfigured-service states; manual sign-in refreshes that result. No identity or denial details are placed in URL parameters. Auth-change routing now handles verification consistently with protected-route entry. SP-2: only reset-password expiry hides its form and requests recovery; expired verification keeps email/resend available.

User authorization explicitly accepts source-based best-effort corrections while browser reproduction is unavailable. Cause/runtime correctness remains unconfirmed; this exception is not a diagnosis pass. No new regression test was added at an unagreed/shallow UI seam. Existing 14 account/config tests passed and vue-tsc/production build passed; they do not exercise the two visible symptoms. Independent Standards/Spec re-checks found no additional scoped source issue. [Correction evidence](evidence/phase4b-account-state-fixes.json) records hashes, results and limits.

Hands-on re-check: `/__preview?screen=verify-email&state=expired` must offer verification resend; `/__preview?screen=reset-password&state=expired` must offer recovery instead of a password form. Later, with an isolated backend, verify denied/unavailable protected-route and auth-change redirects show their distinct messages. Backend checks remain deferred. Keep both findings Implemented awaiting re-check; user feedback on these fixes and runtime evidence are still outstanding.

### Historical Playwright MCP tool-availability attempts — 2026-10-30

User requested browser re-checks via newly configured Playwright MCP. This conversation exposes no callable Playwright MCP tools; no server connection/startup was attempted, and no corresponding error is available. This differs from the earlier built-in Browser error. [Availability evidence](evidence/phase4-playwright-availability.json) and HANDOVER.md preserve the fresh-conversation resume instructions. Both findings remain Implemented awaiting re-check. This historical tool-visibility check has been superseded by the connected browser results below; actual SP-1 paths needing the deferred backend remain blocked.

Resume re-check, also 2026-10-30: callable Playwright MCP tools are still absent from the available tool catalog. The existing local app listener on port 5173 was reused; an approved HTTP check returned **200** after the sandbox connection failed. This establishes HTTP availability only. No screenshot, desktop/mobile check, console inspection or expiry/redirect failure path ran; there is no new observed browser evidence. Both findings remain **Implemented awaiting re-check**, with runtime diagnosis unresolved. Actual provider expiry/denied/unavailable cases requiring the backend remain blocked by its explicit deferral. No application changes or unit/build reruns occurred. User re-check of the existing fixes remains required before final feature acceptance.

### Observed Playwright MCP re-check — 2026-10-30

New Playwright MCP tools became visible and connected successfully. Initial app navigation returned ERR_CONNECTION_REFUSED because Vite was stopped; restarting with compatible Node succeeded after the sandbox listen restriction required approved escalation. This is distinct from the earlier built-in Browser failure. Server: `http://127.0.0.1:5173/`, session 57990.

[Browser evidence](evidence/phase4-browser-recheck.json) records six screenshots and observed clicks at 1440×1000 and 390×844. SP-2: expired verification kept enabled resend; fictional submission produced verification feedback, with no recovery action. Expired recovery had no password inputs, and its link opened the recovery-request screen. Real `/reset-password` without recovery context likewise opened `/forgot-password`; no provider token expiry was exercised. No horizontal overflow or console errors observed in checked account states; full accessibility/parity remains outside this result.

SP-1: actual `/workspace` navigation reached `/sign-in` and explained the unconfigured backend with disabled sign-in at both widths. This does not prove configured-account denied/unavailable or auth-change handling: those cases remain **blocked by the explicit backend deferral**. No preview, injected session or modified service state was counted as actual redirect proof. No application source changed. Current statuses are in the remediation table; historical “browser unavailable” entries above describe earlier attempts. User subsequently accepted the corrected frontend screens (see acceptance below); the full feature remains In progress.

### Frontend acceptance — 2026-10-30

After being asked to re-check the corrected verification/recovery screens, the user replied **“looking good!”** Record acceptance of the scoped frontend fixes; no particular viewport, action sequence or backend check was claimed by the user. Combined with the observed Playwright expiry checks, SP-2 is **Resolved for its scoped UI behavior**. This does not establish provider token expiry/email delivery. SP-1 stays implemented with configured-account denied/unavailable verification blocked by the explicit backend deferral. The frontend review checkpoint is accepted; the full accounts/tracking plan remains In progress. The next planned implementation milestone is manual client/project/task/existing-invoice entry; no record implementation occurred in this acceptance update.
