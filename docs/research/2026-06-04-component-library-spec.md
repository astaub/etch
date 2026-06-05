# etch component library — spec (v0 proposal)

> "Tailwind for the CLI." A reusable set of ASCII/monospace wireframe components
> built on a consistent spacing + sizing token system, so everything aligns and
> breathes. Companion to the [design-language research](./2026-06-04-wireframe-design-language.md).
> Reference implementation: [`samples/kit.mjs`](./samples/kit.mjs). Proof:
> [`samples/`](./samples/).
>
> Status: **proposal for Andrew to react to.** Not yet wired into `SKILL.md`.

---

## 0. The one law

> **Every row inside a frame is padded to one identical width before the closing
> border is appended.**

Everything else is convenience. This is correctness. A frame is aligned iff every
row has the same visible width. Verify by rendering through Menlo (`freeze
--font.family Menlo`) and reading the image — never trust the editor.

---

## 1. Tokens

### 1.1 Spacing scale (horizontal, in character cells)

Like Tailwind's scale, but the unit is one monospace column.

| Token | Cells | Use |
|---|---|---|
| `s-0` | 0 | flush |
| `s-1` | 1 | hairline gap (icon ↔ label) |
| `s-2` | 2 | **default gutter** (inner padding each side) |
| `s-3` | 3 | gap between tab/legend items |
| `s-4` | 4 | column gap on desktop |
| `s-6` | 6 | section inset |
| `s-8` | 8 | major inset |

**Default gutter = `s-2`.** This is the breathing room the current wireframes
lack. A frame of outer width `W` has:

```
inner   = W - 2          (space between the two border columns)
content = inner - 2·2     (gutter both sides) = W - 6
```

### 1.2 Vertical rhythm (blank rows)

| Token | Rows | Use |
|---|---|---|
| `v-0` | 0 | tight |
| `v-1` | 1 | between sections inside a card; top/bottom pad of a card body |
| `v-2` | 2 | between cards / major regions |

Default: one `v-1` pad row at the top and bottom of every card body.

### 1.3 Frame widths (outer, includes the 2 border columns) — MOBILE-FIRST

Design the narrow phone frame first; widen to desktop second.

| Token | Cells | Target |
|---|---|---|
| `w-phone` | **40** | narrow phone — the default canvas |
| `w-phone-lg` | 46 | large phone |
| `w-tablet` | 64 | tablet / split pane |
| `w-desktop` | **104** | wide desktop |
| `w-desktop-xl` | 124 | very wide desktop |

Mobile is one column. Desktop composes multiple frames side-by-side with an `s-4`
column gap (see §4).

---

## 2. The glyph set ("the ink")

One coherent family. **Menlo-safe allowlist only** — every glyph below audited as
single-cell in Menlo. Anything not on this list is banned (notably the diagonals
`╲ ╱ ╳`, which are *not* single-cell and break alignment).

```
Frame (light, default)   ╭ ╮ ╰ ╯ ─ │
Junctions                ├ ┤ ┬ ┴ ┼
Frame (heavy = emphasis) ┏ ┓ ┗ ┛ ━ ┃ ┳ ┻
Frame (dashed = placeholder)  ┌ ┐ └ ┘ ╌ ╎
Shade ramp (density/text)     ░ ▒ ▓ █
Block ramp (sparkline/meter)  ▁ ▂ ▃ ▄ ▅ ▆ ▇ █
Furniture   ☰  ⌕  ●  ○  ✓  ›  →  ↑  ↓  ★  ◆  •  ▮ ▯
```

**Weight carries meaning.** Light frame = default. Heavy frame = the one primary
action / active element on the surface (use sparingly — one per view, like
charts' single accent). Dashed frame = a placeholder region ("fill this in").

---

## 3. Components

Each is a function of the available width; each returns rows already padded to
the frame's content width. Rendered catalog: [`samples/01-components.png`](./samples/01-components.png).

### 3.1 Frame / Card — title embedded in the top border

```
╭─ Card title ─────────────────────────────────╮
│                                              │
│  ██████████████████████                      │   heading = solid block
│                                              │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄     │   body = light dashed lines,
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                       │   ragged last line
│                                              │
│  ╭──────╮                                    │
│  │ Open │                                    │
│  ╰──────╯                                    │
│                                              │
╰──────────────────────────────────────────────╯
```

**Placeholder vocabulary (the keystone — chosen by render-and-look, see
[`samples/lab2.png`](./samples/lab2.png)):**
- **Heading** = solid block bar `███████` (bold, obvious hierarchy).
- **Body copy** = light dashed lines `┄┄┄┄┄┄`, ragged last line. *Not* shaded
  blocks `▒▒▒` — those read as noisy static. Dashed lines stay airy and clearly
  signal "copy goes here."
- **Sample data** (metrics, table cells) = real-ish values (`12,480`, `$1,200`).

### 3.2 Buttons — line weight = hierarchy

```
primary (heavy)     secondary (light)    ghost        pill (inline)
┏━━━━━━━━━━━━━┓      ╭────────────╮       Cancel →     [ Save ]
┃ Get started ┃      │ Learn more │
┗━━━━━━━━━━━━━┛      ╰────────────╯
```

Full-width CTA (`cta(label, width)`) centers the label across the frame content
width — used as the bottom action on mobile.

### 3.3 Inputs — label above, boxed value/placeholder below

```
Email
╭────────────────────────────────╮
│ you@example.com                │
╰────────────────────────────────╯
```

Search field uses the `⌕` glyph: `│ ⌕  Search …                  │`.

### 3.4 Status · badges · avatars · toggles

```
● Active   ○ Idle   [ NEW ]   [ BETA ]   ( A )  ( JD )   [ ●·· ] off   [ ··● ] on
```

Filled dot `●` = on/active; hollow `○` = off/idle. Badges are `[ LABEL ]`.
Avatars are initials in parens `( A )`.

### 3.5 Progress · stepper

```
meter   █████████████████░░░░░░░░░░░  60%
stepper ●━━━●───○   Step 2 of 3
```

Meter = block-fill on a shade track (charts style). Stepper = dots joined by
heavy rule up to the current step, light rule after.

### 3.6 Tabs — underline = active

```
Overview   Activity   Settings
━━━━━━━━   ········   ········
```

Heavy underline under the active tab; dotted under the rest.

### 3.7 Image / media placeholder — dashed region

```
┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
╎                      ╎
╎        image         ╎
╎                      ╎
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
```

Dashed border alone signals "placeholder." No diagonal X (not Menlo-safe).

### 3.8 List item — avatar + title + meta + chevron, shaded subtitle

```
( J )  Jane Cooper                    2m  ›
       ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
```

### 3.9 Table — header divider, numeric columns right-aligned

```
╭──────────────────────┬──────────────┬────────────────────╮
│ Name                 │ Status       │              Value │
├──────────────────────┼──────────────┼────────────────────┤
│ Acme Inc             │ ● Active     │             $1,200 │
│ Globex               │ ○ Idle       │               $840 │
╰──────────────────────┴──────────────┴────────────────────╯
```

### 3.10 Nav bar — brand left, actions right

```
☰  Acme Analytics                          ● Live    ⌕ Search    ( AS )
```

### 3.11 Bar chart — block columns + axis (placeholder-grade)

Block-fill columns over a baseline rule, with sparse axis labels. Reads as a
chart without pretending to be real data (see the dashboard sample).

---

## 4. Layout — composing for desktop

Mobile is a single `w-phone` frame, stacked. Desktop composes frames
**horizontally** with an `s-4` column gap. The reference `joinH()` pads each
block to its width and stacks side-by-side:

```
┌ sidebar (w 22) ┐  ┌ main column (w 80) ──────────────────────────┐
│  ◆ Dashboard   │  │ ┌metric┐ ┌metric┐ ┌metric┐                   │
│    Reports     │  │ │ chart card …                                │
│    …           │  │ │ table card …                                │
└────────────────┘  └─────────────────────────────────────────────┘
        22       + s-4 gap +              80              = 104 (w-desktop)
```

A responsive screen is the *same components* at a different width: a metric card
is `w-phone` content on mobile and ~25 cells in a 3-up row on desktop. The tokens
don't change; the composition does.

**Borderless columns** (kanban, lists-of-cards): not every region needs a frame.
A column is a header line + a full-width rule + stacked cards — no outer box.
Nesting framed cards inside a framed column produces noisy double-walls; drop the
column border and let the cards carry the structure. See
[`06-desktop-board.png`](./samples/06-desktop-board.png) (very wide, 124).

---

## 5. Samples (the proof)

| File | Screen | Width | Render |
|---|---|---|---|
| [`01-components.png`](./samples/01-components.png) | full component catalog | desktop | paper |
| [`02-mobile-signup.png`](./samples/02-mobile-signup.png) | signup / onboarding | phone (40) | paper + [dark](./samples/02-mobile-signup-dark.png) |
| [`03-mobile-feed.png`](./samples/03-mobile-feed.png) | inbox / feed | phone (40) | paper |
| [`04-desktop-dashboard.png`](./samples/04-desktop-dashboard.png) | analytics dashboard | desktop (104) | paper + [dark](./samples/04-desktop-dashboard-dark.png) |
| [`06-desktop-board.png`](./samples/06-desktop-board.png) | kanban board | **very wide (124)** | paper |
| [`05-ascii-vs-unicode.png`](./samples/05-ascii-vs-unicode.png) | the contract decision | phone | paper |

Regenerate any sample:

```
cd docs/research/samples
node 04-desktop-dashboard.mjs > 04-desktop-dashboard.txt
./freeze.sh 04-desktop-dashboard.txt 04-desktop-dashboard.png paper   # or: dark
```

---

## 6. Open decisions for Andrew

1. **Unicode box-drawing vs pure ASCII.** The contract forbids the glyphs that
   make these beautiful. Recommendation: relax "pure ASCII" → "Menlo-safe
   allowlist" (§2). See [`05-ascii-vs-unicode.png`](./samples/05-ascii-vs-unicode.png).
   *Everything downstream depends on this.*
2. **Default render skin** for the README gallery: cream paper (Balsamiq) or
   dark terminal (charts heritage)? Both are supported; pick a default.
3. **Token values.** Phone = 40, desktop = 104, gutter = 2. Tune to taste.
4. **Scope of v1.** Which components ship first when we do wire this into
   `SKILL.md` (held pending #1).
