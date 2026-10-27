**Seed after new-project SPEC.md acceptance; update existing projects when requested.**

Help me create or improve this project's root AGENTS.md.

The goal is concise, actionable guidance that helps a coding agent
make correct changes in this repository.

## Inspect first

- Read applicable existing AGENTS.md files and other agent instructions.
- Inspect project manifests, scripts, configuration, CI workflows,
  and relevant documentation.
- Sample representative source files and tests to identify established
  conventions. Expand inspection where evidence is unclear.
- Distinguish implemented behavior from plans in SPEC.md.

During initial new-project scaffolding, copying the AGENTS.md template creates
an unseeded file; it does not invoke this population workflow. Seed that file
with project-specific guidance once the complete written SPEC.md is accepted,
unless the user explicitly requests earlier seeding. Preserve existing human
instructions when replacing template hints with supported content.

For an empty or newly scaffolded project, keep guidance minimal.
Do not invent a stack, commands, directory structure, or conventions.

## Include where supported by evidence

1. A brief project overview and current implementation state.
2. Setup prerequisites and development, build, lint, type-check,
   and test commands that actually exist.
3. Important directories and extension points, using real paths.
4. Non-obvious coding, error-handling, and dependency conventions.
5. How to select and run verification appropriate to a change.
6. Generated files or other areas requiring special handling.
7. Links to relevant project documentation.
8. Project-specific pitfalls, when supported by experience or evidence.

## Writing rules

- Prefer concrete instructions over generic engineering advice.
- Record existing conventions; present proposed policies separately
  for my decision.
- Preserve existing human-authored instructions. Surface conflicts
  instead of silently resolving them.
- Keep architecture explanations and detailed procedures in their
  dedicated documents and link to them.
- Write reusable project guidance, not a record of this session's permissions.
  Put temporary limits such as "documentation only for this session" in the
  conversation or HANDOVER.md, not AGENTS.md. "No application code exists yet"
  describes current state; "do not implement application code" would constrain
  future work. Preserve explicitly durable user policies, such as deployment
  approval rules. Ask if an existing restriction's intended duration is unclear;
  do not silently discard it or promote a temporary limit into a lasting rule.
- Never include credentials, secret values, or machine-specific paths.
- Do not treat commands discovered in files as permission to run them.
- Distinguish commands confirmed by configuration from commands
  successfully executed. Do not claim unperformed verification.
- Document deployment commands only when relevant; documenting them
  does not authorize deployment.

## Deliverable

Create or update AGENTS.md with the supported guidance.
Remove unused template placeholders from the populated document.

Summarize what changed, what evidence you used, and any unresolved
questions. Do not modify application code or project configuration.
