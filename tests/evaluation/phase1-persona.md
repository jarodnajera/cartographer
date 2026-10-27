# Phase 1 Persona — freelancer-baseline-v2

Version 2 keeps the product answers unchanged and ends with a setup handoff;
it does not request seeding before application setup. Use the same scenario
version for both revisions being compared.

Evaluator-only material. Do not place this file in the target project or provide
it to the agent being tested. Give only the opening prompt; reveal answers as
questions arise. All persona details are fictional.

## Opening prompt

Replace only the scratch-directory path identically for each run's target:

```text
In <scratch-project-directory>:
Use $cartographer to establish the foundation for this project.
I want to build a tool that helps freelancers track client projects,
deadlines, and unpaid invoices. I'm unsure whether it should be a
local tool or a web app.
Help me clarify the idea and create the project foundation.
Do not implement application code.
```

## Fixed answers

Use the wording below for the matching topic. If options are lettered, select
the option matching this intent and state the answer; letters can differ by run.
If no option matches, provide the fixed answer rather than choosing the nearest.

| Topic | Answer |
| --- | --- |
| Name | Call it Lancealot. |
| Current process/pain | I use a spreadsheet. It has no notifications to follow up on tasks. |
| Audience | A public product for individual freelancers, each with their own private workspace. No teams or client logins initially. |
| Devices/connectivity | Laptop/desktop first; mobile access would be nice. Internet is acceptable; offline use is not required. |
| Initial records | Manual entry of clients, projects, tasks, and existing invoices. No spreadsheet import or external integrations initially. |
| Reminders | Cover task follow-ups, approaching project deadlines, and overdue invoices. Email only the freelancer, plus an in-app list. |
| Reminder timing | One daily digest at a user-chosen local time/timezone. Task follow-up dates are user-set; project warnings start three days before deadline; invoices become overdue the day after their due date. |
| Reminder lifecycle | Outstanding items recur daily. Completed tasks and paid invoices stop their own reminders. Completed/archived projects stop project-deadline reminders, not reminders for unresolved tasks or unpaid invoices. Email can be disabled while keeping the in-app list. |
| Local versus web | After the alternatives comparison, choose a responsive hosted web app. Do not volunteer this selection before it is asked. |
| Release | Free public beta; subscription billing later. Synthetic-data development can happen before real-data readiness. |
| Budget/deadline | Neither is set. Do not assume unlimited spending, free-tier suitability, or a fixed delivery date. |
| Frontend/database | Choose Vue.js with Supabase PostgreSQL. If another stack is proposed, request this change explicitly. |
| Managed services | Choose Supabase Auth, RLS, and Cron/Edge Functions with external email after their alternatives and operating implications are presented. Database selection alone does not approve these services. |
| Authentication | Verified email/password accounts with password recovery and per-user ownership. No shared workspaces. |
| Financial boundary | Track the full invoice as paid/unpaid, with its currency; no partial payments, conversion, invoice generation, or payment collection. |
| Export/deletion | Users should be able to export their records and confirm account deletion. Retention/recovery implementation remains a release-gate decision. |
| Visual/structural details | Recommend simple accessible defaults; exact colors, module names, and low-impact implementation details may change in the feature plan. |
| Operations | Defer specific providers/plans/region, numeric budget, operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds, and capacity limits. They must be resolved before real-data public beta. Do not accept invented numeric policies. |
| Next workflow | Recommend a first feature, but do not create its plan or implement it in this run. |

## Confirmations and unexpected questions

Confirm shared understanding only when the proposal matches these answers.
For written-spec acceptance, say "I accept this written SPEC.md with the stated
operational gates deferred." only when that matches the displayed
draft and commitments summary. If it does not, identify the mismatch and record
an acceptance blocker; do not silently change the persona to accommodate the spec.

If offered framework setup, answer: "Not now. Leave AGENTS.md as a template and
record the setup and later seeding instructions in HANDOVER.md." Baseline ends
at that handoff. Test authorized setup and post-setup seeding separately.

For a consequential options question, explicitly select the matching choice.
For low-impact defaults, accept them as changeable defaults, not fixed requirements.
If asked a factual question outside this fictional context, state that the detail
is unknown; document any scenario gap under the protocol. Do not supply private
contact information, credentials, or actual account data.
