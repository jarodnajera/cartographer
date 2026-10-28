# External skills

## Grilling

Cartographer requires Matt Pocock's `grilling` for specification and feature
interviews. Other upstream skills are not automatically required dependencies.

- Author: Matt Pocock.
- Repository: https://github.com/mattpocock/skills
- Original path: `skills/productivity/grilling/SKILL.md`.
- [Upstream skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling).
- [Upstream installation guidance](https://github.com/mattpocock/skills#installation-30-second-setup).

## Installation

Cartographer documents the `npx` installer for all supported agents, including
Codex and Claude Code. These are user setup instructions; Cartographer does not
run installation commands automatically.

Use a Node.js version supported by the [skills CLI](https://github.com/vercel-labs/skills#install-a-skill)
(currently Node.js 22.20 or later). From the project where you want the skills
available, run:

```sh
npx skills@latest add mattpocock/skills
```

In the interactive installer:

1. Select the target agent or agents.
2. Include `grilling`; select other skills only when useful (see below).
3. Choose project scope for this repository, or global scope for use across projects.
4. Verify the selected skills are available in the agent's current session before
   asking Cartographer to use them. Reload the session if needed for discovery.

Use this route instead of adding the same skills through Codex or Claude Code
marketplaces. If you already have a marketplace installation, choose which copy
to retain before adding another; Cartographer does not remove existing installs.

For a reproducible baseline, use an installation method supporting an exact Git
revision or install the complete grilling folder from that checkout through the
client's supported skill mechanism. Do not assume latest equals the compatibility
baseline. Review changes before updating installed skills; retain the version or
revision used in evaluation.

## Suggested selection

| Role | Skills | When useful |
| --- | --- | --- |
| Required | `grilling` | Phase 1 specification and Phase 2 feature discovery |
| Recommended for Phase 2 | `codebase-design`, `domain-modeling` | Architecture decisions and consistent domain language |
| Recommended for Phase 3 as needed | `writing-for-agents`, `wizard` | Agent-facing documentation and human-only procedures |
| Optional for later development | `prototype`, `tdd`, `code-review` | UI exploration, implementation, and review respectively |

Installation makes a skill available; it does not invoke it or authorize its
workflow. These recommendations do not establish compatibility evidence for the
optional skills. Read each selected skill and its dependencies when using it.

Cartographer keeps ownership of the foundation and feature-plan handoffs. Use
its bundled [research workflow](research/SKILL.md), rather than installing a second
research workflow for the same work. Preserve docs/GLOSSARY.md, docs/research/,
docs/plans/PLANS.md and feature plans, and docs/adr/ as the project's canonical
locations; reconcile different upstream paths before a companion skill writes
documents. Keep ARCHITECTURE.md, TESTING.md, and RUNBOOK.md in docs/ for their
existing purposes.

Phase 3 uses [writing-for-agents](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents)
for agent-facing documentation and [wizard](https://github.com/mattpocock/skills/tree/main/skills/engineering/wizard)
for human-only procedures. Install complete skill folders, including supporting
resources such as wizard's template.sh. The [implementation workflow](phases/implement-feature.md)
defines when to load them, missing-skill handling, and explicit overrides for
wizard retention and Git actions. Their integration has not been tested end to end.

The upstream full-toolbox setup is not a prerequisite for Cartographer's grilling
integration. If you later adopt tracker-oriented workflows, review their setup
and proposed document locations against the existing scaffold first.

## Compatibility evidence

The earlier bundled Cartographer workflow used:

- Revision: `95249b0b49782349740fd9b8c6ce32b4e59e497a`.
- [Pinned source](https://github.com/mattpocock/skills/blob/95249b0b49782349740fd9b8c6ce32b4e59e497a/skills/productivity/grilling/SKILL.md).
- Instructions verified against upstream; the local copy differed only by a
  missing final newline. Prior manual foundation runs exercised that bundled
  workflow, not external skill resolution.

**External integration: not yet tested end to end.** Installed skills can change
when updated; record the installer version and skill source revision actually
loaded during evaluation when available.
Unknown or newer versions are not covered automatically by the earlier baseline.
Installation guidance checked 2026-10-28.

Test the migration with external grilling accessible and the bundled folder absent.
Also test the missing-dependency path: interview work pauses with installation
instructions, while independent requested scaffolding can proceed. Use consistent
inputs/client settings under the evaluation protocol.

## Integration and attribution

The [spec workflow](prompts/create-spec.md) owns resolution and Cartographer's
explicit adaptations. It requires reading the actual installed instructions;
mentioning a name does not load them. It must not silently fall back to the old
bundled folder or claim missing instructions were used.

Cartographer retains its explicit consequential-choice format, scoped research
and design-review rules, document paths, glossary timing, and written acceptance.
These integration rules override conflicting upstream procedure details, subject
to higher-priority instructions and user scope.

The former references/grilling/ folder, if still present during migration, is
not a runtime dependency or fallback. Its license/provenance stay with that copy
until removal. The installed skill's upstream distribution maintains its notices;
this document preserves the source acknowledgement and compatibility reference.
