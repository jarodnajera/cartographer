# Handover

Status: Complete — project foundation accepted; application unimplemented.

## On resume

Read [AGENTS.md](AGENTS.md) and [SPEC.md](SPEC.md), then inspect current files.
This snapshot describes the foundation handoff, not evidence of a working app.
Keep this file and refresh it when later work changes the project state.

## Objective and scope

Clarify and establish a documentation foundation for a tool helping solo
freelancers track client projects, deadlines, and unpaid invoices. The user
explicitly excluded application implementation. Target project root is this
directory, the parent workspace's tests/; Cartographer's source is outside it.

## Current state

### Complete

- Discovery and design review completed; user separately accepted the complete
  written SPEC.md on 2026-10-27. All 15 material decisions are Agreed.
- SPEC.md marked Accepted; scope, workflows, acceptance criteria, stack rationale,
  data/security, screens/wireframes, delivery costs/risks and milestones recorded.
- AGENTS.md created from actual project state after written acceptance.
- Documentation scaffold created and existing content preserved. Planning
  conventions are in docs/plans/PLANS.md. No individual feature plans exist.
- docs/ARCHITECTURE.md, docs/TESTING.md, docs/RUNBOOK.md and docs/COMPENDIUM.md remain
  intentionally empty; no implemented architecture, commands, or operations exist.
  ADR/research directories contain only .gitkeep files.

### In progress

None within the requested foundation scope. No application work started.

### Blocked or broken

No known foundation blocker. Future real-data launch has explicit prerequisites
in SPEC.md; these do not prevent the documentation foundation being complete.

### Working tree

The target was empty at first inspection. All 11 current files were created
through this foundation workflow. Git status at initial inspection reported
that the workspace was not a Git repository; no branch/commit is available.
No commits, package installs, services, or deployments were performed.

## Verification

After final SPEC.md and AGENTS.md changes, inline Python checks from the parent
workspace verified Accepted status, all 15 Agreed decision entries, local links
and internal anchors, the expected 11-file documentation-only inventory, and
preservation of the four empty documentation scaffolds. All passed.

Earlier complete-Draft checks verified substantive section coverage and no
remaining template comments. Official documentation was consulted for service
capabilities, security, pricing and SMTP requirements; dated sources are linked
in SPEC.md. Recheck service limits/costs before provisioning.

No application tests, builds, database-policy tests, accessibility checks, or
restore drills ran: application code and test tooling do not exist. Specified
acceptance criteria and operational targets are future verification requirements.
This handover's links and final file inventory are checked after writing it.

## Decisions and open questions

Canonical decisions and their dependencies are in
[SPEC.md](SPEC.md#design-decisions-and-dependencies). The accepted direction is an
online responsive web app using hosted Supabase and private accounts, with
manual tracking, one currency and full paid/unpaid states, export, deletion and
recovery requirements. Planned frontend: React/TypeScript/Vite on Netlify.
These are design decisions, not provisioned or implemented components.

No question blocks the foundation. Names/vendors, numeric budget, region,
package/test tooling choices, production SMTP, backup implementation and actual
recovery readiness remain explicit operational details or release gates in
[SPEC.md](SPEC.md#open-questions-and-assumptions). Acceptance authorizes no spending,
provisioning, deployment, or implementation.

## Next steps

1. Ask the user to select a feature to plan. Recommended first candidate:
   private account and data boundary (schema, auth, RLS, ownership constraints).
2. Once selected, follow [docs/plans/PLANS.md](docs/plans/PLANS.md) to create a
   focused Draft plan tied to relevant spec decisions and observable tests.
3. Review the written plan. Begin implementation only after a separate request
   authorizes it; retain the accepted product boundaries and launch gates.

## Essential context

No development command exists. Do not invent commands from the planned stack.
SPEC.md folder structures and APIs describe future files, not working components.
Service free tiers have availability/backup limits; real-data use requires the
recorded budget, production mail and recovery checks. No processes or temporary
resources are required to resume this project. Original invoices remain outside
the tracker; it is not an accounting system of record.
