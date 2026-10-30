# Lancealot Glossary

Shared domain vocabulary from the accepted [SPEC.md](../SPEC.md) and [feature plans](../SPEC.md#feature-plans). Lancealot helps individual freelancers track client work and follow-ups.

## Terms

**Freelancer**:
The individual who owns a private workspace and receives its reminder emails; a client does not log in.

**Private workspace**:
The records and reminder preferences belonging to one freelancer. It is not shared with a team, another freelancer or a client.
_In code_: `lancealot/src/accounts/types.ts` (`Workspace`); prepared `public.workspaces` in the account migration (unapplied).

**Client**:
The customer associated with a freelancer's projects and invoices; a client is a tracked record rather than an account with access.

**Project**:
Client work containing tasks and optionally a project deadline. An invoice can be associated with a project but need not be.

**Task**:
An item of work within a project, with an open/completed state and a user-set follow-up date when a reminder is needed.

**Follow-up date**:
The freelancer-selected calendar date on which an open task becomes eligible for reminders. It is evaluated in the freelancer's selected timezone.

**Project deadline**:
The calendar date used for project-deadline warnings. Warnings start three days before it and continue after it until the project is completed or archived.

**Completed task**:
A task marked finished; it no longer produces its own follow-up reminder. Reopening it restores its own eligibility without changing other records.

**Completed project**:
A project marked finished; its project-deadline reminders stop while unresolved tasks and unpaid invoices retain theirs. Reopening it changes only that project’s lifecycle.

**Archived record**:
A client or project retained for history rather than deleted, with restoration available. Client archival does not alter child states or reminders; project archival stops only that project’s deadline warnings, and separate task/invoice archive controls are deferred.

**Invoice**:
A manually entered record of an existing client invoice, including its currency and full paid/unpaid status. It can optionally belong to a project; Lancealot does not generate invoices or collect payment initially.

**Paid invoice**:
An invoice marked paid in full, which stops its own reminders. The freelancer can mark it unpaid again to correct a mistake.

**Unpaid invoice**:
An invoice not marked paid in full; partial-payment tracking is outside the first release. Being unpaid alone does not mean it is overdue.

**Invoice due date**:
The calendar date through which an unpaid invoice is not yet overdue, evaluated in the freelancer's selected timezone.

**Overdue invoice**:
An unpaid invoice whose due date has passed; it becomes overdue the day after its due date. It remains eligible for daily reminders until marked paid.

**Reminder**:
An eligible task follow-up, project-deadline warning or overdue invoice. Outstanding eligible items recur daily under their own completion and suppression rules.

**In-app reminder list**:
The live list of currently eligible reminders in the freelancer's workspace. It remains available when reminder email is disabled.

**Daily digest**:
The optional email grouping eligible reminders only for the freelancer at their chosen local time/timezone, with one intended digest per local day. After an empty scheduled evaluation, newly eligible items appear in the In-app reminder list immediately and wait for the next routine digest, except an agreed Same-day catch-up.

**Same-day catch-up**:
One digest within the applicable local day after an outage, or when a permitted Digest schedule change makes the chosen time already past before submission. It does not create an older-day backlog or a second digest after one was already submitted that local day.

**Workspace export**:
A versioned JSON download of the freelancer’s records and relationships, amounts, currencies, statuses, dates and reminder preferences, including archived work. It excludes other freelancers’ data, credentials and operational delivery records; export does not imply import/restore support.

**Account/data deletion**:
The irreversible removal flow for a freelancer’s account and workspace data after fresh password verification and explicit confirmation, rather than archival. Accepted Deletion requests block access and new reminder dispatch while Deletion cleanup resumes; active-data and backup timing remain subject to policies deferred before real-data public beta.

**Private-test allowlist**:
The approved email addresses permitted to register during private testing. It does not create shared-workspace invitations or client access.
_In code_: prepared `private.signup_allowlist` and signup restrictions in `lancealot/supabase/migrations/202610300001_private_accounts.sql` (not live-verified).

**Project restoration**:
Returning an archived project to its previous lifecycle state. Restoring a previously completed project does not automatically reopen it or change its tasks or invoices.

**Reopening**:
Returning a completed task or project to its open/active state so its own reminder eligibility is evaluated again. It does not change other records automatically.

**Reminder email opt-in**:
Explicitly enabling email after confirming a timezone and choosing a digest time. Disabling email leaves the In-app reminder list available.

**Digest schedule change**:
Changing the chosen digest time/timezone without discarding submission history. After submission the change applies from the next local day; before submission a newly passed chosen time can qualify for Same-day catch-up.

**Invoice association**:
An invoice’s client and optional project, where the project must belong to that same client. A project’s client cannot be reassigned while linked invoices would become inconsistent; associations must be explicitly corrected first.

**Deletion request**:
The password-verified, explicitly confirmed and irreversible instruction to remove the account and workspace. Acceptance stops access and new reminder dispatch but is not a claim that cleanup or backup expiry has finished; emails already being sent may still arrive.

**Deletion cleanup**:
Removing account/workspace data after an accepted Deletion request, with interrupted work resumable. Incomplete cleanup does not reactivate access or reminders, and completion of active-data removal does not establish backup expiry.
