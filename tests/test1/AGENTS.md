# Agent Instructions

## Project

This directory is the target project root for a solo freelancer project,
deadline, and unpaid-invoice tracker. It is separate from the parent
Cartographer skill source. Keep project work within this root unless asked otherwise.

The foundation is documentation-only. [SPEC.md](SPEC.md) was explicitly accepted
on 2026-10-27. The planned stack is React/TypeScript/Vite, Netlify, and hosted
Supabase database/Auth. No application code, manifests, migrations, dependencies,
services, or CI configuration exist. Planned paths and interfaces in SPEC.md are
not implemented facts.

## Setup and commands

No development, build, lint, type-check, test, or deployment commands are defined
or verified. Inspect actual configuration before documenting or running project
commands when implementation is separately requested.

## Working conventions

- Current authorization is project foundation documentation only; do not implement
  application code, install packages, provision services, or deploy.
- Preserve the accepted scope and decision map in SPEC.md. Surface material scope
  changes for review instead of silently superseding accepted requirements.
- Keep existing documentation and empty scaffold files. Populate them when useful
  evidence exists; never fabricate implemented architecture or working procedures.
- Keep credentials and secret values out of documentation.

## Project documentation

- [SPEC.md](SPEC.md): accepted product scope, planned design, acceptance criteria,
  priorities, launch gates, and unresolved operational details.
- [HANDOVER.md](HANDOVER.md): current state, verification, and next step.
- [docs/plans/PLANS.md](docs/plans/PLANS.md): feature planning conventions.
- docs/ARCHITECTURE.md, docs/TESTING.md, docs/RUNBOOK.md, and docs/COMPENDIUM.md:
  intentionally empty scaffolds; they do not establish architecture or commands.
- docs/adr/ and docs/research/: reserved locations, currently only .gitkeep files.

## Verification and feature planning

For documentation changes, check relative links, decision/status consistency,
and the distinction between planned and implemented behavior. Application checks
cannot run until tooling and application files exist; do not claim otherwise.

Read docs/plans/PLANS.md before planning a selected substantial feature. No feature
plan is selected or created. Suggested first feature: private account and data
boundary. Plan acceptance does not itself authorize implementation. Review
SPEC.md launch gates before proposing real-data operation or provisioning.
