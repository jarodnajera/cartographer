# Handover

Status: Complete — AGENTS.md seeded from the observed application starter.
Last updated: 2026-10-27T15:17:07-07:00 (America/Los_Angeles).

## Objective and scope

Seed tests/test3/AGENTS.md from the scaffolded project using Cartographer's agent
workflow. No application code or configuration changes requested or made. The
session's exclusion of the evaluation folder remains in force; it was not read.

## On resume

Read AGENTS.md and accepted SPEC.md, then inspect current files. Preserve settled
requirements and explicit D15 deferrals; do not restart discovery or treat plans
as implemented behavior.

## Current state

The actual application starter is in lancealot-test/, beneath the documentation
root. It contains Vue 3, Vite, TypeScript, npm scripts/lockfile, installed dependencies,
and a generated welcome screen. AGENTS.md now records these observed paths, commands,
configuration conventions and limitations. Its template placeholders were removed.

Supabase, Router, auth, records, reminders, export/deletion, automated tests/lint and
CI are not configured. The spec's original folder inventory predates this starter;
its architecture describes intended product behavior. Supporting architecture,
testing, runbook and compendium files remain scaffolds. No feature plan exists.
The earlier setup instructions/research are historical guidance, not evidence of
how this externally created starter was generated. Do not regenerate it.

This turn changed AGENTS.md and HANDOVER.md only. Existing starter files, installed
dependencies, lockfile and accepted specification were left untouched. No Git
operations or dependency install were performed; working-tree status was not inspected.

## Accepted scope and deferred decisions

SPEC.md was explicitly accepted on 2026-10-27 with D15 deferrals. The selected product
is a private-workspace freelancer tracker using Vue/Supabase PostgreSQL/Auth/RLS/
Cron/Edge Functions, verified password accounts, manual related records, full
paid/unpaid invoices, daily user-local reminders, export and confirmed deletion.
These features are not implemented by the observed starter.

D15 remains Deferred: frontend/mail providers, service plans/region, numeric budget,
operator/support ownership, backup/retention/recovery targets, delivery/retry thresholds
and capacity limits. Resolve them before real-data public beta. See
[SPEC release gates](SPEC.md#release-gates). No production readiness or purchase is implied.

## Verification

Inspected app manifests/lockfile root metadata, source, Vite/TypeScript configuration,
HTML, README, .gitignore and editor recommendations. Confirmed installed Vite,
vue-tsc and run-p entry points. No build, type check, dev server, dependency install
or application test was run for this documentation-only change.

Read-only `node --version` returned v22.14.0; the app's actual package.json requires
`^22.18.0 || >=24.12.0`. A compatible runtime is needed for later application checks.
This is an observed environment mismatch, not a reported build failure.

After the edits, verified AGENTS/HANDOVER local links, documented scripts/paths
against manifests, removal of agent-template placeholders, and preservation of
application/configuration file contents.

## Next useful action

Select a compatible Node runtime, then validate the existing starter from
lancealot-test/ using `npm run build` when application verification is requested.
AGENTS.md documents the command from configuration, not a successful run.
No application setup rerun is needed merely to seed instructions; seeding is complete.

Candidate first feature: private workspace and manual client/project/task/invoice
records; subsequent candidate: daily digest delivery. Request feature planning using
[PLANS.md](docs/plans/PLANS.md) before complex implementation. No plan or application
implementation is authorized merely by spec acceptance or this seeding request.

## Essential context

Cartographer workflow: ../../skills/cartographer/references/prompts/create-agents.md.
Documentation root and package root differ. The nested folder/package name is
lancealot-test; the product remains Lancealot. Preserve both unless a move/rename
is explicitly part of authorized work.
