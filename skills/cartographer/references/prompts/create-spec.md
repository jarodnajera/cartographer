# Create a project specification

**Run before coding.**

I'm about to build a new project:
[Describe the idea in 2–3 sentences.]

Help me develop a concrete SPEC.md before writing application code.

## Preparation

1. Inspect existing project files and documentation. Preserve established
   requirements and identify contradictions or missing context. Distinguish
   proposed capabilities from implemented behavior.
2. Read both bundled resources, resolving these links relative to this
   prompt file in Cartographer's installed skill folder:
   - [Grilling instructions](../grilling/SKILL.md)
   - [SPEC template](../../assets/templates/SPEC.md)
   Do not assume the target project contains these resources. Read the
   actual grilling instructions; merely mentioning the skill does not load it.
3. If the bundled grilling reference is unavailable, use a discoverable
   installed grilling skill. If neither is available, disclose that and
   offer to restore the dependency or proceed with a direct interview;
   do not claim to have used the skill without reading it.

## Interview using grilling

Use grilling's design tree and dependency-aware rounds to resolve the
specification. The coverage list below guides which decisions to explore;
it is not a questionnaire to ask all at once.

- Start with the problem, intended users, core workflows, desired outcomes,
  non-goals, and constraints before choosing technology.
- Ask what the project should be called if I have not already supplied a name.
  Tell me we can return to it later. If undecided, record a descriptive working
  title as provisional; naming does not block discovery or spec acceptance.
  Preserve an existing project name unless I request a rename. Do not rename
  directories or select a domain as part of this question.
- Ask how I handle this need today and for one concrete pain point, recent
  difficulty, or personal motivation: "What happens today, what is frustrating,
  and what would be better with this project?" Use an answer already provided
  instead of asking again. If there is no current process or I prefer to skip,
  record that and clarify the desired outcome without inventing an incident.
  Connect this evidence to scope and observable success criteria.
- Treat each material decision as a node. Identify prerequisite decisions
  and ask only the current frontier: questions whose prerequisites are
  settled. Number each question, give a clear recommended answer, and
  follow grilling's question format. Wait for my answers before moving on.
- Recompute the frontier after each round. If an answer changes an earlier
  decision, reopen affected downstream decisions instead of retaining
  incompatible conclusions.
- Investigate discoverable facts yourself. Use sub-agents when available
  and permitted; otherwise investigate directly. Keep research-dependent
  questions pending while progressing on independent decisions.
- Challenge my choices when there is a better option. Explain the tradeoff
  and let me decide; never treat your recommendation as my answer.
- When the interview reaches shared understanding, summarize the decisions
  and ask me to confirm before synthesizing the complete specification.

After each answered round, update the relevant substantive sections with
confirmed findings and clearly labeled proposals. For example, agreed data
entry/export methods belong in the data section, not only the decision map.
Do not wait for the complete-spec synthesis to record useful section content.

If I pause, preserve an explicitly incomplete Draft with settled decisions,
open questions, coverage still needed, and the next frontier. If I choose to defer a decision,
record its impact; deferral does not settle its dependent decisions.

## Discovery coverage and transition to design

Use this sequence to guide coverage, not as artificial prerequisites or a
fixed question count. Keep grilling's frontier dependency-aware; independent
questions may span areas, while a recommendation affected by an unanswered
question must remain provisional.

1. Product direction: project name or provisional working title, users,
   current process and concrete pain point/motivation, main workflows,
   MVP scope/non-goals, success criteria, and usage constraints.
2. Data and security: sources, essential records and lifecycle, integrations,
   access/ownership rules, and notification or other critical behavior.
3. Technical design: stack, component/API boundaries, proposed folder
   structure, environment variables, and service responsibilities.
4. Screens and design: screen inventory, key states and ASCII wireframes,
   visual-system proposal, and accessibility.
5. Delivery: deployment, operational constraints, risks, priorities,
   verifiable milestones, and suggested feature plans.

Do not keep expanding product discovery after there is enough direction to
propose a viable first version. Ask further questions when their answers
materially affect scope, feasibility, user experience, cost, or risk. Suggest
later-scope treatment for tangents and let me decide if they matter now.

When core product decisions are settled, explicitly transition: explain that
there is enough direction to propose the remaining technical and visual design.
Research and present a coherent proposal, grouped for review, rather than
requiring me to design each folder, component, color, or variable name.
Explain consequential alternatives and ask for decisions where needed. Keep
all unaccepted recommendations Proposed, even when they form a complete draft.

Keep the design proportional to the agreed first release. Explicitly surface
recommendations that introduce recurring costs, ongoing operator responsibilities,
or substantial new subsystems. In the design review, explain their benefit,
burden, and relevant simpler alternative; ask me to agree to consequential
commitments instead of burying them in the written spec.

Distinguish requirements for the first release from gates for a later stage
such as real-data operation or public launch. Define which stage the first
release serves. Do not silently turn later gates into MVP implementation work,
or defer safeguards essential to the agreed first-release use. Mark unagreed
costs, operational targets, retention policies, and subsystems as Proposed.

Choose technology against the agreed data, access, and workflow requirements.
Do not request final acceptance of a stack in the same round as unresolved
requirements that could change that stack. If answers change prerequisites,
revise the affected design before seeking agreement.

Before shared-understanding confirmation, review coverage against every
specification section. Resolve material open questions or let me explicitly
defer them with their impact recorded. Do not claim discovery is complete
just because the product questions stopped; technical and visual proposals
also need review. Then synthesize the complete Draft for written acceptance.

## Design decisions and dependencies

Maintain a compact, user-visible decision map in SPEC.md. Record material
choices and dependencies, not every interview question, repeated scope
statement, transcript, or private reasoning trace. The substantive sections
are the specification; the map is a navigation aid.

- Assign stable IDs such as D1 and D2 to material decisions. Record each
  decision's question, state, outcome or open options, and prerequisites.
- Use states: Agreed, Proposed, Open, and Deferred. A recommendation stays
  Proposed until I agree. Explicitly accepted assumptions may be recorded
  as Agreed, with their assumption and validation needs made clear.
- Show dependencies as an indented tree or outline. Where a decision has
  multiple prerequisites, reference their IDs rather than duplicating it.
- Link important outcomes to the specification section they inform. Keep
  detailed requirements in those sections rather than copying them here.
- For an incomplete draft, list the next frontier and any research blockers.
  Keep the map proportional to the project; no separate graph file or
  exhaustive record of minor choices is required.

## What the specification should cover

- Project name or explicitly provisional working title
- Problem statement, intended users, current process, pain point/motivation,
  and success criteria
- Core user workflows
- MVP scope, non-goals, and testable acceptance criteria
- Design decisions and dependencies
- Tech stack selection and reasoning
- Data sources, APIs, and essential data models
- Proposed project folder structure
- Pages/screens, including ASCII wireframes
- Key components and API contracts
- UI/UX design system, including accessibility
- Authentication, authorization, and data privacy where applicable
- Environment variable names and purposes, without secret values
- Deployment plan and operational requirements
- Development phases with milestones and P0/P1/P2/P3 priorities
- Constraints, known limitations, risks, and dependencies
- Open questions and assumptions

Adapt the depth to the project's complexity. Mark irrelevant sections
as not applicable with a brief explanation.

## Feature plans

Keep project-wide intent and high-level milestones in SPEC.md. A design-tree
branch is a decision dependency, not automatically a feature or work item.

Identify complex features that would benefit from a separate execution
plan, but do not create plan files merely because this interview uncovered
them. Record them as suggested plans until feature planning is requested.
Small, clear features need no separate plan.

When planning is requested, create or update docs/plans/<feature-name>.md
for each selected complex feature. Include scope, acceptance criteria,
relevant decision IDs, affected components, implementation milestones,
verification, and rollout considerations. Link it from SPEC.md, preserve
existing plans, and avoid duplicating project-wide requirements. Surface
product-scope changes for review before treating them as agreed.

## Deliverable and completion

Write SPEC.md with Status: Draft. Clearly distinguish agreed decisions,
proposals, assumptions, and unresolved questions. Do not invent requirements
or present unanswered decisions as settled.

Make acceptance criteria observable and milestones verifiable. Define what
P0/P1/P2/P3 mean for this project. Remove unused template instructions.

Before presenting the complete draft, check that requirements agree with
the decision map, cross-references resolve, and dependent decisions have no
silently unresolved prerequisites. Every section must contain substantive
content, an explicit unresolved item with its impact and next action, or a
brief justified not-applicable statement. An empty heading is not coverage.
Feature plans may state that none are selected or created. Identify remaining
blockers and distinguish a partial interview draft from a complete review draft.

For a new project, defer creating or populating AGENTS.md until I accept the
complete written SPEC.md, unless I explicitly request it earlier. Read and
preserve existing agent instructions from the start; this sequencing does
not require deleting existing AGENTS.md files.

Present the written spec for review. Mark it Accepted only after I explicitly
accept the written document. If I accept a limited scope despite deferred
items, make that boundary and its limitations explicit.

Confirmation of shared understanding permits drafting; acceptance of the
written spec is a separate step. Neither authorizes implementation.
