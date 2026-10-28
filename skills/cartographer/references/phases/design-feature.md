# Phase 2b: Define the UI and design

Use this workflow for features with user-facing design work after
[feature planning](plan-feature.md). For work without a UI impact, skip this phase
and follow PLANS.md for plan acceptance.

## Establish the design context

Read the feature plan, accepted SPEC.md, docs/GLOSSARY.md, existing screens, and
any maintained style or brand guide. Preserve agreed behavior and terminology.
Reuse the project's established design system; clarify only the visual and
interaction choices needed for the selected feature. Scale design work to the
feature: a small UI change may need only existing components and a short design
section in its feature plan. Multiple prototypes and a new style guide are not
required for every UI feature.

## Explore and settle the design

1. Define the feature's user flows and relevant screens, including empty, loading,
   error, and success states where applicable. Use glossary terms in labels.
2. Present wireframes or mockups at a fidelity proportional to the uncertainty.
   Explain consequential alternatives and ask the user to select a direction.
3. If interactive exploration would resolve uncertainty, offer a bounded prototype.
   When using an installed design or prototype skill, locate and read its actual
   instructions first; see [dependency guidance](../dependencies.md). Do not claim
   an unavailable skill was used. Static design work can proceed independently.
4. For the first substantial UI feature, establish a concise project style guide,
   normally docs/DESIGN.md, if one does not exist. Cover agreed typography, colors,
   spacing, component states, responsive behavior, and accessibility expectations;
   include brand guidance only where relevant. Later features usually apply the
   existing guide, updating it only for agreed shared changes. Keep feature-specific
   screens and interactions in the feature plan or linked design artifacts.
5. Reconcile the design with the feature plan: update affected responsibilities,
   interfaces, milestones, acceptance criteria, and verification strategy. Surface
   material changes to accepted product scope for a focused spec update. If a
   mockup exposes a missing state, unclear domain relationship, or expensive
   interaction, return to the affected part of [Phase 2a](plan-feature.md) and
   revise the same plan. Review material changes with the user before final
   acceptance, preserving decisions that remain valid.

Follow Phase 2a's [prototype authorization and capture rules](plan-feature.md#prototype-authorization-and-capture)
for any prototype here, including its explicit overrides of upstream capture
steps. Record design-prototype verdicts in the feature plan. A chosen mockup does
not authorize production implementation or promotion of prototype code.

## Completion and handoff

Summarize the chosen design, artifacts, and remaining deferred decisions. Request
explicit final acceptance of the reconciled written plan and design together,
unless already accepted in that form. Confirmation of direction in Phase 2a does
not count as this final acceptance. Keep unresolved consequential choices visible. Record the
next implementation step in HANDOVER.md when a handover is needed.

During implementation, verify behavior and accessibility against the agreed
design. Update docs/ARCHITECTURE.md when the implemented system changes; proposed
architecture remains in the plan until then.
