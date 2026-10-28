# Test4: Lancealot workflow example

This test exercises Cartographer's foundation, feature planning/design, and
implementation workflows for a fictional freelancer tracking application.
The application is in lancealot/; current progress and verification limits are
recorded in [HANDOVER.md](HANDOVER.md).

## Publication notes

[CONVERSATION.md](CONVERSATION.md) is a redacted publication copy, not an unchanged
raw export. Personal absolute filesystem paths in message links were replaced
with relative repository links. Tool traffic is omitted, and the early exchanges
were recorded retrospectively. Evaluate claims about execution order accordingly.

Sample names, records, example.test email addresses, and test passwords/tokens
are fictional fixtures. The committed .env.example contains blank browser-public
configuration fields. Local credentials, installed dependencies, build output,
browser reports, and local agent configuration are excluded from publication.
The published application is an implementation example, not a verified deployment;
see TESTING.md and RUNBOOK.md under docs/ for outstanding checks and setup gates.

## Companion skills

The locally installed .agents/ skills are excluded from Git and remain on the
original machine. [skills-lock.json](skills-lock.json) records installed Pocock
skill sources and hashes; it does not capture the entire client environment.

To obtain companion skills, follow Cartographer's
[dependency guidance](../../skills/cartographer/references/dependencies.md).
The run used grilling, domain-modeling, codebase-design, prototype,
writing-for-agents, and wizard guidance from
[Matt Pocock's skills](https://github.com/mattpocock/skills), plus
[Anthropic's frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design).
Install frontend-design separately if reproducing the design/implementation work;
it is not recorded in this test's Pocock skills lockfile. References to local
installed-skill paths in the transcript describe that original environment.

## Run the application

From lancealot/, use the Node version in .nvmrc, then install dependencies with
npm ci. Run npm run dev and choose Explore sample workspace for fictional,
in-memory data without live-service configuration. npm test runs the local suite;
see [docs/TESTING.md](docs/TESTING.md) for its scope and remaining verification.
