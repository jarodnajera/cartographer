# Lancealot handover

Status: In progress — Phase 3 source implemented and locally checked; hosted integration and rendered-browser verification pending.
Last updated: 2026-10-28 (America/Los_Angeles).

## Authority and current outcome

The user approved the HTML prototype and explicitly requested Phase 3, applying frontend-design during implementation. The latest “continue in test4” confirms the working directory; it does not select a live Supabase project, email vendor or paid plan. Work is in lancealot/. No services were provisioned, deployed or configured with real credentials, and no real email/account deletion was performed.

Implemented approved Layout A as a responsive Vue ledger with account/signup/recovery forms, clients/projects, project-linked task/invoice editing, reversible statuses, guarded deletion, Today, digest preferences, exact-decimal JSON export and password-confirmed account deletion. An explicitly chosen fictional sample workspace works without credentials and resets on reload. Sample deletion clearly reports a simulation.

The local development server is available at http://127.0.0.1:5173/ (session 67538 at handover). Choose “Explore sample workspace.” If it has stopped, use the Node version in lancealot/.nvmrc and run npm run dev from lancealot/.

## Source and active plans

- [Accounts/project tracking](docs/plans/private-accounts-project-tracking.md): In progress. Verified-session gateway pins each request to its captured identity; migrations enforce ownership, active-account checks, revisions, protected relationships and invoice reference/precision rules.
- [Today/daily digest](docs/plans/today-daily-digest.md): In progress. Live eligibility and digest selection share SQL; persistent daily jobs use fenced claims, bounded same-day known-failure retries and no blind resend after unknown acceptance. DST, future-setting floors and no-backlog rules are covered locally.
- [Export/account deletion](docs/plans/export-account-deletion.md): In progress. Consistent JSON export, verified password proof, immediate account lock and bounded cleanup/recovery jobs are implemented. Pending cleanup is never presented as completed erasure.

[ARCHITECTURE.md](docs/ARCHITECTURE.md) maps modules and trust boundaries. [TESTING.md](docs/TESTING.md) distinguishes embedded tests from live/browser checks. [RUNBOOK.md](docs/RUNBOOK.md) records proposed setup, server-only secret destinations, gate activation and recovery. [DESIGN.md](docs/DESIGN.md) and [prototype notes](docs/prototypes/README.md) record approval and implementation refinements. [GLOSSARY.md](docs/GLOSSARY.md) maps agreed terms to observed identifiers.

## Verification evidence

Run from lancealot/ using Node 24.22.1 (the default npm environment can select an unsupported older Node):

- Vitest 5.0.5: 6 suites, 32 tests passed. Covers exact money/sample behavior, identity-pinned gateway, Vue surfaces in Happy DOM, password-confirmed deletion handler, job/email coordinator and actual migrations in embedded PostgreSQL 18.6 through PGlite. Test configuration forces blank public connection settings; no remote services are contacted. A synthetic pre-existing connection-env check also passed.
- npm run build: passed, including vue-tsc and Vite production bundling.
- Local Vite HTTP response checked successfully. This proves serving, not visual correctness.

PGlite uses an Auth role/uid shim: these tests do not establish hosted JWT/Auth behavior or real concurrent service execution. Happy DOM stubs native dialogs: it does not establish browser focus, responsive layout or accessibility. Browser discovery returned no connected instances, so no rendered screenshots or browser verification are claimed. Authored Playwright flows and six pgTAP checks have not run. The Deno entry points have not been deployed or runtime-verified; shared pure handlers are covered by Vitest.

## Next work and unresolved gates

Review the local UI/source, then validate the deployment-dependent boundaries using an explicitly selected test project. Follow RUNBOOK.md; confirm setup stages before creating/executing a setup wizard. Recheck hosted Auth/signup/recovery, RLS/JWT/grants, deletion/dispatch races, Edge runtime, Cron scheduling and provider outcomes. Run authored pgTAP and real-browser desktop/mobile/native-dialog flows. Fix observed issues before marking the plans Complete.

Digest delivery and account erasure readiness gates default off. The optional Resend adapter is source only, enabled only by explicit provider configuration plus the database gate; its existence is not vendor selection. Cron is not registered. Never put service/email/worker secrets in VITE variables or conversation text.

D8 budget/date remain unset. D18 still requires vendor/plan cost and limits, region, retention and restore-erasure policy, recovery/cleanup operating configuration and a named maintenance/support owner before real-data/public use. No public-readiness or delivery/erasure SLA is established.

## Continuity

Append user-authored messages (including IDE context) and visible assistant commentary/final replies verbatim to [CONVERSATION.md](CONVERSATION.md), excluding tool traffic and private reasoning. Preserve unrelated repository work. No subagents, commits or pushes were used. Cartographer, frontend-design, writing-for-agents and research guidance informed this implementation; the setup wizard guidance was inspected but not executed.
