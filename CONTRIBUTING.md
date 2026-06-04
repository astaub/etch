# Contributing to etch

Thanks for your interest in etch. It is a small, deliberately boring project: a
single Claude Code skill (`SKILL.md`) plus example artifacts. There is no build
step and no runtime dependency — the skill *is* the markdown.

## Project shape

```
SKILL.md                     # the skill: generation rules + output contract
README.md                    # human overview
AGENTS.md                    # agent/host integration notes
.claude-plugin/              # plugin + marketplace manifests for /plugin install
examples/                    # one shipped artifact per shape (page/flow/component/copy/diff)
references/                  # framing notes
test/contract.test.mjs       # zero-dependency contract test for examples/
```

## Running the test

The only test is a zero-dependency Node script that checks every file in
`examples/` against the output contract documented in `SKILL.md`:

```bash
node test/contract.test.mjs
```

It exits non-zero on any violation and prints the offending file and rule. No
`npm install`, no toolchain — any recent Node (18+) works. CI runs the same
command on every push and pull request.

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
2. Match the contract above; run `node test/contract.test.mjs` until it passes.
3. If you add a *new shape*, update `SKILL.md` (the shape table and output
   format), add a covering example, and extend the test's shape list.

## Pull requests

- Keep changes focused and the diff readable.
- Run the contract test before opening the PR.
- Update `CHANGELOG.md` under `## [Unreleased]` for any user-visible change.
- Do not introduce build steps, dependencies, network calls, or local file
  writes into the core skill — those belong in host adapters, never in `etch`.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
