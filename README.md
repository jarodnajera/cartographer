# cartographer

Skill to map out your project

## Install companion skills

Install companion skills through the interactive `npx` installer for Codex,
Claude Code, or another supported agent:

```sh
npx skills@latest add mattpocock/skills
```

Choose your target agent and select the skills you need:

| Role | Skills | Purpose |
| --- | --- | --- |
| Required | `grilling` | Specification and feature-discovery interviews |
| Recommended for Phase 2 | `codebase-design`, `domain-modeling` | Architecture tradeoffs and domain vocabulary |
| Recommended for Phase 3 as needed | `writing-for-agents`, `wizard` | Agent-facing documentation and human-only procedures |
| Recommended for Phase 2 visual exploration | `prototype` | Bounded UI/logic experiments before implementation |
| Phase 3 and 4b behavior implementation | `tdd` | Test-first behavior at agreed seams |
| Phase 4 review and diagnosis | `code-review`, `diagnosing-bugs`, `wizard` | Standards/spec review, confirmed causes, human-only test setup |

For Anthropic's `frontend-design` (recommended for Phase 2b and UI implementation),
use its separate source and select `frontend-design` in the installer:

```sh
npx skills@latest add anthropics/skills
```

[frontend-design source](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
is maintained by Anthropic, separately from the Pocock skills.

Cartographer reads installed grilling and applies its own spec workflow.
Scaffold-only requests can run independently. Additional skills are recommendations,
not an automatic workflow. Keep Cartographer's bundled research workflow and
existing document paths when using companion skills.

See [dependency installation and compatibility](skills/cartographer/references/dependencies.md)
for prerequisites, installation scope, and verification. Use this `npx` route
instead of also installing the same skills through an agent marketplace.

The interview procedure builds on [Matt Pocock's grilling skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling).
Earlier bundled workflow runs used upstream revision
`95249b0b49782349740fd9b8c6ce32b4e59e497a`. Test4 exercised external companion-skill
use through foundation, planning, design, a prototype and local implementation. Its [conversation](tests/test4/CONVERSATION.md)
and [handover](tests/test4/HANDOVER.md) record the evidence and limitations;
[skills-lock.json](tests/test4/skills-lock.json) records installed Pocock sources/hashes,
not a complete reproducible version pin. The transcript is redacted, reconstructs
early exchanges, and omits tool events; skill loading and execution order are
reported rather than independently proven. Missing-dependency behavior, the manual
wizard, hosted integration and rendered-browser behavior remain unproven. Newer
installed revisions are not automatically covered by this run.

Phase 2b selects structure and appearance separately, using rendered directions
for the first substantial UI feature. Phase 3 implements the approved style and
compares desktop/mobile screenshots. Screenshot critique requires an available
permitted browser, such as Playwright with Chromium; unavailable rendering is
reported explicitly. Browser installation is not automatic. This revised visual
workflow has not yet been behaviorally evaluated.

## Phase 4: Review and remediation

[Review and remediation](skills/cartographer/references/phases/review-feature.md)
is part of Cartographer's active workflow. It separates hands-on review/diagnosis
from authorized fixes and repeats until the user and agent agree the feature is
ready to move on. Explicit user confirmation marks the plan Complete.

To start, ask Cartographer to review the implemented feature against its accepted
plan. After remediation planning, request the agreed fixes when ready. Existing
authorization is honored; a review request alone does not authorize production fixes.

This workflow and its expanded TDD integration have not yet been behaviorally
evaluated; Test4 does not establish Phase 4 success.
