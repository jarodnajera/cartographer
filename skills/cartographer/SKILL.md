---
name: cartographer
description: Establish a new or existing software project's foundation through guided requirements discovery, documentation scaffolding, project mapping, and feature planning. Use when the user wants to clarify an idea, organize project knowledge, or plan a substantial feature; not for routine implementation or debugging alone.
---

# Cartographer

Help the user establish clear project intent, a trustworthy map of the
current system, and a concrete next step. Core work ends with a reviewed
foundation or feature plan; recommend development tools when useful rather
than automatically starting implementation.

## Resource locations and routing

Resolve all links below relative to this SKILL.md, not the target project's
working directory. [Prompts](references/prompts/) and
[templates](assets/templates/) are bundled inside this skill folder.
Distribute or install the complete cartographer folder, preserving its
subdirectories; the repository's root-level files are not required at runtime.
Links inside supporting documents resolve relative to those documents.
If a required resource is missing, report its path and recover an available
source location or ask for it instead of inventing its contents.

Read only the resources relevant to the current request:

| Request | Resources |
| --- | --- |
| Create or refine the project spec | [Spec workflow](references/prompts/create-spec.md), [SPEC template](assets/templates/SPEC.md), [grilling](references/grilling/SKILL.md) |
| Populate agent instructions | [Agent workflow](references/prompts/create-agents.md), [AGENTS template](assets/templates/AGENTS.md) |
| Plan a substantial feature | [Planning guide](assets/templates/docs/plans/PLANS.md); grilling when requirements need clarification |
| Write or resume a handover | [Handover workflow](references/prompts/create-handover.md), [HANDOVER template](assets/templates/HANDOVER.md) |
| Set up personal collaboration preferences | [Optional profile workflow](references/prompts/create-soul.md) |
| Configure project hooks | [Optional hooks workflow](references/prompts/create-hooks.md) |
| Seed memory | [Optional memory workflow](references/prompts/seed-memory.md) |

Prompt files are workflow guidance. Treat their example inputs and
placeholders as examples, not user answers. Do not run every workflow.

## Establish context

Identify the target project from the request and environment. Keep it
separate from Cartographer's own source; ask if the target is ambiguous.
Read applicable agent instructions and relevant existing documentation.
Inspect manifests, configuration, entry points, representative code, and
tests as needed; exclude dependencies, generated output, and secret files.

For a new project, clarify the idea and constraints. Ask for a project name;
if undecided, use a clearly labeled working title and revisit it later without
blocking discovery. Preserve an existing name unless a rename is requested.
Ask about the current process and a concrete pain point or personal motivation,
using the answer to ground intended outcomes rather than inventing a backstory.
For an existing project, first identify implemented behavior, documented intent,
and discrepancies.
Preserve working conventions and accepted requirements. Ask the user about
product decisions and preferences; investigate discoverable facts directly.
Do not restart a settled specification merely because a new feature is requested.

## Phase 1: Establish the foundation

### Scaffold when requested

Create missing project documentation using the matching templates:

- Root initially: SPEC.md and HANDOVER.md.
- AGENTS.md: for a new project, create and populate it after explicit
  acceptance of the complete written spec, unless the user requests it
  earlier. Always read and preserve any existing agent instructions.
- docs/: ARCHITECTURE.md, TESTING.md, RUNBOOK.md, COMPENDIUM.md.
- docs/plans/: PLANS.md and .gitkeep.
- docs/adr/ and docs/research/: .gitkeep.

Create files exclusively and preserve existing files, including empty ones.
Report conflicts rather than writing through symlinks or incompatible paths.
When document population is requested, read existing content first and make
focused updates instead of replacing it with a template.

Copy templates as provided. Empty templates stay empty until useful evidence
is available; populated scaffold creation does not settle requirements.
Exclude assets/templates/optional/ and hook configuration from the default scaffold.
There is currently no bundled CLI implementation; do not invent a command.

### Clarify and document

For specification work, explicitly read the spec workflow, SPEC template,
and bundled grilling instructions. Use grilling's dependency-aware rounds
and preserve a compact decision map in SPEC.md as directed by that workflow.
Move from product scope through data/security, technical design, screens/design,
and delivery coverage, respecting actual decision dependencies. Once the core
product choices are settled, propose a coherent design for the remaining
sections instead of interviewing the user about every implementation detail.
Keep the design proportional to the agreed first release. Explicitly surface
recommendations that introduce recurring costs, ongoing operator responsibilities,
or substantial new subsystems. Distinguish first-release requirements from later
release gates, and obtain agreement on consequential commitments rather than
burying them in a long spec.
Update the substantive spec sections after each round; the decision map indexes
those outcomes rather than replacing them. Before complete-draft review, each
section needs useful content, an explicit unresolved item with its impact, or
a justified not-applicable statement. Do not leave unexplained empty headings.
Use sub-agents only when available and permitted; otherwise research directly.
Wait for user decisions rather than accepting recommendations on their behalf.

Confirm shared understanding before synthesizing the complete Draft spec.
Keep written-spec acceptance separate from that interview confirmation and
mark the spec Accepted only after explicit acceptance of the document.
If the user pauses, preserve an incomplete Draft and its next frontier.

For a new project, populate AGENTS.md after written-spec acceptance using
its workflow, unless the user explicitly requests earlier creation. Keep
planned stack and structure distinct from implemented facts; do not invent
commands. Existing projects may have their instructions inspected and updated
when requested without restarting spec acceptance. When mapping existing
systems, document implemented architecture and verified project commands;
label proposed changes separately. Link detailed findings to their canonical
documents rather than duplicating them across the spec and project map.
Keep durable knowledge in COMPENDIUM.md, significant architectural rationale
in ADRs, and temporary work state in HANDOVER.md when those updates are relevant.

Do not force every document to be populated. A new project may have no
implemented architecture, test commands, or operational procedures yet.
State what remains unknown without fabricating content to complete a checklist.

### Foundation handoff

Review for contradictory requirements, unresolved dependencies, broken links,
and claims unsupported by project evidence. Summarize agreed scope, document
status, open questions, and candidate first features. The foundation is ready
for its agreed scope when the user has accepted the written spec and has
clear goals, acceptance criteria, constraints, and a concrete next step.
Document gaps may remain if they are explicit and do not block that scope.

Offer feature selection as the next workflow; do not automatically create
plans for every idea or begin application development.

## Phase 2: Select and plan a feature

Use an explicitly selected feature, or help the user choose one based on
value, dependencies, uncertainty, and project priorities. Inspect relevant
spec decisions and current implementation. Use grilling to resolve material
feature requirements when necessary; do not repeat the entire project interview.

Follow the target project's docs/plans/PLANS.md if present; otherwise use
the bundled planning guide. For substantial work, create or update
`docs/plans/<feature-name>.md` with Draft status. Include scope, observable acceptance,
affected components, milestones, dependencies, testing strategy, and review
criteria. Include rollout and recovery when relevant. Keep small changes
lightweight rather than requiring a separate file.

Review the plan for gaps and obtain explicit acceptance of its written scope
and approach. Propose focused SPEC.md updates for changed product scope;
never silently treat a feature plan as superseding accepted requirements.

Testing and review are planned here and performed throughout later
implementation. Acceptance of a spec or plan alone does not authorize code
changes, commits, deployment, or publication. Honor any separate implementation
request already given; do not add a redundant permission gate.

## Development toolbox and continuity

At handoff, recommend only tools relevant to the chosen work. Explain their
purpose, source, and dependencies; do not install or invoke them automatically.
[TDD](references/tdd/SKILL.md) is an optional development reference, not a
foundation prerequisite. Read it and its provenance only when the user asks
to use or evaluate it; check referenced dependencies before claiming readiness.

Use the handover workflow when asked to pause or resume. On completion,
report the documents created or updated, verification actually performed,
remaining limitations, and the next useful action. Keep development results
and evolving project documentation aligned when later updates are requested.
