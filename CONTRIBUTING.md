# Contributing to etch

Thanks for your interest in etch. It is a small, deliberately boring project: a
single Claude Code skill (`SKILL.md`) plus example artifacts. The skill itself has
no build step and no runtime dependency — the skill *is* the markdown. The only
tooling is dev-only: a [vitest](https://vitest.dev) suite that holds the example
artifacts to the output contract.

## Project shape

```
SKILL.md                     # the skill: generation rules + output contract
README.md                    # human overview
AGENTS.md                    # agent/host integration notes
.claude-plugin/              # plugin + marketplace manifests for /plugin install
examples/                    # one shipped artifact per shape (page/flow/component/copy/diff)
references/                  # framing notes
test/contract.test.ts        # vitest contract test over examples/
package.json                 # dev tooling only (vitest, typescript)
```

## Running the test

The contract test (vitest) checks every file in `examples/` against the output
contract documented in `SKILL.md`:

```bash
npm install   # first time only — pulls vitest + typescript
npm test      # vitest run
npm run typecheck
```

It fails on any violation and names the offending file and rule. CI runs
`npm run typecheck` and `npm test` on every push and pull request.

## The output contract (do not break)

These invariants are enforced by the test and by review. They are the public
surface of the skill:

- **One fenced block.** Each artifact is a single ` ```markdown ` block, opened on
  the first line and closed on the last.
- **Pure ASCII.** No non-ASCII characters, no images, no HTML, no links or URLs.
  Use `-` for bullets, `+/-` for plus-minus, straight quotes only.
- **Header.** `# Wireframe Alternatives: <summary>`, then `Shape:`, `Track:`,
  `Source:` (in that order). `Shape` is one of `page`, `flow`, `component`,
  `copy`, `diff`.
- **Alternatives.** `## Alternative N (EFFORT)` headings numbered sequentially
  from 1, between 1 and 7 of them, ordered cheapest-first. `EFFORT` is one of
  `XS`, `S`, `M`, `L`.
- **Per alternative.** Each block carries `- Title:`, `- Rationale:`,
  `- Change list:`, `- Effort:` (matching the heading tag), and
  `- How we'll know it worked:`, plus at least one ASCII sketch (a nested
  ` ```text ` block or a markdown table).
- **Customer-agnostic.** Examples and copy are synthetic. No real customer names,
  no private data, no internal system references, no real file paths. File paths
  in examples are illustrative.

## Adding or changing an example

1. Keep it synthetic and customer-agnostic.
2. Match the contract above; run `npm test` until it passes.
3. If you add a *new shape*, update `SKILL.md` (the shape table and output
   format), add a covering example, and extend the `SHAPES`/`FILE_SHAPE` lists in
   `test/contract.test.ts`.

## Pull requests

- Keep changes focused and the diff readable.
- Run `npm test` (and `npm run typecheck`) before opening the PR.
- Update `CHANGELOG.md` under `## [Unreleased]` for any user-visible change.
- Keep the *skill* itself dependency-free: no build step, no network calls, and no
  local file reads or writes in `SKILL.md`. Those belong in host adapters, never in
  `etch`. Dev tooling (vitest, typescript) is fine — it never ships with the skill.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
