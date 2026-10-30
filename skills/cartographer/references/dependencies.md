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
| Recommended for Phase 1/2 vocabulary | `domain-modeling` | Clarify terms with Cartographer document-timing overrides |
| Recommended for Phase 2 architecture | `codebase-design` | Interfaces, responsibilities and test seams |
| Recommended for Phase 3 as needed | `writing-for-agents`, `wizard` | Agent-facing documentation and human-only procedures |
| Recommended for Phase 2 exploration | `prototype` | Bounded UI or logic experiments |
| Phase 3 and 4b behavior implementation | `tdd` | Test-first behavior at agreed seams |
| Phase 4 review and diagnosis | `code-review`, `diagnosing-bugs`, `wizard` | Standards/spec review, confirmed causes, human-only test setup |

Anthropic's [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
is a separate recommended source for Phase 2b and UI implementation. Run
`npx skills@latest add anthropics/skills` and select `frontend-design`; verify its
installed instructions as with the other skills. Source checked 2026-10-28.

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
wizard retention and Git actions. Test4 reports using writing-for-agents during
implementation documentation; wizard guidance was read but its manual procedure
was not executed.

The upstream full-toolbox setup is not a prerequisite for Cartographer's grilling
integration. If you later adopt tracker-oriented workflows, review their setup
and proposed document locations against the existing scaffold first.

Phase 4 uses [code-review](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review)
and [diagnosing-bugs](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnosing-bugs).
Read their installed instructions and supporting files. The
[review workflow](phases/review-feature.md) owns explicit overrides for local spec
sources, working-tree review, delegation availability, diagnosis-only work in 4a,
and wizard execution/Git actions. `tdd` uses seams agreed in Phase 2a and calls for
`codebase-design` when their design is unresolved; both use docs/GLOSSARY.md here.
Phase 4 and the expanded TDD integration are active instructions. Test5 exercised
scoped review/remediation and browser re-checks; full diagnosis/red-green remediation
and feature completion are not established by that run.

Phase 2b selects structure and appearance separately, using rendered directions
for the first substantial UI feature. Phase 3 implements the approved style and
compares desktop/mobile screenshots. Screenshot critique requires an available
permitted browser, such as Playwright with Chromium; unavailable rendering is
reported explicitly. Browser installation is not automatic. Test5 exercised user
selection from visual directions; agent screenshot critique and full design parity
were not established during that design session.

## Compatibility evidence

[Test5's publication notes](../../../tests/test5/README.md) summarize the newer
manual integration run. Its [browser evidence](../../../tests/test5/docs/plans/evidence/phase4-browser-recheck.json)
records selected account-state checks after Playwright MCP became available.
These results do not establish hosted Auth, full accessibility/design parity,
original-defect reproduction, or the final full-feature completion loop.

The earlier bundled Cartographer workflow used:

- Revision: `95249b0b49782349740fd9b8c6ce32b4e59e497a`.
- [Pinned source](https://github.com/mattpocock/skills/blob/95249b0b49782349740fd9b8c6ce32b4e59e497a/skills/productivity/grilling/SKILL.md).
- Instructions verified against upstream; the local copy differed only by a
  missing final newline. Prior manual foundation runs exercised that bundled
  workflow, not external skill resolution.

**External integration: Test4 exercised the foundation-to-local-implementation
path.** See its [conversation](../../../tests/test4/CONVERSATION.md),
[handover](../../../tests/test4/HANDOVER.md) and
[skill source/hash record](../../../tests/test4/skills-lock.json). This is one
qualitative run, not a controlled comparison or a hosted/browser validation.
The published transcript is redacted, reconstructs early exchanges, and omits
tool events. Skill loading and execution order are reported, not independently
verified by the transcript or lockfile.
Missing-dependency behavior and the executed wizard path remain unproven.
Installed skills can change when updated; record the installer version and skill
source revision actually loaded during evaluation when available.
Unknown or newer versions are not covered automatically by the earlier baseline.
Installation guidance checked 2026-10-28.

For subsequent runs, verify external grilling resolution and test the
missing-dependency path: interview work pauses with installation
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

## Domain and browser readiness

Use the [domain integration rules](domain-guidance.md) when applying domain-modeling
in Phase 1 or later: retain docs/GLOSSARY.md, optional observed code mappings,
acceptance-first population, and authorized batched ADR recording. No additional
grill-with-docs dependency is needed.

Visual verification requires a working permitted real browser. Check local-page
opening and screenshot capture at the start of Phase 2b, before rendering options;
repeat if the environment changes before Phase 3/4 checks. Playwright with Chromium
is one supported route where allowed; use the host's browser mechanism when
required. Report unavailable tooling before proceeding with explicitly unchecked
previews. Tool installation and permissions remain subject to user scope and
client controls.
