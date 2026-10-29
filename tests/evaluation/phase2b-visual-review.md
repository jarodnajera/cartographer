# Phase 2b visual-direction evaluation

Status: Protocol only — no run results recorded.

Use a separately authorized scratch project with an accepted spec and a bounded
UI feature plan. Preserve the same brief, content, user answers and environment
when comparing revisions, using the [evaluation protocol](README.md) for evidence
capture. Record skill revisions, installed companion sources, browser availability
and viewport sizes. Do not redesign test4; use its existing output as historical
context rather than a controlled comparator.

Give the agent the task, not this scoring checklist. Answer brand questions
consistently across compared runs; record visual choices and their rationale.
Capture screenshots/artifacts before selection and after authorized implementation.
No external service setup, paid fonts or production changes are implicit.

## Checks

Score Pass, Fail, Not observed or Not applicable, with transcript/artifact evidence:

- Structure and appearance were reviewed separately; layout approval was not
  silently treated as acceptance of an agent-selected look.
- Existing preferences were reused. Feel, references, identity, font sourcing and
  material brand/accessibility constraints were clarified without invented limits.
- The first substantial UI feature offered 2–3 genuinely distinct rendered visual
  directions using the same chosen structure, content and comparable states.
- The user explicitly selected a visual direction or saw and chose a revised mix.
  A prose description or token table alone did not substitute for rendered options.
- Each direction and final styled prototype received actual screenshot critique,
  or the missing browser evidence was disclosed before presentation. Record these
  separately: honest disclosure does not count as completed screenshot critique.
- DESIGN.md records the selected/rejected directions, named CSS-variable tokens,
  shared states, motion/accessibility/responsive rules and specimen/prototype links.
- Final plan/design acceptance covers both structure and appearance, while code
  authorization remains separate. Executable previews honored existing scope.
- Implementation used the approved look. Compare equivalent desktop/mobile screens,
  content density and states; identify unintended drift and agreed changes.
- Later small features reuse the guide without repeating the full brand session.

## Evidence and interpretation

Retain the rendered options, approved prototype/specimen, selected DESIGN.md,
implementation screenshots and concise comparison notes. Record viewport sizes,
relevant states, browser and font-loading conditions. Missing rendering is an
explicit verification gap; DOM stubs and successful builds cannot establish parity.

Have a reviewer assess specificity to the product brief and frontend-design's
critique of generic defaults, citing visible examples. Keep this aesthetic judgment
separate from objective checks and the user's satisfaction. An unusual palette or
a domain motif alone is not evidence of good design, and accepted system fonts
are not a failure. Judge whether the direction is deliberate and user-selected.

Passing requires actual observed visual choices and parity evidence for those
checks; protocol files and a completed token table do not prove behavioral success.
