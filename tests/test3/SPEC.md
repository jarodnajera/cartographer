# Lancealot — Project Specification

Status: Accepted — written specification explicitly accepted on 2026-10-27
for the stated scope and D15 deferrals. D15 operating decisions remain Deferred
and block real-data public beta until resolved and verified.

**Requirements** are agreed product behavior or consequential choices.
**Changeable defaults** may be revised while preserving requirements.
**Feature-plan work** identifies bounded implementation detail, not unknown scope.

## Project name

**Requirement (D1):** Lancealot. Documentation resides in `tests/test3`.

## Goals and intended users

**Requirements (D2–D4, D9):** a public hosted product for individual freelancers,
each with one private workspace. Help users find the next action for each active
project, identify invoices needing follow-up, and receive reminders privately.
Laptop/desktop first; mobile access is desirable. Internet is acceptable; offline
operation is not required. No teams or client logins initially.

### Current process and pain point

The user tracks work in a spreadsheet with no notifications to follow up on tasks.
No particular missed deadline or unpaid-invoice incident was reported.

## Core workflows

**Requirements (D5, D8, D10–D11, D14, D16, D19):**

1. Sign up with verified email/password, sign in, and recover access.
2. Manually create/edit clients, projects, tasks and existing invoices. Each project
   belongs to a client; each task/invoice belongs to a project, under the same owner.
3. Review next actions, approaching/overdue deadlines and unpaid invoices in an
   in-app list. Complete tasks, mark whole invoices paid/unpaid, archive projects.
4. Configure a daily email digest's local time and saved timezone, or disable email
   while retaining the list. Email only the freelancer, never the client.
5. Export owned records and confirm account deletion. Account deletion stops email
   and removes active workspace data; retention/recovery policy is a release gate.

### Reminder eligibility and schedule

- Tasks qualify from their user-set follow-up date and recur daily until completed.

- Project warnings start three calendar days before deadline and continue when
  overdue until the project is completed/archived.

- Unpaid invoices become overdue the day after their due date and recur daily
  until marked paid. No partial payments or currency conversion.

- Completed/archived projects stop only their deadline warnings. Unresolved tasks
  and unpaid invoices under them retain their own reminders.

- Use the saved timezone for calendar-date decisions. One daily digest at the
  chosen local time; skip empty digests. Normal-operation target: submit to the
  email provider within 15 minutes after that time, subject to scheduler/cost
  validation. This is not a guarantee of exact inbox arrival.

- At a repeated DST clock time, send once; at a skipped clock time, use the next
  valid time. After an outage, send the current digest later that same local day;
  do not replay old days. The in-app list remains available independently of email.

## Scope and non-goals

**Requirements:** manual tracking and reminders, verified private accounts,
record lifecycle, export and confirmed account deletion for the first public beta.
No spreadsheet import, external business integrations, teams, shared workspaces,
client logins/emails, invoice generation, payment collection, partial payments,
currency conversion, browser/device notifications, or offline use initially.
No subscription billing or paid access in the first public beta (D18). This does
not imply free hosting or email. Infrastructure services required for the selected
backend and email are permitted; they are not business-data integrations.
Desktop/laptop is the release priority; mobile refinement is later improvement.
No budget or delivery date is set.

## Central alternatives and tradeoffs

**D6, Agreed:** hosted web, explicitly chosen over an installed local tool.

| Concern | Installed local | Hosted web — selected |
| --- | --- | --- |
| Installation/access | Install per device; mobile needs more work | Browser access on laptop/desktop |
| Offline/data | Local data/offline support | Central data/internet; offline not required |
| Timely digest | Computer awake/connected or a hosted helper | Scheduled backend independent of user device |
| Cross-device/recovery | Sync adds scope; local recovery policy needed | Shared hosted data; operator backups/restore needed |
| Costs/work | Packaging, updates, local support, email | Hosting, database, auth, email, monitoring, maintenance |

Hosted web fits public access and device-independent digests. Specific frontend
host and email provider remain Deferred under D15. See [platform research](docs/research/platform-and-digest.md).

## Consequential commitments

| Decision/status | Commitment and burden | Stage |
| --- | --- | --- |
| D3/D6, Agreed | Public hosted private workspaces require access isolation, hosted data, recovery and continuing operation | First public beta |
| D12/D17, Agreed | Vue + Supabase PostgreSQL/Auth/RLS/Cron/Edge Functions; policy tests, migrations, secure privileged functions, runtime/capacity validation, platform maintenance and service costs | First release foundation and beta |
| D8/D11/D16, Agreed | Scheduled user-local email with 15-minute normal-operation provider-handoff target; email service, sender configuration, retries/deduplication and monitoring work | First public beta |
| D14, Agreed | Guarded deletion/archiving, owned-record export and confirmed account deletion; secure data removal and backup-retention handling | First public beta |
| D18, Agreed | No user subscription billing/paid access initially; operating costs still require funding | First public beta |
| D15, Deferred by user | Frontend/email providers and all service plans/region, numeric budget, operator/support owner, backup/retention/recovery targets, delivery/retry thresholds and capacity limits remain unresolved; required review blocks real-data public beta | Mandatory beta gate |

Supabase is selected for the specified backend roles; provider deferral does not
reopen that selection. No paid plan, purchase, numerical retention/recovery policy,
capacity promise or inbox SLA has been agreed. Details: [deployment](#deployment-plan)
and [open questions](#open-questions-and-assumptions).

## Acceptance criteria

**Requirements:**

- Verified account can sign in/recover access and retain its records across sessions.
  Anonymous access and a second user's reads/writes/export/foreign-record links
  fail without leaking another user's data, including through backend functions.

- Users create/edit the client → project → task/invoice hierarchy. Invalid required
  fields, money/dates and cross-owner links are rejected without corrupting data;
  failed saves are not displayed as successful. Exact messages are feature-plan work.

- For follow-up date D, an unfinished task is eligible on D and later local dates;
  completing it removes its reminder. A project due on D first warns on D−3,
  stays eligible after D, and stops its deadline warning when completed/archived.

- An unpaid invoice due on D first appears overdue on D+1; marking it paid removes
  its reminder. Store its currency; no partial payment or conversion workflow.

- Completing/archiving a project leaves unresolved child task/invoice reminders
  eligible. Parent deletion with linked records is blocked; individual task/invoice
  deletion requires confirmation. No silent cascading removal of linked work.

- With eligible items and email enabled, submit one current daily digest within
  the 15-minute normal-operation target at the saved timezone/time. Verify empty
  days, DST skipped/repeated times and same-local-day outage catch-up. Email off
  stops digest dispatch while leaving list eligibility intact.

- Repeated scheduled execution must not intentionally send duplicate daily digests.
  Persist outcomes and test retry/failure paths. Numeric retry/delivery thresholds,
  declared capacity and provider-specific ambiguous-send handling are beta gates.

- Export contains only the owner's product records and relationships, without
  passwords or privileged credentials. Account deletion requires confirmation,
  stops future emails and removes active owned data; other users remain intact.
  Deleted users must not regain data access through still-valid sessions.

- Keyboard interaction, visible focus, labeled fields, readable contrast and text
  status support core journeys. Empty/error/loading states remain understandable.

- Before real-data public beta, resolve and verify all [release gates](#release-gates),
  including backups/restore, retention and capacity; target behavior is not evidence
  that these checks have already passed.

## Design decisions and dependencies

- D1 — Agreed: name Lancealot. [Identity](#project-name).

- D2 — Agreed: spreadsheet lacks task follow-up notifications. [Goals](#goals-and-intended-users).

- D3 — Agreed: public product, one private workspace/user, no teams/client logins.
  [Scope](#scope-and-non-goals).

- D4 — Agreed: desktop/laptop first, mobile desirable, internet acceptable, no
  offline requirement, budget/deadline unset. [Scope](#scope-and-non-goals).
  - D5 — Agreed: manual tracking, no import/business integrations; also D2–D3.
    [Workflows](#core-workflows).
    - D10 — Agreed: full invoices paid/unpaid with currency; no partial payments
      or conversion. [Data](#data-sources-apis-and-data-models).
    - D19 — Agreed: required client → project → task/invoice relationships;
      also D10. [Data](#data-sources-apis-and-data-models).
  - D8 — Agreed: user-local daily freelancer email plus in-app list; also D2–D3.
    [Reminder rules](#reminder-eligibility-and-schedule).
    - D11 — Agreed: 15-minute normal-operation provider-handoff target; validation
      required, no inbox SLA. [Acceptance](#acceptance-criteria).
  - D9 — Agreed: next actions/invoice follow-ups and private reminders; also D2–D3.
    [Goals](#goals-and-intended-users).
  - D6 — Agreed: hosted web over local; D2–D5/D8–D9. [Alternatives](#central-alternatives-and-tradeoffs).
    - D12 — Agreed: Vue.js with Supabase PostgreSQL; D6. [Stack](#tech-stack-and-rationale).
      - D17 — Agreed: Supabase Auth/RLS/Cron/Edge Functions instead of a separate
        application server; also D13/D8. [Contracts](#components-and-api-contracts).
    - D13 — Agreed: verified email/password/recovery, per-user ownership; D3/D6.
      [Access](#authentication-authorization-and-data-privacy).
    - D14 — Agreed: edits/archiving, protected parents, confirmed individual
      task/invoice deletion, export and confirmed account deletion; D5/D10.
      [Data](#data-sources-apis-and-data-models).
    - D15 — Deferred by user: specific operating choices with a mandatory
      real-data public-beta gate; D6/D11. [Deployment](#deployment-plan).
    - D16 — Agreed: digest edge rules and home/accessibility package; D5/D8/D10/D11.
      [Rules](#reminder-eligibility-and-schedule), [screens](#pages-and-screens).
    - D18 — Agreed: no paid access/subscription billing initially; D3/D6.
      [Scope](#scope-and-non-goals).
    - D7 — Agreed: consolidated technical/visual design and scoped deferrals,
      confirmed by the user; depends on D12–D19. Written specification subsequently
      accepted for the stated scope and D15 deferrals.

## Tech stack and rationale

**Requirements (D12/D17):** Vue.js frontend, Supabase PostgreSQL, Supabase Auth,
Row Level Security, Cron and trusted Edge Functions. Vue presents records/settings;
Supabase enforces ownership and executes privileged/scheduled backend work.
A separate application server is not selected. No additional broker or standalone
worker service is committed. Supabase plans/region and email/frontend-host providers
remain Deferred (D15). See [current technical research](docs/research/vue-supabase-foundation.md).

**Changeable defaults:** Vue 3 with Vite, TypeScript, Vue Router and the Supabase
JavaScript client. Exact maintained versions, package manager and local setup are
setup/feature-plan work, not installed facts.

## Data sources, APIs, and data models

**Requirements:** manual entry; per-user preferences; the agreed hierarchy above;
full invoice currency/payment state; no business integrations. Supabase data/auth
APIs and email infrastructure serve the application, not a new external integration
feature. No independently supported public developer API.

**Changeable field defaults:** Client(name); Project(client, name, active/completed/
archived status, deadline); Task(project, title, done state, follow-up date);
Invoice(project, reference, decimal total, currency, due date, paid state);
Preferences(owner, timezone, digest time, email enabled). Each record/relationship
must preserve ownership. Deadline/follow-up dates may be absent when not scheduled;
invalid entered dates cannot create reminders. Validate monetary amounts without
floating-point rounding; separate currency totals, never a converted combined sum.
Field lengths, indexes, optional notes and exact validation are feature-plan work.

**Lifecycle requirements (D14):** allow edits and client/project archiving; preserve
linked tasks/invoices and their reminders; block parent deletion with linked records;
confirm task/invoice deletion. Account deletion is a separate whole-account action,
not an ordinary parent deletion. Export owned records with their relationships.
**Changeable export default:** versioned JSON; import/round-trip restore is not promised.
Retention, backup expiration and recovery details remain Deferred at the beta gate.

**Backend design:** durable per-user/local-date digest records and shared eligibility
logic support safe retries and consistent list/email behavior. Provider idempotency
and ownership checks protect privileged execution. Exact tables, claiming/locking,
API payloads, timezone-setting-change handling, and retry mechanics are feature-plan
work constrained by one daily digest and the agreed rules; numeric thresholds and
capacity remain D15 release-gate decisions.

## Project folder structure

Observed: SPEC.md, AGENTS.md, HANDOVER.md; docs/{ARCHITECTURE,TESTING,RUNBOOK,
GLOSSARY}.md; docs/plans/PLANS.md; docs/research/ notes and docs/adr/ placeholder.
No application or tooling is implemented. Supporting documents remain scaffolds.

**Changeable default after setup:** src/ for Vue UI/data adapters, supabase/migrations/
for schema/policies, supabase/functions/ for trusted backend, tests/ for verification.
Exact structure is feature-plan work. Do not describe it as existing architecture.

## Pages and screens

**Agreed direction (D16):** signup/sign-in/verification/recovery; follow-up home;
clients/projects and project detail with tasks/invoices; invoice list; settings
for timezone/time/email and export/account deletion. No team/client/billing screens.

```text
Lancealot   Home | Clients | Projects | Invoices | Settings
Follow-ups: tasks | approaching/overdue projects | overdue invoices
Item / client-project / relevant local date / text status / action
```

**Changeable defaults:** home prioritizes next actions; totals separate currencies;
empty states offer manual entry, errors preserve input, loading is visible. Exact
wireframes/filtering/sorting are feature-plan work. Mobile refinement is a later
improvement within the desktop-first scope, not a native app commitment.

## Components and API contracts

**Requirements (D17):** Vue uses Supabase's client API under the signed-in user's
identity; RLS enforces owner-scoped reads/writes and same-owner relationships.
UI filters alone are insufficient. Supabase Auth handles chosen account flows.

Cron invokes an authenticated trusted function to process due digests; privileged
account deletion is user-requested and authenticated, not a public administrative
endpoint or a scheduled deletion sweep. The trusted digest path must enforce
recipient/ownership separation even where a privileged key can bypass RLS.
Evaluate current eligibility/email preference before dispatch. Shared eligibility
logic must preserve parent/child reminder rules. Exact RPC/function contracts,
batching and durable-send reconciliation are feature-plan work; no unbounded
single-function run or capacity is assumed.

## UI/UX design system

**Requirements (D16):** keyboard access, visible focus, labeled fields, readable
contrast, understandable validation and text status beyond color. Clearly display
relevant dates/timezone and digest preferences; confirm destructive actions.
**Changeable defaults:** restrained light layout, standard tables/forms, system
fonts and one accent color. Exact visual tokens/components are feature-plan work.

## Authentication, authorization, and data privacy

**Requirements (D13/D17):** Supabase Auth verified email/password/recovery; no shared
workspaces. Enforce RLS policies for every exposed product table and restrict linked
record ownership. Test anonymous/second-user access, exports and privileged functions.
Recovery and verification redirect behavior must be configured and tested.
No privileged Supabase or email secret enters browser code, exports or logs.
Auth tokens and confidential record content need protected handling; use encrypted
transport, restricted operator access, and tested session/logout/deletion behavior.
Exact session persistence choice is security-focused feature-plan work consistent
with the selected Supabase browser architecture and the access requirements above.

Account deletion requires confirmation and trusted authorization, disables digest
sending and removes active owned data. Old sessions must not retain record access.
Backup expiration, retention/recovery and region remain Deferred, not guaranteed.
No legal compliance claim or numerical privacy policy is implied.

## Environment variables

None configured. **Proposed names and placement defaults:**

| Name | Purpose/placement |
| --- | --- |
| VITE_SUPABASE_URL | Browser public project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | Browser public API key; safe only with enforced RLS/grants |
| APP_BASE_URL | Trusted backend links and configured auth redirects |
| EMAIL_API_KEY / EMAIL_FROM | Backend digest delivery credentials/sender only |
| SCHEDULER_AUTH_SECRET | Trusted invocation credential if required by chosen setup |

Supabase provides platform runtime credentials; exact names are checked at setup.
Privileged secret/service-role keys stay in trusted backend configuration, never
VITE_ variables. Auth SMTP settings are configured securely in Supabase, not the Vue
bundle. Never store actual credentials in docs. Provider choice may change names.

## Deployment plan

**Requirements (D6/D17):** hosted Vue frontend plus the selected Supabase backend,
Cron/Edge Functions and configured email delivery. Browser users need not keep their
computer awake for scheduled email. Use HTTPS email APIs for Edge Function digests;
configure production-capable SMTP for account verification/recovery. One email vendor
may cover both roles if suitable; none is selected. Separate synthetic test/staging
configuration from production credentials/data.

**Deferred (D15, user-approved):** frontend/mail providers, all service plans/region,
numeric budget, operator/support ownership, backup/retention/recovery targets,
delivery/retry thresholds and capacity limits. Resolve these before real-data public
beta. Supabase's chosen roles remain fixed; its plan/region are deferred. No unlimited
spending, assumed free-tier fit, fixed date or paid purchase is authorized.

### Release gates

The intended first public beta uses real client data only after:

- All core acceptance cases pass, especially RLS/privileged-path isolation, verified
  accounts/recovery, deletion/export and parent/child reminder behavior.

- Accepted frontend/mail providers, plans, region and numeric budget cover declared
  capacity; performance tests demonstrate the 15-minute normal-operation handoff
  target and safe bounded processing within function/runtime/provider limits.

- Delivery/retry thresholds, failed/ambiguous-send handling, monitoring and alerts
  are selected and verified, including signup/mail abuse controls and email opt-out.

- Backup/retention/recovery policies, including deleted-account backup treatment,
  are explicit; a restore test meets the accepted recovery targets and does not
  reactivate deleted accounts/reminders.

- A named operator/support owner accepts access, maintenance, cost-monitoring,
  incident-response and recovery duties; sender and auth redirect configuration
  are verified. Security/privacy operating disclosures match accepted policies.

These are first-beta requirements, not later enhancements. Deferred numerical
policies are not implied by spec acceptance. Synthetic development verifies behavior
without claiming production readiness; there is no readiness evidence yet.

## Development phases

P0 = essential first release; P1 = next improvement; P2 = optional convenience;
P3 = later ideas. **Changeable milestone ordering, preserving all P0 release requirements:**

- P0 foundation: written spec accepted for its explicit scope/deferrals; separate
  application setup followed by evidence-based AGENTS.md seeding.

- P0 records: account/ownership/manual-record flows pass persistence, validation,
  cross-user isolation, lifecycle and export/deletion cases using synthetic data.

- P0 reminders: shared list/digest rules pass date/DST/archive/payment/disable,
  repeated execution and failure cases. Validate handoff target at declared load.

- P0 public readiness: resolve D15 policies and pass every release gate before
  real-data public beta.

- P1: mobile/usability refinement based on feedback.

- P2/P3: later feature selection; imports/integrations/teams/payments remain outside
  this release and require scope review before expansion.

### Feature plans

No feature plan is selected or created. Candidate first feature: private workspace
and manual client/project/task/invoice records. Daily digest delivery is a subsequent
candidate that merits a plan. Use [PLANS.md](docs/plans/PLANS.md) when planning is
requested; accepting the foundation does not select or implement every feature.

## Constraints, risks, and known limitations

No budget/deadline, free-tier suitability or unlimited spend assumed. Function
runtime/throughput, email delays/rejections, privileged bypass of RLS, setting changes,
DST/date boundaries and backup/deletion interaction need verification. Scheduled
sweeps must be bounded; relying on one unbounded function or browser timer risks
missed digests. The accepted handoff target is a requirement subject to validation,
not a measured SLA. All application behavior is planned, not implemented.

## Open questions and assumptions

- D15 — Deferred by user until before real-data public beta: exact operating choices
  listed above. They block that release. Select policies/providers, price declared
  capacity, assign ownership and test restoration/delivery/load before lifting gates.

- Changeable defaults (Vite/TypeScript/router, fields/export format, layout/folders)
  and bounded feature-plan details may change while preserving the requirements.
  Material costs, access changes or new subsystems still need focused agreement.
