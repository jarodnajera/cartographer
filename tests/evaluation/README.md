# Cartographer Phase 1 Evaluation

Use this protocol to compare revisions of the idea-to-foundation workflow.
The earlier test1 and test2 runs are qualitative examples: their inputs differ
and their conversation records are not equivalent raw transcripts. Do not
retroactively present them as controlled before/after evidence.

## Prepare a run

1. Freeze the [scenario and answer set](phase1-persona.md) for both revisions.
   Give the agent only the opening prompt, not the evaluator's answer bank or
   scoring checklist. Use a fresh conversation with the same agent instructions.
2. Use an empty scratch project outside this repository, so other test projects
   and repository instructions do not affect discovery. For authorized end-to-end
   follow-ups, keep the generated app, dependency locks and data snapshots in that
   scratch project or a separate app repository, not this skill repository. Preserve the complete
   Cartographer skill resources through the same installation method in each run.
3. Record the skill commit and any uncommitted changes, model/client versions,
   reasoning setting, tools, memory state, instruction sources, and research date.
   Use the [run report](run-report-template.md). Do not record secrets or private
   global instructions; note relevant differences instead.
4. Keep client settings and permissions consistent. If memory can influence the
   run, disable it for this test using supported controls or document its state
   and treat the comparison as confounded. Do not change global settings silently.

## Conduct the interview

Use the persona's answers, matching questions by meaning rather than round number.
Select explicit options that match the fixed intent; do not automatically approve
the recommended option. Keep the user's facts, constraints, and choices unchanged.
Record extra questions and any necessary deviation from the answer set. Do not
coach the agent to repair an omission mid-run; score it after the run.

At an unrelated or underspecified consequential question, say that the decision
is not yet made and request the relevant options. Do not invent a new preference.
A material missing persona answer is a scenario defect: document it and revise
the scenario for future runs of both revisions, rather than only helping one.

Keep the baseline uninterrupted. Test pause/resume, changed requirements, and
existing-project mapping as separately labeled scenarios, not mixed into baseline
comparisons. No application implementation or external provisioning is requested.

## Preserve evidence

Store evidence separately from the target project, under a unique run directory.
Retain selected documents, transcripts and a report in this repository; keep
application source/locks/generated data in the scratch project or its separate
repository, referenced by commit or external artifact location where available.
Do not delete or relocate existing evaluation applications without user direction.
The existing test4 app is historical evidence, not the model for future run layout.

Suggested evidence layout:

```text
<run-id>/
  run-report.md
  transcript.raw.md       # or the client's original structured export
  conversation-summary.md # optional; never the only conversation evidence
  artifacts/              # final target-project documents, including research
  checkpoints/            # files at meaningful points, if captured
```

Export the client transcript when supported, preserving message order and exact
wording. Otherwise capture messages verbatim as the run proceeds, including
assistant progress messages. Label manual capture and omitted material explicitly;
never reconstruct a raw transcript from an agent-authored summary. Preserve tool
calls/results when available, or state their absence and limit conclusions.

Number messages/lines or retain native event IDs so report evidence is traceable.
Record whether AGENTS.md remains template-only through the accepted-spec handoff.
For a separately authorized setup/seeding test, capture application setup before
seeding using tool events or external file checkpoints where available. Final files alone
cannot prove creation order. Never insert evaluator commentary into the raw log.
If redaction is needed, mark it and label the transcript redacted; keep summaries
separate. Do not store secrets just to obtain a complete tool trace.

## Score and compare

Score the checklist in the run report with Pass, Fail, Not observed, or Not
applicable and an evidence reference. Missing logs are Not observed, not a pass.
A concise spec is not a pass if it omits required decisions. Record length as a
measurement, not a substitute for examining requirements versus defaults.

Compare both revisions against the same criteria and distinguish regressions,
improvements, and unknowns. Prefer one workflow change per comparison; multiple
simultaneous changes cannot identify which caused the difference. For stronger
evidence, run at least three independent sessions per revision and report counts
and variation, including failures. Alternate revision order when practical.

Research results, provider documentation, and model behavior can change. Record
these confounders; consistent answers improve comparability but do not guarantee
causal attribution. Passing this scenario is evidence about Phase 1 only, not
feature planning, implementation, or general safety.

## Separately authorized feature follow-ups

Keep these separate from Phase 1 baseline scoring. For a multi-feature request,
record whether the agent explains the added cost, proposes dependency order and
names the first slice/review point. Measure each plan against its selected
light/standard tier, noting justified overruns and duplicated canonical content.
Check that implementation ends at the agreed review point unless a continuous
pass was requested. For the first substantial UI feature, record the prototype
offer, authorization, verdict and actual browser evidence or stated limitation.
Inspect AGENTS.md for transient evaluation instructions and local skill paths.
Use an external scratch project for generated application code; preserve evidence
without silently removing existing runs.

## Visual-direction follow-up

Use the [Phase 2b visual-direction checks](phase2b-visual-review.md) for separately
authorized design/implementation runs. Keep this evidence separate from Phase 1
scores. Test4 remains the historical before example; do not redesign it to make
its original evaluation appear to pass the new workflow.
