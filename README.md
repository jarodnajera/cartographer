# Cartographer

A skill for turning a new idea or existing software project into an accepted
specification, focused feature plans, and an iterative build/review workflow.
Cartographer supplies prompts, documentation templates, and phase routing for
coding agents; there is no standalone scaffolding CLI yet.

## Get started

From a local checkout, install Cartographer through the
[skills CLI](https://github.com/vercel-labs/skills#install-a-skill):

```sh
npx skills@latest add ./skills/cartographer
```

Choose your agent and installation scope. For use across projects, choose global
scope (or add -g). Install the required companion below, then start in your target
project with:

```text
Use $cartographer to establish the foundation for this project.
My idea is: [describe the problem and intended users].
Help me clarify it and create the project foundation.
Do not implement application code yet.
```

Use your agent's skill-invocation syntax if it differs. For an existing project,
ask Cartographer to map the codebase and identify documentation/planning gaps.
Foundation discovery preserves existing files and settled requirements.

## Workflow

| Phase | Outcome |
| --- | --- |
| 1 — Foundation | Documentation scaffold, accepted SPEC.md, seeded domain glossary, ADR assessment, and setup handoff |
| 2a — Feature planning | Bounded scope, agreed test seams, milestones, verification strategy and review points |
| 2b — Design | Selected structure and rendered visual direction, DESIGN.md and approved styled preview; skipped for non-UI work |
| 3 — Implementation | Authorized milestone delivery, relevant tests, maintained documentation and a concrete review handoff |
| 4a — Review | Hands-on feedback, separate Standards/Spec assessments, diagnosis and proposed remediation |
| 4b — Remediation | Authorized fixes, re-verification and user re-checks until explicit acceptance |

After acceptance, return to Phase 2a for the next selected feature. Document
acceptance and tool permission are separate; neither authorizes deployment or
spending by itself. Keep multiple features reviewable rather than implementing
all plans in one uninterrupted pass unless requested.

## Install companion skills

Use the interactive installer rather than also installing duplicate marketplace
copies:

```sh
npx skills@latest add mattpocock/skills
```

| Role | Skills |
| --- | --- |
| Required for interviews | grilling |
| Recommended for domain clarification in Phases 1/2 | domain-modeling |
| Recommended for Phase 2 interfaces and test seams | codebase-design |
| Recommended for Phase 2 structure/logic exploration | prototype |
| Phase 3/4b behavior suited to test-first work | tdd |
| Agent-facing documentation | writing-for-agents |
| Phase 4 review and diagnosis | code-review, diagnosing-bugs |
| Human-only setup when needed | wizard |

For Phase 2b appearance and Phase 3 UI implementation, install Anthropic's separate
[frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design):

```sh
npx skills@latest add anthropics/skills
```

Select frontend-design in that installer. Availability is checked when a skill is
needed; Cartographer does not claim to use a missing skill. Its bundled research
workflow and [domain integration rules](skills/cartographer/references/domain-guidance.md)
retain project paths and acceptance timing when companion conventions differ.
See [dependencies and compatibility](skills/cartographer/references/dependencies.md)
for prerequisites, sources and evidence limits.

## Browser prerequisite

Visual critique and parity checks require a working permitted real browser.
Check local-page navigation and screenshot capture before Phase 2b preview work.
Playwright/Chromium is one option; use the environment's supported browser tools.
Having web search or an installed browser alone does not establish agent browser
control. Installation is not automatic; unavailable checks remain explicit gaps.

## Documentation

Templates live in [assets/templates](skills/cartographer/assets/templates/).
SPEC.md owns product intent; docs/GLOSSARY.md owns accepted domain terms;
docs/plans/PLANS.md defines plan conventions. ARCHITECTURE.md, TESTING.md and
RUNBOOK.md describe implemented facts as evidence becomes available. DESIGN.md
is established for substantial UI work in Phase 2b. AGENTS.md starts as a template
and is seeded after application tooling exists. HANDOVER.md records session state.
Personal profiles, memory seeding and hooks are optional workflows.

## Evaluation and limitations

[Test4](tests/test4/README.md) exercised a broad foundation-to-implementation run.
[Test5](tests/test5/README.md) exercised explicit visual choices, smaller delivery
slices, ADRs, Standards/Spec review and a scoped browser-checked correction with
user acceptance. Its full feature is still In progress; configured backend checks
remain deferred, and screenshot checks cover selected account states only.

These are qualitative examples, not controlled comparisons or guarantees across
agents/projects. Published transcripts are redacted and omit tool events; early
exchanges were captured retrospectively. Lockfiles record some skill sources and
hashes, not complete reproducible environments. Full bug reproduction/test-first
remediation, complete visual parity, live-service setup, and the final full-feature
acceptance-to-next-feature transition still need broader evidence.

Use the [evaluation protocol](tests/evaluation/README.md) and
[visual review checks](tests/evaluation/phase2b-visual-review.md) for future runs.
Existing example apps remain as inspectable evidence; new runs belong in scratch
projects or separate app repositories. No v1 tag or release is created by this
preparation.

## Attribution

Companion skills are maintained by [Matt Pocock](https://github.com/mattpocock/skills)
and [Anthropic](https://github.com/anthropics/skills). Bundled glossary format
[provenance and license](skills/cartographer/references/glossary/UPSTREAM.md)
are retained. Earlier bundled grilling tests used upstream revision
95249b0b49782349740fd9b8c6ce32b4e59e497a; installed updates require fresh evaluation.
