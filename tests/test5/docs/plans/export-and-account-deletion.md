# Workspace export and account deletion

Status: Accepted — 2026-10-30, including selected C and the retained browser/screenshot verification gap. Not started; scheduled after the current Phase 3 account/frontend review boundary.
Tier: Standard. Depends on the shared account/record contract in [private accounts and project tracking](private-accounts-and-project-tracking.md), plus the [digest processing](today-and-daily-digest.md) deletion/opt-out check. Related: [SPEC.md](../../SPEC.md), D12/D14/D16–D18, and [glossary](../GLOSSARY.md).

## Problem, outcome, and scope

Allow an individual freelancer to obtain their complete workspace data and delete their account/data before public use. Export and deletion are distinct from archival. Preserve the accepted data content and ownership rules; do not invent backup expiry, deletion completion timings or a cancellation grace period. Private testing remains synthetic-only, with actual operational retention/recovery policies required before real-data public beta.

## Context and proposed approach

No export/deletion functionality or backend exists. This plan uses the owned entities/preferences defined by the first plan, rather than maintaining another schema or owner definition. Keep export serialization behind an authenticated workspace-export interface, with a consistent snapshot of the owner's records and preferences. It must preserve relationships, statuses, exact amounts/currencies and calendar dates; exclude credentials, provider secrets, operational delivery records and other owners' data. A downloadable file is not a restore/import feature or an operational backup promise.

Privileged deletion is an authenticated server-side operation, never browser use of a service-role key. The proposed account-deletion interface implementing F6 verifies the owner and fresh credentials, records a durable deletion state, prevents subsequent access/data mutation/digest claims and resumes cleanup after partial failure. Every privileged record operation and scheduled send rechecks that state. Do not claim that local browser sign-out alone revokes every session or that stopping future jobs retracts email already accepted by a provider; validate real Supabase session behavior and document residual-token protections before acceptance.

## Decisions and bounded follow-up work

- F5 Agreed: versioned JSON download preserving owned records, relationships and preferences; no CSV ZIP or import/restore feature in this plan. The CSV alternative was not selected. Proposed implementation detail: a consistent database snapshot prevents concurrent edits from producing mismatched parent/child data; fail visibly rather than offer a silently incomplete export. Property names/version marker mechanics are bounded implementation detail.
- F6 Agreed: fresh password verification and explicit final confirmation, then irreversible resumable deletion. No cancellable pending-request flow or grace period. Optional export is offered first, not required. Acceptance stops application access and new reminders; active-data and backup deletion timelines remain deferred under D16. Existing provider-accepted or already in-flight email cannot be recalled by this flow. Stop new send dispatch after accepted deletion rather than promising no later arrival.
- Proposed flow default: offer an optional export before deletion without requiring download as a precondition. Explain irreversible scope and the difference between active-data cleanup and backup expiry. Review copy and failure/retry states in Phase 2b.
- D16 Deferred: active-data/backup retention/completion targets, operator ownership and support/recovery policy. Synthetic deletion-state verification can proceed without these numeric commitments; real-data public beta cannot.

## Milestones and review points

1. Export slice: snapshot and serialization, authenticated download and visible failure path. Review a synthetic workspace containing archived projects, unresolved tasks, paid/unpaid invoices with different currencies and preferences. Verify completeness and owner isolation.
2. Deletion-intent slice: reauthentication, confirmation, durable state and account/data/digest gates. Review two accounts plus stale/expired sessions, direct API access and concurrent mutations before destructive cleanup.
3. Cleanup/recovery slice: idempotent retry after partial failure, dependent-record removal and auth-account removal in an order that preserves the ability to resume. Review database, identity and digest failure cases without claiming a completion policy or restoring already-deleted data.
4. Public-use readiness: approve D16 policies, verify active-data deletion/backup expiry, monitoring/support, and UI claims against deployed behavior before real-data public beta.

## Planned interfaces and acceptance scenarios

The export interface authenticates the owner and returns one versioned JSON snapshot or an explicit failure. It excludes private credentials and provider/delivery internals. An export racing accepted deletion must not bypass the deletion access gate or read a partially cleaned workspace.

Deletion has a small proposed state model: active account → accepted deletion with access/reminders blocked → cleanup → complete, with incomplete cleanup resumable rather than returning the account to active. Persist the intent outside records that cleanup removes; do not orphan an unresumable request by deleting its only owner/job reference first. Privileged operations and ordinary RLS reads/writes must reject accepted deletion, including with previously issued access tokens. Exact storage/function names and retry policies remain implementation/deferred-policy work, not new glossary definitions.

Review failure scenarios include wrong password, lost confirmation request, repeated acceptance, auth deletion failure, cleanup interruption, concurrent export/mutation, previously issued token, another owner's ID, and a claimed but not yet submitted digest. Never present full cleanup/backup expiry as complete from receipt of the deletion request alone. Numeric completion, retention and retry targets remain D16 decisions.

## Verification strategy and limits

Planned export seam: integration tests of an authenticated owner export catch missing/foreign records and inconsistent snapshots; serialization tests validate relationships, amounts and dates but cannot prove RLS or browser download behavior alone. Browser review checks accessible export/error states.

Planned deletion seam: integration tests invoke the privileged operation with real test identities and inject failures at data/auth/digest interactions. Verify idempotency, ownership rejection, stale-session restrictions, completed cleanup and noninterference with another owner. A fake auth adapter cannot prove Supabase session revocation or server-side token checks. Race tests should coordinate a claimed digest and deletion, distinguishing unsent work from an already accepted email. Real backup-expiry/retention evidence is an operational gate, not a unit-test assertion.

The existing app check is `npm run build` in `lancealot/`. No export/deletion/test commands exist; choose test tooling with the first plan instead of installing a second stack. No build or application test ran during planning.

## External setup, progress and completion boundary

Later verification needs a synthetic Supabase environment with auth-admin deletion access, RLS policies, dependent-record constraints, digest-state checks and approved operator access. No environment provisioning or application code is authorized here. The later authorization covers the isolated styled preview; production integration remains unauthorized. Review-baseline evidence is recorded once in the first plan.

F5/F6 and direction are confirmed; the user accepted this plan with the guide and prototype, retaining the browser evidence gap. Implementation and Phase 4 completion/review remain separate. Feature acceptance must not imply that deferred real-data policy gates passed.

## Verified external fact

[Supabase user-management documentation](https://supabase.com/docs/guides/auth/managing-user-data), checked 2026-10-29, states that deleting an auth user does not retroactively invalidate issued access tokens. Therefore deletion-state restrictions must be exercised through actual database/function access with an old token; success from the auth deletion call or browser sign-out is insufficient evidence of immediate loss of application access. Do not invent a token-expiry duration to resolve this requirement.

## Reconciled design and acceptance

Use [selected C guide](../DESIGN.md) and [styled prototype](../design/previews/README.md): Settings offers optional JSON export, password re-entry and irreversible confirmation, then distinct accepted/incomplete/complete deletion receipts. Review preserved input/error feedback, other-screen access blocking and copy separating active-data cleanup from backup expiry. Mock passwords/receipts prove no security or cleanup behavior; exercise the real integration seams above, including stale tokens and claimed digests. Browser screenshots remain unavailable. Final plan/guide/prototype are accepted for the agreed scope, retaining the missing browser evidence. Feature implementation and cleanup behavior remain unverified.

Deletion/access/digest coordination rationale: [ADR 0002](../adr/0002-resumable-account-deletion.md).
