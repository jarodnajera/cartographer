**Seed after framework/application setup; update existing projects when requested.**

Help me create or improve this project's root AGENTS.md.

The goal is concise, actionable guidance that helps a coding agent
make correct changes in this repository. Aim for roughly 300–400 words in the
populated AGENTS.md; use less when sufficient and more for genuinely complex
repos. Prioritize useful instructions over filling sections. Never drop durable
user policies or essential commands merely to meet the budget.

## Inspect first

- Read applicable existing AGENTS.md files and other agent instructions.
- Inspect project manifests, scripts, configuration, CI workflows,
  and relevant documentation.
- Sample representative source files and tests to identify established
  conventions. Expand inspection where evidence is unclear.
- Distinguish implemented behavior from plans in SPEC.md.

Initial documentation scaffolding creates AGENTS.md from its template without
seeding it. For a new project, populate it after the framework/application
skeleton exists so paths, scripts, and conventions come from actual files.
If the project is still documentation-only, keep the template unseeded and
return the spec workflow's setup guidance rather than generating speculative
conventions. This workflow does not itself authorize running a scaffolder.

For an existing codebase, inspect and populate guidance directly when requested.
Preserve human instructions when replacing template hints with supported content.
Do not invent a stack, commands, directory structure, or conventions.

## Include where supported by evidence

1. A brief project overview and current implementation state.
2. Setup prerequisites and development, build, lint, type-check,
   and test commands that actually exist.
3. A few important directories or extension points, not a starter-file inventory.
4. Non-obvious coding, error-handling, and dependency conventions.
5. How to select and run verification appropriate to a change.
6. Generated files or other areas requiring special handling.
7. Links to relevant maintained documentation. Link to SPEC.md for scope and
   release gates rather than repeating them. If a planning guide exists, include
   a short pointer for substantial feature work rather than copying its rules.
   Once docs/GLOSSARY.md has content, link it with a one-line instruction:
   "Use docs/GLOSSARY.md terms in code, UI text and tests."
8. Project-specific pitfalls, when supported by experience or evidence.

## Writing rules

- Prefer concrete instructions over generic engineering advice.
- Record existing conventions; present proposed policies separately
  for my decision.
- Preserve existing human-authored instructions. Surface conflicts
  instead of silently resolving them.
- Keep architecture explanations, detailed procedures, and product requirements
  in their canonical documents; link instead of restating them. Include a
  requirement directly only when it supplies a non-obvious working constraint.
- Prioritize actual command working directories, runtime prerequisites, important
  conventions, and pitfalls likely to cause incorrect work. Avoid listing every
  starter configuration file or linking empty scaffolds just for completeness.
- Write reusable project guidance, not a record of this session's permissions.
  Put temporary limits such as "documentation only for this session" in the
  conversation or HANDOVER.md, not AGENTS.md. "No application code exists yet"
  describes current state; "do not implement application code" would constrain
  future work. Preserve explicitly durable user policies, such as deployment
  approval rules. Ask if an existing restriction's intended duration is unclear;
  do not silently discard it or promote a temporary limit into a lasting rule.
- Never include credentials, secret values, or machine-specific paths.
- Do not treat commands discovered in files as permission to run them.
- AGENTS.md defines which checks apply and where to run them. Session results,
  checks not run, and temporary environment problems belong in HANDOVER.md or
  the conversation, not lasting guidance. For example, record the package's
  required Node version here; record the current shell's incompatible version
  in the handover. Do not add repeated "not run while seeding" disclaimers.
- Discover commands from actual configuration without implying they passed.
  Report performed verification and limitations separately; never invent results.
- Document deployment commands only when relevant; documenting them
  does not authorize deployment.

## Deliverable

Create or update AGENTS.md with the supported guidance. Remove unused template
sections/comments and compress duplicated material. Review whether each entry
helps the next agent work correctly; keep transient status out of the file.
If the file needs to exceed the target length, explain the concrete reason in
the completion summary rather than silently truncating necessary instructions.

Summarize what changed, what evidence you used, and any unresolved
questions. Do not modify application code or project configuration.
