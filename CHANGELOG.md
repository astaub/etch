# Changelog

All notable changes to etch are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` so the skill
  installs via `/plugin marketplace add` + `/plugin install`.
- `test/contract.test.mjs` — a zero-dependency contract test that checks every
  file in `examples/` against the `SKILL.md` output contract.
- `CONTRIBUTING.md` documenting the project shape, the output contract, and how to
  run the test.
- Continuous integration that runs the contract test on every push and PR.

### Changed
- Install instructions corrected: `/plugin install <git-url>` does not work;
  use `/plugin marketplace add astaub/etch` then `/plugin install etch@etch`
  (or clone into `~/.claude/skills/etch`).
- `SKILL.md` output-format template now matches the shipped examples: header order
  is `Shape` / `Track` / `Source`, and each alternative uses
  `## Alternative N (EFFORT)` with a `- Title:` line.

### Fixed
- Examples are now pure ASCII, as the contract requires (replaced curly quotes,
  the bullet glyph, the gear glyph, and the plus-minus sign in two examples).

## [0.1.0] - 2026-06-04

### Added
- Initial release: the `etch` skill (`SKILL.md`) for turning a brief into ordered
  ASCII UI wireframe alternatives.
- Five shapes — `page`, `flow`, `component`, `copy`, `diff` — with one example
  artifact each.
- MIT license, README, and AGENTS integration notes.
