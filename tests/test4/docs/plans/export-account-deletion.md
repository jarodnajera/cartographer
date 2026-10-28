# Export and account deletion

## Status and shared constraints

Status: In progress — implementation authorized on 2026-10-28; accepted plan/Layout A and D18 deferrals preserved.
Implementation: Phase 3 authorized; milestone verification tracked below.
Planning requested on 2026-10-28. User explicitly confirmed the written scope/approach direction on 2026-10-28. Layout A was selected and the reconciled written plan/design explicitly accepted on 2026-10-28. No executable prototype or implementation is authorized by this planning request.

The accepted [SPEC](../../SPEC.md) and [glossary](../GLOSSARY.md) are the baseline; the [planning guide](PLANS.md) governs this document. Preserve the existing `lancealot/` application directory. Budget/date remain unset (D8); vendors/costs/limits/region/retention/recovery/operator decisions remain explicit pre-real-data/public-launch blockers (D18). These plans do not provision services or change those gates.

## Problem, outcome and scope

Let the freelancer retrieve their records and deliberately remove their account. Deliver owned JSON export and confirmed account deletion that revokes access, stops reminders and removes active owned data. References: SPEC D12, D13, D17 and D18.

Depends on [accounts/tracking](private-accounts-project-tracking.md) for ownership/schema/session interfaces and coordinates with [Today/digest](today-daily-digest.md) for delivery cancellation and in-flight behavior. No import, partial deletion of another user's workspace, shared workspace, or automatic backup-erasure deadline is implied.

## Observed context and approach — proposed

The starter has no export/deletion handlers, database, product UI or tests. Settings will hold these actions; use a clear separate destructive flow in Phase 2b. No executable prototype is needed for this round; test cases and a state table will document behavior.

An export module exposes one owned snapshot through a versioned JSON format. Export fields: format version/export timestamp and collections for clients, projects, tasks, invoices and workspace settings, retaining stable IDs/relationships and exact amount/currency/date values. Exclude passwords, tokens, privileged secrets and other users' data. Internal delivery/operational metadata is not user domain data; a narrow profile object includes the verified account email as defined in the export contract below. JSON is not an import/restore promise.

A deletion module validates current identity/confirmation, prevents new account work and digest dispatch, removes active owned records and the identity, and reports a truthful success/failure state. A deletion request must not trust an owner ID supplied by the caller. Exact ordering, concurrency protection, retry/recovery state and session revocation require review against current Supabase behavior before finalizing. Account deletion crosses database/Auth/provider operations; do not assume they share a single atomic transaction.

Agreed recovery direction (ED2): once deletion begins, fail closed for reads/writes/export and new digest dispatch; if a later operation fails, preserve enough narrowly scoped operational state to retry without restoring active access or destroying another account. Any retained identifying metadata and its expiry must be explicitly defined alongside D18, not silently retained forever.

## Refined deletion/export proposal

Official Supabase docs confirm issued JWTs can remain valid after Auth deletion and `reauthenticate()` sends an OTP, not password proof. See [integration findings](../research/phase2-account-data-delivery.md). Therefore propose an active-account check in RLS and every privileged path, and server-side password verification bound to the caller's validated identity and this deletion request. Passwords/tokens never enter logs or stored deletion state.

Planned export: version 1 JSON with an exported-at instant, owned client/project/task/invoice collections and settings. Decimal amounts are strings; date-only fields remain date strings; IDs/relationships are preserved. Build one consistent database snapshot; don't assemble unrelated page fetches. Include the verified account email as the explicit profile field defined below; never export Auth tables wholesale. Produce a download directly; no durable storage bucket or email attachment subsystem is introduced.

Planned deletion sequence:

| State | App behavior | Next operation |
| --- | --- | --- |
| Active, before confirmation/password success | Normal owned use; export available | Cancel without effects, or authenticate and confirm |
| Deleting, committed account lock | Reject app reads/writes/export and new digest dispatch, including stale JWT calls | Retryable privileged cleanup |
| Cleanup incomplete | Remain locked; do not claim completed erasure | Scheduled reconciliation of only this deletion operation |
| Auth and active owned data removed | No private access/new sends; report completed erasure | Apply approved backup/metadata retention policy |

Offer export before deletion, without requiring it. After confirmation commits deletion, there is no cancellation or undo (ED2). Durable cleanup state stores only what retries require; retention/erasure policy must be settled before real-data/public use. The existing Cron/Edge execution will reconcile partial cleanup; monitoring and operator escalation were explicitly agreed in ED2. No new queue/vendor is introduced. Exact cadence and retained job metadata remain proposed implementation defaults subject to D18 retention/ownership gates.

Coordinate dispatch through a per-account database serialization point and a documented dispatch-authorization step: a deletion lock that wins first prevents new sends; a provider request already authorized/in flight may still arrive. Provider acceptance cannot be recalled. Recheck account/opt-out/current item state before dispatch authorization. Test both orderings; do not describe a database lock as an atomic transaction with external email. The failure ordering below proposes lease/retry and minimal state cleanup; prove this accepted approach during implementation.

## Milestones and planned verification

1. **Export contract:** versioned JSON snapshot of all owned records/relationships/settings. Verify two-user isolation, exact monetary values, completed/archived parents and children, empty account and snapshot consistency under concurrent edits; define errors without pretending partial output is complete.
2. **Confirmation and identity checks:** explicit destructive confirmation and the selected authentication freshness policy. Verify canceled/failed confirmation has no effect, and guessed account identifiers/expired sessions cannot delete data.
3. **Deletion coordination:** stop new work/reminders, erase active owned data, remove identity/revoke access. Test partial failures, retry, concurrent export/write/send, repeat requests, pending delivery jobs and cleanup of dependent records without affecting another user.
4. **Settings UI and launch readiness:** accessible export/error/download and destructive-action states. Demonstrate erase/restore interaction and operational support/recovery under the approved D18 policies before real-data/public use.

## Acceptance and verification strategy

The export must be valid JSON representing a consistent owned snapshot, with relationships and currencies preserved and no secrets/other users' data. Deletion requires explicit confirmation; after success private account access and future reminder dispatch are unavailable, active owned records are removed and other accounts are unchanged. Confirming deletion is not merely archiving a workspace.

Define integration checks through the export/deletion module interfaces, actual ownership policies and identity/deletion adapters; combine with UI flow verification. Existing `npm run build` from `lancealot/` covers type-check/build only; test infrastructure must be selected/added during separately authorized implementation. No production erasure, restore, delivery or availability result is claimed.

Review every privileged operation and partial-failure path. Backups may retain data according to the later approved policy; define retention, erasure handling on restore, deletion-log retention and operator duties before public use. The plan must not invent a retention duration or mark D18 satisfied.

## Feature decisions and implementation checks

- ED1 — Agreed: require password reauthentication and explicit account-deletion confirmation. A signed-in session alone is insufficient; a failed password check/cancel must not begin deletion.
- ED2 — Agreed: lock app access and new sends when confirmed deletion begins; no undo after cleanup starts; offer optional export beforehand. Partial failures remain locked and retry through existing Cron/Edge Functions. Monitoring and operator escalation for repeated failures are accepted duties; no completion claim before actual cleanup.
- ED4 — Agreed technical approach: snapshot/versioned export contract, identity-bound password validation, active-account gate, retry state and dispatch serialization as above. Verify the documented failure/race cases during implementation.
- ED3 — Deferred under D18: backup retention/restore-erasure handling, recovery targets and operational owner. Exact deletion-job metadata/retention must be resolved before real-data/public use.

## Export and cleanup failure cases

Export one versioned JSON document from a single statement/read-only database function using a consistent snapshot, rather than separate client pages. Require the active-account/session checks before access; stable snapshot semantics are verified in the research note. Include a narrow profile object (stable owner ID and verified email), clients/projects/tasks/invoices and settings, with decimal strings/date strings. Exclude all credentials, internal delivery/deletion logs and unrelated Auth metadata. Return a useful error instead of truncated/incomplete JSON. Direct download only; introducing persistent export files/background generation later needs scope/cost review.

For deletion, serialize the irreversible account lock against writes/dispatch authorization. Commit the lock and a privileged, owner-scoped deletion operation together. Bind recent password proof to the same requesting identity/session/operation; do not persist the submitted password or accept an untrusted client flag as proof. After lock, remove pending jobs, erase domain/settings data, then remove Auth identity with the server-only admin operation. Preserve the account-control denial state until identity removal is known successful; afterward missing-account checks prevent stale-JWT recreation. Private operation state must survive identity deletion until cleanup completes, without exposing logs to other users.

| Failure or concurrent operation | Required result |
| --- | --- |
| Password incorrect, confirmation canceled, or lock transaction fails | No irreversible cleanup starts; report failure/cancel truthfully |
| Write/dispatch races with deletion | Serialized ordering; operation after lock is rejected, authorized external send cannot be recalled |
| Export started before lock | A previously authorized consistent download may complete; export after lock denied |
| Domain deletion fails after lock | Remain locked, retry the same scoped operation; no completed-erasure message |
| Identity deletion fails after domain cleanup | Preserve deny state and minimal operation record; retry identity removal |
| Response lost after identity removal | Reconciler checks identity absence and known cleanup state; don't require a new user login to finish |
| Duplicate worker/request | One fenced cleanup claimant; steps are idempotent and restricted to the operation owner |
| Cleanup cannot finish automatically | Bounded automatic attempts then operator escalation; retain locked state, not endless blind retries |

Operational configuration under D18: use existing scheduled execution for a bounded cleanup retry series; store attempt count/next attempt/last safe error/state with minimal owner identifier. Exact delays/attempt limit and deletion-log retention require an operational configuration before real-data use under D18; no guaranteed erasure/recovery deadline is invented. Synthetic-data implementation must exercise bounded-failure/escalation behavior before marking the feature done. This is the already accepted cleanup duty, not approval for a separate managed job system.

The UI distinguishes “deletion started; access locked” from “deletion completed.” If completion becomes asynchronous after sign-out, do not add a public account lookup: present the known pending state and the support path established under D18. Detailed receipt/status UX is Phase 2b work; no extra email channel is promised.

## Direction review and handoff

Phase 2a scope/approach direction is confirmed and Layout A is selected. The design section below reconciles the same plan with the shared style guide. Final written-plan/design acceptance is recorded; D18 deferrals remain release gates. Implementation is authorized; current progress is recorded below.

## Progress, risks and outcomes

| Milestone | Implemented source and evidence | Still required |
| --- | --- | --- |
| Export contract | Stable owned JSON snapshot, narrow profile, exact decimal/date strings and download; isolation/string checks | Concurrent hosted edits/large-data/export-limit review |
| Identity/confirmation | Password-confirmed dialog and tested handler: verified caller, matching password proof, explicit confirmation, ignored submitted owner | Actual Supabase Auth proof/Edge runtime and native keyboard/dialog verification |
| Erasure coordination | Irreversible lock, cancellation of new dispatch, scoped purge, identity removal, bounded cleanup/reconciliation and operator escalation; isolated failure/ownership checks | Deployed worker/admin API, overlapping service execution and operational recovery review |
| Settings/release readiness | Feature readiness gate, optional export, distinct pending/completed semantics and clearly simulated sample deletion | Approved retention/restore-erasure policy, cleanup configuration/support path and final review |

Source now lives in lancealot/; [ARCHITECTURE](../ARCHITECTURE.md), [TESTING](../TESTING.md) and [RUNBOOK](../RUNBOOK.md) describe current modules, checks and activation/recovery procedures. Milestones are not declared publicly complete while integration/review gates remain.

## Phase 2b design context

Direction and final written-plan/design acceptance are recorded for the linked three-plan scope. [Shared DESIGN.md](../DESIGN.md) records selected Layout A (work ledger); B remains only a considered alternative. The reconciled Layout A design and this written plan were explicitly accepted together on 2026-10-28. The later HTML prototype was approved before Phase 3; see its recorded verdict. Use the accepted glossary and preserve all reminder, ownership, currency, export and deletion behavior. Layout A is accepted; low-impact token/interaction values below remain changeable defaults within agreed requirements.

### Settings and deletion flow

Settings separates Data export from a visually distinct Delete account section; destructive actions are not beside routine reminder saves. Export data triggers the direct JSON download. Show preparing/ready/error states and keep the button available again after failure. Do not promise a restore/import function. If an export request races a deletion lock, report only the result the export/deletion interface actually authorizes.

```text
Settings / Your data
Export your records and settings as JSON.
[Export data]

Delete account
Permanently remove your account and active records.
Existing backup retention is explained by the approved launch policy.
[Delete account]
```

Delete account opens a dedicated review dialog/page: list what will be removed, explain reminders/access stop and that cleanup cannot be undone once begun, offer optional Export data, then request the current password and final explicit Delete account confirmation. Final action remains disabled until required confirmation inputs are present; the server still verifies password/identity. Never substitute a checkbox for actual password proof. Cancel returns focus to the trigger without changing account state.

On incorrect password/expired session or pre-lock failure, show a specific safe error and preserve the active-account outcome. Once the deletion lock commits, switch to “Deletion started. Account access is locked while cleanup finishes.” Do not offer Undo or re-enable app navigation. Only show “Account deleted” after identity/active-data cleanup is confirmed. If completion is asynchronous, show the last known pending state and the D18 support path; no public email/account lookup or new deletion-email feature is introduced.

Backup-retention/erase-on-restore wording is a release-gated content dependency. Keep a clear design placeholder until the policy is agreed; never ship an invented time period or claim backups disappear immediately. Before public use, name support ownership and define how an operator investigates a stuck minimal cleanup operation without exposing another account.

### Design reconciliation and acceptance checks

Export/deletion module results distinguish pre-lock failure, locked/pending cleanup and completed erasure so the UI cannot mislabel them. Milestones 1–4 cover download correctness, reauthentication/cancel/failure, irreversible-state messaging, async cleanup and the policy/support content gate. Verify keyboard focus, dialog name/description/error announcements, no other-user data, responsive destructive flow and every failure-state message. D18 remains unresolved rather than being hidden by a polished deletion screen. Layout A supplies the Settings shell; the separate review dialog/page with password and explicit confirmation is the reconciled destructive flow, covered by final written acceptance; implementation verification remains required.

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
