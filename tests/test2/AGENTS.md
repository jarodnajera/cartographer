# Agent Instructions

## Project and current state

Lancealot is a planned public web product for individual freelancers to track clients, projects, deadlines, tasks, and unpaid invoices with follow-up reminders. [SPEC.md](SPEC.md) is accepted; D12 operational decisions remain explicitly deferred public-beta gates.

This directory currently contains documentation only. There is no application, dependency manifest, database schema, Supabase project configuration, CI, or executable test suite. Planned capabilities and directories in the spec are not implemented behavior.

The accepted stack is Vue 3, Vite, TypeScript, Supabase PostgreSQL/Auth/RLS/Cron/Edge Functions, and external email delivery. Runtime/package versions and provider plans have not been selected or installed.

## Navigation and commands

Work relative to this project directory, separate from Cartographer's skill source and sibling test projects.

- [SPEC.md](SPEC.md): canonical accepted scope, data/contracts, screens, acceptance criteria, milestones, and deferred release gates.
- [HANDOVER.md](HANDOVER.md): current progress, authorization context, verification evidence, and next steps.
- [docs/plans/PLANS.md](docs/plans/PLANS.md): feature-planning conventions; no individual feature plans are selected.
- [docs/research/vue-supabase-fit.md](docs/research/vue-supabase-fit.md): current stack research, sources, and unresolved provider details. The older framework-fit.md is superseded for stack selection.
- docs/ARCHITECTURE.md, docs/TESTING.md, docs/RUNBOOK.md, and docs/COMPENDIUM.md remain scaffolds. docs/adr/ has no decisions recorded yet. Do not treat placeholders as established architecture, procedures, or test results.

No setup, development, build, lint, type-check, test, or deployment commands are established. Inspect actual manifests/configuration when these are introduced; do not invent commands or claim verification without running it.

## Accepted boundaries to preserve

- One private workspace per freelancer; manual entry and paid/unpaid invoices. Billing, teams/client logins, imports, payment collection, partial payments, conversion, attachments, and accounting integrations are outside the first release.
- Daily reminders go only to the freelancer, using their chosen local time/timezone and the agreed task/project/invoice eligibility rules. Keep dashboard and digest eligibility consistent; completed tasks and paid invoices stop generating reminders. Project lifecycle and failure semantics are defined in the spec.
- Browser route guards and owner filters are not access enforcement. Database RLS, grants and relationship constraints must reject anonymous/cross-owner access through direct API calls. Privileged functions require their own authorization and ownership checks.
- Keep secret/service-role/database/email credentials out of Vue bundles and VITE_ configuration. Public Supabase credentials do not replace RLS.
- Reminder processing requires durable delivery claims and safe failure handling. Provider acceptance is not guaranteed inbox delivery; do not blindly retry ambiguous sends.
- D12 gates block real-data public beta. Accepted architecture does not imply selected plans, an operating budget, tested recovery, or production readiness.

## Verification and planning

For documentation changes, check links, decision states, scope consistency, and the distinction between existing and planned files. For future implementation, use SPEC.md acceptance criteria and the project's actual tooling; include direct-API isolation, privileged-function authorization, timezone/DST boundaries, reminder suppression and failure recovery where affected. Populate docs/TESTING.md with real procedures as tooling appears.

Read docs/plans/PLANS.md before creating a complex feature plan. No feature implementation plan is implied by the spec's decision tree or milestones. Resolve routine details within accepted scope; surface material product or scope changes. Document acceptance alone does not authorize implementation, spending, deployment, commits, or publication; follow the user's current task and Git workflow.
