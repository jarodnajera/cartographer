# Lancealot — Project Specification

Status: Accepted — project foundation, including explicit D16 operational deferrals.
Accepted by the user: 2026-10-29 (America/Los_Angeles).
Last updated: 2026-10-30 (America/Los_Angeles).

Requirements and material choices below reflect confirmed shared understanding. **Changeable defaults** may be revised without changing agreed outcomes or service commitments. **Feature-plan work** is bounded detail for a selected feature. **Deferred** operational decisions remain release gates; acceptance does not settle them.

Current state: Phase 3 account frontend and backend-readiness slice exists in `lancealot/`; live auth/RLS checks are explicitly deferred, and record tracking/digests/deletion remain unimplemented milestones.

## Project name

**Agreed (D1):** Lancealot.

## Goals and intended users

Confirmed direction: help freelancers track client projects, deadlines, and unpaid invoices.
**Agreed (D2):** a public product for individual freelancers, each with their own private workspace. Success means the freelancer can see current follow-ups without consulting the spreadsheet and receive the agreed daily digest; the observable checks are in [Acceptance criteria](#acceptance-criteria).

### Current process and pain point

**Agreed (D3):** the user currently uses a spreadsheet. It provides no notifications to follow up on tasks. The desired improvement is follow-up notifications for tasks, project deadlines, and overdue invoices. No missed-deadline incident has been claimed.

## Core workflows

**Requirements (D4, D7, D8):** manually enter clients, projects, tasks, and existing invoices; track all three areas: tasks, project deadlines, and invoice payments.

Reminder rules:
- Task follow-up dates are user-set.
- Project-deadline warnings start three days before the deadline.
- Unpaid invoices become overdue the day after their due date.
- Outstanding qualifying items recur daily.
- Completed tasks and paid invoices stop their own reminders.
- Completed/archived projects stop project-deadline reminders, but unresolved tasks and unpaid invoices retain their own reminders.
- Maintain an in-app reminder list and send one daily email digest only to the freelancer at their chosen local time/timezone. Email may be disabled without disabling the in-app list.

**Agreed (D11):** project warnings continue daily past the deadline until completion/archive. Calendar dates use the freelancer's selected timezone. The in-app list reflects current eligibility. Send no digest when nothing qualifies. Target one digest per local calendar day; use the next valid time during a daylight-saving gap and send once during a repeated hour. After an outage, send one catch-up digest that day rather than a backlog. The normal-operation submission target and delivery limitations are defined in [Components and API contracts](#components-and-api-contracts) (D15).

## Scope and non-goals

**Requirements (D2, D4, D6, D8):** public product for individual freelancers with private workspaces; manual tracking of clients, projects, tasks, and existing invoices; reminders described above. Laptop/desktop first. Internet is acceptable and offline use is not required. Mobile access is desirable, not established as an essential launch requirement.

**First-release exclusions:** teams, client logins, spreadsheet import, external data integrations, partial payments, currency conversion, invoice generation, and payment collection. Invoice status is paid/unpaid for the full invoice. Reminder email delivery remains required; excluding external integrations means no external business-data integrations, rather than excluding the email delivery mechanism.

## Central alternatives and tradeoffs

**Agreed (D5): hosted web app selected.** The following compares design alternatives for the agreed needs, without assuming prices/free-tier suitability; the selected backend platform is specified separately in [Tech stack](#tech-stack-and-rationale).

| Alternative | Fit and benefits | Limitations and added burden |
| --- | --- | --- |
| Local installed tool | Desktop-first access; data can stay on the device; no central workspace database required | Installation/updates and device backup/recovery. Daily email needs local scheduling with availability constraints or an added hosted service; reliable delivery while the device is off is unresolved. Cross-device access needs additional synchronization scope. |
| Hosted web app | Browser access, centralized private workspaces, and server-side daily digest scheduling fit the stated workflows; leaves room for mobile access | Hosted application/database, workspace authentication/isolation, scheduler and email delivery, backups/recovery, monitoring/support, and recurring service costs require operation. Internet dependence is acceptable for this brief. |

**Selection and rationale (D5):** hosted web app; browser access and centralized digest scheduling fit the agreed needs without offline support. This platform choice alone did not select a stack or approve spending; the stack and service bundle were subsequently agreed under D14. Local delivery is retained above as the considered alternative, not active scope.

## Consequential commitments

The product/service commitments below apply to the initial release, including synthetic private testing, unless a later readiness gate is named. Detailed costs, operating assignments and policies remain D16 deferrals. Details are in [Stack](#tech-stack-and-rationale), [Delivery contracts](#components-and-api-contracts), [Privacy](#authentication-authorization-and-data-privacy), and [Release gates](#release-gates).

- D2/D5, Agreed: public hosted web product with private per-user workspaces. Requires hosting, access isolation, backups/recovery, and ongoing operation; public availability follows private testing (D13).
- D7/D11/D15, Agreed: scheduled timezone-aware daily digest plus live in-app list; opt-out, DST, catch-up, deduplication/retry/failure handling. Target provider submission within five minutes in normal operation; no inbox-arrival/exactly-once guarantee. Delivery/retry thresholds and capacity policies remain deferred under D16, rather than being invented.
- D14, Agreed: Vue.js and Supabase PostgreSQL. Supabase Auth/RLS plus Cron/Edge Functions and external transactional email are agreed after alternatives/operating-implication review; service plans and operating limits remain deferred.
- D12/D17, Agreed: export and account/data deletion before public use, verified email/password/recovery and per-user ownership; metadata-only sensitive-data boundary. Backup expiry/deletion timelines remain deferred, not implicitly zero.
- D16, Deferred by user: specific providers/plans/region, numeric budget, operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds, and capacity limits must be resolved before real-data public beta. Supabase platform selection remains agreed. No invented numeric policy or spend authorization.
- D18, Agreed: private testing uses synthetic data only. Real-data public beta remains blocked on D16 operational decisions and readiness checks.
- D9, Agreed constraint: budget and timeframe unset. No unlimited-spending, free-tier-suitability, or fixed-date assumption.

## Acceptance criteria

Confirmed behavior to verify after implementation:
- A freelancer can manually record clients, projects, tasks, and existing invoices with currency and paid/unpaid status; reopening preserves records in the hosted workspace.
- A task becomes reminder-eligible on its user-set follow-up date; completing it removes its own reminder.
- A project warning begins three days before its deadline; completing or archiving the project stops that warning without suppressing unresolved task or unpaid-invoice reminders.
- An unpaid invoice due on a given local date becomes overdue the following day; marking it paid stops its reminder. No partial-payment or currency-conversion workflow is included.
- Outstanding eligible items recur daily; the freelancer receives one daily digest at their chosen local time/timezone, with D11 daylight-saving and catch-up rules; the five-minute normal-operation provider-submission target is agreed (D15); operational delivery/retry thresholds remain deferred (D16).
- Disabling email preserves the in-app reminder list. Emails go only to the freelancer.
- Workspaces are private to their individual freelancer; unauthorized cross-workspace access must be rejected.
- Clients have projects; tasks belong to projects; invoices belong to a client and optionally a project. Archive records to retain history; archived-project tasks and unpaid invoices remain visible. A paid invoice can be marked unpaid to correct a mistake.
- Provide downloadable workspace export and account/data deletion before public use (D12).

Additional verifiable scenarios:
- With no eligible items, no digest is submitted. A repeated scheduler invocation must not intentionally create another digest for the same workspace/local date.
- For a skipped local clock time, process at the next valid time; a repeated clock hour produces one intended daily digest. A same-day outage results in one catch-up digest, with no older-day backlog.
- A paid invoice changed back to unpaid re-enters reminders if its due date has passed. Record archival must not silently resolve unpaid invoices or incomplete tasks.
- Invalid or cross-owner client/project relationships are rejected, including through direct API requests. Failed saves remain visible as failures rather than successful completion.
- Export contains the owner's records and relationships, currencies, amounts, statuses, dates and preferences, without another owner's data or credentials. Deletion is verified against the agreed active-data/backup policy once D16 is resolved.
- Core desktop flows are usable by keyboard with visible focus, labels and understandable errors; status is not conveyed by color alone.
- Synthetic-only private testing precedes public registration. Real-data public beta cannot proceed with D16 decisions unresolved.

These are verification requirements, not claims of implemented behavior. Quantitative delivery/retry/capacity policies and recovery/deletion targets remain deferred under D16.

## Design decisions and dependencies

- D1 — Agreed: name is Lancealot; no prerequisites. See [Project name](#project-name).
- D2 — Agreed: public product for individual freelancers; private workspace each, no teams or client logins initially. See [Goals](#goals-and-intended-users) and [Scope](#scope-and-non-goals).
- D3 — Agreed: spreadsheet lacks task follow-up notifications; no prerequisites. See [Current process](#current-process-and-pain-point).
  - D4 — Agreed: track project deadlines, individual tasks, and invoice payments; depends on D2 and D3. Further lifecycle details are D10. See [Workflows](#core-workflows) and [Acceptance](#acceptance-criteria).
  - D5 — Agreed: hosted web app selected over local tool; depends on D2, D4, D6–D9. See [Alternatives](#central-alternatives-and-tradeoffs).
  - D6 — Agreed: laptop/desktop first, mobile desirable, internet acceptable, offline not required; depends on D2. No device-only data requirement supplied. See [Scope](#scope-and-non-goals).
  - D7 — Agreed: daily email only to freelancer plus in-app list, triggers and suppression as in Core workflows; depends on D3. Edge cases tracked in D11.
  - D8 — Agreed: manual existing-invoice tracking with currency and full paid/unpaid status; depends on D2. Exclusions and meanings in Data sources.
  - D9 — Agreed constraint: budget/timeframe unset; no unlimited/free-tier/date assumptions. Hosted operating model is D5; specific operational policies are D16. See [Commitments](#consequential-commitments).
  - D10 — Agreed: client/project/task/invoice relationships, archival retaining history, unresolved reminders, and reversible paid status; depends on D4/D8. See [Data](#data-sources-apis-and-data-models).
  - D11 — Agreed: local-date rules, continuing project warnings, live list, DST, empty-digest suppression, and same-day outage catch-up; depends on D7. See [Workflows](#core-workflows).
  - D12 — Agreed: downloadable workspace export and account/data deletion before public use; depends on D2/D8. Retention/recovery remain under D16; the agreed sensitive-data boundary is D17. See [Privacy](#authentication-authorization-and-data-privacy).
  - D13 — Agreed: private testing followed by public registration once readiness checks pass; depends on D2/D4. See [Release gates](#release-gates).
  - D14 — Agreed: Vue.js with Supabase PostgreSQL, chosen by user; depends on D5/D10. Supabase Auth/RLS/Cron/Edge Functions and external transactional email agreed after alternatives/operating-implication review. See [Stack](#tech-stack-and-rationale).
  - D15 — Agreed: Five-minute normal-operation submission target with retries/deduplication and delivery limitations; depends on D7/D11. Numeric delivery/retry thresholds otherwise deferred under D16. See [Contracts](#components-and-api-contracts).
  - D16 — Deferred by user: specific providers/plans/region, numeric budget, operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds, capacity limits; resolve before real-data public beta. Depends on D5/D12/D13. Private testing is synthetic-only (D18). See [Deployment](#deployment-plan).
  - D17 — Agreed: verified email/password, recovery, per-user ownership, no shared workspaces; metadata-only data boundary; screen structure and accessibility direction accepted. Depends on D4/D5/D10/D12. See [Screens](#pages-and-screens), [Accessibility](#uiux-design-system), and [Privacy](#authentication-authorization-and-data-privacy).
  - D18 — Agreed: synthetic-data-only private testing; depends on D13/D16. See [Release gates](#release-gates).

## Tech stack and rationale

**Agreed (D14):** Vue.js frontend with Supabase PostgreSQL. Supabase is selected as the backend platform, while its plan/region and other providers remain deferred (D16).

**Agreed implementation shape (D14, selected after alternatives review):** a Vue browser application, Supabase Auth for the agreed verified email/password and recovery flows, PostgreSQL Row Level Security (RLS) enforcing per-user ownership, and privileged server-side functions for account deletion and scheduled digest delivery. Supabase Cron plus Edge Functions are the selected scheduled-processing mechanism, rather than a separate application server/queue service. This adds scheduling/serverless processing duties but keeps them within the selected platform; no capacity/free-tier suitability is assumed. A separate backend/scheduler is a credible alternative with additional deployment/credential/operation boundaries, not selected scope.

D14 architectural rationale is recorded in [ADR 0001](docs/adr/0001-supabase-service-boundaries.md).

### Backend service alternatives and operating implications

**Agreed (D14):** the following bundle was selected after reviewing alternatives and operating implications. This is separate approval of Auth, RLS, Cron/Edge execution and external transactional email; database selection alone was not treated as approval. Email provider remains deferred.

| Selected element | Credible alternative | Operating implications and tradeoff |
| --- | --- | --- |
| Supabase Auth for verified email/password and recovery | Independent identity provider, or authentication implemented in a separate backend | Supabase keeps account identity near the selected database; the application still configures verification/recovery redirects, production email, sessions and abuse controls. Another identity provider adds integration/configuration and possible service costs; app-managed authentication adds credential/session/recovery maintenance. |
| PostgreSQL RLS for per-user ownership with authenticated browser data access | Route all data access through a separate backend API with ownership enforcement and disable direct browser access to protected database data | RLS requires correct policies on every exposed table, ownership/relationship tests and controlled privileged access. Server-only access moves enforcement to API endpoints and adds backend deployment/maintenance; it does not remove the requirement to test every access path. RLS alone does not restrict privileged credentials. |
| Supabase Cron invoking Edge Functions for daily digest processing | External scheduler and worker/application backend | Cron/Edge keeps scheduling/execution in the selected platform but requires protected invocation, secret management, durable retry/deduplication records, monitoring, and capacity/runtime-limit review. An external worker may offer different execution controls but adds another deployed process/service and operating boundary. Cron triggers are not themselves an email delivery guarantee. |
| Edge Functions for privileged account operations | Separate backend API for account deletion and other sensitive operations | Both must authenticate/recheck ownership, protect privileged keys, and handle partial failures. Edge reduces additional server deployment; platform execution/runtime constraints still need review. A separate backend adds patching/deployment and potentially cost responsibilities. |
| External transactional-email service for account emails and digests, provider deferred | Self-operated outbound mail service | External email reduces mail-server handling but still requires sender/domain configuration, credentials, delivery/bounce monitoring, provider limits and costs, and awareness that private reminder data passes through that processor. Self-operated mail adds server security, reputation/deliverability, bounce and availability duties. Neither guarantees inbox arrival. |

**Selected bundle (D14):** Supabase Auth + RLS + Cron/Edge Functions + external transactional email, with the email provider and all D16 plans/region/cost/policy targets deferred. This supports synthetic testing first and avoids an additional backend/worker deployment. The simpler interface remains one Vue application, not separate services per domain entity. Selection approves service responsibilities, not account provisioning or spending. Separate backend/worker and mixed approaches were considered alternatives and are not selected scope.

**Changeable defaults:** official create-vue/Vite tooling, JavaScript, Vue Router for the agreed screens, and a small data-access boundary. TypeScript, state-management libraries, exact package versions and module names are not product requirements; choose proportionately in setup/feature plans without adding new service commitments.

Primary references checked 2026-10-29: [Vue quick start](https://vuejs.org/guide/quick-start.html), [Supabase password authentication](https://supabase.com/docs/guides/auth/passwords), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase Cron](https://supabase.com/docs/guides/cron), and [Edge Functions](https://supabase.com/docs/guides/functions). These establish capabilities, not an approved provider plan or capacity promise.

## Data sources, APIs, and data models

**Requirements (D8):** manual entry only for clients, projects, tasks, and existing invoices. Track invoice currency and full-invoice paid/unpaid status. No partial payments, conversion, invoice generation, payment collection, spreadsheet import, or external data integrations initially.

**Agreed vocabulary:** unpaid = full invoice not marked paid; overdue invoice = unpaid invoice whose due date has passed, becoming overdue the day after that date. Partial balances are outside first release.

**Agreed relationships/lifecycle (D10):** a client has projects; each task belongs to a project; each invoice belongs to a client and optionally a project. Archive records to retain history. Unresolved tasks and unpaid invoices remain visible when their project is archived. Paid status can be reversed to correct mistakes. Archiving must not silently mark tasks completed or invoices paid.

Minimum entry fields were subsequently accepted in the [accounts/tracking plan](docs/plans/private-accounts-and-project-tracking.md); detailed schema validation remains bounded implementation work. Original field outline: client name with optional contact details; project title, client, active/completed/archived lifecycle and optional deadline; task title, project, open/completed state and optional follow-up date; invoice reference, client, optional same-client project, positive amount, currency, due date, and paid/unpaid state. An absent deadline/follow-up date produces no corresponding reminder. Per-record archival does not clear unresolved tasks/invoices; account/data deletion is a distinct flow. Confirm required fields and validation in the first relevant feature plan, preserving these agreed behaviors.

Workspace settings hold the chosen digest time, timezone, and email preference. Store amounts exactly with their original currency; do not sum unlike currencies. Use date-only business due/follow-up dates and timezone-aware processing timestamps. Technical record: digest run/delivery status with a unique workspace/local-date identity. SQL schema, indexes, request shapes, and exact export format are bounded feature-plan work; export must retain record relationships, amounts, currencies, statuses, dates, and preferences.

## Project folder structure

Existing foundation: SPEC.md, AGENTS.md, HANDOVER.md, docs/ARCHITECTURE.md, docs/TESTING.md, docs/RUNBOOK.md, docs/GLOSSARY.md, docs/plans/PLANS.md, docs/adr/, and docs/research/. The Vue/TypeScript/Vite application exists in `lancealot/`; see [implemented architecture](docs/ARCHITECTURE.md) for observed modules and prepared backend files.

**Changeable default:** Vue source for screens/forms/data access, Supabase migrations and RLS policies, server-side reminder/account functions, and tests. Select exact paths during setup/first feature planning; these names describe proposed responsibilities, not observed code.

## Pages and screens

**Agreed screen structure (D17):** sign-up/sign-in and account recovery; Today/reminders dashboard; Clients list/detail; Projects list/detail containing tasks; Invoices list/detail; Settings for timezone, digest time, email toggle, export and account deletion.

Desktop layout (changeable default):

```text
Lancealot | Today  Clients  Projects  Invoices  Settings
Today                                      + Add
Task follow-ups       Project deadlines       Overdue invoices
[eligible items with links and clear next actions]
```

List/detail forms include empty, loading, validation-error, failed-save, and success states. Show currency with every amount; display totals separately per currency. Email-disabled state explains that the in-app list remains active. Detailed visual directions belong in the selected UI feature's design phase; no prototype currently exists.

## Components and API contracts

**Agreed implementation shape (D14):** browser reads/writes use authenticated Supabase access, with RLS enforcing ownership on all exposed records. Enforce relationship consistency as well as owner identity: another user's project/client ID must not be accepted in a new record. Do not rely on hidden UI controls or client-supplied owner IDs. Privileged server-side functions revalidate caller/ownership for account deletion and other sensitive operations. No public developer API is required.

One shared eligibility definition feeds the live list and digest; verify both against the same business scenarios even if SQL/client/server implementations differ. A protected scheduled process finds due accounts and uses durable delivery records to prevent duplicate work during retries/concurrent runs. Service-role credentials and email-provider secrets are server-only; RLS does not protect against unscoped privileged server code.

**Agreed delivery behavior (D15):** The agreed target is provider submission within five minutes of chosen local time during normal operation, with persistent retry/deduplication and failure monitoring. Inbox arrival and absolute exactly-once delivery are not guaranteed. Do not report failed submission as delivery; ambiguous provider timeouts need reconciliation/idempotency where supported. Recheck opt-out/deletion before send. D11 governs DST and same-day catch-up without older daily backlog.

**Deferred under D16:** numeric delivery/retry thresholds, capacity limits and formal operating policies. Do not invent retry counts, alert windows or delivery guarantees. The agreed five-minute normal-operation target is retained separately from these deferred policies; confirm its interpretation if later capacity/provider evidence conflicts.

Endpoint/function signatures, schedule-change/concurrency mechanics, export serialization, SQL schema and retry implementation belong in selected feature plans and must preserve the agreed rules.

## UI/UX design system

**Agreed direction (D17):** keyboard-operable core flows, visible focus, labeled inputs, clear errors, status text in addition to color, usable contrast, and responsive reflow. Target WCAG 2.2 AA for core flows; verify with automated checks plus keyboard/manual review, without claiming compliance from tools alone. See [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) (checked 2026-10-29).

The accepted [shared design guide](docs/DESIGN.md) records structure A, appearance C (Blueprint), Manrope typography, the calm supplied blue palette, component/state conventions and responsive defaults. Detailed tokens remain canonical there; missing browser/screenshot verification is explicitly retained, not a successful accessibility/parity check.

## Authentication, authorization, and data privacy

**Requirements (D2/D12/D17):** one private workspace per individual freelancer, with per-user ownership; no shared workspaces, teams or client access. Verified email/password accounts and password recovery. Downloadable workspace export and account/data deletion before public use.

**Agreed implementation (D14):** Supabase Auth plus PostgreSQL RLS and validated privileged server-side functions. Every access path, including exports, related-record writes, reminders and deletion, enforces ownership. Browser code receives only public configuration and its user's session, never service-role/email credentials. Account flows need appropriate token/session handling, HTTPS and signup/login/recovery abuse protection. Exact session/CSRF controls follow the chosen browser auth flow, with browser auth and server-side privileged operations assessed separately.

**Agreed sensitive-data boundary (D17):** client contact details, project/task notes, invoice references/amounts/currencies/dates. Exclude uploaded files, bank details, tax IDs and payment credentials initially. Minimize private data in logs/email and restrict operator access; exact digest content is feature-plan work.

**Changeable flow defaults, subject to secure account-operation planning:** authenticated export; recent reauthentication and explicit confirmation for account deletion; deletion immediately disables reminders and access. Actual active-data deletion/backup expiry follow a reviewed policy, not an invented timeline.

**Deferred (D16):** specific providers/plans/region, operator/support ownership, backup/retention/recovery targets and deletion timing policies must be resolved before real-data public beta. Public-beta gates include verified export/deletion, recovery and ownership controls. Private testing uses synthetic data only (D18); real-data public beta remains subject to D16 and readiness checks. No additional sensitive-data scope has been inferred.

## Environment variables

**Changeable frontend names:** VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for public endpoint/publishable-key configuration. These are browser-visible and must never contain privileged credentials; RLS/auth remain the access boundary.

**Server-only purposes:** privileged Supabase credentials where needed, email-provider credentials/sender identity, scheduler authentication if applicable, public application origin and environment marker. Exact server variable names depend on the reviewed implementation/provider plan. Never expose them through VITE_-prefixed variables or store secret values in documentation. Per-user timezone/time/email preferences are persisted data, not environment variables.

## Deployment plan

**Agreed (D5/D14):** hosted Vue.js app using Supabase PostgreSQL. Frontend host and email service remain unselected; Supabase plan/region remain unset. **Agreed (D14):** Supabase Auth/RLS and Cron/Edge Functions for owned records, scheduled email, and privileged account operations, avoiding an additional general-purpose backend unless evidence requires it.

**User-approved deferrals (D16):** specific providers/plans/region, numeric budget, operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds and capacity limits. Resolve before real-data public beta. Do not assume free-tier suitability, unlimited spend, a delivery date or invented numeric policies. Selecting a stack does not authorize provisioning or purchases.

Ongoing duties still exist: releases, secrets, cost monitoring, account/delivery failures, backup/restore checks, deletion and support/incident handling. No individual/operator assignment or service-level target is agreed. Private testing uses synthetic data only (D18). Do not introduce real client data before the agreed readiness review.

### Release gates

**Agreed (D13):** private testing, followed by public registration once readiness checks pass. Export and account/data deletion are required before public use (D12). Public product remains the goal.

**Agreed (D18):** synthetic-data-only private testing. Real client data is excluded from private testing under this foundation; introducing it would require explicit scope/readiness review. Operational deferrals remain unresolved until the real-data public-beta gate.

**Required gate before real-data public beta (D16):** resolve all approved operational deferrals, demonstrate workspace isolation and verified account/recovery, backups/restore and agreed recovery targets, retention/deletion/export behavior, sender/digest/delivery monitoring, abuse controls, approved costs/region/capacity, and operator/support readiness. Define concrete measurable thresholds through that review, not in this draft without agreement. No real-data/public gate is waived by spec acceptance.

## Development phases

P0 = essential first release; P1 = next improvement; P2 = optional convenience; P3 = later ideas.

**Milestones (sequencing is a changeable default):** P0a: authenticated private workspaces and manual records pass ownership/persistence/lifecycle checks. P0b: live reminders and timezone-aware digest pass date/DST/opt-out/suppression/retry checks. P0c: export/deletion and real-data operational safeguards pass reviewed readiness checks. P0d: private-test feedback addressed and public gates pass before opening registration. P1: mobile usability refinements. P2: convenience filters based on observed usage. P3: imports/integrations or expanded billing only through new scope review; no promise to build them.

### Feature plans

The user selected three areas for Phase 2a. The three written plans were accepted on 2026-10-30 together with DESIGN.md and the selected prototype’s structure/appearance, explicitly retaining missing browser/screenshot verification:

1. [Private accounts and project tracking](docs/plans/private-accounts-and-project-tracking.md), including existing-invoice records required by later workflows. This plan owns the shared data/ownership contract.
2. [Today and daily digest](docs/plans/today-and-daily-digest.md), dependent on owned records/preferences.
3. [Export and account deletion](docs/plans/export-and-account-deletion.md), dependent on record ownership and coordination with digest processing.

Use [PLANS.md](docs/plans/PLANS.md) for plan conventions. Propose implementation one slice at a time with independent review; the first slice is verified accounts/workspace isolation. Phase 2a/2b acceptance is complete for this scope with the explicit rendering evidence gap; it does not establish implementation, feature completion or public-beta readiness. Plan/design acceptance alone did not authorize application changes; a later explicit Phase 3 request now authorizes work within the first plan’s review boundaries, with live backend checks deferred by user steering.

## Constraints, risks, and known limitations

Budget and launch timeframe are unset; do not assume unlimited spending, suitability of free service tiers, or a fixed delivery date. Laptop/desktop is the priority; mobile is desirable and offline is not required. Hosting/scheduling/email operating responsibilities, data recovery, and public-release readiness still need review. Current state includes the first account frontend/readiness slice; fake/compiled behavior does not establish deployed auth, persistence or RLS.

## Open questions and assumptions

**D16 — Deferred, with agreed impact:** resolve remaining frontend/email providers, Supabase and other service plans/region, numeric budget, operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds and capacity limits before real-data public beta. A readiness/deployment plan must propose and obtain agreement on these decisions, then record evidence that the gates in [Deployment plan](#deployment-plan) pass. No specific policy value, free-tier suitability or spend is assumed. Supabase itself is already selected; the provider deferral does not reopen D14.

**D15 — Agreed target versus deferred policies:** normal-operation provider submission targets five minutes after the chosen local time at most. This is distinct from inbox arrival, formal service guarantees, and D16 retry/delivery policies. Validate the target against the chosen plans and workload during readiness review; any required change must be surfaced for agreement.

**D18 — Agreed boundary:** private testing uses synthetic data only. Real-data private testing is not included; changing that boundary requires a prior readiness/scope review.

**Bounded feature-plan work:** required-field validation, archive/edit interactions, export serialization, schedule-preference changes across timezones, concurrent retry/idempotency mechanics, endpoint/schema design, exact package versions, and detailed visual styling. These must preserve agreed ownership, reminders, lifecycle and privacy rules. Changeable field, folder and visual defaults elsewhere do not make unresolved policy values implementation freedom.

No other unresolved material product/platform decision blocks this accepted foundation scope. No budget or launch date has been set. Shared understanding and this written specification have been explicitly accepted. D16 deferrals remain unresolved release gates, not approved operating policies.
