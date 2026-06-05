# Changelog

All notable changes to etch are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` so the skill
  installs via `/plugin marketplace add` + `/plugin install`.
- `test/contract.test.ts` — a vitest contract test that checks every file in
  `examples/` against the `SKILL.md` output contract (run with `npm test`),
  matching the testing setup used by sibling skills. Dev tooling
  (`package.json`, `vitest.config.ts`, `tsconfig.json`) is dev-only and never
  ships with the skill.
- `CONTRIBUTING.md` documenting the project shape, the output contract, and how to
  run the test.
- `CLAUDE.md` pointer so Claude Code picks up the `AGENTS.md` contract.
- `DISTRIBUTION.md` — the public-flip / install runbook, following the shared
  Staub OSS-kit standard; its public-flip step runs the canonical `scrub-gate.sh`.
- README gallery: terminal-style cards (`assets/gallery/`) rendered from the real
  `examples/` artifacts by `tools/render-gallery.mjs` (`npm run gallery`). The
  output stays plain text — the images are generated from it, not hand-drawn.
- Continuous integration that runs `npm run typecheck` and `npm test` on every
  push and PR.

### Changed
- Install instructions corrected: `/plugin install <git-url>` does not work;
  use `/plugin marketplace add astaub/etch` then `/plugin install etch@etch`
  (or clone into `~/.claude/skills/etch`).
- `SKILL.md` output-format template now matches the shipped examples: header order
  is `Shape` / `Track` / `Source`, and each alternative uses
  `## Alternative N (EFFORT)` with a `- Title:` line.
- Governance docs (`AGENTS.md`, `CONTRIBUTING.md`, `README.md`) conformed to the
  shared Staub OSS-kit standard: contributors propose via PR, no self-merge,
  never push `main`, one concern per PR, conventional commits.

### Removed
- `docs/public-flip-checklist.md` — superseded by `DISTRIBUTION.md` and the
  canonical, systematic scrub gate (no more hand-rolled per-repo grep checklist).

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
