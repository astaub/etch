# AGENTS.md — etch

`etch` is a host-agnostic **agent skill** (markdown `SKILL.md`, no build, no
network, no local writes). It turns a brief into ordered ASCII UI wireframe
alternatives.

## Install
Claude Code: `/plugin install https://github.com/astaub/etch.git` — clones this
repo's `SKILL.md` (+ `examples/`, `references/`) into the agent's skill
directory. There is no npm package and no build step; the skill is the markdown.

## Compose from another skill
Call it as a sub-skill via `Skill(etch)` (or the host's skill-dispatch
equivalent). The host resolves the brief/finding/diff text and passes scrubbed
text in; the core generates alternatives. Source resolution, credentials,
private URLs, and artifact writes stay in the **host adapter**, never the core.

## Distribution
- **Now:** private repo (`astaub/etch`), consumed via `/plugin install` or
  `git clone` into the skills dir.
- **Goal:** public. The contract (`SKILL.md` shape, output format) is stable; a
  public flip changes only visibility, not the interface.

## Boundaries (do not break)
- Output is **one fenced markdown block**, pure ASCII — no images/HTML/links.
- All wording **customer-agnostic**; file paths synthetic unless from trusted input.
- The core does **not** read local project files or write anything. That's the
  host adapter's job.
