# Today and daily digest

## Status and shared constraints

Status: In progress — implementation authorized on 2026-10-28; accepted plan/Layout A and D18 deferrals preserved.
Implementation: Phase 3 authorized; milestone verification tracked below.
Planning requested on 2026-10-28. User explicitly confirmed the written scope/approach direction on 2026-10-28. Layout A was selected and the reconciled written plan/design explicitly accepted on 2026-10-28. No executable prototype or implementation is authorized by this planning request.

The accepted [SPEC](../../SPEC.md) and [glossary](../GLOSSARY.md) are the baseline; the [planning guide](PLANS.md) governs this document. Preserve the existing `lancealot/` application directory. Budget/date remain unset (D8); vendors/costs/limits/region/retention/recovery/operator decisions remain explicit pre-real-data/public-launch blockers (D18). These plans do not provision services or change those gates.

## Problem, outcome and scope

Show what needs attention today and send reminders outside the spreadsheet. Implement the Today attention list, timezone/local digest time and independent email opt-out, shared eligibility rules, persistent daily delivery tracking, bounded retries and Cron/Edge Functions with external email. References: SPEC D5, D9, D10, D14 and D16.

Build on owned records/settings from [accounts/tracking](private-accounts-project-tracking.md). Design interfaces and fixtures now; that plan's ownership/schema contract must settle before finalizing this plan. Coordinate account deletion with [export/deletion](export-account-deletion.md). No client emails, push/SMS, historical digest bursts, currency conversion or exactly-once external-delivery promise.

## Baseline and agreed rules

Only the Vue starter exists; no attention module, scheduled functions, database, email integration or tests exist. The accepted rule table is:

| Record | Eligibility in workspace-local calendar date | Stops its reminders |
| --- | --- | --- |
| Task | Unresolved with follow-up date on/before today; unset date excludes it | Complete or reschedule beyond today |
| Project | Deadline set, today on/after deadline minus three calendar days | Complete or archive project |
| Invoice | Unpaid and today after due date | Mark invoice paid |

Project completion/archive does not suppress unresolved task or unpaid invoice reminders. Outstanding items recur daily. Email disabled leaves Today active. Empty digests are skipped. Skipped DST time uses next valid local time; repeated time produces one logical digest. Settings changes apply prospectively without historical replay.

## Approach and interfaces

An attention module accepts owned record state and an explicit calendar date/timezone context, returning grouped eligible items. UI and digest callers use the same rules, rather than independently implementing date/status logic. Keep time inputs controllable in tests. Selected placement is a database eligibility module, compared below with shared TypeScript rules; neither approach introduces another backend service.

A digest module coordinates due-work selection, atomic claims/persistent delivery state, preference/ownership rechecks and external sending. A clock seam and an email-sender seam have real alternatives: deterministic test adapters versus production clock/provider. Keep provider credentials in privileged execution. Authenticate scheduled invocations; privileged queries must not let one user's items or address enter another's digest.

Recheck current eligibility before dispatch, so paid invoices/completed tasks do not remain in newly prepared retries. Account deletion must stop new sends; in-flight provider acceptance cannot be undone, so define/test the dispatch/deletion coordination. Never mark an unknown provider outcome as known delivery success. Vendor-dependent idempotency and limits remain prelaunch requirements; the no-blind-resend outcome policy is agreed under TD2; the provider adapter must honor it.

## Schedule and delivery policy

- TD3, Agreed: suggest the browser timezone and ask the freelancer to confirm/correct it on first use. Start email off; enable only after they choose/confirm digest local time and timezone. Today still uses the confirmed timezone. Do not invent a universally suitable send time.
- Poll current due work using the agreed Cron/Edge execution. Claim a logical digest atomically, with a bounded lease; persist its scheduled instant/local-date identity and settings revision, rather than using process memory. Only one claimant may authorize dispatch. Lease expiry after a possibly accepted send must not trigger a blind resend.
- Known transient failures: propose three attempts total (initial, then after five and thirty minutes), subject to provider Retry-After/rate limits, current email preference, current eligibility and the same-local-date cutoff. Permanent failures end the attempt series. These are proposed retry defaults, not an end-to-end delivery-time SLA.
- Unknown provider acceptance: prefer reconciliation/idempotent retry if the eventual vendor proves that guarantee; otherwise leave the logical digest Unknown without a blind resend. Normal next-day eligible reminders continue. This is the agreed TD2 tradeoff.
- Timezone/time changes revise only the next unsent schedule; never create an extra digest for the same already-processed local date. The proposed scenario table below defines date-line and claim-edit behavior; concurrency checks must demonstrate it before implementation is declared complete. A key alone is not proof of correctness.
- Provide a Settings status for last provider acceptance/known failure/unknown outcome; label provider acceptance as such, not confirmed inbox receipt. Today remains independent. Operational log retention stays a D18 gate; no full email-body logging is proposed.

## Eligibility interface placement

Keep eligibility in a database read module used by the signed-in Today query and the privileged digest path, with explicit account/date context and owner enforcement; callers do not reproduce the rules in Vue/Edge code. Alternative: a shared TypeScript rules module, which would require transporting owned records to both runtimes. Recommend the database approach to avoid dual rules and client-supplied ownership; tests exercise the SQL interface directly and compare grouped UI fixtures. Review and test exact RPC grants/caller validation during implementation before exposing the interface. [integration findings](../research/phase2-account-data-delivery.md) records the RLS/active-account constraints.

## Milestones and planned verification

1. **Attention rules:** deterministic eligibility and grouped Today list. Test exact date boundaries, leap/month/year boundaries, absent dates and independent child reminders under completed/archived parents.
2. **Settings and schedule:** explicit timezone/local time and email toggle. Test DST gap/repeated hour, schedule/timezone changes, delayed scheduler runs, no empty email and Today updates independently of email availability.
3. **Delivery processing:** persistent claims, logical daily deduplication, bounded retries and secured Cron/Edge Function integration. Test overlapping invocations, crash windows, transient/permanent/ambiguous provider responses, same-day cutoff and no historical bursts using controlled fixtures.
4. **Integrated UI/delivery:** verify ownership/address, preference edits, status edits and deletion races; inspect responsive/keyboard UI, actionable failure states and delivery monitoring. Public delivery remains blocked by D18 and real email/provider configuration.

## Acceptance and verification strategy

Apply the rule table and SPEC D14 verbatim. Use deterministic date/clock tests and database concurrency/ownership integration checks, plus browser flows for Today/settings. The accepted verification approach uses Vitest, pgTAP and Playwright; existing `npm run build` from `lancealot/` checks types/bundling only. Do not treat fake email acceptance as proof of production deliverability.

Review privileged queries, scheduler authentication, secret placement, claims/retry state transitions and provider logging. Avoid recording digest bodies or unnecessary private data in operational logs. Before enabling scheduled delivery, demonstrate opt-out and scheduler disable controls; rollout with synthetic recipients before real-data/public gates are resolved. Recovery resumes current eligible work without replaying old digests.

## Feature decisions and implementation checks

- TD1 — Agreed: digest includes item names, client/project labels, invoice references, relevant dates and links; keep monetary amounts in the app. These details will exist in the owning freelancer's email mailbox; no client email recipients.
- TD2 — Agreed user tradeoff: when provider acceptance is unknown, reconcile or retry safely only with verified provider guarantees; otherwise do not blindly resend. Record Unknown and resume normal eligible reminders the next day. Claim/lease, known-failure retry defaults and timezone-change scenarios are part of the accepted approach and require implementation verification. No provider/SLA selected.
- TD3 — Agreed onboarding: suggest browser timezone and require confirmation/correction; email initially off, enabling requires a chosen local time and confirmed timezone; Today remains independent. Last-send status presentation follows the accepted UI design.
- Feature findings may require a scoped spec proposal; no change to accepted behavior is authorized by a draft recommendation.

## Schedule and concurrency scenarios

Track a logical digest by account and calendar date, independent of timezone-name spelling/settings revision. Store the resolved UTC schedule and the revision used for claims. Settings updates and dispatch authorization serialize through the same account-control record; obsolete claim revisions cannot authorize a new send. Use a unique logical-day record and compare-and-set/fenced claim token so an old worker cannot finish a newer worker's claim.

| Scenario | Expected behavior |
| --- | --- |
| Worker resumes after chosen time, same local date | Process today's due digest only, with current eligible items/preferences |
| Outage spans previous local dates | Do not create/send historical digests; process only currently due date |
| Send time changed before dispatch to a future time today | Invalidate obsolete claim; use revised time |
| Send time changed to a time already passed today | Schedule the next future chosen local time; no settings-triggered catch-up email |
| Digest already processed for the resulting local date | No extra logical digest when time/timezone is edited or email toggled |
| Timezone moves backward into a processed date | Skip that date; resume at next future scheduled occurrence on an unprocessed date |
| Timezone moves forward across a date | Skip past dates; choose next future scheduled occurrence in the new zone |
| DST repeats the chosen wall time | One logical-date claim, including when worker runs in both occurrences |
| DST skips chosen time | Next valid instant after the gap on that date |
| Empty digest or all eligible records resolved before authorization | Finish as skipped; no empty email or retry series |
| Opt-out/deletion wins account serialization before authorization | Cancel new dispatch; current Today remains available for opt-out only |
| Provider request already authorized/in flight before opt-out/deletion | May still arrive; do not promise recall |
| Crash after dispatch authorization with no confirmed provider result | Unknown, not an automatic lease-expiry resend; apply agreed safe reconciliation policy |

Accepted retry defaults: at most three attempts for one logical date, targeted at initial dispatch then initial+5 and initial+30 minutes. Honor a later Retry-After only within that local date; don't squeeze attempts past cutoff. Recompute eligible items and check latest settings/account state before each authorized request. Provider acceptance is not inbox receipt. Retry mechanics and lightweight last-status UI are accepted defaults; they do not establish numerical availability or delivery commitments.

Planned verification: database eligibility/claims/lease fencing tested through pgTAP and integration clients, controlled-clock/provider adapter cases for retry/crash windows, and Playwright for Today/settings and cross-user browser flows. Add tools only during authorized implementation; the existing app has no test scripts. See integration findings for official tool sources. D18 vendor idempotency/limits, log retention, monitoring ownership and actual deliverability remain required launch evidence.

## Direction review and handoff

Phase 2a scope/approach direction is confirmed and Layout A is selected. The design section below reconciles the same plan with the shared style guide. Final written-plan/design acceptance is recorded; D18 deferrals remain release gates. Implementation is authorized; current progress is recorded below.

## Progress, risks and outcomes

| Milestone | Implemented source and evidence | Still required |
| --- | --- | --- |
| Attention rules | One private PostgreSQL eligibility module for live Today and worker; independent child reminders/date boundaries tested | Actual project integration and final review |
| Settings/schedule | Confirmed timezone/local time, email-off onboarding, prospective setting changes, DST gap/repeated-hour and obsolete-claim checks | Real browser UX and deployed scheduler cadence/limits |
| Delivery processing | Service-only claims, fenced authorization, bounded same-day retries, unknown outcome handling, escaped HTML/plain text and optional provider adapter | Approved vendor/sender/credentials, Auth SMTP, real provider rate/timeout/delivery tests and Cron registration |
| Integrated UI/monitoring | Readiness-gated Settings/last-send states and digest preview; actor isolation and account-lock tests | Concurrent hosted workers/crash windows, retention/monitoring/support ownership, real inbox evidence |

Source now lives in lancealot/; [ARCHITECTURE](../ARCHITECTURE.md), [TESTING](../TESTING.md) and [RUNBOOK](../RUNBOOK.md) describe current modules, checks and activation/recovery procedures. Milestones are not declared publicly complete while integration/review gates remain.

## Phase 2b design context

Direction and final written-plan/design acceptance are recorded for the linked three-plan scope. [Shared DESIGN.md](../DESIGN.md) records selected Layout A (work ledger); B remains only a considered alternative. The reconciled Layout A design and this written plan were explicitly accepted together on 2026-10-28. The later HTML prototype was approved before Phase 3; see its recorded verdict. Use the accepted glossary and preserve all reminder, ownership, currency, export and deletion behavior. Layout A is accepted; low-impact token/interaction values below remain changeable defaults within agreed requirements.

### Today and settings flows

Sign-in → Today with the confirmed local date/timezone. Show Task follow-ups, Project deadlines and Overdue invoices in the selected shared shell. Each row links to the project and record, preserving a Return to Today path. Show text dates/status and category context; overdue invoice amounts remain visible only in the authenticated app with currency codes.

First use and “no attention items today” are different states: first use links to Add client/project; all clear still allows browsing existing projects. A fetch failure never displays all clear. Refresh after a successful correction/deletion; preserve a clear error/stale-data indication if refresh fails. Inline Complete task/Mark paid actions may be offered as reversible explicit actions, with record-local saving/error feedback; use the same tracking interface rather than a second state-change implementation.

Settings → Reminders: timezone suggestion/confirmation, chosen local digest time and Email daily digest toggle. Email starts off. Enabling requires valid time/timezone; Save changes commits settings with current revision checks. Explain “Email off; Today still shows outstanding items.” Send-status copy distinguishes accepted by email provider, failed and unknown; it does not expose internal claim/lease/job identifiers or promise inbox receipt. Email off does not disable verification/recovery messages.

### Daily email layout

```text
Lancealot
Your follow-ups for 28 October
Dates use America/Los_Angeles

Task follow-ups
Send revised estimate
Cedar Studio / Launch kit — Follow-up: 28 October
[Open task]

Project deadlines
Launch kit — Deadline: 30 October
[Open project]

Overdue invoices
INV-014 — Atlas / Site refresh — Due: 26 October
[Open invoice]

[Open Today]    [Reminder settings]
```

Synthetic example content only; omit empty groups. Email contains no invoice amounts, credentials or tokenized private data beyond the separately secured account-access flows. Record links require sign-in/ownership and do not make the emailed data public. Include a plain-text equivalent; no image-heavy template, tracking-pixel subsystem or external font requirement. Existing detailed-email choice already accepts mailbox exposure of client/item labels; keep amounts in app as agreed.

### Design reconciliation and acceptance checks

Eligibility results include owning project/client context, relevant dates and record-link identity for both UI and email. The digest module formats these results without calculating a second eligibility rule. Settings UI consumes the proposed last-status result without treating provider acceptance as delivery proof. Milestones 1, 2 and 4 include empty/error/stale states, mobile rows, email rendering and opt-out clarity. Verify email text contains agreed fields and excludes amounts; keyboard use, timezone labels and state corrections remain consistent with plans/SPEC. Layout A supplies Today/settings shell and stacked narrow-screen records; email uses a single-column equivalent without application navigation. Final styling follows accepted DESIGN.md with changeable low-impact token defaults.

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
