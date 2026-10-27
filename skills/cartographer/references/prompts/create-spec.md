# Create a project specification

**Run before coding.**

I'm about to build a new project:
[Describe the idea in 2–3 sentences.]

Help me develop a concrete SPEC.md before writing application code.
Use the following workflow for new foundations or focused spec revisions.

## Prepare the project and resources

Inspect existing documentation and relevant project evidence. Preserve established
requirements and distinguish implemented behavior from proposals. Resolve these
bundled links relative to this prompt, not the target project:

- [SPEC template](../../assets/templates/SPEC.md)
- [Grilling instructions](../grilling/SKILL.md)
- [Documentation templates](../../assets/templates/)

Read the actual grilling instructions before interviewing. If unavailable, locate
an installed grilling skill; if neither is accessible, disclose the missing
resource and offer to restore it or conduct a direct interview without claiming
the skill was loaded.

When scaffolding is requested, copy missing templates into the target project:
SPEC.md, AGENTS.md, and HANDOVER.md; docs/ARCHITECTURE.md, TESTING.md, RUNBOOK.md,
COMPENDIUM.md; docs/plans/PLANS.md and its .gitkeep; docs/adr/ and docs/research/
with .gitkeep. Exclude optional profiles, memory, and hook configuration.

For a new project, create a missing AGENTS.md from its bundled template during
documentation scaffolding, leaving it unseeded. Seed it after the framework or
application skeleton has actually been set up, not merely after spec acceptance.
Creating the template is not the same as populating it. Always read and preserve
existing agent instructions.

Create files exclusively; preserve existing files, including empty ones. Report
symlink or incompatible-path conflicts instead of overwriting. When population
is requested, read existing content and make focused updates. Copy empty templates
as empty; other documents need not be populated before the foundation is ready.
Unknown commands, architecture, or operations must not be fabricated.

## Interview and progressive drafting

Use grilling's design tree, question format, and dependency-aware rounds. Ask
questions whose prerequisites are settled, wait for answers, and recompute the
frontier after each round. Research discoverable facts directly; use sub-agents
only when available and permitted. Reopen dependent decisions when an answer
changes a prerequisite. Recommendations are not user decisions.

For consequential choices—product scope, architecture, recurring costs, operator
duties, or difficult-to-reverse commitments—ask the user to select explicitly
labeled options with meaningful tradeoffs. Give the recommended option and its
reason, but phrase the question as "Which option do you choose?" rather than
"Shall we use my recommendation?" Do not manufacture alternatives or reopen
explicit decisions already made. Allow a different proposal or explicit deferral.

For these choices, this selection format overrides grilling's instruction to
word questions so "yes" accepts the recommendation. Retain its numbered rounds,
separate recommendation, and decision dependencies; no fixed question cap is added.
A clear free-text selection is valid. An ambiguous "yes" to multiple options or
unresolved commitments does not select the recommended option: clarify the choice
and keep it Open or Proposed until the answer is unambiguous. Low-impact design
review and acceptance of the completed written spec may still use confirmation.

Example:

> ❓ Q1 — First release: A) Private pilot with invited users and limited support,
> or B) Public beta requiring public signup, abuse controls, and support readiness?
> Which do you choose? You may propose a different boundary or defer.
>
> ➡️ I recommend A to validate the core workflow before taking on public operations.

Early in discovery, cover:

- Project name: ask if not supplied, explaining it can be revisited. Preserve an
  existing name; use a provisional working title if undecided. Naming never blocks
  discovery or acceptance and does not authorize directory renaming or a domain.
- Current process and pain point: ask what happens today, one concrete difficulty
  or personal motivation, and what improvement the user wants. Use information
  already supplied rather than asking again. If there is no process or the user
  skips the question, record that without inventing an incident.
- Users, core workflows, desired outcomes, first-release scope/non-goals, usage
  constraints, and observable success criteria before choosing technology.

Move coverage from product direction to data/security, technical design,
screens/design, and delivery. These are coverage areas, not artificial
prerequisites or a fixed question count. Ask follow-ups when they materially
affect scope, feasibility, experience, cost, or risk; suggest later scope for
tangents and let the user decide.

After each round, populate the substantive spec sections with confirmed findings
and labeled proposals. The decision map indexes those sections rather than
replacing them. If paused, preserve an incomplete Draft, outstanding coverage,
research blockers, and the next frontier. Deferral does not settle dependencies.

## Compare the central alternatives

If the user raises an unresolved choice, such as local versus web, compare
credible alternatives explicitly once the relevant needs are understood and
before asking for a selection. Do not settle it indirectly through agreement
with a supporting detail such as hosted storage. Preserve an explicit selection
already made; do not force an options exercise for every minor decision.

Show a compact comparison in the conversation and retain it under Central
alternatives and tradeoffs in SPEC.md. Compare fit to the user's pain point,
constraints, and first release; meaningful benefits and limitations; recurring
costs and operator work; and the infrastructure or additional scope each option
introduces. For local versus web, consider installation, offline/cross-device use,
data location, synchronization, hosting, authentication, and recovery where
applicable. Derive requirements from the actual design, not assumptions that
every web app or local app needs the same infrastructure.

Recommend an option with reasoning and ask the user to choose, retaining the
choice and rationale under its decision ID. If evidence is insufficient, state
what remains unknown. Keep the choice Open or Proposed until answered; explicit
deferral is valid. If no material alternatives remain, record that briefly
rather than inventing options to fill the template.

## Transition to a design proposal

Once product direction is sufficient, explain that there is enough context to
propose the remaining technical and visual design. This advances the grilling
interview; it does not end it or establish shared understanding by itself.

Treat material choices introduced by the proposal as new nodes in the same
decision tree. Mark them Proposed, identify their prerequisites, and continue
dependency-aware review rounds using explicit options for consequential choices.
Answers may unblock further questions or require design revisions; update the
tree and affected spec sections accordingly. Do not mark a proposal Agreed merely
because the product-discovery questions are finished.

Present a coherent design without asking the user to choose every folder,
component, color, or variable. Label low-impact details as changeable defaults
or feature-plan work under the depth guidance below. Challenge weak choices with
reasoning. Do not seek final stack agreement alongside unanswered requirements
that could change it; revise affected recommendations when prerequisites change.

Keep the design proportional to the agreed first release. Explicitly surface
recommendations introducing recurring costs, ongoing operator responsibilities,
or substantial new subsystems. Explain benefit, burden, and a relevant simpler
alternative; obtain agreement on consequential commitments rather than burying
them in a long spec.

Define the first release's intended use. Distinguish its requirements from later
release gates, such as real-data operation or public launch. Do not silently make
later gates MVP work or defer safeguards essential to the first release's use.
Unagreed costs, targets, retention policies, and subsystems stay Proposed.

Finish the interview only after reviewing all spec coverage, including decisions
introduced by design proposals. Resolve material questions or record user-approved
deferrals with their impact and dependent work still unresolved. A scoped deferral
does not mean every branch is settled. Summarize the resulting agreements and
remaining boundaries for shared-understanding confirmation, then synthesize the
complete Draft. Acceptance of the written spec remains a separate step.

## Calibrate depth

Read the [compact example spec](../examples/compact-spec.md) before drafting to
calibrate detail, not to copy its scope, stack, decisions, or Accepted status.
For each detail, ask: "Would a different choice cause costly rework or change an
agreed outcome?" Settle those choices with the user; otherwise use a short
changeable default or defer the detail to the selected feature's plan.

Distinguish **requirements** (agreed product behavior, constraints, and costly
choices), **changeable defaults** (low-cost implementation choices the implementer
may revise), and **feature-plan work** (detail needed only for a selected feature).
Accepting the spec does not make every default mandatory. Default changes must
still respect requirements and consequential commitments; unknown requirements
remain Open or Proposed rather than being disguised as implementation freedom.

Keep scope, acceptance, stack commitments, essential data/ownership, and access
boundaries concrete. Give folder layouts, visual tokens, and incidental component
details only the depth their consequences warrant. Keep later features brief.
The template is a coverage checklist, not a minimum word count: one useful line
or an explicit feature-plan deferral can cover a low-impact section.

## Decision map

Keep a compact outline of material decisions and dependencies, not every question,
repeated scope statement, or transcript. Use stable IDs such as D1 and D2, recording
the question, prerequisites, outcome/options, brief rationale, and spec-section link.
Use Agreed, Proposed, Open, and Deferred states. Explicitly accepted assumptions
may be Agreed if their assumption and validation needs remain clear.

Represent dependencies with indentation and additional prerequisite IDs instead
of duplicated nodes. For incomplete drafts, retain the next interview frontier
and research blockers. No separate graph file or exhaustive minor-choice log is
required. Record outcomes, not private reasoning traces.

## Coverage and review

SPEC.md describes product scope: what the system should do, its constraints,
and release boundaries. A request such as "documentation only for this session"
limits the current task, not the future product. Keep temporary authorization,
file-edit limits, and session exclusions in the conversation or HANDOVER.md;
do not copy them into product scope, non-goals, or acceptance criteria.
A factual statement such as "application not yet implemented" is appropriate
when it clarifies the current state without becoming a permanent prohibition.

Use the template's sections as the coverage checklist: identity, goals/pain point,
workflows, scope, central alternatives, consequential commitments, acceptance,
decisions, stack, data/APIs/models, folder structure,
screens/wireframes, components/contracts, visual system/accessibility, auth/privacy,
environment variables, deployment/release gates, phases, feature plans, and risks.
Adapt depth to complexity. Record variable names and purposes, never secret values.
Define P0/P1/P2/P3 and use verifiable milestones.

Before presenting a complete Draft, ensure each section has substantive content,
an explicit unresolved item with impact and next action, a clearly bounded
feature-plan deferral, or a justified not-applicable statement. Empty headings
are not coverage. Check cross-references,
consistency with decision states, and unresolved prerequisites. Distinguish an
incomplete interview draft from a complete review draft; remove template comments.

Keep Next interview frontier only while discovery is incomplete. When preparing
the complete review draft, remove that heading and interview-only progress notes.
Move any remaining deferred decisions or assumptions into Open questions and
assumptions, preserving decision IDs, impact on accepted scope, and resolution
or validation steps. If none remain, remove the frontier without creating a
replacement section. Retain substantive decisions and unresolved release gates;
cleanup must not imply they are settled. Check links to removed headings.

### Consequential commitments before acceptance

Maintain a short Consequential commitments summary in SPEC.md and show it in
the conversation before requesting acceptance. Cover recurring costs, ongoing
operator duties, major subsystems, and difficult-to-reverse choices. For each,
state the concrete commitment and burden, whether it applies to the first release
or a later release gate, its decision ID/status, and any unresolved choice.
Link to details rather than duplicating them. State when no material commitments
were identified; do not invent infrastructure to fill this section.

Broad approval applies only to the consequential commitments actually surfaced.
A consequential detail absent from this summary and not separately agreed stays
Proposed; do not silently mark it Agreed after a general "yes." Group related
low-impact choices for efficient review, but use explicit option selection for
unresolved consequential choices as described above. Preserve prior explicit agreements without demanding them
again. If the draft adds or changes a consequential commitment, refresh the
summary and surface the change before requesting acceptance.

Present the written spec and this summary, then ask directly: "Do you accept this
written SPEC.md, including the commitments and explicit deferrals, or would you
like revisions?" Do not precede the question with a quotation of Cartographer's
instructions or a repeated explanation of its acceptance gates. Mark it Accepted
for the agreed scope only after explicit user acceptance. If the user accepts limited scope with deferred
items, make that boundary and outstanding proposals explicit. Neither interview
confirmation nor written acceptance authorizes implementation.

## Feature plans and foundation handoff

Keep project-wide intent and high-level milestones in SPEC.md. Identify complex
features that could benefit from execution plans, but create no plan files unless
feature planning is requested. A decision-tree branch is not automatically a
feature. State when no plans are selected; link only to existing files.

Route requested feature planning through Cartographer's Phase 2 and the project's
planning guide. Preserve existing plans and propose focused spec updates for
product-scope changes instead of duplicating or silently superseding requirements.

After spec acceptance, inspect whether application files and tooling exist.
For a new documentation-only project, leave the scaffolded AGENTS.md unseeded and
end Phase 1 with a short setup note:

1. Show the scaffold command for the accepted stack, its working directory and
   relevant options. Verify it against current official framework documentation
   through the research workflow, citing the source. If a material setup choice
   remains open, explain it rather than inventing a runnable command.
2. Offer to run the command. Execute it only after an explicit setup request or
   affirmative response to that offer; spec acceptance is not that response.
   Honor setup authorization already given without requesting it again.
3. Give the exact return instruction: "After application setup, ask Cartographer:
   'Seed AGENTS.md from the scaffolded project.'" Include this next step and
   the verified setup guidance in HANDOVER.md so another session can resume.

Account for the existing documentation in the target directory: do not recommend
force/overwrite flags or assume the scaffolder accepts a nonempty directory.
When needed, describe generation in an empty staging directory and a reviewed
merge preserving the documents. For stacks without a framework generator,
provide a minimal setup approach and state that no scaffold command applies.

Once setup has actually completed, run the agent workflow when requested or as
part of an explicitly authorized setup-and-seeding task. Seed AGENTS.md from
observed files, manifests, scripts, and conventions, separating planned behavior
from implemented facts. If setup failed or is partial, report that state rather
than inventing commands or claiming readiness. Existing projects with a codebase
can use the agent workflow directly without a new framework-setup step.

Summarize agreed scope, document status, remaining uncertainties, and candidate
first features. The foundation is ready for its accepted scope when goals,
acceptance criteria, constraints, and a concrete next step are clear; other
documentation may remain scaffolded when useful evidence does not exist yet.
