# Distribution checklist

How `etch` goes from private repo to a public repo a stranger can install in one
step, following the shared Staub OSS standard
(`templates/oss-kit/DISTRIBUTION.md` in the monorepo). Work top to bottom; check
each box.

`etch` is neither the Node track nor the Go track — it is a **pure agent skill**
(no `src/`, no `dist/`, no CLI binary). Its track is below; the shared public-flip
steps are the same as every other Staub OSS lib.

The goal: **one command installs it.**

---

## Track — agent skill (etch shape)

The unit of distribution is the Markdown skill itself, packaged as a
single-plugin Claude Code marketplace.

- [ ] `SKILL.md` at the repo root with valid frontmatter (`name: etch`,
      `description`, `allowed-tools`, `version`).
- [ ] `.claude-plugin/plugin.json` — plugin manifest (`name`, `description`,
      `version`, `author`, `repository`, `license`).
- [ ] `.claude-plugin/marketplace.json` — single-plugin marketplace whose one
      entry has `"source": "./"` (the plugin is this repo root).
- [ ] One-command install works from a clean agent:

      ```text
      /plugin marketplace add astaub/etch
      /plugin install etch@etch
      ```

      Invoked as `/etch:etch`, or composed from another skill via `Skill(etch)`.
- [ ] Clone fallback works for a no-plugin setup:
      `git clone https://github.com/astaub/etch.git ~/.claude/skills/etch`
      → `/etch`.

### dist: there is none — on purpose

`etch` ships as Markdown. There is no `dist/`, no build, no published npm/Go
package. The only build artifacts are dev-time test dependencies
(`node_modules/`), which are gitignored and never shipped. This is documented in
[AGENTS.md](AGENTS.md) (the `dist_rule`). The dev tooling (`package.json`,
`vitest`) exists solely to hold the `examples/` artifacts to the output contract;
it is not part of the distributed skill.

---

## The public flip (do this last, once)

Extraction history may contain customer data. Flip to public deliberately. These
steps are the shared standard for every Staub OSS lib.

- [ ] **Run the scrub gate.** Before anything else, run the canonical automated
      gate over the repo — it scans the working tree **and full git history** for
      secrets (key/token/PEM/credential shapes), tracked secret files
      (`.env`/`*.pem`/`*.key`/…), internal/customer data (author home paths + the
      terms you supply), and large-binary history bloat:

      ```sh
      # from the monorepo; supply your customer/internal scrub terms
      bash templates/oss-kit/scrub-gate.sh --repo /path/to/etch \
        --term <customer-name> --term <internal-domain> --json
      ```

      It exits non-zero with a `STAUB_E_OSS_SCRUB_LEAK` envelope on any finding.
      **A clean pass is required before the flip.** The gate is
      customer-agnostic — it hardcodes no customer identifiers, so always pass
      your scrub terms (`--term` / `--terms-file`). Use `--allow <glob>` to
      exempt intentional matches (e.g. the synthetic `examples/` fixtures). This
      replaces any per-repo, hand-rolled grep checklist — the systematic scrub
      tooling is the source of truth.
- [ ] **Scrub history.** The shipped surface must contain zero customer data. If
      the repo carries monorepo extraction history, push a **fresh-history**
      snapshot (squash to an "Initial snapshot" commit) rather than the full
      history, then re-run the scrub gate to confirm the new history is clean.
      (`etch`'s current history is already a clean standalone `Initial release`.)
- [ ] **LICENSE present** (MIT) and matching `plugin.json` / `marketplace.json`
      `license`.
- [ ] **README, AGENTS.md, CLAUDE.md, CONTRIBUTING.md** all present and in the
      shared kit shape.
- [ ] **Flip visibility:**
      `gh repo edit astaub/etch --visibility public --accept-visibility-change-consequences`.
- [ ] **Branch protection on `main`** so the "no self-merge" rule is enforced,
      not just documented (required reviews, no direct pushes). Branch protection
      needs GitHub Pro on private repos; until the flip makes it available,
      enforce no-self-merge by convention.
- [ ] **Tokens / secrets:** a pure skill needs **no** release token or repo
      secret — nothing is published to a registry. Never commit a token.
- [ ] **First release tag** cut (`git tag v0.1.0 && git push --tags`), CI green,
      and the `Unreleased` section of `CHANGELOG.md` moved under the dated
      version.
- [ ] **One-command install verified from a clean machine / fresh agent** — run
      the `/plugin marketplace add` + `/plugin install` flow above and generate a
      conforming artifact. This is the smoke test that distribution works.

## Human-voice copy (owner: Andrew)

- [ ] README hero / pitch / "Why" / the name framing reflect the voice you want
      in public — left as `TODO(astaub)` stubs in `README.md`. Do a voice pass
      before flipping.
