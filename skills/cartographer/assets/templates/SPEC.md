# Project Specification

Status: Draft template — requirements undecided.

This scaffold does not represent agreed requirements.
Populate it through Cartographer's specification workflow using the bundled
grilling instructions. Grilling develops shared understanding; the written
specification remains Draft until explicitly accepted by the user.

<!-- Keep confirmed requirements separate from proposals and assumptions.
Populate substantive sections progressively during discovery; the decision
map indexes outcomes rather than replacing section content. For a complete
review draft, every section needs substantive content, an explicit unresolved
item with impact and next action, or a justified not-applicable statement.
Do not present unexplained empty headings as a completed specification.
Remove instructional comments when populated. For paused interviews,
retain an incomplete Draft, missing coverage, and the next frontier.
New-project AGENTS.md is populated after written-spec acceptance unless
explicitly requested earlier; preserve any existing instructions. -->

## Project name

<!-- Ask what the project should be called; explain that we can return to
this later. Preserve a supplied name. If undecided, record a descriptive
working title as provisional and revisit when useful. This is not a blocker
for spec acceptance or permission to rename directories or choose a domain. -->

## Goals and intended users

<!-- Who is this for, what problem does it solve, and how is success measured? -->

### Current process and pain point

<!-- Ask how the user handles the need today and for one concrete difficulty,
recent example, or personal motivation. Record their account and connect it
to the desired improvement and success criteria. Do not invent incidents or
ask again if already answered. For a new need without an existing process,
record that and the intended outcome; the user may defer or skip this detail. -->

## Core workflows

<!-- Describe the key user journeys or non-UI workflows. -->

## Scope and non-goals

<!-- Define the agreed first release and its intended use (for example,
a prototype, private pilot, or real-data release). Keep design proportional
and distinguish its requirements from later release gates. -->

## Acceptance criteria

<!-- Observable outcomes that establish whether the agreed scope works. -->

## Design decisions and dependencies

<!-- Summarize material decisions from the grilling interview using stable
IDs (D1, D2, ...). Record outcomes and brief rationale, not a transcript.

Show dependencies as a compact indented tree or outline. Reference IDs
for additional prerequisites instead of duplicating nodes. For each node,
record the question, state, prerequisites, outcome or open options, and
relevant spec section. States: Agreed, Proposed, Open, Deferred.
Recommendations remain Proposed until the user agrees. If a prerequisite
changes, revisit its dependent decisions.

Illustrative structure only — replace it with actual project decisions:
- D1: [Product decision] — [state]; prerequisites: none.
  Outcome/options: [...]. Rationale: [...]. See [Scope](#scope-and-non-goals).
  - D2: [Dependent design decision] — [state]; prerequisites: D1.
    Outcome/options: [...]. Rationale: [...]. See the relevant spec section.

This is a concise decision index, not an interview log or feature backlog.
Record only material choices and their dependencies, avoid duplicate scope
nodes, and put detailed requirements in their own sections. -->

### Next interview frontier

<!-- For an incomplete Draft, list questions whose prerequisites are
settled, plus research blockers and coverage still needed. Track the current
coverage area: product, data/security, technical design, screens/design,
or delivery. Transition to proposing a coherent design once product direction
is sufficient; ask about material choices, not every implementation detail.
Deferred decisions and their dependents remain unresolved. Once no questions remain,
state that shared understanding was confirmed; do not imply spec acceptance. -->

## Tech stack and rationale

## Data sources, APIs, and data models

<!-- Record agreed entry/import/export methods and integrations as they emerge.
Propose essential entities, relationships, and lifecycle rules for review. -->

## Project folder structure

<!-- Propose a structure appropriate to the selected stack. Label it proposed
until agreed; it does not imply files or application code already exist. -->

## Pages and screens

<!-- Propose the screen inventory, key states, and ASCII wireframes using
the agreed workflows. Explain why not applicable for projects without a UI. -->

## Components and API contracts

<!-- Propose component responsibilities, interfaces, inputs/outputs, and
important error cases at the level needed to guide implementation. -->

## UI/UX design system

<!-- Propose a coherent visual system (colors, typography, component style)
and accessibility requirements. Distinguish proposals from user agreements. -->

## Authentication, authorization, and data privacy

<!-- Describe accounts, access boundaries, data ownership, and relevant privacy
needs. Keep stack selection provisional while requirements affecting it are open. -->

## Environment variables

<!-- Propose names and purposes from the selected services; distinguish
public/client configuration from server-only secrets. Never include values. -->

## Deployment plan

<!-- Propose hosting and service responsibilities, configuration, and relevant
operational requirements. Distinguish planned setup from provisioned resources.
Surface recommendations introducing recurring costs, ongoing operator work,
or substantial subsystems during design review, including their benefit,
burden, and simpler alternatives. Keep unagreed commitments Proposed. -->

### Release gates

<!-- Separate requirements for the agreed first release from gates applying
to a later stage, naming that stage and what triggers each gate. Record
agreed commitments and unresolved choices without silently expanding MVP
work. Do not defer safeguards necessary for the first release's actual use.
If no later gates are needed, say so briefly. -->

## Development phases

<!-- Define P0/P1/P2/P3 priorities and high-level, verifiable milestones. -->

### Feature plans

<!-- Identify complex features that warrant separate execution plans.
Label suggested plans as not yet created. Link only to existing files in
docs/plans/; do not create a plan for every decision-tree branch.
Create feature plans when requested, after their relevant scope is agreed.
Small features may need no separate plan. If none are selected, say so;
do not leave this section unexplained or invent plan links. -->

## Constraints, risks, and known limitations

<!-- Carry forward usage constraints, budget/timing boundaries, excluded
capabilities, and material risks; do not invent numeric limits. -->

## Open questions and assumptions

<!-- Reference decision IDs where relevant. Identify implementation
blockers, deferred items, and assumptions requiring validation. Explicitly
state any limited accepted scope rather than treating deferrals as settled. -->
