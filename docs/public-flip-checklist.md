# Private → Public flip checklist

> Status: **prepared, not executed.** This is a manual runbook for the maintainer
> to make `astaub/etch` public. Nothing here runs automatically. Work top to
> bottom; each box is a deliberate human decision.

## 1. Repo hygiene (done in the hardening PR — re-verify)

- [ ] `git ls-files` lists only intended files (no local settings, no secrets).
      `.claude/settings.local.json` is git-ignored and untracked.
- [ ] No private-repo references, internal system names, customer names, real
      data, or absolute machine paths anywhere tracked. Grep the tree for your own
      sensitive tokens — your machine username, your home path prefix, any
      internal product/system names, and private-repo issue refs:
      ```bash
      git grep -niE '<your-username>|/Users/|/home/|<internal-system-names>|<org>/<private-repo>#[0-9]'
      ```
      (Expect: no matches. `astaub/etch` self-references and "customer-agnostic"
      are fine.)
- [ ] Examples are synthetic and pure ASCII; `npm install && npm test` passes
      (and `npm run typecheck`).
- [ ] `LICENSE` present (MIT) with the correct copyright holder and year.
- [ ] `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `AGENTS.md` are accurate and
      contain no internal-only context.

## 2. Human-voice copy (owner: Andrew)

- [ ] README hero / pitch / tagline reflects the voice you want in public. The
      hardening PR left the factual copy in place and flagged the pitch as a
      placeholder — do a voice pass before flipping.
- [ ] Confirm the one-line `description` in `SKILL.md`, `plugin.json`, and
      `marketplace.json` all read the way you want them to in a public listing.

## 3. History scrub (decide before flipping)

- [ ] Review the full commit history that will become public:
      ```bash
      git log -p | grep -niE '<your-username>|/Users/|/home/|secret|token|<internal-system-names>'
      ```
- [ ] If any sensitive content exists in history (not just the current tree),
      decide between: (a) squashing history before flip, or (b) creating a fresh
      public repo and pushing a clean snapshot. The current tree is clean; this
      step is about *history*.

## 4. Install path verification (post-flip smoke test)

Once public, confirm the documented install actually works from a clean machine:

- [ ] `/plugin marketplace add astaub/etch`
- [ ] `/plugin install etch@etch`
- [ ] Invoke `/etch:etch` (or `Skill(etch)` from another skill) and confirm it
      generates a conforming artifact.
- [ ] Clone fallback also works: `git clone https://github.com/astaub/etch.git
      ~/.claude/skills/etch` then `/etch`.

## 5. Flip + release

- [ ] Tag the release: `git tag v0.1.0 && git push --tags`.
- [ ] Move the `Unreleased` section of `CHANGELOG.md` under a dated version
      heading.
- [ ] GitHub → repo Settings → General → Danger Zone → **Change visibility →
      Public**.
- [ ] Verify branch protection / required CI status on `main` after the flip.
- [ ] (Optional) Add repository topics, a description, and a homepage on GitHub.

## 6. Post-flip

- [ ] Confirm the `test` GitHub Action runs green on the public repo.
- [ ] Announce / link where appropriate.
