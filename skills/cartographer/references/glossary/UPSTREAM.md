# Upstream: glossary format

- Author: Matt Pocock
- Repository: https://github.com/mattpocock/skills
- Upstream commit: `59db609eb1e18aaf59b63284d0e52255aff0c63c`
- [Format source](https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md)
- [Maintained glossary example](https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/GLOSSARY.md)
- [License source](https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/LICENSE)
- License: MIT; see [LICENSE](LICENSE).
- Local template: [GLOSSARY.md](../../assets/templates/docs/GLOSSARY.md).

## Adaptations

- Add entries only for meanings agreed in the accepted spec or established in
  existing code; Phase 1 seeds these terms after written-spec acceptance.
- Add an optional _In code_ line for implemented identifiers/locations. Omit it
  when no implementation exists; upstream's format has no such field.
- Use one glossary at docs/GLOSSARY.md with a Terms section. The template does
  not implement upstream's root-level or multi-context glossary-map conventions.
- Replace upstream's example domain definitions with neutral template hints.

## Maintenance and distribution

The template adapts the term/definition/_Avoid_ layout and concise domain-language
guidance rather than copying upstream's project-specific vocabulary. Keep this
provenance and the unchanged MIT notice with distributions of the adapted format.
When updating, verify the format and license at the intended upstream revision
and update the commit and adaptations recorded here.
