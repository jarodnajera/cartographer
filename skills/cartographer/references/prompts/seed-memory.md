# Seed memory (optional)

Let memory grow naturally through normal work. Use this prompt only when
I already have a few confirmed facts or preferences worth carrying forward.
An empty memory is fine; do not invent entries to fill a template.

I would like to seed these items:

- [A confirmed preference or durable finding]
- [Where it applies: this project or my work generally]
- [Any important condition or exception]

Ignore unfilled placeholders. If no real items are supplied, explain that
seeding is unnecessary and stop rather than generating speculative notes.

## Review the seeds

1. Establish the target agent, actual memory capabilities, and intended
   scope. Do not promise persistence or cross-project recall without
   checking the relevant mechanism.
2. Keep only explicitly supplied information or findings supported by
   repeated experience. Do not infer lasting preferences from one task.
3. Distinguish recall from instructions:
   - Required project rules belong in AGENTS.md or project documentation.
   - Consistent personal defaults belong in user-level instructions;
     use create-soul.md if a preference interview is needed.
   - Temporary work, blockers, and next steps belong in HANDOVER.md.
   - Memory is for useful durable context, corrections, and discoveries
     that are not already captured by those sources.
4. Preserve scope and exceptions. Do not turn a preferred tool into an
   unconditional requirement for every project.
5. Exclude secrets, sensitive personal details, session logs, tentative
   conclusions, and facts readily recoverable from current code.
6. Review existing relevant entries when accessible. Merge duplicates,
   surface contradictions, and preserve unrelated memories. Do not
   silently replace a confirmed preference with an inferred one.

## Agent compatibility

### Claude Code

Auto memory is normally per project, stored under
~/.claude/projects/<project>/memory/, with possible configuration overrides.
Use /memory or the client's reported location to find the actual store;
do not guess its encoded directory name. A repository-root MEMORY.md is
not automatically the active auto-memory file.

Keep MEMORY.md a short index, with detailed entries in topic files when
needed. Preserve the client's existing format. The initial load is limited
to 200 lines or 25KB, whichever comes first. Project memory does not provide
a universal cross-project preference store; use user-level CLAUDE.md or
user rules for that purpose.

### Codex

Codex local memories, when available and enabled, use a generated store
under CODEX_HOME/memories (normally ~/.codex/memories). Use supported
memory controls such as /memories; do not manually overwrite generated
files or install this MEMORY.md template into that store.

Memory generation can happen later in the background. Do not claim an
item was saved merely because it was mentioned in the chat. Put personal
defaults that must apply consistently in global AGENTS.md, normally
~/.codex/AGENTS.md, respecting CODEX_HOME and existing instructions.

### Unavailable or disabled memory

Do not enable memory or change configuration automatically. Explain the
limitation and offer a reviewable note or an appropriate instruction-file
update. A saved Markdown draft is not proof of future automatic recall.

## Deliverable

Route each supplied item to the appropriate scope and destination. When
supported, save suitable items through the agent's available memory
mechanism. This request permits seeding those supplied items, not changing
memory settings or rewriting unrelated instruction files.

If drafting a manual note, use the bundled
[MEMORY template](../../assets/templates/optional/MEMORY.md) as a minimal
starting point. Resolve the link relative to this prompt file, not the
target project. Present the draft unless I requested a destination.
Never copy an empty template over active memory.

Summarize what was actually saved and where, what was omitted or routed
elsewhere, and any persistence limitations. Distinguish saved, drafted,
and pending background generation. Do not require a full memory document
before coding; let useful knowledge accumulate through normal work.

## References

- [Claude Code auto memory](https://code.claude.com/docs/en/memory)
- [Codex local memories](https://learn.chatgpt.com/docs/customization/memories)
