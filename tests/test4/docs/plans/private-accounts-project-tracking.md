# Private accounts and project tracking

## Status and shared constraints

Status: In progress — implementation authorized on 2026-10-28; accepted plan/Layout A and D18 deferrals preserved.
Implementation: Phase 3 authorized; milestone verification tracked below.
Planning requested on 2026-10-28. User explicitly confirmed the written scope/approach direction on 2026-10-28. Layout A was selected and the reconciled written plan/design explicitly accepted on 2026-10-28. No executable prototype or implementation is authorized by this planning request.

The accepted [SPEC](../../SPEC.md) and [glossary](../GLOSSARY.md) are the baseline; the [planning guide](PLANS.md) governs this document. Preserve the existing `lancealot/` application directory. Budget/date remain unset (D8); vendors/costs/limits/region/retention/recovery/operator decisions remain explicit pre-real-data/public-launch blockers (D18). These plans do not provision services or change those gates.

## Problem, outcome and scope

Replace spreadsheet-only tracking with private, persistent client/project records. Cover verified email/password signup, sign-in/out, verification and recovery; one workspace per freelancer; clients, projects, tasks and full paid/unpaid invoices. Include create/read/update, state changes and agreed deletion protection. References: SPEC D1, D6, D11, D12, D15–D17.

Exclude teams/shared workspaces, client logins, invoice generation, collection, partial payments, conversion, import, email delivery and account erasure. The latter features are planned in [Today/digest](today-daily-digest.md) and [export/deletion](export-account-deletion.md), not dropped from first-release scope.

## Baseline before Phase 3

`lancealot/src/main.ts` mounts the starter `App.vue`. Vue/TypeScript/Vite, the `@` source alias and type-check/build scripts exist. No router, Supabase client/schema, authentication, product screens, tests or lint runner exist. Architecture/testing/runbook documents are placeholders. Proposed modules and migration/test paths below do not exist yet.

## Approach and interfaces

Use Supabase Auth and RLS as selected in SPEC. Model clients, projects, tasks, invoices and settings with authenticated ownership and same-owner relationship constraints. Derive the owner from the authenticated context, never trust a browser-supplied owner. Include ownership and relationship attack checks at the database interface; privileged handlers must independently validate ownership.

A private-account module hides session/bootstrap/verification/recovery states from callers. A tracking module exposes validated record reads/changes and state transitions; Vue screens cross the same interface exercised by tests. Database policies/constraints are the authoritative enforcement, not route guards. Do not add generic repository wrappers solely to mirror the SDK. Initial official-doc checks are recorded in [integration findings](../research/phase2-account-data-delivery.md). SDK versions and local integration remain to verify during implementation setup. Include an active-account existence/status requirement in RLS/privileged paths: an old JWT must not restore access or recreate a deleting/deleted account.

Changeable validation defaults: trim and require client/project names and task titles; require invoice reference, exact decimal amount, currency and due date. Preserve calendar dates rather than converting them to midnight UTC; use exact decimal monetary storage with no cross-currency totals. AT1–AT3 are agreed: states may be corrected, invoices require positive amounts, and individual task/invoice deletion requires confirmation. Per-client reference uniqueness is agreed (AT4). Exact text limits are changeable validation defaults; current and historical ISO currency coverage is agreed (AT6). Planned: current and historical ISO currency codes with currency-appropriate minor-unit precision, no silent rounding, finite positive PostgreSQL numeric storage and decimal strings in JavaScript/JSON. Reject NaN/infinite/exponent-form inputs rather than passing them through generic number coercion. The authoritative currency-code/precision source is verified in the integration findings; AT6 selects both current and historical monetary currency codes; special non-monetary entries without applicable precision must not be treated as ordinary currencies with an invented two-decimal rule. No universal two-decimal rule.

Screens for Phase 2b: account entry/verification/recovery, Clients, Projects, project detail with Tasks/Invoices. Specify loading, no-data, validation, expired-session and rejected-save states. At the original planning baseline, only static wireframes were present; the later HTML prototype is retained for history.

## Shared data/interfaces

Keep one account-control record per Auth identity, with lifecycle checked at the authoritative database interface. Client/project/task/invoice/settings rows have stable IDs and owner IDs; same-owner foreign keys prevent cross-account links, and indexes support owner/project queries. Ownership cannot be reassigned by an ordinary client write. Reads and mutations require an existing verified, active account, not only a syntactically valid JWT.

Use a deliberate transition interface for corrections: task complete/reopen; project active/completed/archived transitions; invoice paid/unpaid correction. Do not cascade these state transitions to children. Planned: edits may move a project to another owned client or a child to another owned project; reject the entire edit on ownership/reference conflicts. No cross-owner transfer or bulk migration subsystem.

Planned module results distinguish successful save, validation issue, stale/conflicting update, access denial and temporary failure. Use a revision check for concurrent edits so a stale form does not silently overwrite newer state. Fine-grained caching/UI placement remains Phase 2b/implementation detail.

## Planned verification tooling

Use Vitest for domain/client-interface behavior; pgTAP and local Supabase integration checks for RLS, constraints and active-account lifecycle; real-browser synthetic-user flows for login/tracking and narrow/desktop layouts. These complement each other: mocked Supabase responses cannot prove RLS. Tool installation and test scripts are future implementation work; no new npm test command is claimed. Local CLI tests need a running local stack; document actual prerequisites before executing them. See [integration findings](../research/phase2-account-data-delivery.md).

## Milestones and planned verification

1. **Ownership and account lifecycle:** schema/settings bootstrap, Auth flows, RLS/grants and same-owner relationships. Verify two synthetic users cannot read, modify, delete or link each other's data through direct database/API access; unauthenticated and unverified use must not gain private records. Check sign-out/recovery/expired-link/session behavior.
2. **Persistent tracking:** client → project → task/invoice forms and lists. Verify saves survive reload, invalid changes leave data unchanged, currencies retain exact values and state changes preserve the parent/child reminder rules.
3. **Lifecycle and UI integration:** implement agreed correction/deletion policy, project completion/archive and responsive accessible screens. Verify archive/complete does not modify child completion/payment states; rejected parent deletion preserves children.
4. **Cross-feature contract:** provide owned records/settings for attention calculations and export/deletion; demonstrate those interfaces with synthetic fixtures. No product feature is declared publicly ready before D18 gates.

## Acceptance and verification strategy

Use SPEC's ownership, persistence, relationship, invoice and accessibility criteria. During implementation, add meaningful automated domain/database checks and browser flow verification; use the accepted Vitest/pgTAP/browser verification approach during implementation. Existing command: `npm run build` from `lancealot/` includes type checking; `npm run type-check` is available for focused checks. No test command exists yet; build success alone cannot prove RLS or workflows.

Review migrations, grants/RLS, privileged paths and credential placement. Public keys/config only in the browser; never expose privileged/email secrets in VITE variables. Establish migration/recovery and synthetic-data verification before using real data.

## Feature decisions and implementation checks

- AT1 — Agreed: allow reopening tasks/projects, reactivating archived projects, correcting paid invoices back to unpaid, and editing child records under completed/archived projects. Recompute reminders from current state/dates; parent corrections never silently change children.
- AT2 — Agreed: positive invoice amounts only; reject zero and negative amounts. No credit-record extension.
- AT3 — Agreed: permit permanent individual task/invoice deletion after explicit confirmation; removed records leave current attention eligibility. Parent deletion protection remains D17. No undo/soft-delete subsystem selected.
- AT4 — Agreed: invoice references are unique per client within the owning workspace; different clients may reuse a reference. Cross-project duplicates for the same client must be rejected. Normalization/case rules below remain changeable validation defaults within per-client uniqueness requirements.
- AT5 — Agreed approach; low-impact values remain changeable defaults: minimum text validation, verified currency metadata/precision, same-owner reassignment and conflict-safe edits, active-account checks and verification tooling as described above. Currency source and current/historical coverage are settled; validation and exact metadata-version handling remain part of the proposed technical approach.
- AT6 — Agreed: current and historical ISO currency codes for invoice entry, retaining the recorded code and exact positive amount with applicable currency precision. No conversion or automatic replacement with a successor currency. Custom currencies/crypto require separate scope review.
- AT5 technical approach is accepted; low-impact defaults remain changeable and implementation requires a separate go-ahead. TD3 onboarding is now agreed in the digest plan.

## Validation and relationship scenarios — changeable defaults

Trim outer whitespace from references, preserving display spelling; compare normalized references case-insensitively per client. Reject conflicts across projects for that client. Updating a project client or moving an invoice must enforce uniqueness at commit, with no partial move. A database-enforced client/reference key, with client ownership tied to the parent project, prevents concurrent bypass; any derived client key must be maintained transactionally, not accepted from the browser.

Text length limits and list/page sizes are changeable defaults; nonempty names/titles/reference, positive finite amounts, valid calendar dates and required relationships are behavioral validation. Changing amount or currency revalidates precision without conversion or silent rounding. Preserve existing saved currency metadata if code definitions later change. Dated currency-source updates are reviewed data maintenance, not a live third-party dependency for each save.

| Scenario | Expected result |
| --- | --- |
| Same client, same reference in two projects | Second save rejected without changing existing invoice |
| Two clients reuse a reference | Both invoices allowed |
| Concurrent forms claim the same client/reference | At most one conflicting save succeeds |
| Move project/invoice creates reference collision | Entire move rejected; original relationships retained |
| Reopen overdue paid invoice as unpaid | Next attention calculation includes it by current due date |
| Correct child of archived/completed project | Child remains editable; parent reminder rule stays independent |
| Zero/negative/nonfinite amount or unsupported precision | Validation failure; no silent rounding or failed-save success message |
| Stale JWT after account lock or identity erasure | No read/write/export/bootstrap access to private records |

## Direction review and handoff

Phase 2a scope/approach direction is confirmed and Layout A is selected. The design section below reconciles the same plan with the shared style guide. Final written-plan/design acceptance is recorded; D18 deferrals remain release gates. Implementation is authorized; current progress is recorded below.

## Progress, risks and outcomes

| Milestone | Implemented source and evidence | Still required |
| --- | --- | --- |
| Ownership/account lifecycle | Auth views/client, fixed-token request binding, active-account bootstrap/RLS/mutations; isolated owner/stale-session tests | Actual verification/recovery/expired-link/sign-out integration against chosen Supabase project |
| Persistent tracking | Client/project/task/invoice forms, explicit corrections, version checks, same-owner relationships and atomic per-client uniqueness; PostgreSQL integrity checks | Hosted persistence/API/grant validation and final code review |
| Lifecycle/UI | Layout A, protected parent deletion, confirmed child deletion, current/historical currency metadata and exact decimal snapshots | Actual desktop/mobile, keyboard/dialog focus and accessibility review |
| Shared interfaces | Owned snapshot, live database attention rule, settings/export and worker/deletion contracts | Workload/limits and end-to-end cross-feature hosted verification |

Source now lives in lancealot/; [ARCHITECTURE](../ARCHITECTURE.md), [TESTING](../TESTING.md) and [RUNBOOK](../RUNBOOK.md) describe current modules, checks and activation/recovery procedures. Milestones are not declared publicly complete while integration/review gates remain.

## Phase 2b design context

Direction and final written-plan/design acceptance are recorded for the linked three-plan scope. [Shared DESIGN.md](../DESIGN.md) records selected Layout A (work ledger); B remains only a considered alternative. The reconciled Layout A design and this written plan were explicitly accepted together on 2026-10-28. The later HTML prototype was approved before Phase 3; see its recorded verdict. Use the accepted glossary and preserve all reminder, ownership, currency, export and deletion behavior. Layout A is accepted; low-impact token/interaction values below remain changeable defaults within agreed requirements.

### Screens and interaction flow

Sign up (email/password) → check-email state → verified sign-in → confirm/correct timezone → Clients/Projects. Verification/recovery expired links show a safe resend/retry path. Sign-in/recovery errors avoid leaking whether an unrelated email exists. An expired session blocks private content and offers sign-in; do not silently save pending form changes as another account after reauthentication.

First-use empty state: Add client → create project under that client → add task/invoice within the project. Existing clients/projects can be selected by name; all choices are owner-scoped. Avoid a generic Add task action without project context. A project detail header shows client, current project state and optional deadline; Tasks and Invoices remain accessible/editable when the project is completed/archived.

```text
Projects / Launch kit                       [Edit project]
Cedar Studio     Active     Deadline: 30 Oct  [Archive project]
[Tasks] [Invoices]

Tasks                                    [Add task]
Send revised estimate   Follow-up: 28 Oct    [Open]

Invoice form
Reference [INV-014]  Amount [450.00]  Currency [USD]
Due date  [26 Oct]   Status [Unpaid]
[Cancel] [Save changes]
```

Examples are synthetic. Currency selection must expose code/name and clearly label historical codes; never pre-convert an old invoice. Render amounts with currency code, not a potentially ambiguous symbol alone. Project deadline/task follow-up fields say Optional; invoice amount/currency/due date/status are required. Keep desktop aligned rows and narrow-screen stacked rows consistent with selected Layout A.

Place task complete/reopen and invoice paid/unpaid correction beside the record state; require an explicit labeled action, not an unlabeled icon or color toggle. Record deletion uses a confirmation dialog naming the record and permanent effect. Project/client deletion with linked records explains what blocks it and offers navigation/Archive project where applicable; never silently cascade-delete children.

### Design reconciliation and acceptance checks

Tracking/account modules provide field-level validation and stale/conflict/access results to forms; the UI must retain input on recoverable failure. Milestones 1–3 include the auth/first-use/correction/delete screen states above. Browser verification covers keyboard-only form use, expired session, confirmation cancel, save conflict, historical-currency selection, desktop/narrow layout and parent/child lifecycle independence. Layout A supplies the persistent desktop sidebar and compact rows, with stacked narrow-screen records/navigation disclosure. Exact form organization remains a changeable default within the required records/rules.

## Acceptance and implementation boundary

The user explicitly accepted this written plan together with DESIGN.md and the linked plans on 2026-10-28, including Layout A and explicit D18 deferrals. This is final written-plan/design acceptance, separate from the earlier direction/layout confirmations. Requirements and accepted technical approach govern implementation; low-impact defaults remain changeable within agreed outcomes.

Provider choices/costs/limits, region, backup/deletion-log retention, recovery/cleanup operating configuration and named support/maintenance ownership remain D18 gates before real-data/public use. No numerical delivery/erasure SLA, paid plan or separate worker infrastructure is silently agreed. Unresolved vendor-dependent behavior must be verified against the documented acceptance scenarios before launch.

Initial written acceptance covered static wireframes; a follow-up HTML UI prototype was subsequently requested and created (see review addendum). Production implementation is not authorized by document acceptance alone. Implementation proceeded through private ownership/account lifecycle, persistent tracking and the dependent digest/export/deletion work. Implementation/local verification is recorded in the Phase 3 ledger; live validation remains pending.

## Follow-up HTML prototype review

The user requested an actual browser-verifiable UI mockup after written-plan/design acceptance. Artifact: [lancealot-ui.html](../prototypes/lancealot-ui.html); [review/run notes](../prototypes/README.md). The installed prototype UI skill was applied, adapted to the explicit standalone HTML request because no host product route/router exists. A is the selected Work ledger; B/C are optional structural comparisons. Synthetic records and mutations exist only in memory. No application source, backend, service or persistent data was changed.

Question: does Layout A's density, navigation, responsive hierarchy and the relevant record/reminder/data flows work in an actual mock UI? Verdict: Approved — user endorsed the prototype direction and requested frontend-design refinement during Phase 3 on 2026-10-28. Layout A remains selected; implementation is rewritten as maintainable Vue modules. Branch/commit: none; implementation is now authorized separately as recorded below. Reconcile feedback in this same plan/DESIGN.md; do not create a second feature plan or treat script checks as design acceptance.

Node syntax and non-browser render/state smoke checks passed. No browser connection was available, so actual rendering, mobile reflow, native dialog/keyboard behavior and accessibility remain unverified. The user subsequently approved the prototype and explicitly authorized Phase 3. Actual rendered Vue/browser review remains pending; this does not expand external-service authorization.

## Phase 3 implementation authorization

User explicitly approved the prototype direction and requested Phase 3, including frontend-design use during implementation. This supersedes prior session-only no-implementation restrictions. Work proceeds within accepted scope; no service provisioning, deployment, paid plan or real-email sending is implied. Actual milestones and evidence will be recorded here as completed.

## Phase 3 verification and remaining gates

Implementation authorized by the user's explicit Phase 3 request and reaffirmed target tests/test4. Layout A prototype verdict: Approved; frontend-design used for the Vue implementation, with refined ledger hierarchy, responsive stacking, long-record reflow and mobile sign-out access. No provider/project/paid plan or deployment was approved by the target clarification.

Local verification (Node 24.22.1): Vitest suites for domain, component boot/sample flow, fixed-token gateway, deletion authorization, worker outcome handling and actual migrations on PGlite/PostgreSQL 18.6. A full production build includes Vue type checking. Final command outcomes are in HANDOVER.md; no hosted Supabase, deployed Deno or rendered-browser success is inferred.

Test-runner adaptation: added PGlite to execute actual migration/RLS/job SQL in isolation because no Supabase CLI/Docker stack is configured. It supplements, not replaces, authored pgTAP and Playwright checks. Auth is a small SQL fixture shim; true hosted JWT/session behavior and simultaneous service workers still need review. Vitest forces blank connection configuration; sample mode is explicit and never silently stores real records.

Both service gates remain false. D18 provider/cost/limit/region, backup/metadata retention, recovery/cleanup configuration and operating/support ownership remain unresolved before real-data/public use. The Resend adapter is optional code, not a vendor selection. No real accounts, emails, credentials, external deployment or production erasures were created. Features remain In progress until final review and service validation; do not mark Complete merely because code/local checks exist.
