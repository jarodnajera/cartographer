# Create project hooks (optional)

Help me set up lightweight, advisory hooks for this project.
Hooks are optional automation, not part of the default scaffold.

## Inspect first

1. Establish whether the target is Codex, Claude Code, or both, including
   the client/version, operating system, and available script runtime.
   Use existing evidence; ask only about choices that remain unclear.
2. Read applicable AGENTS.md instructions, existing hook configuration,
   manifests, lockfiles, CI workflows, and relevant testing guidance.
   Identify actual package-manager, lint, type-check, and test commands.
3. Check the official documentation for the installed client's supported
   events, tool matchers, input payloads, output schema, and hook loading.
   Do not assume matching event names imply identical behavior.
4. Use project-scoped configuration by default. Preserve unrelated
   settings and hooks, and avoid registering the same hook twice.

## Requested behavior

### Branch reminder

Before supported file-editing tools run, warn if the working branch is
main or master and suggest a feature branch. Respect another primary
branch if established by project configuration.

The reminder is advisory: do not block the edit, approve permissions,
switch branches, or create a branch automatically. Handle non-Git
projects and detached HEAD states without crashing. Describe which edit
paths the hook covers; do not claim it catches every shell-based edit.

### Lint and type-check

After relevant source edits, run existing non-mutating lint and type-check
commands where the project supports them. TypeScript/JavaScript is an
example, not a required stack.

Use file-scoped checks only when the tool supports them. Type-checking
may require project-level configuration; do not pass arbitrary file paths
if that changes the command's meaning. Report missing checks as gaps
rather than installing dependencies or inventing commands.

### Tests

After test-file edits, run the relevant tests using the project's actual
naming conventions and runner. Use a one-shot command, never watch mode.
If there is no reliable focused command, explain the fallback and its
cost. Avoid running the entire suite on every edit; batch expensive
checks at a supported lifecycle boundary when appropriate.

## Implementation requirements

- Keep hooks advisory. Check failures should provide actionable feedback
  without denying tool use or forcing an agent to continue indefinitely.
  Advisory does not necessarily mean asynchronous; explain any latency.
- Use the documented model-visible feedback mechanism for each event.
  Do not assume plain stdout reaches the agent. Separate a check's failed
  result from the hook wrapper's execution status, using the supported
  output schema and exit behavior to preserve advisory semantics.
- Parse JSON input with a real parser. Handle missing fields, multiple
  edited files, unrelated tools, paths with spaces, and deleted files.
  Do not assume every provider supplies tool_input.file_path.
- Resolve paths from the project context, including nested working
  directories and worktrees. Quote arguments and never evaluate hook
  input as shell code.
- Set explicit timeouts and bound reported output. Report timeouts,
  skipped checks, and unavailable commands honestly; never label them
  passing. Avoid exposing environment values or secrets in diagnostics.
- Prevent duplicate or overlapping expensive runs. Avoid auto-fix flags,
  file-writing formatters, and recursive check-triggered edits.
- Generate scripts for the available runtime. List prerequisites and
  explain any portability limitations.

## Agent-specific configuration

### Codex

Use project .codex/hooks.json or inline hooks in .codex/config.toml,
following the existing representation rather than adding both. Verify
support in the target client. Account for Codex's tool payloads, including
apply_patch, rather than copying Claude-specific file-path handling.
Explain project trust and hook review through /hooks; do not bypass trust.

### Claude Code

Use .claude/settings.json for shared project hooks, or
.claude/settings.local.json when the user requests private local hooks.
A plugin's hooks/hooks.json is a different packaging format. Match the
actual editing tools and use Claude's documented payload/output schema.

### Both agents

Share check-running logic where useful, with separate configuration and
input/output adapters where needed. Explain how to avoid duplicate check
runs if both clients operate on the same working tree.

## Validation and deliverable

Generate the scripts and the minimal configuration changes needed for
the selected agent. Validate syntax and exercise representative payloads
in isolation: a primary-branch warning, a feature-branch no-op, a relevant
edit, an unrelated edit, a failed check, and missing tooling. Include a
path with spaces and the provider's actual edit payload format.

Show how failures reach the model without blocking work. Distinguish
script-level tests from an actual live hook test; do not claim that hooks
are active unless activation has been verified.

Summarize created or changed files, commands, trigger coverage, expected
feedback, prerequisites, activation steps, and how to disable these hooks
without removing unrelated configuration.

This request covers project hook scripts and configuration. Do not change
application code, install dependencies, alter global agent settings, or
weaken existing checks. If hooks are unsupported, explain the limitation
and propose existing task/CI commands instead of fabricating integration.

## References

- [Codex hooks](https://learn.chatgpt.com/docs/hooks)
- [Claude Code hooks](https://code.claude.com/docs/en/hooks)
