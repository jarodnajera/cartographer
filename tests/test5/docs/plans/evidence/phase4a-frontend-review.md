# Phase 4a — account frontend/readiness review

Date: 2026-10-30 (America/Los_Angeles). Scope: first slice only; full feature remains In progress. Historical initial review; authorized corrections and current status are recorded in the feature plan and the dated follow-up below.

## Baseline and evidence

Baseline and reviewed HEAD: `03c130eb7c3cd7428980034b6b022b4ada1d3f83`. `git diff <baseline> -- tests/test5` is empty because the target is entirely untracked (`?? tests/test5/`). Review used the [pre-edit inventory](phase3-start.json), [checkpoint](phase3-frontend-checkpoint.json), and actual source/config/tests rather than treating the empty Git diff as evidence. All 42 checkpoint-added/changed paths matched their recorded hashes before this review’s documentation changes; no app source changed in this pass. Existing scaffold/assets are not attributed to new implementation.

User feedback: **“everything looking good so far!”** No bugs, reproduction steps, viewport sizes, detailed coverage or acceptance of the entire feature were reported. This is positive frontend feedback, not live account/RLS evidence.

Installed code-review ran separate fresh-context Standards and Spec agents. Sources: AGENTS.md, accepted feature plan/SPEC.md, DESIGN.md, GLOSSARY.md, TESTING.md, ARCHITECTURE.md and applicable app config. Root AGENTS.md/CODING_STANDARDS.md/CONTRIBUTING.md were absent. The 14 unit passes, build pass and 3 integration skips are prior checkpoint results, not rerun by these read-only passes.

## Standards

No clear documented-standard violations found in this scoped account/frontend slice.

One optional heuristic: **possible Repeated Switches** in [WorkspaceView.vue:29](../../../lancealot/src/views/WorkspaceView.vue#L29)–42. Tasks, invoice and notes each branch on the selected fictional project ID. Store those details together if fixture maintenance becomes substantial. This is a Fowler-baseline judgement, not a blocker or requirement for a domain abstraction. No refactor proposed now; reconsider when record UI replaces these fixtures.

Browser/font/focus/interaction/parity and deployed Supabase enforcement remain evidence gaps, not coding-standard violations. Preview is deliberately fictional; later features are not delivered by this slice.

## Spec

**SP-1 — Access feedback lost (medium).** The plan requires account operations to return “explicit unavailable/denied states.” The service distinguishes them, but [router/index.ts:22](../../../lancealot/src/router/index.ts#L22) redirects protected-route failures to ordinary sign-in; the auth-change path at line 29 does likewise. With configuration present, AuthView does not display the reason. Proposed response: retain a safe typed reason and display denial/unavailability feedback on sign-in. Runtime diagnosis remains unresolved; no connected backend or browser was used.

**SP-2 — Expired verification offers recovery (low).** The plan promises “verification/resend” and “expired” account states. In [AuthView.vue:20](../../../lancealot/src/views/AuthView.vue#L20), generic preview expiry hides the resend form (line 115), while line 112 says to request another verification email below. The replacement at line 122 requests password recovery instead. Proposed response: separate verification expiry from recovery expiry and retain verification resend. This is a concrete source-branch inconsistency; the runtime symptom/cause has not been reproduced.

No concrete unauthorized scope expansion found. Disabled record controls and isolated preview match this checkpoint. Record CRUD, Today/digests and export/deletion remain intentionally unstarted; they still prevent full-feature completion.

## Diagnosis boundary and decision

Applied diagnosing-bugs only through feedback-loop setup; no reproduced cause or fix is claimed. Browser selection for the expired-verification preview returned **“No browser is available”**; supported discovery returned `[]`. No alternate browser automation, DOM stubs or source check was substituted as rendering proof. Auth/backend tests remain deferred by the user, not retried.

SP-2 reproduction when a browser is available: open `/__preview?screen=verify-email&state=expired`; expected: request/resend **verification** action; source predicts recovery action and no resend form. Also check expired password recovery still requests recovery. SP-1 needs actual router/AuthView failure navigation with denied/unavailable external account results; a pure mapping assertion would not establish visible feedback.

Both runtime diagnoses are **unresolved**. Preferred next action is browser reproduction, then scoped corrections and re-checks. If the user explicitly authorizes source-based best-effort fixes despite this gap, retain that exception and require browser re-check afterward. Acceptance of a proposed fix does not confirm its cause. No correct existing automated UI/navigation seam covers either symptom; agree a browser/component navigation seam before retaining regression tests. Keep service tests/build as supporting checks only.

Counts: Standards: 0 hard violations, 1 optional heuristic. Spec: 2 proposed scoped findings. No clean-review or complete-feature verdict. Current ordered actions/status live in the [feature plan](../private-accounts-and-project-tracking.md#remediation).

## Phase 4b follow-up — 2026-10-30

User approved the proposed source-based fixes with browser verification pending. AuthView and router were corrected. Separate Standards/Spec reviewers re-read the two changed files: no new hard Standards violations or obvious source regressions; both Spec findings are **Implemented awaiting re-check**. Initial findings above are historical, not a statement that patches remain unapproved. Runtime diagnosis remains unresolved. Existing 14 unit tests and vue-tsc/production build passed after changes; these are supporting checks, not symptom verification. [Correction evidence](phase4b-account-state-fixes.json) captures the current source hashes.

## Browser resume follow-up — 2026-10-30

The resumed session still exposes no callable Playwright MCP tools. Existing local app on port 5173 returned HTTP 200 through an approved HTTP check; no restart was needed. This is server availability evidence only. No screenshot, viewport/console check or actual expiry/protected-route failure path was exercised. SP-1 and SP-2 remain Implemented awaiting re-check; backend-dependent cases remain blocked by the user's deferral. No new cause, browser result or application change is claimed. [Availability evidence](phase4-playwright-availability.json) records the repeated tool-exposure blocker separately from any server error.

## Subsequent observed browser evidence

Playwright MCP connected later on 2026-10-30. [Browser re-check](phase4-browser-recheck.json) supersedes the earlier tool-availability limitation: SP-2’s scoped expiry UI passed desktop/mobile, with fictional resend and actual no-context recovery navigation. SP-1’s real unconfigured redirect was observed; configured denied/unavailable paths remain backend-blocked. User re-check/full-feature acceptance remain open. No production code changed during this browser pass.
