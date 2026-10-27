# Cartographer Phase 1 Review

Reviewed: 2026-10-27
Scope: commit `7fa8e49` ("made main SKILL.md route focused..."), covering `SKILL.md`,
`references/prompts/create-spec.md`, `references/prompts/create-agents.md`,
`references/grilling/SKILL.md`, the SPEC and AGENTS templates, and the Lancealot test
run in `tests/test2/`. Compared against `tests/test1/REVIEW.md` and the source article,
[6 files that make Claude Code actually useful](https://dev.to/jazzpujols34/6-files-that-make-claude-code-actually-useful-4cob).

## Summary

Phase 1 is in good shape, and the latest commit fixed several failures from the test1
review. The article's prompts are one-shot; Cartographer adds real gates (shared
understanding, written acceptance, no implied authorization), which is its main
improvement over the source.

The remaining problems are about proportion and timing:

- The spec is mostly agent-proposed detail approved with "yes".
- AGENTS.md is generated before any code exists to describe.
- Scaffolding creates files with nothing to put in them.

## What improved since test1

- **Name and pain point asked in round one.** The user named the project Lancealot and
  described the spreadsheet with no notifications.
- **Explicit comparison of the core uncertainty.** Local versus web got a comparison
  table instead of being settled indirectly through a storage question.
- **User override respected.** The switch from the proposed Django stack to Vue/Supabase
  was recorded as the user's decision. The agent also flagged that Cron, Edge Functions
  and external email went beyond what the user had chosen and needed separate review.
- **Session limits kept out of lasting docs.** The "documentation only" constraint stayed
  in HANDOVER.md rather than AGENTS.md.

## Issues

### 1. Acceptance is still mostly "yes"

Across six rounds the user typed about 60 words of decisions. Most answers were
"1. yes 2. yes 3. yes", and a single "yes" approved the whole revised architecture.
The result is a ~30KB spec, almost all of it agent-proposed.

Grilling's rule ("word each question so 'yes' accepts your recommended answer") pushes
toward this.

Fixes:

- For consequential decisions, ask the user to pick an option (A/B/C) rather than
  confirm a recommendation.
- Cap each round at about three consequential questions.

### 2. The spec is too big for the input

A 4,000+ word spec for a free beta with no budget and no deadline is a lot for a future
agent to treat as binding.

**What "fleshed out" should mean.** Every decision that matters is made, not that the
document is long.

The article's podcast example shows what a spec is for. Each wrong guess there was a
choice that was expensive to undo:

- Flask vs. FastAPI
- relational vs. Firestore
- one JSON blob vs. per-episode markdown
- REST API vs. cron CLI

A good spec removes those guesses. That is the part worth fleshing out:

- scope and non-goals
- stack
- data ownership and the data model
- auth
- acceptance criteria
- anything hard to reverse

**Where extra detail hurts:**

- **It's guessed before there's any code.** Folder trees, component contracts, color
  values and wireframes for later screens are written before the agent has seen the
  project, and many will be wrong once building starts. The article treats SPEC.md as
  a read-only snapshot, so wrong details stay in the document and later agents follow
  them.
- **It blurs who decided what.** In test1, one "yes" marked hex colors, WCAG 2.2 AA, a
  24-hour data-loss target and a deletion ledger as Agreed without the user seeing them.
  Once real decisions and agent guesses carry the same label, a future agent can't tell
  which ones it is free to change.
- **It costs attention.** An agent reading 30KB before each feature gives the key
  constraints less weight than a two-page spec would, and more text means more chances
  for sections to contradict each other.

**Where the detail should go.** Phase 2 already exists for this. When a feature is
selected, its plan can specify components, screens and contracts with real code to look
at, and that detail is fresh when it's used. The spec stays a stable statement of intent;
the plans hold the rest.

**Proposed rule for create-spec.md:**

> For each section, ask: "If the agent guessed differently here, would we have to undo
> work?"
> - If yes, settle it with the user.
> - If no, leave it out, or write one line marked as a default the implementer may change.

**Proposed tiers, chosen early from the project's size:**

| Tier | When | Depth |
| --- | --- | --- |
| Light | Solo or MVP | About two pages: decisions, P0 scope and acceptance criteria in full. |
| Standard | Public, multi-user, or real money or personal data | Light, plus data and auth detail, release gates and consequential commitments. |

In either tier, P0 features get real detail; P2 and P3 get a line each.

**Add one short example spec to `references/`.** It would calibrate depth better than
another paragraph of rules (the test1 review asked for this too).

By this rule, test2 would still settle Vue/Supabase, RLS ownership, the reminder rules
and the beta boundary. It would drop most of the visual system, the folder structure,
and the contracts for screens that won't be built for months.

### 3. AGENTS.md comes too early

**What the article says.** The order is SPEC.md first, then CLAUDE.md, but with a setup
step in between. Its checklist says to write SPEC.md "before any code" and to generate
CLAUDE.md "after initial setup." Its CLAUDE.md prompt starts by reading the project's
codebase and asks for real commands and actual file paths. The article's sequence is:

1. Write the spec.
2. Set up the project: run the framework's scaffold, add the package manifest, and
   create the dev, build and test scripts.
3. Generate CLAUDE.md from what now exists.
4. Add Learned Rules as mistakes happen.

In the article, CLAUDE.md always comes after there is code. Its before/after example is
about Tailwind, Lucide and App Router, which are conventions visible in the repo.

**What Cartographer does.** It skips step 2 and seeds AGENTS.md as soon as the spec is
accepted, while the folder holds only docs. Because create-agents.md correctly forbids
inventing commands, the agent has nothing concrete to record. Test2's AGENTS.md is about
600 words: in Commands, Code navigation and Conventions it says "none established yet",
and the rest restates the spec and repeats that things are "not authorized".

**Recommended fix: end Phase 1 with a setup note instead of seeding AGENTS.md.**

For a new project with no code yet, the note should include:

- **The actual scaffold command.** The spec already settles the stack, so the agent
  can say exactly what to run, e.g. `npm create vue@latest` for Lancealot. Scaffold
  commands and flags change, so the agent should check the framework's current docs
  first through the research workflow.
- **An offer to run it.** Some users would rather the agent do it. Running it still
  requires an explicit yes, which preserves the rule that accepting a document doesn't
  authorize changes.
- **How to come back.** "Run AGENTS.md" is vague for a file that isn't a command. Give
  the literal phrase to use, such as "Ask Cartographer to create AGENTS.md", and run
  create-agents.md when the user says it.
- **A HANDOVER.md entry.** If the user scaffolds in a new session, the next agent
  won't see the chat. A "Next step" entry carries the instruction over.

For an existing project with a codebase, skip the note and run create-agents.md
directly.

Proposed wording for the handoff section of create-spec.md:

> After SPEC.md is accepted for a new project with no code yet, don't seed AGENTS.md.
> Instead, end Phase 1 with a short note that includes:
>
> 1. **The scaffold command for the accepted stack.** Verify it against the framework's
>    current docs first.
> 2. **An offer to run that command.** Run it only on an explicit yes.
> 3. **How to come back for AGENTS.md.** Tell the user the exact phrase to use.
>
> Record the same next step in HANDOVER.md.

Example of what the user would see:

> SPEC.md is accepted. Next, set up the project skeleton by running
> `npm create vue@latest` (TypeScript, Vue Router, Vitest), or I can run it for you.
> Once the project exists, ask me to create AGENTS.md and I'll build it from the real
> commands and structure.

**Related changes:**

- Remove AGENTS.md from the Phase 1 scaffold list. An empty AGENTS.md is a placeholder
  a future agent might read as real guidance.
- Update the SKILL.md Phase 1 steps and create-agents.md's "seed after SPEC.md
  acceptance" line to match.
- Check whether Claude Code reads AGENTS.md directly in your setup. As far as I know it
  reads CLAUDE.md natively; a one-line CLAUDE.md that imports AGENTS.md would cover it.

### 4. Scaffolding is still eager

Test2 contains four zero-byte docs (ARCHITECTURE, TESTING, RUNBOOK, COMPENDIUM) plus
empty `adr/` and `research/` folders. The agent then has to explain that they are
placeholders.

Create SPEC.md and HANDOVER.md up front and the rest when there is content for them.
This would also remove several of the "don't treat placeholders as settled" rules.

### 5. Unfinished items from the test1 review

- **Nested `SKILL.md` names.** The new `references/research/SKILL.md` adds a third
  alongside grilling and TDD. Rename them (e.g. `grilling.md`, `research.md`, `tdd.md`)
  so they aren't mistaken for standalone skills.
- **Grilling's completion condition.** Grilling ends when the frontier is empty;
  create-spec.md transitions to a design proposal before that. The transition section
  implies an override, but it should say so explicitly.
- **Rule density.** create-spec.md is still about 200 lines of terse rules, many of
  which read like patches for specific test failures. It's hard for the model to tell
  central rules from edge cases. Briefly explaining *why* for the central rules would
  help it generalize.
- **Narrating rules to the user.** The agent still explains the skill's internal rules
  in conversation, e.g. "Cartographer's spec workflow requires explicit acceptance".
- **Repo hygiene.** `.DS_Store` files are committed; add them to `.gitignore`.

### 6. Make the tests comparable

Test2's CONVERSATION.md is the agent's own summary of the run, which makes it a lenient
grader. Test1 and test2 also used different user answers, which makes improvement hard
to measure.

Use a fixed scripted persona and score each run against a short checklist:

- Was the name asked in round one?
- Was the core uncertainty compared with explicit options?
- Did consequential decisions get individual answers rather than a batch "yes"?
- Did any session permissions end up in SPEC.md or AGENTS.md?
- How long was the spec, relative to its tier?
- Were any zero-byte placeholder files created?

Keep the raw transcript alongside any summary. The skill-creator skill can run this kind
of eval across several runs and report variance, if you want to automate it.

## Prioritized fixes

1. **Phase 1 handoff.** End Phase 1 with a setup note (scaffold command, offer to run it,
   how to return for AGENTS.md) and record it in HANDOVER.md. Remove AGENTS.md from the
   initial scaffold.
2. **Spec proportion.** Add the "would we have to undo work?" rule, light and standard
   tiers, and one short example spec.
3. **Real decisions.** Use option picks instead of "yes" for consequential decisions,
   and cap them at about three per round.
4. **Lazy scaffolding.** Create SPEC.md and HANDOVER.md up front and other docs when they
   have content.
5. **Cleanup.** Rename nested `SKILL.md` files, state the grilling override, ignore
   `.DS_Store`, and stop narrating rules to the user.
6. **Comparable tests.** Use a scripted persona, a checklist and raw transcripts.