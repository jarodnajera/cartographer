# Phase 2a: Select and understand the feature

1. Suggest a bounded first feature based on value, dependencies, uncertainty, and
   project priorities, or use the user's selection. When several features are
   selected, explain the added planning/review cost and propose implementing one
   at a time in dependency order. Plan coupled decisions together without
   duplicating shared requirements; use separate plans only for independently
   reviewable outcomes. Name the first implementation slice and its review point.
   Honor an explicit request for a continuous pass.
2. Read the accepted SPEC.md, docs/GLOSSARY.md, relevant architecture, and actual
   code where it exists. Distinguish proposed structure from implemented behavior.
3. Grill only unresolved feature requirements; preserve settled project decisions.
   Follow the [spec workflow's](../prompts/create-spec.md) installed-grilling
   resolution and discovery guidance
   for this feature only. See [dependency setup](../dependencies.md) if
   grilling is missing.
4. Apply installed `domain-modeling` where terminology or relationships need
   clarification.
5. Apply installed `codebase-design` where interfaces, responsibilities, or test
   boundaries need thought.
6. Where a question is hard to judge on paper, offer installed `prototype`. Use
   its logic branch for rules and state, and its UI branch for layout when a host
   page exists. Follow the prototype authorization and capture rules below.
   Without authorization, sketch ASCII wireframes in the plan instead; for logic,
   use a state table or concrete scenarios.
7. Draft docs/plans/<feature>.md following the project's PLANS.md, or the
   [bundled planning guide](../../assets/templates/docs/plans/PLANS.md), including scope,
   milestones, acceptance criteria, and a verification strategy covering testing
   and review. Select the guide's light or standard tier; include a concrete
   review point for each plan or large milestone. Propose test seams for main
   behavior using codebase-design: name each public boundary, what tests there
   catch, and what they miss. Obtain agreement through the plan review; resolve
   unclear boundaries before test-first implementation. Identify external services,
   human-only setup steps, and criteria needing live-service verification.
   Include each prototype's verdict
   and any unresolved findings.
8. Update docs/GLOSSARY.md with newly agreed terms, and propose any spec change
   for approval before finishing the plan.
9. Present the written plan and summarize its scope, approach, and remaining
   decisions. For UI features, ask: "Does this scope and approach look right to
   take into design?" This confirms direction; keep the plan in Draft until final
   written-plan acceptance after Phase 2b. For features without UI work, ask:
   "Do you approve this written plan?" Wait for the response and revise as needed.
   After approval, summarize the next step: Phase 2b for UI work, or implementation
   when separately authorized. Implementation needs its own go-ahead; plan approval
   alone does not authorize it. Honor implementation authorization already given
   within the agreed scope rather than asking again.

For the companion skills in steps 4–6, locate and read their installed instructions
when needed. If unavailable, explain how to install them using the dependency
setup; do not claim to have used them. They are recommendations, not prerequisites
for planning work that can proceed independently.

Use the glossary's agreed terms for wireframe labels, plan wording, code names,
and tests; add _In code_ mappings only as identifiers exist. Keep decisions in the
feature plan. Offer an ADR only when a decision is expensive to reverse,
surprising without context, and based on a genuine tradeoff. Do not generate ADRs
for every choice.

Keep small changes lightweight. Surface material product-scope changes for a
focused spec update rather than silently superseding accepted requirements.
Testing and review are planned here and performed during later implementation.
Honor separate implementation authorization already given; accepting a document
alone does not authorize code changes or external actions.

## Prototype authorization and capture

Either prototype branch creates executable code. In a planning-only session, ask
before building one, and use authorization the user has already given rather than
asking again. Keep experimental code clearly identified as a prototype.

When using installed `prototype` in either Phase 2a or Phase 2b, these Cartographer
rules override its capture steps, subject to higher-priority instructions and the
user's scope:

- Do not create branches, commit, or fold a variant into production code unless
  the user's Git workflow and current implementation scope allow it.
- Record the question, the verdict, and where the prototype is kept in
  docs/plans/<feature>.md, rather than an implementation issue. Include the artifact
  path and branch or commit reference when applicable; do not invent references
  for actions that were not performed.

## Completion and handoff

Phase 2a ends with explicit confirmation of direction for UI features, or final
written-plan acceptance for features without UI work, and a next-step summary.
Keep the plan in Draft while material requirements or design choices remain
unresolved. For a feature with UI work, carry approval
of the planning direction into [Phase 2b](design-feature.md) and reconcile its
outcomes before final plan acceptance. Otherwise record acceptance under PLANS.md.
Design findings may reopen an affected planning decision. Revisit that part of
Phase 2a, update the same feature plan, and surface material changes before final
acceptance; do not restart settled discovery or create a second plan for the loop.
Do not begin implementation solely because the plan is accepted.
