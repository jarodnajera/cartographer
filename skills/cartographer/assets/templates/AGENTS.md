# Agent Instructions

<!--
Scaffold template: project-specific guidance is not populated yet.
Replace placeholders with evidence-backed instructions.
Remove unused sections and these comments when populated.
-->

## Project

<!-- Briefly describe the purpose and current implementation state.
Separate planned capabilities from working functionality. -->

## Setup and commands

<!-- Add prerequisites and actual commands discovered in the project.
State the working directory when it differs from the repository root.
Do not invent commands or imply they were executed. -->

## Code navigation

<!-- List only the paths useful for locating or extending behavior.
Link to docs/ARCHITECTURE.md when it contains substantive guidance. -->

## Working conventions

<!-- Durable project conventions supported by evidence, including error handling
and generated-file rules. Session-specific limits belong in HANDOVER.md. -->

## Verification

<!-- Explain which checks apply to which changes and how to run them.
Link to docs/TESTING.md for detailed procedures. -->

## Project documentation

- SPEC.md — intended behavior, scope, and acceptance criteria.
- HANDOVER.md — current progress, blockers, and next steps.
- docs/ARCHITECTURE.md — implemented system structure.
- docs/adr/ — significant decisions and their rationale.
- docs/plans/PLANS.md — conventions for feature plans.
- docs/plans/ — individual feature plans and their milestones.
- docs/TESTING.md — testing guidance.
- docs/RUNBOOK.md — operational procedures.
- docs/research/ — research notes and sources.
- docs/COMPENDIUM.md — durable project knowledge and references.

Documentation may still contain scaffold placeholders.
Check its status before treating its contents as settled guidance.

## Project-specific pitfalls

<!-- Add durable, actionable findings as they are discovered.
Keep temporary work status in HANDOVER.md. -->

## Feature planning

For complex features or significant refactors, read docs/plans/PLANS.md
before creating or updating a feature plan in docs/plans/. Small, clear
changes may need no separate plan. During authorized implementation, keep
the plan's progress, decisions, and verification evidence current.

Creating or accepting a plan does not itself authorize implementation.
Resolve routine implementation details within the agreed scope; ask the
user about material product or scope changes. Follow the user's Git
workflow rather than treating a plan as permission to commit or publish.
