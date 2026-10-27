# Create collaboration preferences (optional)

Use once to establish personal preferences, or later to revise them.
This workflow is optional and separate from project scaffolding.

Help me create a concise collaboration profile that I can reuse across
projects. The profile is called SOUL.md here, but the installation format
depends on the agent. Do not assume that SOUL.md loads automatically.

## Interview

1. Establish whether I use Codex, Claude Code, or both. Use explicit
   context if available; ask if it is unclear.
2. Read the bundled [SOUL template](../../assets/templates/optional/SOUL.md),
   resolving the link relative to this prompt file, not the target project.
   If unavailable, use the topics below without blocking the interview.
3. If I provide an existing profile, preserve relevant preferences and
   identify contradictions before proposing changes.
4. Ask a few related questions per round and wait for my answers. Cover:
   - Relevant experience, existing strengths, and learning goals.
   - Communication: detail, tone, examples, and progress updates.
   - Decisions: recommendations, disagreement, and meaningful tradeoffs.
   - Working habits and specific assistant behaviors to avoid.
5. Ask follow-up questions only when they change the resulting guidance.
   Do not infer personality, competence, or working style from a resume,
   job title, or a single task. Omit topics I prefer not to answer.

## Draft

- Write short, actionable instructions based on my stated preferences.
- Make tradeoff preferences conditional where appropriate; distinguish
  flexible defaults from firm constraints.
- Keep project requirements, commands, chosen stacks, session state,
  and authorization rules out of this personal profile.
- Do not invent biographical details or request sensitive personal data.
- Resolve contradictions with me rather than silently choosing a rule.
- Present the draft for review. Remove empty sections and template
  comments from the finished profile.
- Do not generate a filled profile solely from example placeholders.

## Agent compatibility and installation guidance

### Codex

Codex uses global AGENTS.md instructions rather than a special SOUL.md
file. Place the reviewed preference sections directly in AGENTS.md under
CODEX_HOME, which defaults to ~/.codex (normally ~/.codex/AGENTS.md).
Keep them separate from the repository's project-specific AGENTS.md.

If the global file already exists, propose a focused merge that preserves
unrelated instructions and resolves duplicate or conflicting preferences.
A non-empty global AGENTS.override.md takes precedence over AGENTS.md;
flag it if discovered during an authorized installation. Do not delete
it or work around it automatically.

Do not assume Claude's @SOUL.md import syntax is supported by Codex.
Start a new Codex session after installation to load the updated guidance.

### Claude Code

Claude Code does not automatically discover SOUL.md by name. A reusable
setup is a populated ~/.claude/SOUL.md imported from the user-level
~/.claude/CLAUDE.md by adding this line outside a code block:

```text
@SOUL.md
```

The relative import resolves beside CLAUDE.md. Alternatively, merge the
preferences directly into the user-level CLAUDE.md. Preserve existing
instructions; do not create duplicate imports. Start a new session and
check the loaded instructions after installation.

### Both agents

Draft one provider-neutral set of preferences, then explain how to use
it in each agent's supported format. If maintaining both copies, update
them together when the user requests preference changes; do not claim
they synchronize automatically.

## Deliverable and boundaries

Present the reviewable profile and the installation guidance relevant
to my agent. If saving a draft is requested, use the requested destination;
otherwise present the content in the conversation.

Creating this draft does not authorize changing personal configuration,
agent memory, or other files. Install or merge it only when requested.
Keep populated personal profiles outside shared repositories by default;
Cartographer ships the generic optional template, not a user's biography.

## References

- [Codex global instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Claude Code instructions and imports](https://code.claude.com/docs/en/memory)
