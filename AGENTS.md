# Contributing agents & humans — etch ✏️

Turn a brief into ordered ASCII UI wireframe alternatives for experimentation.

This is a **public, open-source repository.** Both humans and coding agents
read this file. It is the operating contract for anyone — person or agent —
proposing a change. It is intentionally short; the full rules live in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Governance (read first)

- **Contributors propose; maintainers merge.** Everyone — including agents
  working autonomously — lands work through a pull request. **No one
  self-merges.** The maintainer (`@astaub`) reviews and merges. An agent that
  finishes its work opens a PR and **stops**.
- **One concern per PR.** Small, reviewable, single-purpose. Split unrelated
  changes.
- **Never push to `main`.** Branch, commit, push the branch, open a PR. No
  force-push to shared branches.
- **Tests gate the PR.** A PR with red tests is not ready. Run the suite below
  before you open it.
- **Discuss large changes first.** Open an issue describing the change before
  writing a big diff, so direction is agreed before code exists.

## What this project is

`etch` is a skill that turns a brief into ordered ASCII UI wireframe
alternatives. It is a host-agnostic **agent skill** — a single Markdown
`SKILL.md` (no build, no network, no local reads or writes) read by Claude Code
and other agents. It is **agent-native**: the output is one plain-text artifact
agents and humans can pass around without a design tool.

`etch` is not a CLI or a library, so it has no JSON API of its own; its contract
is its **output format** (see Conventions). The repo carries a dev-only vitest
suite that holds the `examples/` artifacts to that contract — it never ships
with the skill.

## Build & test

```sh
npm install
npm test
```

There is no build step — the skill is the Markdown. A change is not ready to
propose until `npm test` (and `npm run typecheck`) is green locally.

## Conventions

- **The output contract is the interface.** `etch` returns **one fenced
  Markdown block** — no images, no HTML, no links. Sketches use **printable ASCII
  plus the Menlo-safe glyph allowlist** (rounded box-drawing + shade/block ramps +
  furniture; the diagonals `╱ ╲ ╳` are banned because they are not single-cell).
  Every frame obeys the alignment law (one identical visible width per row) and
  reads in both the light and dark skins. Alternatives are ordered cheapest-first
  and each carries a title, rationale, change list, effort (`XS`/`S`/`M`/`L`), and a
  watch-metric. The full design system lives in `SKILL.md` (§ "Design system"). This
  is the public surface; changing it is a breaking change.
- **No hidden defaults for paths/credentials.** The core never reads local
  files, resolves project paths, or guesses a secret. Source resolution,
  credentials, and writes live in the **host adapter**, never the skill.
- **Customer-agnostic.** Examples and copy are synthetic — no real customer
  names, no private data, no internal system references, no real file paths.
- **Conventional commits.** `feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:`. The subject line says what changed and why it matters.
- **Keep the diff matched to the surrounding code** — its naming, comment
  density, and idioms. Don't reformat unrelated lines.
- **No dist:** etch ships as Markdown (`SKILL.md` + `examples/`). The only build
  artifacts are dev-time test deps, which are gitignored and never shipped — see
  [DISTRIBUTION.md](DISTRIBUTION.md).

## Project layout

```
SKILL.md · examples/ · references/ · .claude-plugin/ (marketplace+plugin manifests) · test/ · package.json (dev-only)
```

## For autonomous agents specifically

- Read this file and `CONTRIBUTING.md` before editing.
- Make the change on a branch, run `npm test`, then open a PR with a clear body
  (what changed, why, how it was verified) and **stop**. Do not merge, do not
  deploy, do not push to `main`.
- If the change is large or ambiguous, open an issue first and wait.
- Leave unrelated dirty work untouched.

## License

`etch` is MIT-licensed. By contributing you agree your contribution is licensed
under the same terms. See [LICENSE](LICENSE).
