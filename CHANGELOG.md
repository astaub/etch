# Changelog

All notable changes to etch are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed (0.2.0 — the beauty design system)
- **The output contract is now a designed monospace language, not crude ASCII.**
  `SKILL.md` gains a full "Design system" section: the alignment law (every row
  padded to one identical width), a Menlo-safe glyph allowlist (rounded box-drawing
  + shade/block ramps + furniture, weight = hierarchy), "Tailwind for the CLI"
  spacing/sizing tokens (mobile-first widths: phone 40, desktop 104), a reusable
  component library (cards, buttons, inputs, status, progress, tabs, table, nav,
  charts), desktop composition, and the freeze-verify authoring gate.
- **Both light (cream paper) and dark (terminal) skins are first-class** — identical
  layout, only the ink color changes.
- **Contract relaxed from "pure ASCII" to "printable ASCII + the Menlo-safe
  allowlist."** The v0.1 pure-ASCII rule was a paste-safety choice; the allowlisted
  box-drawing glyphs are universally monospace-safe (terminals, Slack, GitHub) and
  are what make the wireframes read as designed. The banned diagonals `╱ ╲ ╳`
  (not single-cell in Menlo) are rejected by the contract test. Design rationale:
  `docs/research/2026-06-04-wireframe-design-language.md`; component spec:
  `docs/research/2026-06-04-component-library-spec.md`; proof:
  `docs/research/samples/`.
- `test/contract.test.ts` enforces the allowlist (replacing the pure-ASCII check)
  and explicitly bans the diagonals.

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
