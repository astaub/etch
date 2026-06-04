# Contributing to etch ✏️

Thanks for helping out. `etch` is a skill that turns a brief into ordered ASCII
UI wireframe alternatives. Contributions come from both humans and coding
agents, and the rules are the same for both.

## The short version

1. Open an issue for anything non-trivial before writing code.
2. Branch off `main`. Never commit to `main` directly.
3. Make one focused change.
4. Run the tests (`npm test`) — they must be green.
5. Open a pull request describing **what** changed, **why**, and **how you
   verified it**.
6. **Stop there.** A maintainer reviews and merges. Contributors do not
   self-merge.

## Setup

```sh
git clone https://github.com/astaub/etch.git
cd etch
npm install   # dev tooling only — pulls vitest + typescript
npm test      # vitest run
npm run typecheck
```

There is no build step: `etch` ships as Markdown (`SKILL.md` + `examples/`). The
`package.json` exists purely for the dev-time test suite and never ships with
the skill.

## Project shape

```
SKILL.md                     # the skill: generation rules + output contract
README.md                    # human overview
AGENTS.md / CLAUDE.md        # governance contract + agent pointer
CONTRIBUTING.md              # this file
DISTRIBUTION.md              # the public-flip / install runbook
.claude-plugin/              # plugin + marketplace manifests for /plugin install
examples/                    # one shipped artifact per shape (page/flow/component/copy/diff)
references/                  # framing notes
test/contract.test.ts        # vitest contract test over examples/
package.json                 # dev tooling only (vitest, typescript)
```

## The output contract (do not break)

These invariants are the public surface of the skill, enforced by the test and
by review:

- **One fenced block.** Each artifact is a single ` ```markdown ` block, opened
  on the first line and closed on the last.
- **Pure ASCII.** No non-ASCII characters, no images, no HTML, no links or URLs.
  Use `-` for bullets, `+/-` for plus-minus, straight quotes only.
- **Header.** `# Wireframe Alternatives: <summary>`, then `Shape:`, `Track:`,
  `Source:` (in that order). `Shape` is one of `page`, `flow`, `component`,
  `copy`, `diff`.
- **Alternatives.** `## Alternative N (EFFORT)` headings numbered sequentially
  from 1, between 1 and 7 of them, ordered cheapest-first. `EFFORT` is one of
  `XS`, `S`, `M`, `L`.
- **Per alternative.** `- Title:`, `- Rationale:`, `- Change list:`,
  `- Effort:` (matching the heading tag), `- How we'll know it worked:`, plus at
  least one ASCII sketch (a nested ` ```text ` block or a Markdown table).
- **Customer-agnostic.** Synthetic only — no real customer names, private data,
  internal references, or real file paths.

### Adding or changing an example

1. Keep it synthetic and customer-agnostic.
2. Match the contract above; run `npm test` until it passes.
3. If you add a *new shape*, update `SKILL.md` (the shape table and output
   format), add a covering example, and extend the `SHAPES`/`FILE_SHAPE` lists
   in `test/contract.test.ts`.
4. Regenerate the README gallery if you touched an example's sketch:
   `npm run gallery` (needs `rsvg-convert` — `brew install librsvg`). The gallery
   cards in `assets/gallery/` are rendered from `examples/`, never hand-drawn.

## Pull requests

- **One concern per PR.** A bug fix and a refactor are two PRs.
- **Tests required.** New behavior ships with a test; a contract change ships
  with the example that proves it.
- **Conventional commits** for the subject line: `feat:`, `fix:`, `docs:`,
  `refactor:`, `test:`, `chore:`.
- **No drive-by reformatting.** Keep the diff to the change.
- **Green CI.** PRs that don't pass `npm run typecheck` + `npm test` aren't
  reviewed until they do.
- Keep the *skill* dependency-free: no build, no network, no local reads/writes
  in `SKILL.md`. Those belong in host adapters. Dev tooling (vitest, typescript)
  is fine — it never ships with the skill.

## Reporting bugs

Open an issue with: the brief you passed, the artifact you expected, what `etch`
produced, and your agent/host. A minimal reproduction is the fastest path to a
fix.

## License

By contributing you agree your contribution is licensed under the MIT license
that covers this project. See [LICENSE](LICENSE).
