# Phase 3: Implement and document the feature

Implement the accepted feature plan within the user's authorized scope. Use the
project's docs/plans/PLANS.md for plan status, progress, and verification evidence.

## Start from the accepted plan

1. Read applicable AGENTS.md instructions, the accepted feature plan, relevant
   SPEC.md sections, docs/GLOSSARY.md, architecture, and the affected code and tests.
   For UI work, also read docs/DESIGN.md and the approved styled prototype.
   Preserve both the selected structure and appearance.
   Check actual repository state against the plan and preserve unrelated work.
2. Confirm the written plan is accepted and implementation is authorized. A request
   to implement the accepted plan supplies that authorization; document acceptance
   alone does not. Resolve material plan/code conflicts before affected work;
   revisit only the relevant part of Phase 2 when scope or design needs to change.
   Record a resolved baseline commit SHA when available and an inventory of
   pre-existing dirty/untracked files before editing. Do not create a baseline
   commit automatically. Without a usable commit, record a starting file inventory
   and the limitation for Phase 4a's changed-file review.
3. Mark the plan In progress and implement its milestones in dependency order.
   Follow established conventions and agreed interfaces. Record meaningful changes
   to the approach in the same plan, seeking a decision when product scope or an
   accepted constraint changes. For behavior with meaningful inputs and outputs,
   locate and read installed `tdd` and use vertical red–green slices at the seams
   agreed in the plan. Read `codebase-design` when boundary design is unresolved;
   confirm new seams before retained tests. Plan acceptance can confirm explicitly
   listed seams without a separate ceremony. Use proportionate checks for config,
   wiring or changes whose tests would only mirror implementation. Add browser
   and end-to-end checks after the behavior works; this ordering is Cartographer
   guidance. Continue routine work within the agreed scope.
4. Add or update tests appropriate to the changed behavior and run relevant checks
   as milestones land. Use actual project commands and working directories. Fix
   failures introduced by the work, distinguish pre-existing failures, and record
   checks performed, results, and limitations. Testing happens during development;
   final review complements these checks rather than supplying the first test run.
5. Update affected documentation as implementation becomes real, following the
   documentation guidance below. For steps that genuinely require a human, follow
   the wizard guidance below while continuing independent work where possible.
6. Compare delivered behavior against each acceptance criterion. Summarize the
   implemented milestones, verification evidence, remaining gaps, and the next
   review step. List unverified criteria and why, then hand off to
   [Phase 4a](review-feature.md#phase-4a-review-and-plan-remediation); do not
   mark the feature Complete while required review or acceptance work remains.
   Update HANDOVER.md when pausing or transferring work.

## Handoff to Phase 4

When the agreed Phase 3 implementation is finished, notify the user directly:

> I've finished Phase 3. We're now moving into Phase 4: please test the feature
> and tell me what bugs you find or what you'd like changed.

Keep this transition brief. Include the actual run command or available URL when
needed, and state material incomplete or unverified work without claiming success.
For a partial slice, name that slice rather than claiming the full phase is done.
Keep the feature plan In progress and continue with
[Phase 4a](review-feature.md#phase-4a-review-and-plan-remediation); its review
checklist and code review remain part of that workflow.

## Implementation review points

By default, complete one accepted plan at a time in dependency order. For a large
plan, use its named, observable milestones as review points. At each boundary,
finish the slice and relevant checks, then present what works, how to try it,
actual verification and remaining gaps. Pause for user review before starting
the next large milestone or plan; do not leave a routine fix or required check
unfinished merely to manufacture a checkpoint.

Use the review boundaries already agreed in the accepted plan. If none were
agreed, propose a bounded first slice and its review point when starting
implementation. Carry out independently authorized work while that choice is
pending; wait at the agreed boundary rather than imposing extra approval gates. “Start these three features” authorizes the
scope but does not imply a continuous pass. When the user explicitly requests
continuous implementation, proceed across boundaries without approval questions
and keep milestone updates concise. Existing user authorization takes precedence.

## Implement the approved visual design

For UI work, use installed `frontend-design` to execute the accepted DESIGN.md and
styled prototype well: spacing, states, typography and detail. Phase 3 is not a
new visual-direction session. Keep token names/values aligned with the guide and
use realistic fictional content for review. Surface material deviations needed
by implementation to the user and reconcile the same guide/plan before adopting
them; routine refinements within the accepted direction need no new design gate.

Before each UI handoff, capture the built screens at desktop and mobile widths
using an available permitted real browser, following Phase 2b's
[screenshot critique](design-feature.md#screenshot-critique). Compare equivalent
screens, data density and states with the approved prototype. Record differences;
fix unintended drift and explain intentional, agreed changes. Verify visible
hierarchy, typography, colors, spacing, states and responsive behavior rather than
relying on build success. If rendering is unavailable, state that parity is
unverified and carry the specific checks into Phase 4a; do not claim a visual match.

## Document the implemented system

When creating or substantially updating documents an agent will consume, locate
and read installed `writing-for-agents`. Apply its guidance for clear steps,
completion criteria, useful context pointers, and a single authoritative home for
each fact. See [dependency setup](../dependencies.md) for installation. Read only
its relevant supporting resources. This is writing guidance, not an instruction
to produce extra documents or rewrite unaffected files.

Update only the documents affected by the work:

- Feature plan: milestone progress, discoveries, decisions, and actual verification
  evidence. Keep intended outcomes distinct from observed results.
- docs/ARCHITECTURE.md: implemented boundaries, responsibilities, entry points,
  dependencies, and important data flows. Seed it once an application structure
  exists; leave future architectural proposals in the plan.
- docs/TESTING.md: durable test procedures, prerequisites, and relevant command
  locations. Keep session-specific test results in the plan or HANDOVER.md.
- docs/RUNBOOK.md: actual setup, operation, recovery, and troubleshooting procedures
  introduced by the feature. Describe verified behavior and flag unverified steps.
- docs/DESIGN.md: agreed visual refinements, specimen/prototype pointers and
  current comparison evidence, preserving the selected direction.
- docs/GLOSSARY.md: newly agreed domain terms and _In code_ mappings for identifiers
  that now exist. AGENTS.md: changed durable conventions or non-obvious pitfalls,
  using the [agent workflow](../prompts/create-agents.md) when seeding is needed.

Link shared facts instead of repeating spec requirements or copying the plan into
other documents. Update SPEC.md only for approved product changes. Offer ADRs
using the shared [domain integration rules](../domain-guidance.md).

## Human intervention: wizard

Use `wizard` here only for human-only steps that block implementation. Follow the
shared [human setup procedure](review-feature.md#human-setup-wizard); it owns scope,
secret handling, human execution, and retention/Git overrides. Defer setup needed
only for final live-service verification to Phase 4a, recording the affected checks.

If a companion skill is missing or unreadable, provide
[dependency setup](../dependencies.md) and do not claim use or install automatically.
Continue independent work using project conventions and record coverage limits.
For a blocking human-only step, record the exact next action in the plan/handover
and wait for the necessary outcome before dependent work.
