# Phase 3: Implement and document the feature

Implement the accepted feature plan within the user's authorized scope. Use the
project's docs/plans/PLANS.md for plan status, progress, and verification evidence.

## Start from the accepted plan

1. Read applicable AGENTS.md instructions, the accepted feature plan, relevant
   SPEC.md sections, docs/GLOSSARY.md, architecture, and the affected code and tests.
   For UI work, also read the agreed design and docs/DESIGN.md where present.
   Check actual repository state against the plan and preserve unrelated work.
2. Confirm the written plan is accepted and implementation is authorized. A request
   to implement the accepted plan supplies that authorization; document acceptance
   alone does not. Resolve material plan/code conflicts before affected work;
   revisit only the relevant part of Phase 2 when scope or design needs to change.
3. Mark the plan In progress and implement its milestones in dependency order.
   Follow established conventions and agreed interfaces. Record meaningful changes
   to the approach in the same plan, seeking a decision when product scope or an
   accepted constraint changes. Continue routine work within the agreed scope.
4. Add or update tests appropriate to the changed behavior and run relevant checks
   as milestones land. Use actual project commands and working directories. Fix
   failures introduced by the work, distinguish pre-existing failures, and record
   checks performed, results, and limitations. Testing happens during development;
   Phase 4 supplies final review and verification rather than the first test run.
5. Update affected documentation as implementation becomes real, following the
   documentation guidance below. For steps that genuinely require a human, follow
   the wizard guidance below while continuing independent work where possible.
6. Compare delivered behavior against each acceptance criterion. Summarize the
   implemented milestones, verification evidence, remaining gaps, and the next
   review step. Hand off to Phase 4 for final code review and verification; do not
   mark the feature Complete while required review or acceptance work remains.
   Update HANDOVER.md when pausing or transferring work.

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
- docs/GLOSSARY.md: newly agreed domain terms and _In code_ mappings for identifiers
  that now exist. AGENTS.md: changed durable conventions or non-obvious pitfalls,
  using the [agent workflow](../prompts/create-agents.md) when seeding is needed.

Link shared facts instead of repeating spec requirements or copying the plan into
other documents. Update SPEC.md only for approved product changes. Offer ADRs
under the qualifying criteria in [Phase 2a](plan-feature.md).

## Human intervention: wizard

Use installed `wizard` when progress requires human-only steps, such as navigating
an account dashboard, obtaining credentials, or performing a manual cutover.
Handle tasks the agent can perform directly within existing authorization.

1. Read the installed skill and its `template.sh`, inspecting project configuration
   and example variable names without exposing secret values. Identify the manual
   stages, prerequisites, values needed, and each value's destination.
2. Present the proposed stages and confirm the procedure with the user as the
   wizard skill directs. Verify unfamiliar service instructions through
   Cartographer's [research workflow](../research/SKILL.md). Explain consequential
   costs, external changes, or irreversible actions before their relevant step.
3. Generate the scoped wizard using its template and hidden secret entry. Keep
   credentials out of conversation, documentation, logs, and tracked artifacts;
   persist them only to the agreed local or service destination.
4. Check shell syntax and trace each stage statically; run shellcheck if available.
   Hand the user the script path, run command, and expected outcome. The user runs
   the interactive wizard; the agent does not execute it end to end.
5. Resume affected milestones when the necessary outcome is confirmed. Record
   completion or remaining blockers without secret values. Retain reusable
   procedures in RUNBOOK.md when useful.

Cartographer's scope and Git rules override upstream wizard retention/commit
instructions: keep one-off helpers temporary, retain a repeatable script when
requested, and commit only when the user's Git workflow authorizes it. Creating a
wizard does not authorize provisioning, secret writes, migrations, or deployment
beyond the agreed procedure. Preserve useful artifacts until their disposition is
agreed rather than deleting user work automatically.

If either companion skill is missing or unreadable, say so and provide dependency
setup guidance; do not claim to have used it or install it automatically. Continue
independent implementation and documentation using project conventions. If a
human-only step blocks progress, record the exact next action in the plan and
handover, and wait for its outcome before dependent work.
