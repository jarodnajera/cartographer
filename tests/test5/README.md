# Test5: staged design, implementation and review

This qualitative run uses the fictional Lancealot project to exercise Cartographer.
See [HANDOVER.md](HANDOVER.md) for the latest checkpoint and
[the conversation](CONVERSATION.md) for the recorded exchanges.

## Evidence and scope

The run includes foundation discovery, accepted feature plans, separate structure
and visual-direction selection, ADR authorization, an account/frontend readiness
slice, separate Standards/Spec review, scoped fixes, and Playwright MCP re-checks.
The account-state screenshots and [browser record](docs/plans/evidence/phase4-browser-recheck.json)
cover selected desktop/mobile UI states, not complete design parity or accessibility.
The full feature is In progress. Live backend verification and later features
remain deferred or unimplemented; see [TESTING.md](docs/TESTING.md).

CONVERSATION.md is a redacted publication copy. Personal absolute filesystem links
were replaced with relative repository links and trailing whitespace normalized.
Early messages were captured retrospectively; tool events are omitted. Source
inventories and selected review evidence supplement the transcript but do not make
it a complete execution trace or a controlled comparison with previous runs.

## Local setup

Application commands run from lancealot/. Use Node matching package.json, then
install locked dependencies with npm ci --ignore-scripts. Run npm run dev and open
/__preview?screen=workspace or /__preview?screen=sign-in for fictional frontend
review without backend configuration. This development-only preview is not a
working authentication system. See the app README and TESTING.md for commands
and the explicitly opt-in backend integration suite.

Installed companion-skill copies and local agent configuration are ignored.
[skills-lock.json](skills-lock.json) records installed sources/hashes. Reinstall
using Cartographer's [dependency guidance](../../skills/cartographer/references/dependencies.md);
source records alone do not reproduce the complete runtime or tool configuration.

## Publication notes

Names, addresses, passwords/tokens and records used by fixtures are synthetic.
The literal sb_secret_do-not-use tests rejection of privileged credentials; it is
not a usable key. Environment examples contain blank credentials. Local environment
files, dependencies, build output and transient browser logs stay ignored. Selected
screenshots/reports are intentionally retained as review evidence. Font licenses
and source notices remain beside the bundled font assets.
