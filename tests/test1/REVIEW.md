# Cartographer Skill Review

Reviewed: 2026-10-27
Scope: `SKILL.md`, bundled references (prompts, grilling, TDD), templates, and the
freelancer-tracker test run (`tests/CONVERSATION.md`, `tests/SPEC.md`, `tests/AGENTS.md`).

## Summary

Cartographer is well designed. Its safeguards target real agent failure modes:
fabricated commands, recommendations treated as decisions, "sounds good" treated as
permission to build, and specs padded with plausible placeholders. The test run shows
the core mechanics working: frontier-based interview rounds, a transition from
discovery to proposed design, cost surfacing, separate confirmation and acceptance,
AGENTS.md deferred until acceptance, and no application code.

The main problem is structural. The same rules are written into SKILL.md, the prompt
files, and the templates, often nearly word for word. The test run shows the cost:
the rule repeated everywhere (AGENTS.md deferral) was followed carefully and even
narrated to the user three times, while rules stated in fewer places (ask for a
project name, ask about the current process and pain point) were skipped entirely.
Consolidating so each rule lives in one place should improve behavior, not just
reduce length.

## Test run findings

### What worked

- **Cost surfacing.** Without being asked, the agent checked current docs and
  surfaced that Supabase Free has no automatic backups and can pause, Pro is
  $25/month, and production auth email needs custom SMTP. It framed these as launch
  dependencies, not authorized spending.
- **Release staging.** The split between a free-tier synthetic-data pilot and
  real-data release gates is strong.
- **Testable acceptance criteria.** Date-boundary examples and cross-user RLS
  criteria are concrete and verifiable.
- **Handling an answer that jumped ahead.** "supabase for db" was recorded as a
  user decision (D9) rather than ignored or reopened.

### What went wrong

1. **Explicit instructions skipped.** The project name and current process/pain
   point were never asked about, even though SKILL.md, create-spec.md, and the SPEC
   template all require them. The final SPEC.md omits both template sections.

2. **Batch approval.** One "yes" to "does this proposal reflect what you want?"
   moved D12–D15 to Agreed. The spec labels as agreed several items the user never
   saw: 28-day backup retention, a deletion ledger, hex colors, WCAG 2.2 AA, a 24h
   data-loss target, and stale-write conflict detection. Grilling's "word each
   question so yes accepts the recommendation" amplifies this.

3. **Ceremonial written acceptance.** A ~4,000-word spec was accepted moments after
   it was presented. The two-step gate looks rigorous but can't be meaningful unless
   the consequential commitments are shown in a short form before acceptance.

4. **The user's core question got no options comparison.** The user opened unsure
   between a local tool and a web app. This was resolved indirectly through a
   yes/no question about hosted storage. A local-first option was never presented
   with tradeoffs, even though the web choice brought in auth, RLS, an account
   deletion Edge Function, SMTP, backups, and a deletion ledger.

5. **Scope growth from the agent's own recommendations.** "A documented
   backup/recovery approach" (recommended by the agent, accepted by the user) became
   encrypted off-site backups, retention policy, restore drills, RTO/RPO targets,
   and deletion-ledger reconciliation. That's heavy for "low ongoing costs, small
   first version." The proportionality rule exists, but nothing enforced it.

6. **Session permissions leaked into lasting documents (bug).** SPEC.md's Scope
   section says "Do not implement application code," and AGENTS.md says "Current
   authorization is project foundation documentation only; do not implement
   application code, install packages, provision services, or deploy." AGENTS.md
   loads in every future session, so a fresh agent will be told not to build when
   implementation starts. SPEC.md also repeats "not authorized" roughly ten times.

7. **Smaller issues.**
   - "Next interview frontier" remained in the accepted spec.
   - The test ran inside the skill repo's `tests/`, so the spec spends words
     explaining that paths are relative to the current workspace's `tests/`. A
     separate scratch directory would keep test artifacts clean.
   - The agent narrated Cartographer's internal rules to the user several times.

## SKILL.md

### Strengths

- Gates: confirming shared understanding is separate from accepting the written
  spec, and neither authorizes code.
- Anti-fabrication rules: don't invent commands, keep planned and implemented
  facts separate, wait for user decisions.
- Progressive disclosure through the routing table.
- Proportionality and cost-surfacing guidance.
- The description includes a negative trigger.

### Issues

1. **Dense rules with equal weight.** Most sentences are terse directives, and many
   read like patches for specific test failures. Claude can't tell central rules
   (acceptance gates) from edge cases (symlinks). Explaining *why* helps the model
   generalize.
2. **The core workflow is buried.** The spec interview is one long paragraph placed
   after the scaffolding rules. Phase 1 should be a short ordered sequence: context,
   interview rounds, confirm understanding, draft, written acceptance, AGENTS.md,
   handoff.
3. **Maintainer-facing text.** Installation and distribution notes and "no bundled
   CLI implementation" belong in the README, not in runtime instructions.
4. **Scaffolding is ambiguous and eager.** "Scaffold when requested" conflicts with
   scaffolding being Phase 1's job. A new project gets about 11 files and folders,
   most of which must stay empty. Prefer SPEC.md (and HANDOVER.md) up front and
   create other docs when there's content for them.
5. **The description needs natural trigger phrases**, such as "I have an app idea,"
   "help me write a spec," "plan this feature," or "document this repo."
6. **Nested `SKILL.md` names.** Rename `references/grilling/SKILL.md` and
   `references/tdd/SKILL.md` (e.g., `grilling.md`, `tdd.md`) so they aren't mistaken
   for or loaded as standalone skills.
7. **The toolbox is thin.** It currently has one optional TDD reference. Either
   describe the planned toolbox at handoff or present it more modestly.
8. **"Foundation" is undefined.** State whether Phase 1 is docs only, or add an
   explicit, gated project-skeleton step after acceptance.

## References

### Cross-cutting

- **Written in the user's voice.** The prompts read as paste-in user prompts ("Help
  me...", "[Describe the idea]"), which forced the patch in SKILL.md about treating
  placeholders as examples. Rewrite them as agent instructions, and keep paste-in
  versions for humans separately if wanted.
- **Duplication with SKILL.md.** Proportionality, recurring costs, AGENTS.md
  deferral, two-step acceptance, and feature-plan rules appear in both. Make
  create-spec.md the single source of truth and reduce SKILL.md's Phase 1 to an
  outline that points to it.
- **Hardcoded product details will go stale.** Memory locations and limits, import
  syntax, and Codex file names. Follow create-hooks.md's pattern: give the approach,
  link the official docs, and verify before acting.

### Per file

- **create-spec.md.** The strongest file. Fix the conflict with grilling: grilling
  ends only when "every branch [is] visited," while create-spec says to stop
  discovery and propose. State explicitly that create-spec overrides grilling's
  completion condition. Add a concrete example of a light spec to calibrate depth.
- **create-agents.md.** Concise and evidence-based. Check whether Claude Code reads
  AGENTS.md directly in your setup. If not, create or suggest a CLAUDE.md that
  imports it.
- **create-handover.md.** Very good: separate write and resume flows, snapshot
  rather than diary, recorded results treated as historical.
- **create-hooks.md.** Rigorous, though heavy for "lightweight." Consider warning
  once per session on the main branch instead of before every edit.
- **create-soul.md / seed-memory.md.** Careful, but about personal/global agent
  config rather than project mapping. Consider moving them to a separate skill.
- **TDD (adapted).** It references `codebase-design` and `code-review` skills that
  aren't bundled, so make those references conditional or remove them. It reads
  `COMPENDIUM.md`, but the convention is `docs/COMPENDIUM.md`.
- **Provenance.** UPSTREAM.md files with pinned commits and licenses are excellent
  practice.

## Templates

### Cross-cutting

- **A third copy of the rules.** SPEC.md's comments restate the acceptance rules,
  progressive population, the empty-heading rule, and even AGENTS.md deferral.
  Templates should hold structure plus short section hints only.
- **Instructions get copied into user repos.** Comments such as "Populate it
  through Cartographer's specification workflow" end up in the user's SPEC.md,
  where a later agent without Cartographer can't follow them.
- **Zero-byte templates.** ARCHITECTURE.md, TESTING.md, RUNBOOK.md, and
  COMPENDIUM.md are empty, unlike SPEC.md and HANDOVER.md, which have Status lines.
  Give each a title, a one-line purpose, and a status, or create them lazily.

### Per file

- **SPEC.md.** Good section list, and keeping the decision map inline is a good
  call. Say what happens to "Next interview frontier" at acceptance. Consider moving
  "Release gates" next to "Scope and non-goals." Show the format of the Accepted
  status line.
- **AGENTS.md.** It contradicts create-agents.md: it ships a generic prefilled
  "Feature planning" section and hardcodes links to all ten docs, including empty
  ones. AGENTS.md loads every session, so keep it lean and add links only for docs
  with content.
- **HANDOVER.md.** The best template. "On resume" is real text and survives
  population.
- **PLANS.md.** Solid, with good attribution. It mentions Codex Plan mode only, so
  name both agents or neither. The `.gitkeep` in `docs/plans/` is redundant because
  PLANS.md is there.
- **COMPENDIUM.md.** Needs a definition. It's described as durable knowledge in
  some places and used as a domain glossary by TDD.
- **SOUL.md / MEMORY.md.** Fine as optional templates. The agent-specific install
  details will go stale.

## Prioritized fixes

1. **Ask the name and pain-point questions in round one.** List them explicitly in
   SKILL.md's Phase 1 steps.
2. **No batch design approval.** Present design decisions individually with
   tradeoffs. Anything not seen individually stays Proposed.
3. **Commitments summary before acceptance.** Show a short list of costs, operator
   duties, and hard-to-reverse choices.
4. **Options comparison for the user's core uncertainty.** Show two or three options
   with tradeoffs, including what each adds to scope.
5. **Project documents describe the project, not session permissions.** Keep
   authorization in HANDOVER.md or the conversation. Fix the test's AGENTS.md and
   SPEC.md Scope section.
6. **Calibrate proportionality with an example** of what's too much for a solo MVP
   (e.g., prefer the managed service's defaults over custom operator infrastructure).
7. **Consolidate rules.** SKILL.md handles routing and gates, prompts hold the
   workflow rules, and templates hold structure and hints.
8. **Clean up.** Remove maintainer text from SKILL.md, rename nested `SKILL.md`
   files, fix the TDD references, define COMPENDIUM.md, give empty templates status
   lines or create them lazily, and run tests in a scratch directory.