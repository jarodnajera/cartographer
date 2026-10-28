# Lancealot Glossary

Domain vocabulary from the [accepted specification](../SPEC.md) and agreed refinements in the [feature plans](plans/PLANS.md). Definitions describe agreed domain behavior; code mappings below identify implemented source, not completed hosted-service verification.

## Terms

**Workspace**:
The private records and settings owned by one freelancer. A workspace is never shared with another freelancer, a team, or a client in the first release.
_In code_: `lancealot/src/lib/types.ts` (`Snapshot`); `lancealot/supabase/migrations/202610280001_workspace.sql` (`public.accounts`).


**Client**:
The party a freelancer does work for, recorded within their workspace. Each project belongs to a client; clients do not sign in to Lancealot.
_In code_: `lancealot/src/lib/types.ts` (`Client`); `public.clients` in `202610280001_workspace.sql`.


**Project**:
A client-linked unit of work containing tasks and invoices. A project may have a deadline and be active, completed, or archived.
_In code_: `lancealot/src/lib/types.ts` (`Project`, `ProjectStatus`); `public.projects` in `202610280001_workspace.sql`.


**Task**:
A project-linked item of work with a completion state and an optional follow-up date. An unresolved task can continue producing follow-up reminders after its project is completed or archived.
_In code_: `lancealot/src/lib/types.ts` (`Task`); `public.tasks` in `202610280001_workspace.sql`.


**Follow-up date**:
A calendar date chosen by the freelancer for a task. The unresolved task appears in the attention list and enabled daily digest on that date and subsequent days until completed, rescheduled, or explicitly deleted; an unset date produces no follow-up reminder.
_In code_: `Task.followup_date`; `private.attention_for` in `lancealot/supabase/migrations/202610280003_jobs.sql`.


**Project deadline**:
An optional calendar date for finishing a project. An unfinished, unarchived project produces deadline reminders starting three calendar days before this date and continues while outstanding.
_In code_: `Project.deadline`; `private.attention_for` in `202610280003_jobs.sql`.


**Approaching project deadline**:
A project deadline that has entered the warning window beginning three calendar days before its date. Passing the deadline does not stop its reminder; completing or archiving the project does.

**Completed task**:
A task marked finished by the freelancer. Its own follow-up reminders stop; reopening it makes eligibility follow its current follow-up date.
_In code_: `Task.completed`; `save_record` in `202610280001_workspace.sql`.


**Completed project**:
A project marked finished by the freelancer. Project-deadline reminders stop, while unresolved task follow-ups and unpaid invoice reminders continue according to their own dates; the project can be reopened.
_In code_: `Project.status`; `private.attention_for` in `202610280003_jobs.sql`.


**Archived project**:
A project set aside using the archive state without deleting its linked records. Its project-deadline reminders stop, while unresolved task follow-ups and unpaid invoice reminders continue according to their own dates; the project can be reactivated and its child records remain editable.
_In code_: `Project.status`; `lancealot/src/views/ProjectView.vue`.


**Invoice**:
A project-linked record of an invoice tracked in Lancealot, including its positive amount, currency, due date, and paid/unpaid status. References are unique per client within the workspace; Lancealot does not generate invoices or collect payments in the first release.
_In code_: `lancealot/src/lib/types.ts` (`Invoice`); `public.invoices` in `202610280001_workspace.sql`.


**Unpaid invoice**:
An invoice whose full amount has not been marked paid. Partial payments are not tracked, and unpaid alone does not mean overdue.
_In code_: `Invoice.paid`; `private.attention_for` in `202610280003_jobs.sql`.


**Paid invoice**:
An invoice whose full amount has been marked paid. Its own overdue reminders stop; an incorrect paid status can be corrected to unpaid, making eligibility follow its due date again.
_In code_: `Invoice.paid`; `lancealot/src/views/ProjectView.vue`.


**Overdue invoice**:
An unpaid invoice on a calendar date after its due date, beginning the following day. It remains in the attention list and enabled daily digest until paid or explicitly deleted, including when its project is completed or archived.
_In code_: `private.attention_for` in `202610280003_jobs.sql`; `lancealot/src/views/TodayView.vue`.


**Attention list**:
The in-app view of outstanding task follow-ups, project-deadline reminders, and overdue invoices, shown on Today. It remains available when email is disabled and does not depend on successful digest delivery.
_In code_: `Attention` in `lancealot/src/lib/types.ts`; `private.attention_for`; `lancealot/src/views/TodayView.vue`.


**Daily digest**:
One scheduled email to the owning freelancer listing outstanding item names, client/project labels, invoice references, relevant dates and links at their chosen local time and timezone; monetary amounts remain in the app. Outstanding items recur daily, empty digests are skipped, and missed historical digests are not sent in a burst.
_In code_: `private.digest_jobs` in `202610280003_jobs.sql`; `runJobs`/`digestContent` in `lancealot/supabase/functions/_shared/jobs.ts`.


**Email opt-out**:
Disabling daily digest email while keeping the attention list available; email starts disabled and enabling it requires a chosen local time and confirmed timezone. This setting controls reminders, rather than changing account verification or password recovery requirements.
_In code_: `Settings.email_enabled`; `public.save_settings`; `lancealot/src/views/SettingsView.vue`.


**Account deletion**:
An action requiring password reauthentication and explicit confirmation that revokes access, stops future reminders, and removes active records owned by the freelancer. After deletion starts it cannot be undone; partial cleanup failures remain locked while cleanup retries, and backup retention/restore-erasure handling must be settled before real-data/public launch.
_In code_: `createDeletionHandler` in `lancealot/supabase/functions/_shared/deletion.ts`; `begin_account_deletion`/`private.deletion_jobs` in `202610280003_jobs.sql`.


**Record deletion**:
Explicitly confirmed permanent removal of an individual task or invoice, including its eligibility for future reminders. Clients/projects with linked records cannot be deleted through this action.
_In code_: `public.delete_record` in `202610280001_workspace.sql`; `lancealot/src/components/DeleteRecord.vue`.


**Unknown digest outcome**:
An email attempt for which the provider may have accepted the digest but acceptance could not be confirmed. Without verified safe retry or reconciliation, Lancealot avoids a blind resend and resumes normal eligible reminders the next day.
_In code_: `private.digest_jobs.state` and `public.finish_digest` in `202610280003_jobs.sql`; `runJobs` in `_shared/jobs.ts`.


**Invoice currency**:
The current or historical ISO currency code recorded with an invoice and its applicable amount precision. A historical code remains attached to the invoice without automatic conversion or replacement by a successor currency.
_In code_: `Invoice.currency`/`currency_digits`; `lancealot/src/data/currencies.json`; `public.currencies`.
