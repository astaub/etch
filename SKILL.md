---
name: etch
description: |
  Turn a brief into ordered, beautiful monospace wireframe alternatives for
  experimentation. Supports page, flow, component, copy, and diff shapes.
allowed-tools: Read
version: 0.2.0
---

# Etch

`etch` outputs alternative UI concepts directly in chat-friendly text. No
rendering dependency, no images, no external IDs — just one designed,
copy-pasteable Markdown block.

The bar is **beauty**: as considered as a `@staub/charts` dashboard, in the spirit
of a Balsamiq sketch — obviously a mockup, never a finished design, but aligned,
airy, and intentional. The design system below (the glyph set, the tokens, the
component library) is how etch hits that bar every time. The *why* lives in
[`docs/research/2026-06-04-wireframe-design-language.md`](docs/research/2026-06-04-wireframe-design-language.md);
the proof is [`docs/research/samples/`](docs/research/samples/).

## Parse input

Accept one of:

- Finding ID
- Intent sentence
- Feature brief
- Code diff snippet
- Hypothesis text

Input can arrive as:

- command arg
- stdin
- `--finding-id <id>`

If no explicit input is present, fail with:

- `missing input` and ask for one brief sentence.

## Detect shape

Auto-detect unless `--shape` is explicitly set.

| Signal | Shape |
|---|---|
| mentions "step", "journey", "checkout", "screen to screen", "redirect", or "branch" | `flow` |
| includes copy blocks, headlines, body copy, CTA, button text, empty/error copy | `copy` |
| includes `+`/`-` hunks, `@@`, `before/after`, or file rename/move context | `diff` |
| includes "component", "card", "button", "input", "nav", or "widget" with no flow words | `component` |
| feature or product goal text without clear control-flow or code-diff markers | `page` |

If none match:

- finding involving a UI step => `page` or `flow` based on verbosity
- finding involving copy => `copy`
- feature brief => `page`
- diff brief => `diff`

## Generate alternatives

Generate `N` alternatives (default `3`):

1. cheapest / least invasive
2. moderate change
3. larger redesign

Order from minimal to most expensive effort. Never collapse them into one.

---

# Design system — the beauty contract

The skill renders in a designed monospace language, not crude ASCII art. Five
rules produce the aesthetic; follow them and alignment, hierarchy, and "obviously
a mockup" come for free.

## 1. The one law — every row is padded to one identical width

> **Inside a single frame, every row is padded to one identical visible width
> before the closing border is appended.**

This is correctness, not taste. A frame is aligned iff all of its rows share one
visible width. Get it right and the frame is perfect; get it wrong and you have
the ragged right border that reads as broken. Compute the inner width once, pad
every content line to `inner - 2·gutter`, then append the border. Never hand-type
a row to "about" the right width.

(Desktop layouts compose *multiple* frames side-by-side — the law applies *within*
each frame, not across the composed row; see §5.)

## 2. The glyph set — the Menlo-safe allowlist (the "ink")

One coherent box-drawing family with **rounded corners**. Every glyph below is
audited single-cell in Menlo. **This allowlist is the whole palette — anything
not on it is banned**, notably the diagonals `╲ ╱ ╳`, which are *not* single-cell
and silently break alignment.

```
Frame · light (default)     ╭ ╮ ╰ ╯ ─ │
Junctions                   ├ ┤ ┬ ┴ ┼
Frame · heavy (emphasis)    ┏ ┓ ┗ ┛ ━ ┃ ┳ ┻
Frame · dashed (placeholder)┌ ┐ └ ┘ ╌ ╎
Shade ramp (density/fill)   ░ ▒ ▓ █
Block ramp (spark/meter)    ▁ ▂ ▃ ▄ ▅ ▆ ▇ █
Furniture                   ☰  ⌕  ●  ○  ✓  ›  →  ↑  ↓  ★  ◆  •  ▮  ▯  ┄
Typographic punctuation     ·  —  …
```

**Weight carries meaning.** Light frame = default. Heavy frame `┏━┓` = the *one*
primary action or active element on the surface — use it sparingly, one per view,
like charts' single accent. Dashed frame `┌╌┐` = a placeholder region ("fill this
in"). Plus standard printable ASCII for all real words, labels, numbers, and
punctuation.

## 3. Tokens — "Tailwind for the CLI"

### Spacing scale (horizontal, in character cells)

| Token | Cells | Use |
|---|---|---|
| `s-0` | 0 | flush |
| `s-1` | 1 | hairline gap (icon ↔ label) |
| `s-2` | 2 | **default gutter** (inner padding each side) |
| `s-3` | 3 | gap between tab / legend items |
| `s-4` | 4 | column gap on desktop |
| `s-6` | 6 | section inset |
| `s-8` | 8 | major inset |

**Default gutter = `s-2`.** A frame of outer width `W` has `inner = W − 2` and
`content = inner − 2·2 = W − 6`.

### Vertical rhythm (blank rows)

| Token | Rows | Use |
|---|---|---|
| `v-0` | 0 | tight |
| `v-1` | 1 | between sections in a card; top/bottom pad of a card body |
| `v-2` | 2 | between cards / major regions |

Default: one `v-1` pad row at the top and bottom of every card body. Generous air
is part of the aesthetic — when in doubt, add a blank row.

### Frame widths (outer, includes the 2 border columns) — MOBILE-FIRST

Design the narrow phone frame first; widen to desktop second.

| Token | Cells | Target |
|---|---|---|
| `w-phone` | **40** | narrow phone — the default canvas |
| `w-phone-lg` | 46 | large phone |
| `w-tablet` | 64 | tablet / split pane |
| `w-desktop` | **104** | wide desktop |
| `w-desktop-xl` | 124 | very wide desktop |

## 4. Light + dark are both first-class

Design the *layout* in pure monochrome; the render background is a swappable skin.
The identical `.txt` reads beautifully on **cream paper** (the Balsamiq look) and
on a **dark terminal** (the charts heritage) with **zero layout change** — only
the ink color differs, never the geometry. Never special-case a width, a glyph, or
a padding value for one mode. If a sketch only aligns in one skin, it is wrong in
both.

## 5. The component library

Each component is a function of the available width and returns rows already
padded to the frame's content width. Rendered catalog:
[`docs/research/samples/01-components.txt`](docs/research/samples/01-components.txt).

**Placeholder vocabulary (the keystone — commit to structure, placeholder
everything else):**

- **Heading** = solid block bar `██████████` — bold, obvious hierarchy.
- **Body copy** = light dashed lines `┄┄┄┄┄┄┄┄`, with a **ragged last line**. Not
  shaded blocks `▒▒▒` (those read as noisy static). Dashed lines stay airy and say
  "copy goes here" without committing words.
- **Sample data** (metrics, table cells, labels, buttons) = real-ish values
  (`12,480`, `$1,200`, `Create account`) — they carry intent, so make them words.

**Card / frame — title embedded in the top border:**

```
╭─ Card title ─────────────────────────────────╮
│                                              │
│  ██████████████████████                      │
│                                              │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄    │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                     │
│                                              │
│  ╭──────╮                                    │
│  │ Open │                                    │
│  ╰──────╯                                    │
│                                              │
╰──────────────────────────────────────────────╯
```

**Buttons — line weight = hierarchy:**

```
primary (heavy)     secondary (light)    ghost        pill (inline)
┏━━━━━━━━━━━━━┓      ╭────────────╮       Cancel →     [ Save ]
┃ Get started ┃      │ Learn more │
┗━━━━━━━━━━━━━┛      ╰────────────╯
```

A full-width CTA centers its label across the content width — the bottom action
on mobile.

**Inputs — label above, boxed value/placeholder below:**

```
Email
╭────────────────────────────────╮
│ you@example.com                │
╰────────────────────────────────╯
```

Search uses `⌕`: `│ ⌕  Search …                  │`.

**Status · badges · avatars · toggles:**

```
● Active   ○ Idle   [ NEW ]   [ BETA ]   ( A )  ( JD )   [ ●·· ] off   [ ··● ] on
```

Filled dot `●` = on/active; hollow `○` = off/idle. Badges are `[ LABEL ]`.
Avatars are initials in parens `( A )`.

**Progress · stepper:**

```
meter   █████████████████░░░░░░░░░░░  60%
stepper ●━━━●───○   Step 2 of 3
```

Meter = block-fill on a shade track. Stepper = dots joined by a heavy rule up to
the current step, light rule after.

**Tabs — underline = active:**

```
Overview   Activity   Settings
━━━━━━━━   ········   ········
```

**Image / media placeholder — dashed region (no diagonal X; it is not Menlo-safe):**

```
┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
╎                      ╎
╎        image         ╎
╎                      ╎
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
```

**List item — avatar + title + meta + chevron, dashed subtitle:**

```
( J )  Jane Cooper                    2m  ›
       ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
```

**Table — header divider, numeric columns right-aligned:**

```
╭──────────────────────┬──────────────┬────────────────────╮
│ Name                 │ Status       │              Value │
├──────────────────────┼──────────────┼────────────────────┤
│ Acme Inc             │ ● Active     │             $1,200 │
│ Globex               │ ○ Idle       │               $840 │
╰──────────────────────┴──────────────┴────────────────────╯
```

**Nav bar — brand left, actions right:**

```
☰  Acme Analytics                          ● Live    ⌕ Search    ( AS )
```

**Bar chart / sparkline — block columns over a baseline (placeholder-grade):**
block-fill columns from the block ramp over a baseline rule with sparse axis
labels (`▆▇██▆▅▃▃▃▄▅▄▃▂`). Reads as a chart without pretending to be real data.

## 6. Layout — composing for desktop

Mobile is a single `w-phone` frame, stacked vertically. Desktop composes frames
**horizontally** with an `s-4` column gap: pad each block to its own width, then
stack side-by-side (a sidebar of 22 + gap + main of 80 = `w-desktop` 104). A
responsive screen is the *same components* at a different width — the tokens don't
change, the composition does.

**Borderless columns** (kanban, lists-of-cards): not every region needs a frame.
A column is a header line + a full-width rule + stacked cards, with no outer box —
nesting framed cards inside a framed column produces noisy double-walls. Drop the
column border and let the cards carry the structure. See
[`docs/research/samples/06-desktop-board.txt`](docs/research/samples/06-desktop-board.txt).

## 7. Freeze-verify — the authoring gate

You cannot trust an editor to tell you whether box-drawing lines up: proportional
fonts advance glyphs by fractional widths, so a *correct* frame can *look* ragged
and a *broken* frame can *look* fine. The only reliable check is to render through
a real monospace font and read the result.

```
write sketch  →  freeze --font.family Menlo  →  LOOK at the PNG  →  fix  →  repeat
```

Verify both skins (`paper` and `dark`). This loop is what catches off-by-one
overflows and non-single-cell glyphs that are invisible in source. When you
hand-author or change a frame, walk it: count the cells of the widest row, then
confirm every other row pads to exactly that — including trailing spaces before
the border.

---

## Render

Render each shape in the design language above — beautiful, aligned, both skins.

- **page**: composed cards/sections with hierarchy (heading blocks, dashed body,
  real labels). Mobile = one `w-phone` column; desktop = composed frames.
- **flow**: screen frames joined by `→` with branch labels; include a failure
  branch when relevant. Use a stepper (`●━━━●───○`) for progress.
- **component**: a variant grid built from the component library, plus quick
  composition notes — weight = hierarchy, dashed = placeholder.
- **copy**: table-driven copy alternatives (the table component).
- **diff**: before/after frames side-by-side, same widths, so the change is the
  only thing that moves.

## Annotate each alternative

Every alternative must include:

- **Title**
- **Rationale**
- **Change list**
  - file-level when file names are present in the brief
  - conceptual otherwise
- **Effort**: `XS`, `S`, `M`, or `L`
- **How we'll know it worked**
  - watched metric
  - reasonable threshold
  - no statistical power language or MDE framing

## Output format

Return **one markdown block** only, wrapped in one fenced block. No images, no
screenshots, no external links, no HTML. The sketches use the Menlo-safe glyph
allowlist (§2) — that is the only non-ASCII permitted, and it is universally
monospace-safe in terminals, Slack, and GitHub.

```markdown
# Wireframe Alternatives: <brief summary>
Shape: <shape>
Track: <slug>
Source: <brief id or short summary>

## Alternative 1 (XS)
- Title: <Title>
- Rationale: ...
- Change list:
  - ...
  - ...
- Effort: XS
- How we'll know it worked: <metric> moves from <A> to >= <B> within <N> days

```text
╭─ Sign up ────────────────────────────╮
│                                      │
│  ██████████████                      │
│                                      │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄   │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                 │
│                                      │
│  Email                               │
│  ╭────────────────────────────────╮  │
│  │ you@example.com                │  │
│  ╰────────────────────────────────╯  │
│                                      │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃         Create account         ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                      │
│  ●───○───○   Step 1 of 3             │
│                                      │
╰──────────────────────────────────────╯
```

## Alternative 2 (S)
- Title: ...
...
```

The header order is `Shape`, then `Track`, then `Source`. Each alternative heading
carries its effort tag in parentheses, and repeats `- Effort:` in the body so the
artifact is both skimmable and machine-checkable. See `examples/` for one shipped
artifact per shape.

## Output quality gates

- **Alignment first.** Every frame obeys the one law (§1) — one identical visible
  width per row. A ragged frame is a defect, not a style.
- **Allowlist only.** Use only the Menlo-safe glyphs (§2) plus printable ASCII.
  Never the banned diagonals `╲ ╱ ╳`.
- **Both skins.** The sketch must read in light (paper) and dark (terminal) with
  no layout change.
- Keep all wording customer-agnostic.
- Keep all file paths synthetic unless they came from trusted input.
- Keep one brief sentence before the block:
  - "Generated N alternatives from shape S using evidence from ..."
- If assumptions are missing, call them out explicitly and still output a
  conservative draft.
- If `count` is omitted, default to `3`.
- If `count` is outside `1..7`, clamp to `1..7` and continue.

## Host adapter boundary

The core does not resolve local project paths or write files. Host adapters pass
resolved brief text, choose defaults, and handle write paths.
