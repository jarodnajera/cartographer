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
| Optional for later development | `prototype`, `tdd`, `code-review` | Visual exploration, implementation, and review |

Cartographer reads installed grilling and applies its own spec workflow.
Scaffold-only requests can run independently. Additional skills are recommendations,
not an automatic workflow. Keep Cartographer's bundled research workflow and
existing document paths when using companion skills.

See [dependency installation and compatibility](skills/cartographer/references/dependencies.md)
for prerequisites, installation scope, and verification. Use this `npx` route
instead of also installing the same skills through an agent marketplace.

The interview procedure builds on [Matt Pocock's grilling skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling).
Earlier bundled workflow runs used upstream revision
`95249b0b49782349740fd9b8c6ce32b4e59e497a`. The external-installation migration still
needs an end-to-end smoke test; newer installed revisions are not automatically
covered by that baseline.
