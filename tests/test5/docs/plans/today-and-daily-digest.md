# Today and daily digest

Status: Accepted — 2026-10-30, including selected C and the retained browser/screenshot verification gap. Not started; scheduled after the current Phase 3 account/frontend review boundary.
Tier: Standard. Depends on the shared account/record contract in [private accounts and project tracking](private-accounts-and-project-tracking.md). Related: [SPEC.md](../../SPEC.md), D7/D11/D14–D18, and [glossary](../GLOSSARY.md).

## Problem, outcome, and scope

Provide the live Today list and optional daily email from the same reminder rules, so tasks/deadlines/overdue invoices no longer require spreadsheet follow-up. Date triggers, completed/archived-project behavior, DST and same-day outage catch-up are already settled in the spec; do not reopen them or duplicate their full definition here. No client email, push channel, background offline app or external business-data integration is included.

## Context and proposed approach

No reminder implementation exists. Depend on stable owned records and preferences from the first plan. A reminder eligibility module takes an explicit instant, timezone and owned record snapshot and returns eligible reminder items; keep system-clock reads out of its rules. Both Today and scheduled processing must use this interface or pass the same shared conformance scenarios if runtime differences require separate adapters. Persist user dates without UTC date shifting.

A digest-processing module claims a workspace/local-date run, rechecks current records/preferences/deletion state, prepares minimal email content, and records provider outcome. Supabase Cron invokes authenticated Edge processing. Timezone-aware due selection, atomic claims and idempotency are required; Cron invocation alone is not deduplication. The email adapter is a real seam because synthetic tests and an eventual external provider behave differently. Record ambiguous provider timeouts separately from confirmed failures/submissions; do not blindly retry them as known unsent messages.

## Agreed feature decisions and design defaults

- F4 Agreed: email remains disabled until the freelancer confirms timezone, chooses a digest time and explicitly enables it; no assumed send time. After provider submission, apply time/timezone changes from the next local day, without a second digest that day. Before submission, a newly selected time already passed qualifies for one same-day catch-up. Retain send history across setting changes. Cross-timezone examples and atomic scheduling mechanics must implement this rule rather than reset the daily limit.
- F8 Agreed: if the scheduled evaluation is empty, send no email. Items becoming eligible or entered later appear in Today immediately but wait for the next routine scheduled digest. Do not keep polling to send a routine late digest merely because the earlier evaluation was empty. The separately agreed outage/schedule-change catch-up exceptions remain. Record the scheduled evaluation separately from provider submission; an empty evaluation is not a sent digest and must not erase catch-up eligibility.
- Proposed content default: group items by task follow-up, project deadline and overdue invoice; include concise titles, relevant dates/currency and authenticated links. Exclude free-text notes/contact details from email. No unlike-currency total. Review content in design.
- Deferred under D16: provider/plan/region, retry/delivery thresholds, capacity and formal monitoring policies. Retain the separately agreed five-minute normal-operation submission target. Do not invent queue limits, retry counts or alert timings. A provider-independent test can validate intended behavior, not real delivery capacity.

## Milestones and review points

1. Eligibility and Today slice: share canonical reminder scenarios; show currently eligible items, empty/error/loading states and links/actions for the underlying records. Review archive/completion/paid corrections, midnight eligibility and email-disabled behavior.
2. Preference and scheduled-processing slice: explicit setup, accepted schedule-change semantics, per-local-day claims, concurrency, DST, no-empty-digest and same-day catch-up. Review with an injected clock and two synthetic owners.
3. Delivery-adapter slice: simulated success/failure/ambiguous timeout, opt-out/deletion recheck and reconciliation. Review resulting delivery state before any real test-mail configuration.
4. Live-service verification only when authorized and configured: confirm protected Cron/Edge invocation, email sender/callback configuration and isolated synthetic recipient. All three plans keep independent review points; this plan is not a continuous-implementation request.

## Planned interfaces and acceptance scenarios

The eligibility interface receives owned records and a clock/timezone context, returning reminder kind, source ID and presentation data without sending email or mutating completion/payment state. The digest-processing interface receives a trusted run context and returns skipped, submitted, known-failed or ambiguous outcomes, with durable ownership/day/run identity. Provider acceptance is distinct from inbox delivery. A recording adapter supports deterministic synthetic checks; actual external-email behavior remains a separate gate.

Review scenarios: task follow-up today versus tomorrow; project deadline three days away versus four, completed/archived project with an open task and overdue invoice; paid-to-unpaid correction; no qualification; email off; both DST transitions; duplicate workers; outage catch-up; preference change before/after submission; deletion after a digest is claimed but before send dispatch. Coordinate the deletion gate with dispatch: once an external request is in flight it may still be accepted/delivered; record that outcome without starting a new send after accepted deletion. After an empty scheduled evaluation, a newly eligible item updates Today without a routine late send; separately test outage and schedule-change catch-up so that an empty-evaluation record cannot suppress those exceptions. Use explicit timestamps and scenario data rather than invented operational limits.

## Verification strategy and limits

Planned eligibility seam: deterministic scenario tests cover local date boundaries, every status/suppression rule and DST inputs, but cannot prove deployed timezone data or RLS. Digest-processing seam: integration tests against durable storage plus a recording email adapter exercise concurrent claims, duplicate callbacks, opt-out and deletion races; they cannot prove provider inbox arrival. Real Supabase policies/functions must separately reject cross-user/unauthorized access. Browser checks validate Today/settings usability and keyboard behavior; rendered styling is Phase 2b work.

Use `npm run build` from `lancealot/` for the application; no reminder/test command exists yet. Plan test-tool/runtime setup before adding behavior; use shared conformance fixtures rather than implementation-mirroring tests. Numeric retry/throughput targets stay unresolved until D16 review.

## External setup, progress and completion boundary

Needed later: Supabase Cron/Edge deployment/configuration, server-only credentials, external email adapter and allowed sender, monitored failure/reconciliation process, and agreed service limits. Provider selection/spending is not authorized by this planning request. Synthetic recording adapters can establish the rule contract without selecting an external provider, but do not count as live-email acceptance. The later authorization covers isolated fictional-data previews; no production integration or tool installation is authorized.

F4/F8 are confirmed by the user. Direction is confirmed and interfaces/test seams are ready for final plan review. No application implementation or behavior tests executed; isolated preview static checks are separate. Review-baseline evidence is in the first plan; recapture scoped working-tree baseline before implementation. The accepted plan proceeds to implementation only on a separate go-ahead. Public-beta operating gates remain open even if synthetic feature behavior later passes.

## Reconciled design and acceptance

Apply [selected C guide](../DESIGN.md). The [styled prototype](../design/previews/README.md) shows grouped Today, linked archived-project follow-ups, empty/error/loading states, email-off messaging, explicit timezone/time/opt-in settings and a minimal digest addressed only to the freelancer. Review consistency with record forms and currency labels; no notes/contact details are inserted into digest content. Prototype time is a fixed fictional day, not a scheduler or DST test. Accept actual eligibility, schedule changes, duplicate processing and delivery failures through the real test seams above. Guide, final prototype and plan are accepted for the agreed scope with screenshots explicitly unavailable. Feature implementation, real-service behavior and visual parity still need verification.

Deletion/access/digest coordination rationale: [ADR 0002](../adr/0002-resumable-account-deletion.md).
