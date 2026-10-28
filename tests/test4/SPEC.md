# Project Specification

Status: Accepted — agreed first-release scope with explicit D18 launch deferrals.
Written-spec acceptance: 2026-10-28.
Shared understanding confirmed: 2026-10-28.

Requirements are agreed product behavior. Changeable defaults may be revised while preserving requirements. Feature-plan work must be resolved before implementing the affected feature. A Vue starter exists under lancealot/; product behavior is not yet implemented.

## Project name

**Requirement (D4, Agreed):** Lancealot.

## Goals and intended users

**Requirements:** help individual freelancers track client projects, deadlines, and unpaid invoices. The intended first release is a public product; each freelancer has their own private workspace (D1, Agreed). **Success criterion (D9, Agreed):** “I can see what needs attention today and receive a reminder for a scheduled follow-up without opening the spreadsheet.”

### Current process and pain point

**Confirmed (D2, Agreed):** the user currently uses a spreadsheet, which has no notifications to follow up on tasks. The desired improvement is an attention-today view and scheduled follow-up reminders outside the spreadsheet (D9).

## Core workflows

**Confirmed intent:** track client projects, deadlines, and unpaid invoices.
**Requirements (D5/D6):** follow up on tasks, see approaching project deadlines and overdue invoices, receive email addressed only to the freelancer, and see an in-app attention list. Track each invoice as fully paid or unpaid with its currency.
**Requirements (D10, Agreed):** one daily digest at a user-chosen local time and timezone. Task follow-up dates are user-set; project warnings start three calendar days before the deadline; invoices become overdue the day after their due date. Outstanding items recur daily. Completed tasks and paid invoices stop their own reminders. Completed/archived projects stop project-deadline reminders only: unresolved tasks and unpaid invoices continue. Email can be disabled independently of the in-app list.
**Requirements (D11, Agreed):** each project belongs to a client; every task and invoice belongs to a project.
**Requirements (D10/D11, Agreed):** interpret calendar dates in the chosen workspace timezone; optional project deadline/task follow-up date means no corresponding reminder until set. Invoice due date, amount, currency and paid/unpaid status are required. Date-setting changes update the current attention list. Timezone/time changes apply to the next eligible digest without replaying historical digests; detailed duplicate protection across timezone changes is feature-plan work before reminder implementation.

## Scope and non-goals

**Requirements (D1):** public product for individual freelancers with private workspaces. No teams or client logins initially.
**Requirements (D6/D7):** invoices have paid/unpaid status and their own currency. No partial payments, currency conversion, invoice generation, or payment collection. Responsive hosted web app, laptop/desktop first, with layouts usable on mobile; exact browser/device verification is feature-plan work. Internet is acceptable; offline operation is not required.
**Agreed (D12/D13):** verified email/password accounts with password recovery and per-user ownership; no shared workspaces. Manual entry, data export and account deletion in the first release; no spreadsheet import.
**Agreed design (D17):** JSON export; protect clients/projects with linked records from deletion; project archiving; confirmed account deletion stops reminders and removes active owned data; screen/accessibility baseline. Backup retention and concrete launch operations are explicitly deferred (D18). Exact field validation and retry mechanics are feature-plan work.

## Central alternatives and tradeoffs

**D3, Agreed:** responsive hosted web app. Vue.js and Supabase PostgreSQL are selected separately (D15); additional services were explicitly agreed under D16 after alternatives and operating implications were reviewed.

| Option | Fit and benefits | Limitations, costs and operator work |
| --- | --- | --- |
| Local installed app | Data can remain on the device; local use need not require hosting. | Installation and updates per device; cross-device access requires additional synchronization if offered. Email while the app is closed needs a background process with the computer running, or a hosted sender/scheduler. Local recovery needs a backup strategy. |
| Hosted web app — selected | Responsive browser access on desktop and mobile; server scheduling can send email while the browser is closed; aligns with internet-acceptable use and private workspaces. | Hosted storage, account/access isolation, recovery, email delivery and scheduling require implementation and ongoing operations. Service costs are unestimated; no free-tier suitability is assumed. |

The web selection follows D1/D5/D7 and the explicit user choice. It does not constitute agreement on providers, spend, or deployment. Local packaging and web hosting each need a support and recovery design appropriate to public use.

### Service alternatives (D16)

**D16, Agreed:** Supabase Auth, RLS and Cron/Edge Functions with external transactional email were selected after the following alternatives and operating implications were presented and shared understanding confirmed. This was a separate decision from the PostgreSQL selection; no email vendor or paid tier was chosen.

| Area | Selected composition | Credible alternative and tradeoff | Operating implications |
| --- | --- | --- | --- |
| Account access | Supabase Auth for verified email/password and recovery | Another managed identity provider or application-server auth; adds integration and possibly another service, but permits different identity controls | Configure email verification, redirects, SMTP and abuse/rate controls; maintain recovery and session flows. |
| Private records | Supabase RLS plus same-owner relationship constraints | Server-only database access through an application API; centralizes checks in server code but requires a maintained backend | Design/test policies on reads and writes and related records. Privileged paths still need explicit ownership checks; browser hiding is insufficient. |
| Scheduling | Supabase Cron invoking an authenticated Edge Function; persistent delivery records in PostgreSQL | Separately hosted scheduler/worker; more deployment and monitoring, but more control over runtime and workload | Secure scheduler credentials; handle overlapping runs, timezones, bounded retries, provider uncertainty and failed jobs. No separate queue service is proposed. |
| Email | External transactional service for Auth SMTP and digest delivery | Self-hosted SMTP; more control, but sender reputation, delivery troubleshooting and mail-server maintenance become operator work | Configure sender/domain authentication, delivery credentials, rate limits, failure handling and cost monitoring. No vendor/tier selected. |

**Rationale for selection:** use the selected composition to avoid a separate application server, identity provider and worker host initially. This is an inference from the agreed scope, not a claim that managed services remove operational duties. Runtime/usage limits and costs must be validated before real-data/public use; separate worker infrastructure would require renewed review if needed.

## Consequential commitments

- D1/D3/D12, Agreed, first release: public responsive web product with private, per-user workspaces and verified email/password/recovery. Requires isolation testing and ongoing access/security maintenance. See [Privacy](#authentication-authorization-and-data-privacy).
- D15, Agreed, first release: Vue.js and Supabase PostgreSQL. Database policies/migrations and provider integration require maintenance; migration away would require work. See [Stack](#tech-stack-and-rationale).
- D16, Agreed, first release: Supabase Auth/RLS/Cron/Edge Functions and external transactional email. Requires configuration, secrets management, scheduling/email monitoring and handling provider limits. Costs are unestimated; no separate queue or worker-host commitment. See [Service alternatives](#service-alternatives-d16).
- D14, Agreed, first release: persistent daily delivery tracking, bounded retries, no empty digests/backlog bursts and defined DST behavior. Delivery monitoring and retry handling are ongoing duties; exactly-once external email is not promised. See [Contracts](#components-and-api-contracts).
- D13/D17, Agreed, first release: JSON export and confirmed account deletion; prevent parent deletion with linked records. Erasure must stop active reminders; backups need a retention/restore-erasure policy. See [Data](#data-sources-apis-and-data-models).
- D18, Deferred with user approval: frontend/email vendors, service costs/limits, hosting region, backup retention, recovery targets and named maintenance/support owner. Resolve before real-data/public launch; these are release blockers, not excluded first-release work. See [Release gates](#release-gates).
- D8, Open by explicit user constraint: budget and delivery date unset. No unlimited spending, free-tier suitability or fixed date assumed; no paid provisioning approved.

## Acceptance criteria

**Agreed outcome (D9):** the freelancer can see what needs attention today and receive a scheduled follow-up reminder without opening the spreadsheet.
**Agreed boundaries:** email only the owning freelancer; workspace data remains private; full invoices are paid/unpaid with their currency; no partial payments or conversion.
**Requirements (D10/D11):**

- Before a task's user-set follow-up date it is absent from follow-up reminders; on that date and subsequent days it appears until completed or rescheduled.
- Project deadline warnings start three calendar days before the deadline; unresolved warnings recur daily. Completed/archived projects leave this reminder group.
- An unpaid invoice is not overdue on its due date; it becomes overdue the following calendar day and recurs daily until paid.
- Completing/archiving a project does not suppress its unresolved task follow-ups or unpaid invoice reminders.
- Disabling email leaves the in-app attention list available; enabled email uses the user's chosen local time/timezone and only their address.
- A project must belong to a client, and every task/invoice must belong to a project.

**Requirements (D14/D17):**

- Empty attention sets do not produce digest email. A scheduler rerun checks persistent delivery state; transient failures receive bounded retries, without replaying historical-day digests after an outage.
- A skipped local send time uses the next valid time that day; a repeated time triggers one logical digest. Exact retry limits, timezone-change concurrency and uncertain provider-response handling must be specified/tested in the reminder plan; no exactly-once external delivery guarantee.
- JSON export includes owned records, relationships, currencies and settings; parent deletion with linked records is rejected. Confirmed account deletion removes active owned data and stops future reminders.
- User A cannot read, change, export or link User B's records; unauthenticated access is denied. Verify this through direct API/database access and privileged functions, not UI behavior alone.
- Verified email signup, sign-in and password recovery work; errors do not expose another user's records. Responsive screens and keyboard-operable forms provide validation/save feedback.

**Release verification still required:** restore and deletion/backup interaction, delivery monitoring, provider limits and all launch commitments under D18. These are criteria, not test results.

## Design decisions and dependencies

- D1 — Agreed: public product for individual freelancers, each with a private workspace; no teams or client logins initially. See [Scope](#scope-and-non-goals).
  - D5 — Agreed: task follow-ups, approaching project deadlines and overdue invoices; email only the freelancer plus an in-app list; depends on D1/D2. See [Workflows](#core-workflows).
  - D6 — Agreed: track full invoice paid/unpaid and currency; exclude partial payments, conversion, invoice generation and payment collection; depends on D1. See [Scope](#scope-and-non-goals).
  - D7 — Agreed: responsive hosted web app, laptop/desktop first, internet acceptable, offline not required; depends on D1. See [Alternatives](#central-alternatives-and-tradeoffs).
  - D8 — Open: budget/timeline unset; do not assume unlimited spend, free-tier suitability or a fixed delivery date; depends on D1. See [Commitments](#consequential-commitments).
  - D9 — Agreed: attention-today view and scheduled reminder without opening the spreadsheet; depends on D1/D2. See [Goals](#goals-and-intended-users).
  - D3 — Agreed: responsive hosted web app selected over local installed app; depends on D1/D2, D5, D6, D7; cost feasibility remains subject to D8. See [Alternatives](#central-alternatives-and-tradeoffs).
- D10 — Agreed: user-chosen local time/timezone daily digest; user-set task follow-ups, project warnings from three days before deadline, invoices overdue the next day, daily recurrence and independent email opt-out; depends on D5/D7. See [Workflows](#core-workflows).
- D11 — Agreed: client → project → task/invoice relationships; project deadline/task follow-up optional; invoice amount/currency/due date/status required; detailed validation is feature-plan work; depends on D6. See [Data](#data-sources-apis-and-data-models).
- D12 — Agreed: verified email/password accounts with password recovery and per-user ownership; no shared workspaces; depends on D1/D3. See [Privacy](#authentication-authorization-and-data-privacy).
- D13 — Agreed: manual entry, export and account deletion, no spreadsheet import; parent-deletion protection and active account erasure agreed in D17; retention deferred in D18; depends on D11. See [Data](#data-sources-apis-and-data-models).
- D14 — Agreed: persistent daily delivery tracking, bounded retries and date edge cases; depends on D3/D10. See [Contracts](#components-and-api-contracts).
- D15 — Agreed: Vue.js and Supabase PostgreSQL selected; service composition is separately tracked in D16; depends on D3. Deployment cost feasibility remains subject to D8/D18. See [Deployment](#deployment-plan).
- D16 — Agreed: Supabase Auth/RLS/Cron/Edge Functions with external email, after alternatives/operating review and shared-understanding confirmation; depends on D12/D14/D15. See [Service alternatives](#service-alternatives-d16).
- D17 — Agreed: JSON export, parent-deletion protection, confirmed account erasure, screens and accessibility baseline; depends on D11/D13. See [Data](#data-sources-apis-and-data-models) and [Screens](#pages-and-screens).
- D18 — Deferred: vendor/cost/limit/region/retention/recovery decisions and maintenance/support ownership; prerequisites D8/D16; must resolve before real-data/public launch. See [Release gates](#release-gates).
- D2 — Agreed: current spreadsheet lacks task follow-up notifications. See [Current process](#current-process-and-pain-point).
- D4 — Agreed: project name Lancealot. See [Project name](#project-name).

## Tech stack and rationale

**Requirements (D15, Agreed):** Vue.js frontend and Supabase PostgreSQL.
**Requirements (D16, Agreed):** Supabase Auth, RLS, Cron/Edge Functions and external transactional email.
**Changeable frontend setup default:** Vue 3/Vite.
**Selected service composition:** Supabase Auth for verified email/password and recovery; PostgreSQL owner-scoped RLS policies for all exposed domain data; Supabase Cron invoking an authenticated Edge Function for digest processing; a transactional email service supporting production Auth SMTP and digest sending. Frontend hosting and email vendor are deferred under D18. A separate application server was considered; it is outside the selected initial composition.
**Burden:** database policies/migrations, privileged-function ownership checks, email configuration, scheduling/delivery monitoring, backup/restore, dependencies, support and costs need ongoing ownership. No paid plan or free-tier suitability assumed.
**Changeable defaults:** TypeScript, Vue Router and feature-oriented frontend folders; exact package versions and test tooling are setup/feature-plan work, not established application facts.

Official documentation checked 2026-10-28: [Vue setup](https://vuejs.org/guide/quick-start.html), [Supabase password Auth](https://supabase.com/docs/guides/auth/passwords), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [scheduled Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions), [production SMTP](https://supabase.com/docs/guides/auth/auth-smtp). These document capabilities; the composition above is the agreed project design, not implemented behavior. Default Supabase SMTP is not suitable for public production email; production delivery needs explicit configuration. No pricing investigation completed.

## Data sources, APIs, and data models

**Requirement (D6):** each invoice records full paid/unpaid status and currency; no conversion or partial-payment model.
**Requirements (D11):** each project belongs to one client; every task/invoice belongs to one project in the same private workspace.
**Agreed domain model (D11):** Client (name); Project (name, client, deadline, active/completed/archived status); Task (title, project, follow-up date, completion); Invoice (reference, project, amount, currency, due date, paid/unpaid); Workspace settings (timezone, daily digest local time, email enabled). Project deadline and task follow-up date are optional; absent dates produce no corresponding reminder. Invoice amount, currency, due date and paid/unpaid status are required. Names, references and exact validation constraints are feature-plan work. Amounts retain their currency and are never combined into a cross-currency total.
**Agreed (D13):** manual entry, data export and account deletion; no spreadsheet import in the first release.
**Agreed (D17):** structured JSON export including all owned domain records, relationships, currencies and settings; prevent client/project deletion while linked records exist, with project archiving available instead. Account deletion requires explicit confirmation, revokes access/stops reminders and removes active owned data; backup erasure timing must be defined before public use. Exact export schema and individual task/invoice delete confirmation are feature-plan work; linked parent deletion is prohibited. Backup retention and restore-erasure handling are D18 launch blockers.

## Project folder structure

**Observed after application scaffolding:** project documentation and installed companion skills remain at this root; the Vue/TypeScript/Vite starter is in lancealot/, with src/, public/, package.json and package-lock.json. AGENTS.md is seeded from that starter; no product workflows or Supabase integration are implemented.
**Changeable future layout defaults:** keep Vue source in the existing lancealot/src/; database migrations, privileged functions and tests may use supabase/migrations/, supabase/functions/ and tests/ within the application package. Those backend/test paths do not exist yet; names and internal modules are feature-plan work.

## Pages and screens

**Agreed screen inventory (D17), changeable layout:** sign up/verify/sign in/recover; Today; Clients; Projects and project detail with Tasks/Invoices; Settings for timezone, digest time, email toggle, export and account deletion.

```text
Lancealot    Today | Clients | Projects | Settings
Today       [Task follow-ups] [Project deadlines] [Overdue invoices]
Item / Client / Project          Relevant date       Action
```

Desktop tables become readable stacked rows on narrow screens. Today groups eligible items and links to the owning project; unresolved child items remain visible under completed/archived projects. Empty/loading/error states and clear save feedback are required design coverage. Exact navigation, responsive breakpoints and screen/component details are feature-plan work. Date optionality is defined in the domain model.

## Components and API contracts

**Requirements (D14):** shared attention eligibility rules for the in-app list and scheduled digest; persistent per-workspace/local-date delivery tracking and bounded retries. Recheck email preference and ownership before sending; do not send empty digests or bursts of historical digests. Skipped local time sends at the next valid time; repeated time sends one logical digest. No exactly-once external delivery promise.
**Feature-plan work:** retry count/backoff, atomic claiming and overlapping-run protection, provider idempotency/ambiguous responses, schedule/timezone changes and retry cutoff. Resolve before reminder implementation while preserving daily recurrence and no historical backlog bursts. API signatures and implementation internals are feature-plan work.

## UI/UX design system

See the [accepted shared style guide](docs/DESIGN.md) for selected Layout A (work ledger). The three written feature plans and shared design were accepted on 2026-10-28, including explicit launch deferrals; product requirements remain unchanged.

**Agreed baseline (D17):** keyboard-operable forms/actions, visible focus, labels and actionable validation errors, readable contrast, status text beyond color, responsive layouts.
**Changeable visual defaults:** calm, compact work dashboard; neutral background, one accent color, restrained typography; detailed tokens and component styling deferred to feature design. No product-specific branding or UI workflows are implemented; the frontend remains starter content.

## Authentication, authorization, and data privacy

**Requirement (D1):** each individual freelancer has a private workspace. Teams and client logins are excluded initially.
**Agreed (D12):** verified email/password accounts, password recovery, per-user ownership, no shared workspaces.
**Requirements (D16):** Supabase Auth; owner-scoped RLS plus same-owner relationship constraints. Browser receives only public project configuration and publishable key; privileged keys/email credentials remain server-side. Privileged export/deletion/digest paths must explicitly enforce ownership.
Supabase Auth and RLS are explicitly agreed separately from the database selection. Parent deletion/active account erasure are agreed; backup retention is Deferred (D18).

## Environment variables

**Changeable configuration naming defaults, not existing files:** VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are public browser configuration. Privileged Supabase credentials, scheduler authentication and transactional email credentials remain server-side/Vault-managed; exact names depend on the reviewed integration. SMTP settings are configured server-side in Auth. No secret values are recorded; VITE-prefixed configuration must never contain secrets.

## Deployment plan

**Direction:** hosted Vue frontend and Supabase PostgreSQL; agreed service composition in D16 adds Auth, scheduled functions and external email. Public-product intent remains the first-release goal.
**Deferred (D18):** frontend/email vendors, paid tiers, region, monthly estimate and limits, operating owner and backup/restore responsibilities. Review concrete costs before provisioning. Implementation/validation milestones are prerequisites, not a replacement private-product scope.

### Release gates

**Agreed first-public-release gates (D18):** verified ownership isolation including cross-user relationship attacks; verification/recovery emails and digest delivery configured/tested; timezone/lifecycle cases checked; export/deletion and restore demonstrated; a named operator, approved service costs/limits, backup-retention/erasure policy and support path established. Numerical retention/recovery/delivery targets are unset, not silently waived. Provider/retention/operating-owner deferral was approved by the user; these block real-data/public launch until resolved. The named owner must cover maintenance, monitoring and support. Synthetic-data development may precede these decisions; safeguards essential to actual use must not be postponed past launch.

## Development phases

P0 = essential first release; P1 = next improvement; P2 = optional convenience; P3 = later scope requiring review. These express priority, not calendar promises.

- P0 foundation: accepted spec, seeded glossary and concrete setup handoff.
- P0 implementation milestones: verified private accounts; persistent project-linked tracking with Today eligibility; digest processing/settings with reliability checks; export/deletion and all D18 launch gates demonstrated. Each milestone is verified against the acceptance criteria before public use.
- P1: usability improvements identified from actual use, scope not selected.
- P2: spreadsheet import only if subsequently selected and planned.
- P3: teams, client access, payments, invoice generation or offline support would require scope review; none are promised.

### Feature plans

The user selected three linked feature areas for Phase 2a. Accepted written plans: [private accounts/project tracking](docs/plans/private-accounts-project-tracking.md), [Today/daily digest](docs/plans/today-daily-digest.md), and [export/account deletion](docs/plans/export-account-deletion.md). The [planning guide](docs/plans/PLANS.md) governs them. All three reconciled plans and DESIGN.md were explicitly accepted on 2026-10-28 with D18 launch deferrals. Implementation is not started or authorized by document acceptance alone.

## Constraints, risks, and known limitations

**Confirmed constraints:** budget and delivery date are unset (D8); no assumption of unlimited spend, free-tier suitability or a fixed date. Responsive web app, desktop/laptop first, no required offline support (D7).
**Risks:** email scheduling/delivery reliability and workspace isolation are central to the intended public product. Costs and operator duties require a concrete design and explicit review.

## Open questions and assumptions

- D18 Deferred: frontend/email vendors, cost/usage limits, region, retention/restore-erasure policy, recovery targets and operating/support owner. Resolve with concrete workload/cost assessment and named ownership before real-data/public launch.
- D8 Open: no budget or date established; spending and timing cannot be inferred.
- Feature-plan work: field validation/export schema, ordinary child-record deletion UX, retry/backoff/atomic delivery claims, timezone-change concurrency, responsive/browser checks and precise implementation contracts. Resolve before affected implementation under the linked accepted feature plans.
