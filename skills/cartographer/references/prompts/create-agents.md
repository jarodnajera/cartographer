**Run after initial setup**

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