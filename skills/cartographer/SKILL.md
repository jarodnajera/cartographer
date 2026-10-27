---
name: cartographer
description: Establish a new or existing software project's foundation through guided requirements discovery, documentation scaffolding, project mapping, and feature planning. Use when the user wants to clarify an idea, organize project knowledge, or plan a substantial feature; not for routine implementation or debugging alone.
---

# Cartographer

Help the user establish clear project intent, a trustworthy map of the
current system, and a concrete next step. Core work produces documentation
and plans; recommend development tools when useful rather than automatically
starting implementation.

## Routing

Resolve these links relative to this SKILL.md and supporting links relative
to their containing files, not the target project's working directory.
Read only the resources needed for the request. If a required resource is
missing, report it rather than inventing its contents. Prompt examples and
placeholders are not user answers.

| Request | Workflow and resources |
| --- | --- |
| Establish a foundation, scaffold documentation, or develop SPEC.md | [Spec workflow](references/prompts/create-spec.md), which directs use of the template and bundled grilling |
| Create or improve agent instructions | [Agent workflow](references/prompts/create-agents.md), [AGENTS template](assets/templates/AGENTS.md) |
| Plan a substantial feature | The project's docs/plans/PLANS.md, or the [bundled planning guide](assets/templates/docs/plans/PLANS.md) |
| Research a question or verify external facts | [Research workflow](references/research/SKILL.md) |
| Write or resume a handover | [Handover workflow](references/prompts/create-handover.md), [HANDOVER template](assets/templates/HANDOVER.md) |
| Set up personal preferences | [Optional profile workflow](references/prompts/create-soul.md) |
| Configure project hooks | [Optional hooks workflow](references/prompts/create-hooks.md) |
| Seed memory | [Optional memory workflow](references/prompts/seed-memory.md) |

## Communication

Keep updates focused on findings, decisions, meaningful changes, and the next
useful step. Acknowledge session constraints when needed, then follow them without
repeated compliance announcements. Revisit them only if scope changes or a relevant
limitation needs explanation. Do not narrate or quote internal workflow rules to
justify routine interview or acceptance questions; ask directly. Explain a rule
when the user asks or when it materially affects what can happen next.

## Establish context

Identify the target project separately from Cartographer's source; ask if
ambiguous. Read applicable agent instructions and existing documentation.
Inspect relevant manifests, configuration, entry points, code, and tests;
exclude dependencies, generated output, and secret files.

For existing projects, distinguish implemented behavior from documented
intent and proposals. Preserve working conventions and accepted requirements.
Do not restart settled discovery for a mapping task or a new feature request.
Map observed architecture into docs/ARCHITECTURE.md, durable knowledge into
docs/COMPENDIUM.md, and significant architectural rationale into docs/adr/
when relevant. Keep detailed information in its canonical document and link
from summaries. Do not invent commands or populate documents without evidence.

When conducting research for either phase, explicitly read and follow the
[Research skill](references/research/SKILL.md), including its privacy and
prompt-injection safeguards, before making external requests. Follow its source,
citation, and delegation guidance; ordinary local inspection does not require
loading it. Save research notes under the project's existing convention, normally
docs/research/, and link relevant findings from the spec or feature plan.

## Phase 1: Establish the foundation

Read and follow the spec workflow; it owns the detailed rules for scaffolding,
interview scope, decision tracking, design review, and completion. Use this order:

1. Inspect the project and prepare missing documentation for the requested scope.
2. Clarify intent through the bundled grilling procedure and record findings.
3. Propose the remaining design and confirm shared understanding.
4. Synthesize the complete Draft SPEC.md and obtain written-spec acceptance.
5. For a project with application files/tooling, seed AGENTS.md using the agent
   workflow. Otherwise provide the spec workflow's framework-setup handoff,
   retaining AGENTS.md as a template until application setup is complete.
6. Summarize the foundation, remaining gaps, and candidate next features.

For scaffold-only or focused documentation requests, perform only the relevant
steps. Offer feature selection after the foundation; do not automatically plan
every candidate or begin application development.

## Phase 2: Select and plan a feature

Use the selected feature, or help the user choose based on value, dependencies,
uncertainty, and project priorities. Inspect the relevant spec and implementation.
For unresolved requirements, read [grilling](references/grilling/SKILL.md) and
apply the spec workflow's discovery guidance to this feature only.

Follow the planning guide for scope, milestones, testing/review strategy,
acceptance, and progress. Keep small changes lightweight. Surface material
product-scope changes for a focused spec update rather than silently superseding
accepted requirements. Testing and review are planned here and performed during
later implementation. Honor separate implementation authorization already given;
accepting a document alone does not authorize code changes or external actions.

## Toolbox and continuity

Recommend only tools relevant to the next step, explaining purpose, source,
and dependencies. Do not install or invoke recommended tools automatically.
[TDD](references/tdd/SKILL.md) is optional; read it and its provenance when asked
to use or evaluate it, checking referenced dependencies before claiming readiness.

Use the handover workflow when asked to pause or resume. Report documents changed,
verification actually performed, remaining limitations, and the next useful action.
