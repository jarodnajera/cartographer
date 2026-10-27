# Cartographer Phase 1 Review: test3

Reviewed: 2026-10-27
Scope: commit `c6148e5` ("Update Cartographer workflows and evaluation protocol"),
the Lancealot run in `tests/test3/` (CONVERSATION.md, SPEC.md, AGENTS.md, HANDOVER.md,
docs scaffolds), and the new `tests/evaluation/` protocol. The Vue starter the user
created in `lancealot-test/` was deleted before commit, so AGENTS.md is reviewed as
seeded from that starter.

## Summary

Test3 is a clear step up from test2. The changes from the last review show up in the
transcript, and the AGENTS.md flow now works the way the source article intended: spec
first, project setup, then agent instructions written from the real repo.

The main remaining issue is AGENTS.md length. The spec is now in reasonable shape, and
AGENTS.md is the file every future session pays for.

## What worked

- **Real choices instead of "yes."** Consequential questions are now A/B picks. The user
  answered with letters or their own text in Q8, Q11 and Q16–Q19. The one place the user
  overrode the recommendation, picking Vue/Supabase over Django, was recorded cleanly.
  The agent then put the new Supabase pieces (Auth, RLS, Cron, Edge Functions) up as a
  separate choice in Q16 rather than folding them into the stack answer.
- **It noticed a skipped answer.** The user's Q13 reply covered export and account
  deletion but skipped individual record deletion. The agent caught that and asked again
  in Q17 instead of assuming its recommendation.
- **The setup handoff worked.** The agent checked the current scaffold command against
  Vue's docs and noticed the local Node v22.14.0 is below Vue's requirement. It gave the
  exact phrase to use for AGENTS.md ("Seed AGENTS.md from the scaffolded project") and
  didn't run setup on its own.
- **AGENTS.md now contains what's actually in the repo:**
  - the real npm scripts
  - the required Node version
  - the nested `lancealot-test/` directory
  - the fact that there's no test or lint script ("don't substitute `npm test`")

  That last point is exactly the kind of thing that saves a future session from a wrong
  guess.
- **The spec separates requirements from defaults.** It labels each item as a
  requirement, a changeable default, or feature-plan work. It came out about 20% smaller
  than test2's (23KB vs. 30KB), and much of the remaining detail came from the user's own
  answers, such as the reminder rules in Q6.
- **The placeholders explain themselves.** The scaffold docs now carry a status line
  saying they're waiting for a later phase.
- **Evaluation protocol.** `tests/evaluation/` covers a frozen persona, a run report,
  confound tracking and scoring after the run. The agent respected the instruction not to
  read it.

## What to look at next

### 1. AGENTS.md has grown too long

It went from 4KB in test2 to 7KB (about 880 words). This file loads every session.

A lot of it is one of these:

- **Session hedges**, e.g. "no build was run while seeding this file" and "documented
  commands are not proof they passed." These go stale as soon as someone runs
  `npm run build`.
- **Repeats of SPEC.md**, e.g. the D15 deferral list and the feature-planning
  boilerplate.
- **A file-by-file list of starter config files.** It will be outdated after the first
  feature.

Suggested changes to create-agents.md:

- Add a rule: AGENTS.md holds lasting facts and instructions; HANDOVER.md holds what was
  or wasn't verified this session.
- Set a rough budget of 300–400 words to force prioritization.
- Link to SPEC.md for release gates instead of restating them.

### 2. Decide where the app lives relative to the docs

Scaffolders usually want an empty directory, so the agent suggested a staging folder,
and the app ended up in `lancealot-test/` under the docs root. AGENTS.md then needed a
pitfall entry just to explain that layout.

The setup note should settle this up front: either scaffold in the root alongside the
docs, or put the app in a named subfolder chosen on purpose and recorded in the spec.

### 3. Repeating the session constraints

Almost every status message ends with "No application code written; the evaluation
folder remains unread." The test prompt caused part of that. A note to state session
constraints once and then simply follow them would cut the noise.

### 4. The agent still narrates its rules

Before acceptance it quoted create-spec.md to the user and said "Cartographer requires
separate written-spec acceptance." The user only needs the question.

### 5. Filler recommendations on open questions

For Q1, the agent recommended "using a recent example to identify the most valuable
workflow first", which isn't an answer. Grilling's format requires a recommendation on
every question. Let the agent skip it when the question asks for facts only the user has.

### 6. Bundled approvals

Q15 still grouped the digest edge cases, the home screen and the accessibility
requirements into one "yes." It was clearly labeled as the remaining package, so this is
mild, but it's the one spot where the old pattern came back.

### 7. Test setup

The run happened inside the repo, but the evaluation README says to use an empty scratch
directory outside it. A few lines in AGENTS.md and HANDOVER.md exist only because of that
(`tests/test3`, `../../skills/...`). Following the protocol's own setup would keep the
test artifacts clean and the runs comparable.

## Prioritized fixes

1. **Trim AGENTS.md.** Lasting facts only, session verification status in HANDOVER.md,
   link instead of restating the spec, and a 300–400 word budget.
2. **App location in the setup note.** Decide root vs. named subfolder before scaffolding.
3. **Conversation polish.** State session constraints once, stop narrating rules, allow
   questions without a recommendation, and avoid bundled approvals for remaining items.
4. **Run tests per the protocol.** Use a scratch directory outside the repo.