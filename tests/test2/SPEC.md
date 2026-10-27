# Project Specification

Status: Accepted — foundation and first-release specification; D12 public-beta gates remain Deferred.

Accepted by the user on 2026-10-27 (America/Los_Angeles), with D12 explicitly Deferred as a gate for public real-data beta. Acceptance covers this written scope and design; it does not resolve deferred operational choices or establish launch readiness.

## Project name

Lancealot — user-selected name (D1). The target directory remains `tests/test2`.

## Goals and intended users

Confirmed direction: a tool that helps freelancers track client projects, deadlines, and unpaid invoices.

Confirmed audience: a public product for freelancers, rather than a personal-only tool (D3). Laptop/desktop use comes first; mobile support would be desirable (D4). The first release is a free public beta. The desired outcome is a single place to identify outstanding work and unpaid invoices, with daily follow-up support replacing the spreadsheet’s notification gap. Observable first-release success is defined in [Acceptance criteria](#acceptance-criteria); no unmeasured revenue or adoption target is assumed.

### Current process and pain point

Confirmed (D2): the current process uses a spreadsheet. It lacks notifications to follow up on certain tasks. The desired improvement is timely follow-up support alongside project, deadline, and unpaid-invoice tracking. Task follow-ups, approaching project deadlines, and overdue invoices are confirmed reminder categories, delivered by email and an in-app list (D6). Recipients and timing are agreed under D9; no specific missed deadline or lost revenue was reported.

## Core workflows

Agreed (D6–D8):
- Each freelancer manages a private workspace without team collaboration or client logins.
- Manually enter clients, projects, tasks, and invoices; mark tasks complete and invoices paid.
- Receive task-follow-up, approaching-project-deadline, and overdue-invoice reminders through email and an in-app list.

Agreed (D9): notify only the freelancer, with a daily email digest at a chosen local time; due items remain visible in-app. User-set task follow-up dates, a default project warning three days before its deadline, and an invoice warning starting the day after its due date. Completed tasks and paid invoices stop generating reminders. Outstanding items recur in the daily digest until resolved or rescheduled. Projects remain visible after their deadline while active; completed/archived projects stop producing deadline reminders. The written design uses active/completed/archived project states (D11, D14). Project status suppresses project-deadline reminders; open tasks and unpaid invoices retain their own reminder lifecycle until individually resolved.

## Scope and non-goals

Agreed (D3–D4, D7–D8): public product for individual freelancers, desktop/laptop first, with mobile desirable and internet required. Manual tracking and reminders are first-release capabilities. Invoice generation, payment collection, accounting integrations, spreadsheet import, team collaboration, and client logins are excluded initially.

Agreed (D10): free public beta with paid subscriptions deferred. No billing subsystem is in the first release. Launch scale remains unspecified.

## Central alternatives and tradeoffs

D5 — Agreed: a responsive web app. Internet is required, private workspaces and email reminders are agreed, and desktop is primary with mobile desirable. The user explicitly selected the web option after reviewing alternatives.

| Option | Fit and benefits | Limitations, costs, and operator work |
| --- | --- | --- |
| Local desktop app, local storage | Local control of project data; offline capability possible, though not required. | Installation and updates per desktop platform; local backup/recovery needed. Mobile access and shared data across devices require additional sync design. Email while the app is closed requires an always-running local agent or hosted service, introducing availability and delivery work. |
| Responsive hosted web app | Browser access without installation; a shared hosted database supports access across devices; server jobs can send email while browsers are closed. Selected fit for the agreed needs. | Hosted storage of client/project/invoice data; authentication, workspace isolation, backups/recovery, monitoring, and email delivery must be operated. Recurring hosting, database, and email costs depend on providers and volume; none are priced or approved yet. |

Selected: web app, because offline use is unnecessary and centrally scheduled reminders plus optional mobile access match the product direction. A desktop app with hosted sync would introduce both desktop distribution and hosted-service responsibilities; no need for that added scope has been identified.

## Consequential commitments

- **Agreed direction (D5, D6, D8, D9):** hosted web access, private freelancer workspaces, and scheduled daily email reminders. Hosting, central storage, authentication, email delivery, and backup/recovery bring recurring costs and operational duties before real-data public use. No price, spending ceiling, or uptime promise is agreed.
- **Agreed release boundary (D10):** free public beta; subscription billing deferred.
- **Agreed stack choice (D13):** Vue.js frontend and Supabase PostgreSQL database. Supabase is the selected database platform; project region, plan, capacity, costs and backup capabilities remain deployment decisions. No project is provisioned.
- **Agreed architecture (D14):** Vue 3/Vite/TypeScript SPA, Supabase Auth for accounts, database row-level security (RLS) for workspace isolation, Supabase Cron invoking Edge Functions for digest processing, plus external email delivery. Frontend hosting is a separate deployment responsibility. This includes managed identity and function scheduling within Supabase. A conventional backend with Supabase used only for PostgreSQL is a credible alternative, but adds a separately operated server.
- **Operator burden (D14):** maintain frontend/functions and schema migrations, test RLS and privileged function access, monitor scheduling and failed deliveries, configure authentication email, respond to abuse/support, and verify restore/deletion behavior. Supabase/database/function usage, frontend hosting, and email may incur recurring costs; no free-tier suitability is assumed. See [Tech stack](#tech-stack-and-rationale) and [Deployment plan](#deployment-plan).
- **Deferred release gates (D12):** operator identity, frontend/email provider and Supabase region/plan choices, monthly spend limit and alerts, backup cadence/retention and recovery objectives, deletion handling in backups, digest delivery window/retry policy, support contact, and beta capacity limits must be resolved before public real-data use. Explicit deferral is agreed; the details remain unresolved. See [Release gates](#release-gates).

## Acceptance criteria

Accepted behavior and release criteria (D11, D14); verification is performed during later implementation:

1. A user signs up, verifies their email, signs in, resets a forgotten password, and accesses only their own records. Anonymous access and cross-user reads, writes, and references are rejected by database RLS and constraints, including direct API calls outside the Vue UI. Privileged function paths have separate authorization tests.
2. Create/edit a client, project with deadline, task with follow-up date, and invoice with amount/currency/due date. Invalid amounts, dates, or foreign-owner relationships show clear errors without saving partial changes.
3. With the user's local date set explicitly in tests, tasks due today or earlier appear; active projects appear from three calendar days before their deadline; unpaid invoices become overdue the day after their due date. Completed/archived projects, completed tasks, and paid invoices are excluded from reminders.
4. Schedule at the user's chosen time and IANA timezone, including DST transition tests. At most one digest is recorded per user/local date; empty digests are skipped. Email uses current eligible items when dispatching. Suppressed items are absent from subsequent digests; an email already sent cannot be recalled.
5. Known pre-acceptance delivery failures are retried within a bounded policy. Ambiguous provider acceptance is reconciled or surfaced for operator attention rather than blindly resent. In-app reminders remain usable on email failure. Exact retry and timing thresholds are a D12 gate; inbox arrival is not guaranteed.
6. Users can disable email while retaining the in-app list, export their records, and request/confirm account deletion. Deleted accounts stop sending reminders. Exact backup expiry is disclosed before beta (D12).
7. Core forms and actions work by keyboard with visible focus, associated labels, readable errors, and status text beyond color. Lists adapt to narrow mobile viewports without requiring a native app.
8. Before beta, demonstrate an isolated backup restore, check account isolation and signup/email abuse controls, and verify failure monitoring and the support/deletion process. No claim that these checks have run is made here.

## Design decisions and dependencies

- D1 — Agreed: name is Lancealot. See [Project name](#project-name).
- D2 — Agreed: spreadsheet workflow lacks follow-up notifications. See [Current process and pain point](#current-process-and-pain-point).
  - D6 — Agreed: all three reminder categories, email plus an in-app list; prerequisite D2. Recipient and scheduling details are tracked in D9. See [Core workflows](#core-workflows).
  - D7 — Agreed: manual tracking, task completion and paid-invoice status; exclude invoice generation, payment collection, integrations, and spreadsheet import initially; prerequisite D2. See [Scope and non-goals](#scope-and-non-goals).
- D3 — Agreed: public product for freelancers. See [Goals and intended users](#goals-and-intended-users).
  - D8 — Agreed: independent freelancer workspaces without teams or client access initially; prerequisite D3. See [Scope and non-goals](#scope-and-non-goals).
- D4 — Agreed: laptop/desktop first, mobile desirable, internet required. Budget and launch deadline are unset; this is not approval of unlimited spending. See [Constraints, risks, and known limitations](#constraints-risks-and-known-limitations).
  - D5 — Agreed: responsive hosted web app after explicit comparison with local desktop app; prerequisites D2, D3, D4, D6, D8. See [Central alternatives and tradeoffs](#central-alternatives-and-tradeoffs).

- D9 — Agreed: freelancer-only daily digest at chosen local time, three-day project warnings, user-dated task follow-ups, overdue unpaid invoices, and daily recurrence until resolved/rescheduled; prerequisite D6. See [Core workflows](#core-workflows).
- D10 — Agreed: free public beta without subscription billing; prerequisite D3. See [Scope and non-goals](#scope-and-non-goals).

- D11 — Agreed: Today dashboard, clients/projects/tasks/invoices, paid/unpaid-only financial boundary, no partial payments/conversion/attachments, settings/export/deletion, restrained accessible responsive UI; prerequisites D5, D7–D10. Technical design is revised under D13–D14. See [Tech stack](#tech-stack-and-rationale), [Data model](#data-sources-apis-and-data-models), and [Acceptance criteria](#acceptance-criteria).
- D12 — Deferred: deployment-specific commitments and release thresholds; prerequisites D13–D14 and provider evaluation. User explicitly agreed deferral as blocking gates for real-data public beta, not for accepting the foundation. See [Release gates](#release-gates).

- D13 — Agreed: user-selected Vue.js frontend and Supabase database; prerequisite D5. See [Tech stack](#tech-stack-and-rationale).
  - D14 — Agreed: Vue 3/Vite/TypeScript SPA, Supabase Auth/RLS/Cron/Edge Functions with external email, plus supporting data contracts and verification details; prerequisites D11, D13. The user explicitly approved the revised architecture and its surfaced service/cost/operator responsibilities. Supporting contracts and verification details are included in the accepted written specification. See [Consequential commitments](#consequential-commitments).

All foundation-level product and architecture choices above have been reviewed. D12 is intentionally Deferred, with impact and resolution steps recorded under [Open questions and assumptions](#open-questions-and-assumptions). Written-spec acceptance does not resolve those gates.

## Tech stack and rationale

Agreed stack (D13–D14): Vue.js frontend and Supabase database; Vue 3 with Vite and TypeScript is the selected frontend direction. Architecture: Vue Router, Supabase JavaScript client, Supabase-managed PostgreSQL, Supabase Auth, Cron and Edge Functions. Keep one repository for the frontend, SQL migrations/policies and functions. No separately hosted application server is required for this design.

The Vue UI uses the authenticated Supabase Data API for ordinary records, protected by database RLS and ownership constraints rather than trusting browser-side filters. Database routines supply shared reminder eligibility to the UI and dispatcher. Privileged actions such as account deletion and email dispatch use protected Edge Functions. Supabase Auth manages password credentials; application profile rows hold preferences, not password hashes.

Supabase Cron can invoke Edge Functions periodically. A bounded dispatcher claims delivery records atomically, applies timezone-aware scheduling, and uses an external email service. No broker/worker fleet is included initially. Auth verification/reset email also needs a production-capable sender; built-in default email is not assumed suitable for public users.

The user explicitly agreed to Supabase Auth/Cron/Edge Functions in addition to the database. These managed features are the selected operational fit; the alternative is retaining Supabase solely as PostgreSQL and operating a separate API/auth/scheduler backend. This adds a runtime and patching responsibility without a current product need. Exact runtime/package versions, function limits, cron execution constraints and provider retry/idempotency behavior must be verified before implementation/deployment.

See [Vue/Supabase research](docs/research/vue-supabase-fit.md). No dependencies, manifests, commands, services or application files have been created.

## Data sources, APIs, and data models

Accepted data model (D14); manual entry only, no attachments or bank/payment data:

| Entity | Fields and relationships |
| --- | --- |
| User/preferences | Supabase Auth identity/verified email plus owner-linked profile: IANA timezone, daily digest time, email enabled flag; one private workspace per user. Password credentials remain in managed Auth. |
| Client | Owner, name, optional contact email and plain-text notes. Client email is not a reminder recipient. |
| Project | Owner, client, title, date-only deadline, status active/completed/archived. |
| Task | Owner, project, title, date-only follow-up date, open/completed status. |
| Invoice | Owner, project, external invoice reference, positive exact-decimal amount, currency code, date-only due date, unpaid/paid status and optional payment date. |
| Digest delivery | Owner, local digest date, attempt state, provider reference where available, timestamps; unique user/local-date key. No permanent duplicate copy of all client content in logs. |

All exposed application tables require RLS; read/write policies bind owner_id to the authenticated identity, including checks preventing ownership reassignment. Cross-owner relationships must also be rejected by database constraints or controlled routines. Digest dispatch state is not writable by ordinary browser clients. All references must remain inside the same owner's workspace. Business dates use the user's configured local calendar; delivery timestamps are timezone-aware UTC. Timezone changes affect subsequent scheduling without resending an existing digest for that local date. If a chosen time is skipped by DST, send at the next valid time; repeated times still produce one digest.

Agreed financial boundary (D11): whole-invoice paid/unpaid tracking only; no partial payments, tax calculation, currency conversion, or exchange-rate API. Show totals separately by currency. Users manually correct errors. Archive clients/projects with history, restricting hard deletion of linked records; account deletion removes the workspace. A user JSON export covers their records before deletion; it is not spreadsheet import.

## Project folder structure

Existing: SPEC.md, AGENTS.md, HANDOVER.md, and the documentation scaffold under docs/, plus framework research notes; current stack findings are in docs/research/vue-supabase-fit.md. AGENTS.md is seeded from the accepted specification and observed documentation-only state. No application files exist.

Proposed future layout (not created): src/views/ for screens; src/components/ for reusable UI; src/composables/ and src/lib/ for client state and Supabase access; src/router/ for navigation; supabase/migrations/ for schema, RLS and shared eligibility routines; supabase/functions/ for protected dispatch/deletion functions; tests/ for implementation verification. All are relative to this target project, not Cartographer's source. Existing docs/plans/PLANS.md supplies planning conventions.

## Pages and screens

Agreed screen direction (D11): public introduction/signup; email verification, login and password reset; Today dashboard; client list/detail; project list/detail with tasks and invoices; invoice list with unpaid/overdue filters; settings for timezone/digest/email toggle/export/delete.

```text
Lancealot          Today | Projects | Clients | Invoices | Settings
Today — [local date]                       [+ Add project]
Follow-ups due       Upcoming/overdue projects       Unpaid invoices
[Task, client, date] [Project, deadline]               [Amount, currency]
[Complete]          [Open project]                    [Mark paid]
```

Use compact tables on desktop and stacked labeled rows on narrow screens. Provide first-use guidance, empty/all-caught-up lists, validation errors, save failures with retained inputs, signed-out/expired sessions, and email-delivery warnings. The dashboard prioritizes actions; email links return to authenticated views without bypassing access checks.

## Components and API contracts

Accepted component contracts (D14):

- Vue account views use Supabase Auth for signup, verification, sessions and password reset; profile preferences remain owner-scoped database records. Client route guards support navigation but do not enforce data authorization.
- The Supabase Data API handles tracking queries/mutations. RLS/grants and constraints validate identity, ownership, relationships, amounts and states; Vue maps database/auth/network errors to understandable form states. No unauthenticated access to private records or owner reassignment is allowed.
- A database eligibility routine takes the current instant/local date and derives the owner from authenticated context for user calls. A restricted privileged path is available only to the dispatcher. It returns the same categories to dashboard and digest generation without exposing another workspace. Security-definer routines and views require explicit grants/search-path/RLS review.
- A scheduler-authenticated Edge Function claims one due user/date delivery, refreshes eligibility, and records skipped/accepted/failed/uncertain state. Successful provider acceptance is distinct from confirmed inbox delivery. Claim expiry/crash recovery and provider idempotency must be tested before beta.
- Email adapter accepts a verified recipient, minimal digest summary and authenticated links; returns provider acceptance or a classified error. Sensitive invoice amounts/client notes stay out of email by default; full details stay in-app.
- Export reads only the authenticated user's records under RLS. Account deletion uses a protected Edge Function that verifies a fresh user identity, confirms intent, stops digests and removes workspace/Auth data using server-side privileges. A persisted deletion state prevents further access/sends during retries; session revocation/token lifetime behavior must be validated.

The Supabase Data API is an application interface, not a separately supported public integration API. No external integration API is in scope. No bank, accounting, or payment integration is included.

## UI/UX design system

Agreed visual direction (D11): restrained light interface, dark navy text, teal primary actions, amber upcoming and red overdue statuses paired with explicit text/icons. System sans-serif typography, clear date/currency formatting, consistent spacing, visible focus, labeled controls, and readable contrast. Avoid decorative knight-themed UI until the workflow is validated; the name supplies the initial brand. Desktop navigation collapses cleanly for mobile. Verify keyboard operation and contrast during implementation rather than asserting compliance now.

## Authentication, authorization, and data privacy

Agreed authentication direction (D14): Supabase Auth email/password login, verified email before digests, password reset and managed sessions. For the static Vue SPA, use documented browser-client session handling, prevent unsafe HTML injection, use an appropriate content security policy, avoid exposing tokens in logs/URLs, validate redirect destinations and configure allowed origins. Use HTTPS and abuse controls for signup/login/reset/email-triggering actions. Token storage and logout/revocation behavior require verification during implementation.

Database RLS/constraints enforce owner access even when the Vue UI is bypassed. Server-side secret/service-role credentials can bypass RLS and must never enter browser bundles; privileged Edge Functions must verify callers, restrict operations and scope every record explicitly. Scheduler endpoints must reject public/user calls that could trigger arbitrary sends. Authentication email configuration and digest email are separate delivery workflows, even if one provider serves both.

Collect only account/contact/project/invoice tracking data; no card details, bank credentials, invoice PDFs, or sensitive-document uploads. Email carries minimal reminder content; production logs exclude notes, credentials, and invoice contents. User export and confirmed deletion are part of beta readiness. Hosting/email processors, privacy disclosures, operator support, backup retention, and deletion propagation must be settled under D12 before real customer data is accepted. Staff access is restricted to operational need; privileged access and secrets require documented controls.

## Environment variables

Proposed configuration names (D14); none have values or files yet:

| Placement | Name | Purpose |
| --- | --- | --- |
| Public Vue build | VITE_SUPABASE_URL | Supabase project URL. |
| Public Vue build | VITE_SUPABASE_PUBLISHABLE_KEY | Browser-safe publishable key; access still requires RLS and user authentication. |
| Function runtime | SUPABASE_URL | Server-side project endpoint. |
| Function runtime | SUPABASE_SECRET_KEYS | Platform-provided secret-key collection where supported; privileged access, never public. Confirm current runtime conventions before use. |
| Function secret | EMAIL_API_KEY | Selected provider's digest-sending credential. |
| Function config | APP_BASE_URL, DEFAULT_FROM_EMAIL | Canonical frontend HTTPS URL and verified sender. |
| Function secret/Vault | REMINDER_JOB_SECRET | Dedicated scheduler authentication; exact secure Cron/function mechanism requires verification. |
| Function config | REMINDER_BATCH_SIZE | Bounded per-invocation workload sized after capacity evaluation. |

Never place server secrets, service-role keys, database passwords or email credentials in VITE_ variables. Auth SMTP credentials belong in Supabase Auth configuration, not the browser. Secrets for Cron invocation belong in server-side secret storage/Vault. Runtime defaults are version-dependent; confirm available key naming before implementation rather than inventing values.

## Deployment plan

Agreed database platform (D13): Supabase. Agreed topology (D14): static Vue hosting plus one managed Supabase project supplying PostgreSQL/Auth/Cron/Edge Functions, and an external email service configured for both Auth SMTP and digest delivery if compatible. The Supabase project plan/region, frontend host and email vendor remain unselected.

Evaluate actual plans/limits, database backup/restore features, function duration/concurrency, scheduler behavior, email sender/domain verification, delivery status/idempotency, authentication-email restrictions and data handling before provisioning. No free-tier production-readiness claim is made. Frontend routing must support direct links; auth redirects and email links must target approved HTTPS URLs.

Operator duties: update frontend/function dependencies; manage migrations, RLS policies, project configuration and secrets; monitor Cron/functions/deliveries; handle abuse/support and deletion; verify backups and recovery. Managed services reduce server administration while retaining application access-control and operational responsibilities. Costs may include Supabase database/Auth/functions, static hosting and email. No spending amount or operator assignment is agreed.

### Release gates

Agreed deferral (D12); details unresolved: foundation acceptance may proceed with deployment decisions open, but the free public beta uses real data and must pass these gates first:
- Name the operator/support contact; choose the frontend host/email provider and Supabase plan/region; review their data handling, costs, monthly spend ceiling/alerts, and beta capacity/signup limits.
- Set backup cadence/retention, restore objectives and account-deletion propagation/backup expiry; demonstrate an isolated restore and disclose these practices before signup.
- Set digest dispatch window, bounded retry/backoff and catch-up policies; test DST, overlapping jobs, restarts, uncertain provider acceptance and failure alerts. Prove safe dispatch under expected capacity; no promise of exact inbox arrival.
- Verify Auth SMTP and digest sender configuration, signup verification and anti-abuse controls, direct-API RLS isolation, privileged function/scheduler authentication, session/security settings, and HTTPS; complete privacy/support information and the export/deletion flow.

Synthetic-data development/testing can precede these public-use gates under separate implementation authorization. Paid subscriptions, team/client access, native apps, import, and integrations are later scope decisions, not hidden beta gates.

## Development phases

Accepted delivery milestones (D14); these are delivery phases, not severity labels:
- P0 — Foundation: accepted written spec, clear deferred gates, and seeded agent guidance.
- P1 — Private tracking slice: in a development environment with synthetic records, direct-API RLS, privileged-function authorization and CRUD checks pass for clients/projects/tasks/invoices, with desktop and narrow-screen forms.
- P2 — Reminder slice: shared eligibility, timezone preferences, in-app list and test-email digests pass boundary, completion/payment suppression, concurrency and failure checks.
- P3 — Public beta readiness: resolve D12 and demonstrate recovery, security/privacy, real email configuration and operational verification. Release only when the gates are met and deployment is authorized.

A usable beta must satisfy the acceptance criteria above; engagement/success metrics beyond these functional checks should be chosen after beta onboarding research, without adding analytics collection by default.

### Feature plans

No feature plans selected or created. Candidate first features are the private client/project tracking slice, task follow-ups, and unpaid-invoice tracking; the reminder slice follows the underlying records. These are candidates, not individual execution plans; planning conventions are in [docs/plans/PLANS.md](docs/plans/PLANS.md).

## Constraints, risks, and known limitations

Confirmed (D4): laptop/desktop first, mobile desirable, internet required. No budget or launch deadline is currently set. Provider costs and an operating ceiling must be assessed before incurring charges; unset budget does not imply unlimited spending. There is no application implementation or runtime configuration yet.

## Open questions and assumptions

- D11 product/visual direction and D13–D14 Vue/Supabase architecture are agreed. Supporting data/contracts/verification are part of the accepted written specification. No material product or architecture choice remains silently open.
- D12 deployment-specific costs, ownership, frontend/email providers, Supabase plan/region, retention/deletion and recovery, capacity, and email service thresholds are explicitly Deferred to deployment preparation as blocking real-data beta gates. No production readiness or zero-cost claim follows from foundation acceptance.
- Partial payments, conversion and attachments are agreed first-release exclusions under D11; accounting automation was excluded under D7. Validate the simple paid/unpaid model with beta users before expanding it.
- Exact dependency versions and scheduler/email provider behaviors need implementation-time verification; current architectural capabilities were checked in [Vue/Supabase research](docs/research/vue-supabase-fit.md).
- Name availability/domain/trademark work has not been performed; the chosen working product name does not authorize domain registration.
