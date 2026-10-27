# Project Specification

Status: Accepted
Accepted: 2026-10-27 — explicit user acceptance of the complete written specification.
Shared understanding confirmed: 2026-10-27.

The product and design decisions below reflect the confirmed discovery and design
review. The user explicitly accepted this complete written specification on 2026-10-27.
Planned architecture, interfaces, screens, and operations describe future work;
none is implemented. No application implementation is authorized.

## Goals and intended users

Agreed: serve solo freelancers managing their own client work. Team collaboration
is later scope. The main goal is a daily answer to “What needs my attention?”
through approaching project deadlines and overdue invoices.

Agreed success measure: a freelancer can identify their next deadline and
overdue invoices from one overview, then update a project or record a payment
without maintaining a separate tracking list.

## Core workflows

Agreed: open a daily overview combining approaching deadlines and overdue
invoices; manually maintain clients, projects, milestones, and existing invoices;
mark an invoice paid. Alerts appear when using the app. Private accounts work
online from the primary computer, with phone access desirable.

Agreed workflows:

1. Register/verify email, sign in, choose currency and account timezone, then add
   a client. Empty states guide the first project and invoice entry.
2. Add a project with a due date, optional milestone dates, and active/completed
   status. Mark milestones done; completing a project removes its deadlines from
   the attention view but never hides its unpaid invoices.
3. Record an existing invoice for a client, optionally linking a project; enter
   reference, amount, and due date. Mark fully paid with a payment date; allow a
   confirmed correction back to unpaid. No partial-payment ledger.
4. Open Today: see overdue deadlines, deadlines due today/within seven calendar
   days, and overdue invoices. All unpaid invoices remain available in Invoices.
5. Settings: export all records; delete individual records with confirmation or
   request account/data deletion. Sign out clears in-memory account data.

## Scope and non-goals

Current work is requirements clarification and documentation in `tests/` only.
Do not implement application code.

Agreed MVP: an online web app using hosted Supabase, private freelancer accounts,
manual client/project/invoice tracking, project and milestone dates, a daily
attention overview, and marking invoices paid. Primary computer use is essential;
phone access is desirable. No offline mode initially. One chosen currency per
freelancer; paid/unpaid status only. Include full record export, confirmed deletion,
and a documented backup/recovery approach.

Outside MVP: invoice creation/sending, payment collection, accounting integrations,
team collaboration, client portals, partial payments, currency conversion,
email/push deadline reminders, offline operation, and native mobile apps.
Additional agreed exclusions: file attachments, time tracking, recurring invoices,
self-service import, billing/subscriptions, and user-facing analytics.

## Acceptance criteria

Agreed product outcomes:

- Identify approaching project deadlines and overdue invoices together from one overview.

- Manually add/update clients, projects, milestones, and existing invoice records.

- Mark an invoice paid and have it leave the unpaid/overdue attention list.

- Use private online accounts, one currency, full paid/unpaid status, full record
  export, confirmed deletion, and a documented recovery approach.

Observable verification criteria:

- With account date 2026-10-27, an unpaid invoice due 2026-10-26 is overdue; one
  due 2026-10-27 is due today, not overdue; paid invoices are never overdue.

- Today includes unfinished deadlines through 2026-11-03 inclusive and all overdue
  unfinished deadlines; later deadlines remain visible in Projects. Account
  timezone determines today; date-only due dates do not shift with device timezone.

- Completing a project hides its unfinished deadlines from Today while its unpaid
  invoice remains visible. Missing optional dates never create false alerts.

- Saved edits persist after reload and are visible on another signed-in device
  after refresh; live synchronization is not required.

- Money is stored as integer minor units, formatted for the account currency;
  invalid/negative/zero invoice amounts and excess precision are rejected.
  Currency cannot change once invoices exist, preventing silent relabeling.

- Direct API attempts by user A to read, insert for, update, delete, or link user B's
  records fail. Anonymous requests and expired sessions cannot access business data.

- Export contains all owned record types, stable IDs, relationships, settings,
  currency, schema version, and export time; no other user's data or auth secrets.

- Canceling deletion changes nothing. Linked clients/projects cannot be deleted
  until dependents are removed or reassigned. Account deletion requires fresh
  authentication and explicit confirmation, removes owned rows and auth identity,
  and handles retries without reporting false success.

- A documented restore exercise recovers sample linked records in an isolated
  environment; restored backups must not resurrect deleted accounts into service.

- Main workflows work with keyboard navigation at 1280px desktop and 375px phone
  widths, visible focus, labeled fields, and readable errors. Simulated failed
  saves show retryable errors and never claim success or discard form input.

Foundation completion requires acceptance of the complete written spec and a
concrete next step; these criteria do not authorize implementation.

## Design decisions and dependencies

- D1 — Initial audience: Agreed; prerequisites: none. Solo freelancers managing their own work; team collaboration later. See [Goals](#goals-and-intended-users).

- D2 — Primary problem: Agreed; prerequisites: none. One daily overview for approaching deadlines and overdue invoices, with lightweight project tracking. See [Core workflows](#core-workflows).

- D3 — Usage constraints: Agreed; prerequisites: none. Primary computer essential; phone access desirable. Online only; see D7. See [Constraints](#constraints-risks-and-known-limitations).
  - D4 — Local versus web delivery: Agreed; prerequisites: D1–D3, D5–D11. Online web app, hosted Supabase, no offline mode. See [Tech stack](#tech-stack-and-rationale).

- D5 — MVP data entry and billing boundary: Agreed; prerequisites: D1, D2. Manual tracking, mark paid; exclude invoice issuing, payment processing, and integrations initially. See [Data](#data-sources-apis-and-data-models).

- D6 — Deadlines and alerts: Agreed; prerequisites: D2. Project due dates with optional milestones; in-app attention indicators first. Email/push reminders later. See [Core workflows](#core-workflows).

- D7 — Storage and offline constraints: Agreed; prerequisites: D1, D3. Hosted Supabase, private freelancer accounts, internet required; no offline mode. See [Privacy](#authentication-authorization-and-data-privacy).

- D8 — Delivery constraints: Agreed; prerequisites: D1–D3. Low ongoing costs, small first version, no fixed launch deadline; no numeric budget specified. See [Constraints](#constraints-risks-and-known-limitations).

- D9 — Database: Agreed; prerequisites: none (user choice). Hosted Supabase; agreed frontend design is indexed in D12. See [Tech stack](#tech-stack-and-rationale).

- D10 — Money and payment lifecycle: Agreed; prerequisites: D5. One chosen currency per freelancer, full paid/unpaid status initially; partial payments and conversion later. See [Data](#data-sources-apis-and-data-models).

- D11 — Portability and recovery: Agreed; prerequisites: D5, D9. Full data export, confirmed deletion, and a documented backup/restore approach. See [Privacy](#authentication-authorization-and-data-privacy).

- D12 — Application architecture: Agreed; prerequisites: D4, D7, D9. React/TypeScript/Vite, Supabase Auth/RLS and deletion function; Netlify static hosting. See [Stack](#tech-stack-and-rationale) and [Contracts](#components-and-api-contracts).
  - D13 — Detailed data/security behavior: Agreed; prerequisites: D5–D7, D10–D12. Ownership constraints, date rules, currency lock, export and deletion safeguards. See [Data](#data-sources-apis-and-data-models) and [Privacy](#authentication-authorization-and-data-privacy).
  - D14 — Screens and visual design: Agreed; prerequisites: D2, D5–D7, D10, D12. Responsive attention dashboard, record screens, accessible light UI. See [Screens](#pages-and-screens).
  - D15 — Delivery and operations: Agreed; prerequisites: D8, D11–D13. Synthetic-data pilot, real-data release gates, costs, backups and verification milestones. See [Deployment](#deployment-plan) and [Phases](#development-phases).

### Next interview frontier

Shared understanding and separate acceptance of this complete written specification
were explicitly confirmed on 2026-10-27. D1–D15 are agreed; the foundation interview
is complete with no remaining discovery questions or research blockers. Agent
guidance is in [AGENTS.md](AGENTS.md); current handoff is in [HANDOVER.md](HANDOVER.md).
Next workflow: select a feature to plan. No application code, feature plans, package
installation, provisioning, spending, or deployment is authorized.

## Tech stack and rationale

Agreed: online web application; hosted Supabase database; private accounts;
no offline mode. This settles local versus web delivery in favor of web.

Planned architecture (D12): React with TypeScript and Vite for a static single-page application,
React Router for routes, plain CSS with shared tokens, Supabase JavaScript client,
Supabase Auth, PostgreSQL migrations/RLS, and one privileged Supabase Edge Function
for account deletion. Netlify hosts static assets and routes; ordinary data work
goes directly to Supabase under the user's session and row-level security.
No separate always-on application server, SSR, or SEO work is needed for this
private productivity tool. Pin supported package versions at implementation time.

Rationale: one responsive UI serves desktop and phone; managed auth/database avoid
building account infrastructure; a static app keeps hosting responsibilities small.
A desktop/local tool would add installation and synchronization work contrary to
the accepted online access direction. A full server-rendered framework remains an
alternative if future server workflows warrant it, but is outside the MVP design.

[Vite guide](https://vite.dev/guide/) describes its static production build;
[Netlify's Vite guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)
documents hosting integration. No packages, services, or manifests exist yet.

## Data sources, APIs, and data models

Agreed: manual entry only, hosted Supabase database, one selected currency per
freelancer, full paid/unpaid states, no payment processing, export/deletion/recovery.

Planned model (D13):

| Entity | Essential fields and rules |
| --- | --- |
| Profile | Auth user ID, currency code, IANA timezone, timestamps; currency selected before first invoice and locked while invoices exist. |
| Client | UUID, owner ID, required name, optional contact email and notes, timestamps. |
| Project | UUID, owner ID, required client ID/title, optional due date/notes, active or completed status, timestamps. |
| Milestone | UUID, owner ID, required project ID/title/date, completion flag, timestamps. |
| Invoice | UUID, owner ID, required client ID/reference/positive amount in minor units/due date, optional project ID/notes, unpaid or paid status, nullable paid date, timestamps. |

Owner ID is immutable and matches the authenticated user. Same-owner composite
foreign keys prevent cross-account links; a linked invoice's project must belong
to its client. Invoice references are unique per owner/client. Required text is
trimmed and length-limited; use plain text, never executable markup. Account
currency uses its standard minor-unit precision. Dates are date-only except
UTC audit timestamps; paid status requires paid date, unpaid status clears it.
Index owner IDs, relationship keys, and due-date/status filters.

Overdue is derived from unpaid status and due date before account-local today,
not stored. No exchange-rate API, attachment storage, realtime channel, or payment
API is required. Completed milestones/projects leave deadline attention lists.
Reject stale record updates using an expected updated timestamp and offer reload.
Block deletion of linked clients/projects by default; explain dependent records.

Planned export: versioned JSON with every owned entity and relationships, produced
by a read-only transaction through an invoker-rights database RPC under RLS and
downloaded by the browser. It is a portable snapshot, not an auth/service backup.
Self-service re-import is later scope; recovery remains an operator procedure.

## Project folder structure

Existing: SPEC.md, HANDOVER.md, and the docs/ scaffold. No application files exist.

Agreed future structure (D12; directories below have not been created):

```text
src/
  app/                 # routes, authenticated shell, session lifecycle
  features/
    auth/ clients/ projects/ invoices/ today/ settings/
  components/          # shared fields, dialogs, status/error states
  lib/                 # Supabase client, dates, money, validation
  styles/              # shared tokens and responsive layouts
supabase/
  migrations/          # schema, constraints, ownership policies, export RPC
  functions/delete-account/
tests/                 # future application tests within this target project
public/
docs/                  # existing documentation scaffold
```

All paths in this structure are relative to the target project root (the current
workspace's `tests/`), not Cartographer's own skill source. Future test files would
therefore live beneath that target root, not replace this documentation.

## Pages and screens

Planned screen inventory (D14):

- Sign in, sign up/email verification, forgotten/reset password, expired-session state.

- First-run settings: currency and timezone, with explanation of currency lock.

- Today: deadlines and invoice attention; links to source records, add actions.

- Clients: list/search, create/edit/detail with linked projects and invoices.

- Projects: active/completed list, create/edit/detail, milestone management.

- Invoices: unpaid/paid/overdue filters, create/edit/detail, paid/correction action.

- Settings: timezone/currency, export, sign out, confirmed account deletion.

All data screens include loading, empty/first-use, populated, error/retry, and
session-expired states. Forms include field errors, pending save, success, and
stale-write conflict. Destructive actions show scope and cancellation. On phone,
tables become labeled cards and navigation becomes a compact menu.

Desktop Today wireframe:

```text
+----------------------------------------------------------+
| Project tracker                     Account / Settings   |
+-------------+--------------------------------------------+
| Today       | Today                 [+ Project] [+ Invoice]|
| Clients     | Overdue deadlines                          |
| Projects    | Project / milestone    Client    Due date  |
| Invoices    | Due today / next 7 days                    |
| Settings    | Project / milestone    Client    Due date  |
|             | Overdue invoices                           |
|             | Ref     Client     Amount     [Mark paid]  |
+-------------+--------------------------------------------+
```

Project/detail and phone wireframes:

```text
+----------------------------------------------------------+
| < Projects     Website refresh          [Edit] [Complete] |
| Client: Acme       Due: Nov 3                             |
| Milestones                           [+ Milestone]       |
| [ ] Draft              Oct 30                            |
| Invoices                             [+ Invoice]         |
| INV-12     Unpaid      500.00 account currency            |
+----------------------------------------------------------+

+----------------------------+
| Menu   Today      Account  |
| [+ Project] [+ Invoice]    |
| Overdue deadlines          |
| Project / client           |
| Due Oct 26    [Open]       |
| Next 7 days                |
| Project / milestone cards  |
| Overdue invoices           |
| Ref / client / amount      |
| [Mark paid]                |
+----------------------------+
```

These are documentation wireframes only; no website or UI is being built.

## Components and API contracts

Planned component responsibilities (D12–D14): session boundary handles sign-in
and expiry; authenticated shell handles navigation; feature forms validate and
save; Today derives attention groups; money/date utilities enforce common rules;
data adapters handle owner-scoped queries, pagination, and normalized failures.
No feature may rely on hiding a button as an access control.

Planned interfaces (not implemented):

| Operation | Inputs and output | Important failures |
| --- | --- | --- |
| List/get owned records | Session, entity, filters, pagination -> owned rows only | Expired session, network failure; no cross-owner existence disclosure. |
| Create/update records | Validated fields; expected update timestamp for edits -> saved row | Invalid dates/money/links, duplicate reference, stale update; retain input. |
| Mark paid / correct unpaid | Invoice ID, expected update timestamp, target status, paid date if paid -> updated invoice | Ownership denied, stale update, invalid date/state. |
| Delete record | Entity/ID plus explicit UI confirmation -> success after server acknowledgment | Linked-record conflict; no silent cascade of invoices. |
| export_account_data RPC | Authenticated caller; no caller-supplied owner -> versioned JSON snapshot | Missing session or failed transaction; no partial download claimed complete. |
| delete-account Edge Function | Fresh verified user session and explicit confirmation -> completed deletion | Reject invalid/stale auth; owner derived from verified identity, never request body. |

Database RLS governs all normal operations and the invoker-rights export RPC.
The deletion function validates caller identity before privileged work. Delete
owned records transactionally, then remove the auth identity; retry safely if the
second step fails, report pending failure, and avoid claiming deletion completed.
A minimal protected deletion ledger supports operator recovery without retaining
business content. No other custom HTTP application API is planned.

Use Supabase's documented function authentication model; do not assume gateway
key checks establish end-user identity. See [function security](https://supabase.com/docs/guides/functions/auth).

## UI/UX design system

Agreed visual direction (D14): a calm, compact productivity interface with light background
(#F8FAFC), white surfaces, dark text (#0F172A), blue primary actions (#1D4ED8),
and restrained amber/red status accents. Use system sans-serif, 16px base text,
4/8px spacing increments, simple bordered cards, and modest corner rounding.
Keep financial amounts aligned and dates explicit. No custom font service.

Target WCAG 2.2 AA: test contrast, keyboard operation, visible focus, semantic
headings, labeled inputs, accessible error/status announcements, dialog focus
management and return, reduced motion, and usable zoom. Pair color with text/icon
status. Use generous phone controls (target 44px) and avoid essential hover-only
actions. Keep forms single-column on phone and show all financial labels.
Disable duplicate submissions; acknowledge only persisted changes. Connection
loss displays an offline message with retry; there is no offline write queue.

## Authentication, authorization, and data privacy

Agreed: private accounts, hosted Supabase, online-only operation, full record
export, confirmed deletion, and a documented backup/recovery approach. Each
freelancer owns their own data. No shared workspace or client portal initially.

Planned security design (D12/D13): Supabase Auth email/password, email verification,
password reset, sign out, and reauthentication for account deletion. Custom SMTP
is required before real-user email authentication. Restrict auth redirect URLs to
approved app origins; preview sites use test accounts/data and a separate backend.

Enable RLS on every exposed business table. For each operation require authenticated
owner identity; both existing-row and new-row checks apply on updates. Prevent
owner reassignment and cross-owner relationships at database level. Test policies
with two users and no session, through direct API calls. Supabase documents
[owner-based RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Only the project URL and publishable key enter the browser. Privileged keys bypass
RLS and stay server-side; see [API key guidance](https://supabase.com/docs/guides/getting-started/api-keys).
No invoice contents, auth tokens, or contact details in logs/analytics. Render notes
as plain text, apply a restrictive content security policy, clear caches on sign-out,
and do not persist business data in offline storage. Sessions remain subject to
browser security; no third-party tracking scripts are planned.

Confirmed individual record deletion follows dependency checks. Account deletion
requires a scope summary, export opportunity, typed confirmation and fresh login.
Agreed policy: encrypted operator backups retained no longer than 28 days; disclose that
deleted content can persist there until expiry. Keep a minimal deletion ledger for
at least the backup window; reconcile it before restored data serves traffic so
closed accounts are not resurrected. This is an operational requirement, not a
claim that backups or deletion automation already exist.

## Environment variables

Planned names/purposes only; no configuration or secret values exist:

| Name | Location | Purpose |
| --- | --- | --- |
| VITE_SUPABASE_URL | Public browser build | Target Supabase project endpoint. |
| VITE_SUPABASE_PUBLISHABLE_KEY | Public browser build | Public project key; user JWT and RLS enforce access. |
| SUPABASE_URL | Edge Function server config | Supabase endpoint for identity/admin operations. |
| SUPABASE_SECRET_KEY | Edge Function secret store only | Privileged account-deletion operations; never VITE-prefixed or bundled. |
| DATABASE_URL | Protected operator/backup environment only | Direct database connection for migrations and backup/restore. |

Use the deployed runtime's supported credential names when implementing; verify
available Supabase-provided variables before setting custom ones. SMTP host/port,
sender and credentials are configured in Supabase Auth, not the browser. App origin
and auth redirect allowlist are platform configuration; no app origin variable is
needed for the planned browser-only routes. Keep production and test credentials
separate. VITE-prefixed values are public, regardless of naming intent.

## Deployment plan

Agreed: low ongoing costs, a small first version, no fixed launch deadline, online
hosted Supabase. No services, accounts, domains, or deployment have been created.

Planned deployment (D15): Netlify serves Vite static output over HTTPS, with SPA route fallback
and security headers. Supabase provides database/Auth/one deletion Edge Function.
Configure exact auth callback/reset URLs and custom SMTP; pick deployment region
near initial users when provisioning. No region or residency requirement is claimed.
Use a non-production Supabase project for development/previews, separate from real data.

Cost findings checked 2026-10-27 (recheck at provisioning):

- [Supabase pricing](https://supabase.com/pricing): Free has 500 MB database storage,
  inactivity pausing, and no automatic backups. Pro starts at $25/month and includes
  daily backups with seven days retention. This is not a guaranteed total cost.

- [Netlify credit plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/):
  Free is $0 with a hard monthly credit limit (300 at this check); usage exhaustion
  can interrupt availability. Confirm current limits before launch.

- Custom SMTP, domain, off-site backup storage, and usage above included allowances
  may add costs; no provider or spend is authorized by this document.

Agreed delivery approach: use free tiers only for a synthetic-data pilot. Before relying on
this for real business records, choose Supabase Pro plus a monitored backup/restore
process and production SMTP; explicitly review the resulting budget. A free-tier
real-data launch would require accepting pause risk and providing reliable operator
backups. Do not silently assume an always-available, zero-cost service.

Planned recovery: automated encrypted daily off-site database backups, 28-day
retention, access restricted to operator, checked backup failures, and an isolated
restore drill before real-data launch and after material schema changes. Target
maximum data loss: 24 hours; target restoration: one business day, validated in the
drill rather than guaranteed. App JSON export does not replace service/auth backup.
Follow [Supabase backup guidance](https://supabase.com/docs/guides/platform/backups)
and verify included schemas, auth recovery, and encryption before depending on it.

Rollback: redeploy last verified static build. Database changes use additive,
reviewed migrations; take a backup before destructive changes. Restore isolated,
verify relationships/RLS/auth and deletion-ledger reconciliation, then resume traffic.
Monitor availability, auth-email delivery, error rates without business data,
backup age, and quota/cost thresholds. Runtime procedures belong in RUNBOOK.md when
actually established, not as invented working commands here.

[Supabase SMTP guidance](https://supabase.com/docs/guides/auth/auth-smtp) states its
default mail service is not for production; this dependency remains a launch gate.

## Development phases

Priority definitions (D15): P0 = security/data-loss/release blockers; P1 = essential
MVP workflow; P2 = polish and convenience after a working MVP; P3 = later ideas.
All phases below describe future work requiring separate implementation authorization.

| Phase | Priority | Verifiable exit |
| --- | --- | --- |
| Foundation | P0 | Written spec accepted; documentation reflects agreed scope; no application code. |
| Identity and data boundary | P0 | Auth, schema, constraints, and RLS verified with two users and anonymous requests. |
| Core records | P1 | Clients/projects/milestones/invoices persist; validation, paid corrections, date/money boundaries and stale writes verified. |
| Daily attention view | P1 | Agreed deadline and overdue examples pass, including completed projects with unpaid invoices and timezone boundaries. |
| Data ownership and pilot | P0/P1 | Export completeness, safe deletion/retries, isolated restore, auth email, deep links, error and keyboard/phone flows verified on synthetic data. |
| Real-data release gate | P0 | Budget/tier approved, production SMTP and backups operating, recovery drill meets targets, access tests pass; deployment separately authorized. |
| Subsequent improvement | P2/P3 | P2: convenience and visual polish; P3: integrations, partial payments, external reminders or collaboration only after scope review. |

Planned verification: unit coverage for date/money/state rules; database integration
coverage for RLS, relationship/deletion constraints, export and concurrent writes;
browser coverage for core journeys, expired sessions, failures, and responsive
keyboard use. No test framework or command is installed or verified. Choose tooling
when implementation is authorized; record actual commands in TESTING.md then.

### Feature plans

None selected or created. Suggested first substantial plan after foundation acceptance:
“Private account and data boundary” (schema, auth, RLS, cross-owner constraints).
Later candidates: daily attention rules and data export/deletion/recovery. These
are suggestions, not plan files or implementation authorization. Planning conventions
already exist in [docs/plans/PLANS.md](docs/plans/PLANS.md).

## Constraints, risks, and known limitations

Agreed: documentation only now; no application code. Solo users, primary computer,
optional phone use, hosted Supabase web app, online-only; one currency and binary
payment status. Low ongoing costs; no numeric ceiling or fixed launch deadline.

Agreed boundaries and known risks: no realtime synchronization or automatic invoice-source
sync; users maintain records manually. Single currency cannot represent foreign
invoices accurately. Account timezone can change which items are due today; show
it in Settings. Stale writes need explicit conflict handling. Export files contain
sensitive business data and require user-controlled storage. Free-service pausing
and quotas affect availability; production auth email and service backups have costs.
An independent backup system and deletion-ledger reconciliation add operational work.
Neither hosting availability nor recovery targets are guaranteed by this spec.

No statutory record-retention or jurisdictional compliance regime is assumed.
This is an operational tracker, not an accounting system of record; users retain
original invoices outside it. No residency claim is made; requirements that emerge
before real-data launch must be reviewed.

## Open questions and assumptions

No unresolved decision blocks the accepted foundation scope. D1–D15 reflect the
confirmed product/design review; the complete written specification was explicitly
accepted on 2026-10-27. No implementation, services, test commands, or running app exist.

The following remain intentionally unselected operational details, not settled
facts: project name, numerical budget ceiling, launch date, SMTP vendor, domain,
region, package versions, test runner, backup scheduler/storage provider, and exact
runtime credential wiring. Resolve them during authorized feature planning or
implementation at the relevant milestone. They do not alter the agreed MVP.

Real-data release is gated on review of actual tier/vendor costs and budget,
region selection, functioning production SMTP, operating encrypted backups,
deletion/recovery procedures and an isolated restore drill meeting the targets.
The synthetic-data pilot can precede that gate. Source prices/limits are a dated
snapshot and must be rechecked before provisioning. The design is agreed; no
purchase, deployment, provisioning, or other external action is authorized.

Next candidate feature: private account and data boundary. No feature plan is
selected or created. Foundation agent guidance is recorded in AGENTS.md. Feature
selection and planning are the next offered workflow; implementation is excluded.
