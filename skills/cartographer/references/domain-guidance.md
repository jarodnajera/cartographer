# Domain-modeling integration

Use installed `domain-modeling` when discovery involves ambiguous terminology,
relationships or behavior-changing edge cases, including Phase 1. Locate and read
its actual instructions; see [dependency setup](dependencies.md). It is recommended,
not a new required dependency: if unavailable, explain setup without claiming use
or blocking independent discovery. Compose it with grilling directly; the
`grill-with-docs` wrapper is not a Cartographer dependency.

These rules override conflicting upstream document paths and write timing,
subject to higher-priority instructions and user scope.

## Vocabulary lifecycle

- During Phase 1, challenge competing or overloaded terms in the next eligible
  interview round. Record resolved meanings in the Draft SPEC.md where used;
  leave docs/GLOSSARY.md unseeded until written-spec acceptance. Limit additional
  scenario questions to ambiguity affecting behavior or UI.
- At spec acceptance, check one term per concept and seed docs/GLOSSARY.md using
  the [spec workflow](prompts/create-spec.md#seed-the-domain-glossary).
- During Phase 2, retain proposed feature terms in the plan. Update the glossary
  when their meanings are accepted, normally with final written-plan acceptance.
- In Phases 3–4, add a newly agreed term directly if it fits accepted requirements.
  If it changes product behavior or conflicts with the spec, resolve and accept
  the affected spec/plan change before publishing that meaning as authoritative.

Keep docs/GLOSSARY.md and its optional _In code_ mappings; fill mappings only for
observed identifiers. Preserve existing accepted entries and surface conflicts.
Do not move the file to the root or create a second glossary to satisfy upstream.

## ADR assessment at acceptance

At each spec or final feature-plan acceptance, assess newly accepted decisions
(or candidates in the draft being presented) against all three criteria:
meaningful cost to reverse, surprising without context, and a genuine tradeoff
between alternatives. Importance alone does not qualify a decision. Check existing
ADRs to avoid duplicate records; there is no target count.

Batch qualifying candidates with a one-line rationale each in the acceptance
summary. Ask once: “These decisions qualify for ADRs. Want me to record them?”
If none qualify, state that in one line. Honor prior authorization to record ADRs
without asking again. The offer may accompany the spec/plan acceptance question,
but broad document acceptance alone does not authorize the optional ADRs. A clear
answer can approve both. Write only after the decisions themselves are accepted
and ADR creation is authorized; keep an unanswered offer pending without blocking
otherwise accepted work.

Write concise docs/adr/0001-slug.md records, incrementing the existing numbering.
Use context, decision and why in a short paragraph; add status, alternatives or
consequences only when useful. Link the spec/plan decision to its ADR for durable
rationale rather than copying it. Preserve prior records when decisions change;
mark supersession explicitly. Follow the installed domain-modeling ADR format
within these conventions.

During implementation or remediation, assess newly agreed material departures or
constraints not apparent in code at the affected decision's acceptance checkpoint.
Apply the same criteria, batching and authorization. Planned departures remain
proposals until accepted; ADRs do not retrospectively authorize scope changes.
