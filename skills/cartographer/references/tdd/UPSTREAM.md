# Upstream: tdd

- Author: Matt Pocock
- Repository: https://github.com/mattpocock/skills
- Original directory: `skills/engineering/tdd/`
- Upstream commit: `3f599139104dfceabc7754eeb91319802f85e042`
- [Pinned source directory](https://github.com/mattpocock/skills/tree/3f599139104dfceabc7754eeb91319802f85e042/skills/engineering/tdd)
- [Pinned license source](https://github.com/mattpocock/skills/blob/3f599139104dfceabc7754eeb91319802f85e042/LICENSE)
- License: MIT; see [LICENSE](LICENSE) in this directory.

## Bundled files

- [SKILL.md](SKILL.md) — adapted skill instructions.
- [tests.md](tests.md) — test examples and anti-patterns.
- [mocking.md](mocking.md) — mocking guidance.

All three files were compared against the pinned revision above.

## Local changes

- SKILL.md refers to `COMPENDIUM.md` instead of upstream's `GLOSSARY.md`.
  This existing local adaptation has been preserved.
- SKILL.md, tests.md, and mocking.md omit upstream's final newline.
- During attribution setup, the local instructions were moved from the
  mistakenly populated UPSTREAM.md into the previously empty SKILL.md,
  without changing their contents.

## Integration notes

The preserved skill refers to `codebase-design` and `code-review`, which
are not included in this directory. Attribution does not establish that
those dependencies are installed or that the workflow has been validated.
The `COMPENDIUM.md` reference is relative as written; Cartographer's
project convention currently places that document at docs/COMPENDIUM.md.

## Maintenance

When updating these files, compare each against the intended upstream
revision, retrieve the license from the same revision, and update the
commit and local-change record. Keep this provenance and LICENSE with
all distributed copies of the bundled TDD reference.
