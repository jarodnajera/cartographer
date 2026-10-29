# Phase 2b: Define structure and visual direction

Use this workflow after [feature planning](plan-feature.md) for UI work. Skip it
when there is no UI impact. The first substantial UI feature establishes the
visual direction; later features apply the accepted docs/DESIGN.md. Read the plan,
SPEC.md, glossary, existing screens and any brand/design guidance first. Preserve
settled requirements; a small UI change may need only existing components and a
short design section in its plan.

## Design with the user

1. **Flows and states.** Define relevant screens and user flows, including empty,
   loading, error and success states. Use agreed domain terms.
2. **Settle structure.** Use plain wireframes or installed `prototype`'s UI branch
   to compare layout and information hierarchy. Offer a bounded HTML/UI prototype
   by default for the first substantial UI feature. Explain that this round chooses
   structure, not appearance. Obtain the user's structural choice before styling.
3. **Brand session.** For the first substantial UI feature, use the installed
   grilling skill through [Cartographer's discovery guidance](../prompts/create-spec.md).
   Ask a short round covering desired feel (with concrete options), liked/disliked
   visual references and why, whether the product name/domain should inform a
   wordmark, motif or voice, and constraints: font sourcing, existing colors/logo,
   brand restrictions and accessibility targets beyond the spec. Skip answered
   questions. Propose constraints for agreement rather than inventing them;
   neither system-only fonts nor a product-name motif is automatically required
   or forbidden. Naming is an opportunity to explore, not a mandatory theme.
4. **Rendered directions.** Locate and read installed `frontend-design`. Using the
   selected structure and brand answers, build 2–3 distinct visual directions of
   the same key screen as HTML previews, with representative domain content,
   density and states. Use fictional fixtures rather than private user data. Each
   direction has a one-line concept, palette, typography and defining detail.
   Apply frontend-design's critique of generic defaults and the screenshot review
   below before presenting. Show rendered options, not only prose or token tables.
   Ask “Which direction do you choose?” Allow a combination and render the revised
   combination before treating it as selected.
5. **Write the shared guide.** Populate docs/DESIGN.md using the
   [DESIGN template](../../assets/templates/docs/DESIGN.md), preserving existing
   guidance. Record audience/tone, named color/type/spacing/radius tokens mapped
   to CSS variables, component/state conventions, motion, accessibility and
   responsive rules. Link a small specimen page showing type, colors, buttons,
   a form, a list, empty and error states; it may share the preview artifact rather
   than require a new app. Record the selected and rejected directions briefly.
   Detailed feature flows remain in the feature plan.
6. **Final styled prototype.** Apply the guide to the structural prototype so the
   user sees the selected appearance across relevant feature screens and states.
   If structure was selected using wireframes only, create the bounded styled HTML
   preview now when authorized. Reuse artifacts rather than building the same
   exploration twice. Run screenshot critique before presenting. Ask the user to
   confirm structure and appearance together; layout approval alone is not visual
   approval. Record the verdict and artifact location in the feature plan.
7. **Reconcile and accept.** Update the same plan's interfaces, milestones,
   acceptance criteria and verification strategy for the agreed design. If design
   exposes missing states, unclear relationships or expensive interactions, revisit
   the affected part of Phase 2a without restarting settled discovery. Surface
   material scope changes. Present the reconciled written plan and design for
   explicit final acceptance, combining this with final prototype confirmation
   when reviewing them together avoids a redundant question.

For later UI features, replace the brand/direction/guide-creation steps with reading
and applying DESIGN.md. Propose shared additions only when needed. Reopen visual
direction only for an explicitly requested redesign or a material unresolved need.

## Skills and executable previews

[Dependency guidance](../dependencies.md) records frontend-design's separate
Anthropic source. `frontend-design` develops appearance and the design guide;
`prototype` explores structure or logic. Read actual installed instructions when
using either; if missing, explain setup and do not claim use. Independent design
work may proceed, with any missing-skill limitation stated.

HTML directions, specimens and styled previews are executable code. Follow
Phase 2a's [authorization and capture rules](plan-feature.md#prototype-authorization-and-capture)
for all of them, including its overrides for branches, commits and production
integration. Use existing authorization rather than asking repeatedly. In a
planning-only session without preview authorization, offer it and continue only
non-executable work; keep rendered visual selection pending rather than claiming
a token table completed it. User-approved deferrals must name that limitation.

## Screenshot critique

Use an available permitted real browser for each direction and the final styled
prototype. Headless Chromium through Playwright is suitable when supported by the
environment's browser instructions. Follow those instructions; do not bypass them
or implicitly install browsers. Confirm visible content and absence of startup
errors, then inspect screenshots at representative desktop and mobile widths.
Critique hierarchy, typography, density, distinctive choices, responsive behavior
and visible states against the brief; refine before presenting.

If unavailable, say before presenting that rendering and screenshot critique are
unchecked. Deliver the preview/run instructions for human review, recording user
feedback separately from agent verification. DOM stubs, syntax tests and token
contrast calculations do not establish rendered correctness. Missing rendering
or parity evidence remains an explicit gap, never a successful visual check.

## Completion and handoff

Summarize chosen structure and appearance, artifact paths, accepted guide and
plan, and outstanding decisions/evidence. Final acceptance covers structure and
appearance together within stated deferrals; it does not authorize implementation.
Record the next step in HANDOVER.md when needed. Phase 3 implements the selected
look and checks visual parity rather than choosing a new direction.
