# Phase 4: Review and remediate the feature

Status: Active workflow — behavioral evaluation pending.

Use the accepted feature plan as the work record. Review first in Phase 4a;
implement agreed remediation in Phase 4b. Feature completion is separate from
public-launch readiness. Keep essential acceptance criteria and explicit release
gates distinct.

Locate and read installed `code-review`, `diagnosing-bugs`, `tdd`, or `wizard`
when the relevant step calls for it, including supporting resources needed by that
step. See [dependency guidance](../dependencies.md). If unavailable, explain the
installation path without claiming use or installing automatically. Independent
work may proceed with project tooling; record the resulting coverage limitation.

## Phase 4a: Review and plan remediation

1. **Prepare hands-on review.** Read the accepted plan, SPEC.md, agreed design,
   implemented code, and Phase 3 evidence. Give the user a short checklist: working
   directory and run command, what to try against each criterion, relevant edge
   cases, and currently unverified items. Name the review baseline and changed
   files. Sample-mode checks do not establish live-service behavior.
2. **Resolve test-environment needs.** Identify checks needing a live service and
   offer the [human setup procedure](#human-setup-wizard) when needed. Explain its
   purpose, expected effort and known costs or unknowns, and that a test environment
   is not a launch decision. Proceed only within explicit setup authorization;
   preserve an ambiguous answer as unresolved. Continue independent review work
   when authorized; keep blocked checks visible at the end of Phase 4a.
3. **Collect user findings.** Wait for hands-on feedback unless the user explicitly
   skips or delegates that review. Record the user's symptom and reproduction
   steps as reported, separately from agent interpretations. A skipped check is
   not a pass. User review does not replace the code review below.
4. **Review both axes.** Use installed `code-review` against the actual review
   scope described below. Use the feature plan and SPEC.md as spec sources and
   relevant project guidance as standards sources. Preserve separate Standards
   and Spec reports, with file locations and evidence. Treat code smells as
   judgments, not automatic violations or authorization for a rewrite. A scoped
   fix/re-check does not replace this full feature review. After recording a
   resolved user finding, resume any outstanding Standards/Spec passes within
   the existing review authorization rather than merely announcing them and
   waiting for another request.
5. **Diagnose bugs before fixing.** For reported bugs and review findings claiming
   incorrect behavior, use installed `diagnosing-bugs` through a reproducible
   feedback loop, minimization, hypothesis testing and confirmed cause. Capture
   the repro command, expected/observed behavior, relevant environment and cause.
   Temporary instrumentation, a harness or a failing test may be diagnostic work
   when authorized; production fixes belong in 4b. Respect read-only scope, asking
   before diagnostic writes if needed. Remove only instrumentation introduced for
   this diagnosis and retain useful repro evidence. If the cause cannot be
   confirmed, label it unresolved and state what evidence/access is needed.
   Source inspection consistent with a screenshot is a provisional explanation,
   not a reproduced cause. If the user explicitly authorizes a best-effort fix
   despite that gap, record the exception and required re-check; approval itself
   does not confirm the diagnosis or satisfy missing verification.
6. **Plan remediation.** Add a concise Remediation section to the same feature
   plan. For each actionable finding record ID, source (user, Standards, Spec or
   diagnosis), severity/impact, evidence, confirmed cause or unresolved status,
   proposed action (fix, refactor, defer or reject), and regression-test seam.
   Record “no correct seam” when applicable, with the verification gap and a
   proposed response. Order bugs first, then spec gaps, then agreed refactors;
   flag urgent risks explicitly. Preserve the two review reports separately from
   this ordered work list. Link a separate <feature>-remediation.md only if the
   work needs its own substantial milestones; keep the originating plan linked.
   Maintain one current status per finding (for example Proposed, Authorized,
   Implemented awaiting re-check, Resolved or Deferred). Update it as evidence or
   authorization changes; keep necessary history explicitly dated/labeled and
   refresh HANDOVER.md so superseded pending statements are not current guidance.
7. **End with a decision.** Present the proposed remediation and outstanding setup
   or evidence choices. Ask “Do you approve this remediation plan?” Wait and revise
   as needed; proposed actions become agreed only when accepted. Approval of the
   written plan alone does not authorize 4b; use a separate implementation go-ahead
   or one already given within scope. If there are no actionable findings and
   acceptance evidence is sufficient, skip remediation and go directly to the
   completion decision below. If evidence is insufficient, report the remaining
   work instead of declaring a clean review. Ask directly without quoting internal
   phase rules to justify a routine approval pause; explain boundaries when asked
   or when they materially affect the available next action.

### Review scope and companion overrides

These integration rules override conflicting companion procedure details,
subject to higher-priority instructions and the user's scope:

- **Local spec source:** code-review uses the accepted feature plan and SPEC.md.
  An issue tracker and upstream setup skill are not prerequisites.
- **Actual changes:** use the resolved baseline commit SHA recorded in Phase 3,
  not only a moving branch name. Check committed changes, staged and unstaged
  tracked changes, and relevant untracked files. HEAD-only comparisons omit
  uncommitted implementation. A tracked working-tree diff against the baseline
  includes staged and unstaged changes; inspect untracked files separately.
  Account for pre-existing changes so they are not attributed to this feature.
  Record the reviewed HEAD, baseline, and file inventory; later edits make the
  earlier review evidence potentially stale. Never treat an empty committed diff
  as a clean review of a nonempty working tree.
- **Missing baseline:** without Git, commits or a usable fixed point, review the
  feature's listed files and requirements, and state that change attribution and
  before/after coverage are limited. Do not create a baseline commit implicitly.
- **Review execution:** preserve Standards and Spec as separate assessments. Use
  parallel reviewers when delegation is available and permitted; otherwise run
  separate passes and disclose the lack of independent reviewers.
- **Diagnosis boundary:** diagnosing-bugs stops at confirmed cause in 4a, resuming
  fix/cleanup in 4b. Record the confirmed cause in the feature plan; commits and PRs
  follow the user's Git workflow, rather than being required evidence containers.
- **Tests and vocabulary:** use docs/GLOSSARY.md and agreed test seams. A temporary
  diagnostic harness is not automatically a durable regression test at an agreed
  seam. Resolve a missing or changed seam before writing a retained test under tdd.

### From code review to regression coverage

Use `code-review` to find additional defects and gaps across the agreed feature
scope, beyond the last user-reported problem. Keep Standards and Spec assessments
separate, route actionable findings into diagnosis/remediation, and use `tdd` for
the agreed bug fixes in 4b. Neither skill replaces the user's hands-on acceptance.

Choose a regression seam that can observe the actual failure:

- Responsive layout needs a real-browser check at the problematic viewport or
  container width, exercising representative task/invoice rows and checking action
  placement and overflow. DOM stubs and CSS-rule-presence assertions do not prove
  the visual behavior. Follow the environment's permitted browser tooling.
- Business-rule failures should use an agreed domain or database interface that
  exercises the behavior, such as preserving unpaid-invoice reminders under an
  archived project. Use independent expected results from the accepted requirements.

If the fix already exists, describe a new test as post-fix regression coverage,
not test-first work. Where feasible and authorized, run that test against an
isolated copy of the prior defective implementation to show it catches the
original failure, then against the corrected version. Preserve the working tree;
never undo the user's fix merely to manufacture red. Record whether this
failure-sensitivity check actually ran or remains unverified.

## Phase 4b: Remediate and re-verify

1. Confirm the remediation plan is accepted and fixes are authorized, honoring
   authorization already given. Follow agreed priorities and review checkpoints;
   keep unrelated improvements outside this pass.
2. For each bug with a correct, agreed seam, use installed `tdd`: write the
   regression test, observe failure for the reported defect, implement the minimum
   fix, observe success, then rerun the original reproduction. A failing test
   already produced in diagnosis can serve as red after confirming its seam and
   failure signal. When no correct seam exists, resolve the agreed architecture
   or verification response first; document any accepted test limitation rather
   than manufacturing a shallow test or claiming regression protection.
3. Refactor only agreed findings, keeping relevant tests green before and after.
   Separate behavior changes from structural changes. Return material new scope
   or newly discovered blocking findings to remediation planning instead of
   silently expanding the work.
4. Run the project's full relevant suite and build, plus browser/live checks
   affected by fixes. Record commands, working directories, results and skipped
   checks. Explain unavailable checks and pre-existing failures; avoid unrelated
   repairs or passing claims based only on earlier results. Re-review changed
   areas against both axes and the finding list; repeat until agreed fixes are
   verified or remaining limitations are explicitly surfaced. Identify which check
   actually exercises the reported defect: unchanged unit tests or a passing build
   do not verify responsive layout. User visual confirmation is hands-on evidence,
   recorded separately from agent/browser checks and automated regression coverage.
5. Update affected architecture, testing, runbook, glossary and durable AGENTS.md
   guidance using [Phase 3's documentation rules](implement-feature.md#document-the-implemented-system).
   Record confirmed causes and outcomes once in the feature plan. Remove temporary
   diagnostic instrumentation without deleting unrelated user work.
6. Give the user a focused re-check list for their reported defects. Await their
   results unless they explicitly delegate or waive the hands-on re-check;
   record that choice and the available evidence honestly. Apply feedback to the
   finding it addresses. “Looks good so far” can resolve a re-checked defect while
   the overall feature stays In progress; it is not acceptance of unchecked flows
   or permission to skip the remaining full review.
7. Present the completion decision below. Unresolved essential acceptance criteria
   keep the feature open; do not turn them into deferrals without an explicit
   scope decision.

## Completion decision

Phase 4 is an iterative loop: repeat review and diagnosis in 4a, agreed remediation
in 4b, and user re-checks until the user and agent agree that the current state of
the feature/app is satisfactory for the agreed scope and ready to move to the next
feature. New findings or dissatisfaction reopen the relevant steps in the same
plan; a single review or passing test run does not end the loop. Preserve existing
authorization and seek decisions only for changed scope or unresolved choices.
If progress is blocked, record the blocker and next action rather than declaring
completion or repeating checks without new evidence.

Show each acceptance criterion with current evidence, resolved findings, and any
remaining deferrals, owners/next actions, or verification gaps. For an adequately
verified bounded feature, ask “Do you want to mark this plan Complete, with these
items deferred?” Omit the deferral clause if there are none. Mark Complete only
after the user explicitly states the feature looks good and can be accepted,
with any stated deferrals. Silence, passing tests or “keep going” is not final
acceptance. A clear acceptance statement satisfies this step without another
formulaic confirmation. This also covers a clean Phase 4a review that
needed no remediation; an empty 4b is not required.

Distinguish feature completion from launch readiness. Approved launch-only work
may remain open in its canonical document; missing essential feature evidence
cannot silently become launch work. Summarize the next feature or outstanding
launch-gate work, updating HANDOVER.md when needed. Completion does not authorize
commits, publication, service provisioning or deployment.

## Return to feature selection

After explicit feature acceptance, mark the plan Complete and summarize the
outcome. Return to [Phase 2a](plan-feature.md): suggest the next bounded feature
from accepted priorities and dependencies, or use the user's selection. Ask which
feature to plan next and wait for selection unless already supplied. Preserve the
existing spec, glossary and design instead of restarting Phase 1. If only launch
gates remain, offer that work as the next item with its authorization boundaries.

Repeat Phase 2 planning/design → Phase 3 implementation → Phase 4 review,
diagnosis, remediation and user re-checks → explicit user acceptance → Phase 2
for the next feature. Stay in Phase 4 while agreed corrections remain or the user
is not satisfied. Treat newly requested product scope as a planning decision rather
than silently bundling unrelated features into fixes. Respect requests to pause
or change priorities.

## Human setup: wizard

Use installed `wizard` for human-only setup that blocks implementation or review.
Tasks the agent can perform within existing authorization stay with the agent.

1. Read its SKILL.md and template.sh. Inspect configuration and example variable
   names without exposing secret values. Identify stages, prerequisites, each
   value's source/destination, and consequential costs or external changes.
2. Present the ordered procedure for confirmation, using authorization already
   given. Verify unfamiliar service instructions through Cartographer's
   [research guidance](../research/SKILL.md). Keep ambiguous choices open.
3. Generate the scoped helper from the upstream template, using hidden secret
   entry. Secrets may go to agreed ignored local configuration or a service secret
   store; keep them out of chat, logs, review documents and tracked artifacts.
4. Check bash syntax, run shellcheck if available, and trace stages and value
   destinations statically. Give the user the script path, run command and expected
   outcome. The human runs the interactive wizard; the agent does not run it end
   to end. Confirm irreversible actions at their relevant stage.
5. Resume dependent work only after the necessary outcome is confirmed. Record
   completed stages or exact blockers without secret values. Retain useful durable
   setup/recovery guidance in RUNBOOK.md.

Cartographer overrides upstream wizard retention and commit steps: keep one-off
helpers temporary, retain repeatable scripts when requested, and commit only under
the user's authorized Git workflow. Preserve useful artifacts until disposition
is agreed. A wizard is not independent authorization for external changes or paid
provisioning; follow the agreed procedure and client permissions.
