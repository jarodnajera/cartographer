# Feature Planning Guide

This file defines how to create and maintain feature execution plans.
It is not an individual plan or a record of work already authorized.
An execution plan (also called an ExecPlan here) explains how an agreed
change will be implemented and verified.

## When to use a plan

Use a separate plan for complex features, significant refactors, migrations,
or work that benefits from milestones and continuity across sessions.
Small, clear changes may need only the user request and appropriate checks.
Scale detail to the uncertainty and impact of the work.

Codex Plan mode can help investigate and propose an approach. When a
persistent plan is requested, capture the result using this guide. These
file conventions also work with other agents and human contributors.

## Choose the plan size

Use the smallest tier that makes the work executable and reviewable. Word ranges
are editing budgets, not minimums or reasons to omit critical requirements:

- **Light**: aim for 300–600 words for one bounded outcome with familiar interfaces
  and low uncertainty. Combine scope/context, a short sequence with a review point,
  acceptance checks, and progress. Skip unused sections.
- **Standard**: aim for 600–1,200 words when cross-cutting behavior, migrations or
  material uncertainty need milestones, failure cases and rollout/recovery detail.
  Explain a necessary overrun briefly; link supporting evidence rather than
  expanding the plan into a second spec or operations manual.

For each detail ask: “Would a different choice require costly rework or change an
agreed outcome?” Settle those choices; label inexpensive defaults as changeable
and defer incidental implementation detail. Link existing spec/design/ops facts
instead of copying them. Keep shared dependencies in one place across coupled
plans. Before presenting a draft, remove repeated requirements and speculative
edge cases that do not change implementation or verification.

For several selected features, explain the added cost and propose implementation
one plan at a time in dependency order. Name an observable review point at each
plan boundary and within a large plan. A request to start several features does
not by itself request an uninterrupted implementation pass. Honor an explicit
continuous-pass request and still report milestone evidence.

## Document responsibilities and location

- SPEC.md records project-wide product intent and acceptance criteria.
- This file, docs/plans/PLANS.md, defines planning conventions.
- docs/plans/<feature-name>.md records one feature's scope, design,
  implementation milestones, progress, and verification evidence.
- HANDOVER.md records the current resumption point and links to active
  plans rather than duplicating their full contents.
- docs/adr/ records significant architectural decisions when needed.

Read existing specifications, architecture guidance, and relevant plans
before drafting. Preserve existing plans; use a descriptive filename and
link to the relevant SPEC.md sections or decision IDs. A branch of the
spec's decision tree does not automatically require its own plan.

## Scope, decisions, and authorization

Keep a new plan in Draft until the user accepts its written scope and
approach. Use Accepted, In progress, Blocked, or Complete as work advances.
Acceptance alone does not authorize implementation; proceed when the
user's request also authorizes the work. Do not request permission again
for actions already authorized within that scope.

Written acceptance records agreed scope; it does not grant or enforce tool
permissions. The agent client's sandbox, permission settings, and approval
mechanisms still apply. Available tool access does not itself authorize work
outside the user's request.

Resolve routine implementation details using project conventions and
record significant choices with brief rationale. Ask the user about
material changes to product behavior, scope, or agreed constraints.
Keep unresolved assumptions visible; do not turn recommendations into
agreed requirements. Use the specification interview workflow when those
requirements need clarification.

For Cartographer feature work, mark Complete only after the Phase 4 review and
any required remediation, current acceptance evidence, and explicit user
confirmation. Repeat review, diagnosis, remediation and user re-checks within the
same plan until the user and agent agree it is ready to move on. A clean review
may skip remediation. Feature completion and
public-launch readiness are separate; essential unmet criteria remain open.

Follow the user's Git workflow. A plan does not independently authorize
commits, pushes, publication, deployments, or unrelated changes.

## Writing a useful plan

Start with the problem and observable outcome. Include enough repository
context for someone without the conversation history to resume: relevant
paths, current behavior, affected components, dependencies, and decisions.
Link to maintained repository documentation for detail, but summarize
facts essential to understanding the plan. Avoid depending on chat history
or external links as the only source of essential instructions.

Describe implementation steps at the level needed to prevent mistakes.
Split substantial work into milestones, each with a concrete outcome and
an independent way to verify it. Include prerequisites and ordering where
they matter. For uncertain feasibility, propose a bounded investigation
or prototype with criteria for using or discarding the result; creating
a plan does not automatically authorize building that prototype.

Document relevant interface changes, compatibility, migrations, rollout,
and recovery when applicable. Do not force these sections onto work that
does not need them. Use ordinary Markdown, with lists, tables, diagrams,
and code blocks only where they improve clarity. No outer code fence or
special heading-spacing convention is required for a plan file.

## Verification and living progress

Define success as observable behavior, including appropriate failure
cases. Record actual project commands and their working directories where
known, alongside expected outcomes. If commands are not yet established,
state what needs investigation rather than inventing them.

During authorized implementation, update progress at meaningful milestones
and pauses. Separate completed work from remaining work. Record discoveries
and significant decisions where they affect the approach. If the plan
changes, update affected steps and briefly explain the change. Keep current state
accurate rather than appending contradictory updates. Record acceptance and scope
changes concisely in one place; link shared design and prototype verdicts instead
of repeating their full history in every coupled plan.

Keep expected outcomes distinct from observed results. Record checks
actually run, their results, and relevant limitations, including whether
later edits made a result stale. Keep evidence concise and omit secrets.
Include retry or recovery guidance where partial execution could matter.
At completion, summarize delivered behavior, remaining gaps, and useful
lessons. HANDOVER.md can link to these details for the next session.

## Starter structure

The outline below is for a standard plan; a light plan combines sections.
Adapt its depth to the work. For substantial plans, retain progress, discoveries,
decisions, and outcomes so the document remains useful across sessions. Combine sections
or omit irrelevant optional detail rather than filling boilerplate.

```markdown
# [Feature or change]

Status: Draft
Related spec: [Relevant section or decision IDs]

## Problem, outcome, and scope

<!-- Explain the behavior being added, boundaries, and non-goals. -->

## Context and approach

<!-- Relevant repository paths, current behavior, proposed design,
interfaces, dependencies, and assumptions. Link to maintained docs.
Test seams: agreed public boundaries, what they catch/miss.
Review baseline: resolved commit SHA and pre-existing changes, or missing-baseline limit.
External setup: human-only steps and criteria needing live services. -->

## Milestones

<!-- For each milestone: intended outcome, concrete work, dependencies,
how to verify it, and any user review boundary. Add exact commands where established. -->

## Verification and acceptance

<!-- Observable success/failure cases, commands, and expected results. -->

### User review findings

<!-- Reported symptoms/repro steps, source, and evidence; distinguish diagnosis. -->

### Remediation

<!-- Finding ID/source/severity, evidence/cause, proposed then agreed action,
regression seam or explicit gap, priority and verification. Omit if unnecessary. -->

## Progress and evidence

<!-- Initially unstarted. During implementation, track completed and
remaining work, actual checks, results, and coverage gaps. -->

## Discoveries and decisions

<!-- Record meaningful findings and decisions with brief rationale.
Distinguish agreed choices from open questions. Link to ADRs if needed. -->

## Rollout and recovery

<!-- Include only where compatibility, migration, or operational risk
requires it; explain safe retries or recovery from partial execution. -->

## Outcomes

<!-- Populate as milestones finish or work completes: delivered behavior,
remaining gaps, and useful lessons. Do not pre-claim successful execution. -->
```

## Source and adaptation

Informed by OpenAI's [execution-plan guide](https://developers.openai.com/cookbook/articles/codex_exec_plans).
Cartographer adapts the approach for plans proportional to the work,
links to maintained project documentation, and explicit user scope and
Git workflows rather than blanket autonomous decisions or commits.
