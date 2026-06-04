# AGENTS.md — etch

`etch` is a host-agnostic **agent skill** (markdown `SKILL.md`, no build, no
network, no local writes). It turns a brief into ordered ASCII UI wireframe
alternatives.

## Install
Claude Code, as a plugin marketplace:

```text
/plugin marketplace add astaub/etch
/plugin install etch@etch
```

This repo is a single-plugin marketplace (`.claude-plugin/marketplace.json` +
`.claude-plugin/plugin.json`) with `SKILL.md` at the plugin root. There is no npm
package and no build step; the skill is the markdown. To skip plugins entirely,
clone the repo into `~/.claude/skills/etch` and invoke `/etch`.

## Compose from another skill
Call it as a sub-skill via `Skill(etch)` (or the host's skill-dispatch
equivalent). The host resolves the brief/finding/diff text and passes scrubbed
text in; the core generates alternatives. Source resolution, credentials,
private URLs, and artifact writes stay in the **host adapter**, never the core.

## Distribution
- Consumed via `/plugin marketplace add` + `/plugin install`, or by cloning the
  repo into the agent's skills directory.
- The contract (`SKILL.md` shape, output format) is stable and versioned in
  `CHANGELOG.md`; distribution changes do not change the interface.

## Boundaries (do not break)
- Output is **one fenced markdown block**, pure ASCII — no images/HTML/links.
- All wording **customer-agnostic**; file paths synthetic unless from trusted input.
- The core does **not** read local project files or write anything. That's the
  host adapter's job.
