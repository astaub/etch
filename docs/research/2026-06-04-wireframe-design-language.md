# Wireframe design language — research

> 2026-06-04 · research + prototype for making etch's ASCII wireframes
> beautiful. The bar: as considered and beautiful as the `@staub/charts`
> dashboards. This doc is the *why*; the [component-library spec](./2026-06-04-component-library-spec.md)
> is the *what*; the [samples](./samples/) are the *proof*.

## The problem

etch's current wireframes look cramped, misaligned, and crude. The failure is
not taste — it is the absence of a system. Three concrete defects, all visible
in the shipped gallery:

1. **Ragged right borders.** Each row is hand-typed to a different width, so the
   closing `|` lands in a different column on every line. The frame looks broken.
2. **No breathing room.** One cell of padding (often zero). Content jams against
   the walls.
3. **Crude ink.** `+`, `-`, `|` corners read as 1990s ASCII art, not as a
   designed wireframe.

None of these are hard to fix. They are fixed the same way `@staub/charts` fixed
them: a token system, one disciplined glyph set, and a verification step.

---

## 1. Balsamiq's wireframe language, translated to monospace

Balsamiq is the reference Andrew named, and the reason is precise: **it looks
obviously like a mockup, never like a finished design.** That roughness is a
feature. It tells the viewer "react to the structure, not the pixels." A polished
mock invites bikeshedding on color and copy; a sketch invites decisions about
layout and flow. We want the sketch.

Balsamiq achieves "obviously a mockup" with a small, repeatable vocabulary. Here
is each convention and its monospace translation:

| Balsamiq convention | What it signals | Monospace translation |
|---|---|---|
| Hand-drawn "marker" boxes | This is a sketch | Box-drawing frames `╭─╮ │ ╰─╯` — clean but clearly diagrammatic |
| Squiggle / greek text | "copy goes here", don't read it | Light dashed text-lines `┄┄┄┄┄┄┄┄┄┄`, ragged last line — reads as a line of copy without committing to words |
| Heavier scribble for headings | Visual hierarchy | Solid blocks `███████` for headings, light dashed lines for body |
| Rectangle with an X | Image placeholder | A **dashed** region `┌╌╌╌┐ ╎ image ╎ └╌╌╌┘` (see the freeze note below on why not a literal X) |
| `[Button]` chrome | Clickable | Boxed button; **line weight = priority** (heavy `┏━┓` = primary, light `╭─╮` = secondary) |
| Greyed / dashed elements | Placeholder / disabled | Dashed borders `┌╌╌┐` mark any "to be filled" region |
| Sample data in tables | Show intent, not real data | Real-ish sample values (`12,480`, `$1,200`) — Balsamiq does this too; it reads better than blocks for numbers |

The principle that ties them together: **commit to structure, placeholder
everything else.** Labels, buttons, and sample metrics are real words (they carry
intent). Body copy and images are deliberately rough (they carry only position).
That mix is what makes a wireframe read as a wireframe.

The body-text placeholder is the keystone, and getting it *beautiful* (not just
functional) took iteration. The first attempt used shaded word-chunks
(`▒▒▒▒ ▒▒▒▒▒▒ ▒▒▒`) — functional, but they render as noisy gray static that
fights the rest of the frame. A focused render-and-look pass over six candidates
([`samples/lab2.png`](./samples/lab2.png)) settled it: **light dashed text-lines
`┄┄┄┄┄┄┄┄`, with a ragged last line, paired with a solid `███` heading bar.**
The dashed lines read instantly as "a paragraph of copy," stay airy instead of
heavy, and are visually distinct from the solid frame — clearly a mockup, and
clean. Headings stay solid blocks so hierarchy is obvious at a glance. This is the
single change that took the samples from "aligned" to "beautiful."

---

## 2. How `@staub/charts` achieved beautiful ASCII

`@staub/charts` (the gold standard) is beautiful for reasons that are entirely
copyable. None of them are about color — the charts are beautiful in plain
monochrome. The beauty is *geometry plus restraint*.

### The cardinal rule: every row is padded to one identical width

This is the single most important thing, and the single thing etch is missing.
From the charts source, every body row is padded to the same visible width
*before* the closing border is appended. Quoting the charts test invariant:

> "A panel renders correctly iff every body row is padded to one identical
> ANSI-visible width before the right border is appended — so a single distinct
> visible width across all rows proves the strings are right."

Get this one rule right and the frame is perfect. Get it wrong and you have
etch's ragged borders. Our prototype kit enforces it in one function (`frame()`):
compute `inner`, pad every line to `inner - 2·gutter`, then wrap. There is no
other way to be aligned, and once you do it, alignment is free.

### One coherent glyph set, rounded corners

Charts uses a single box-drawing family with rounded corners (`╭ ╮ ╰ ╯ ─ │`) and
tee junctions (`├ ┤ ┬ ┴ ┼`). Rounded corners read softer and more intentional
than sharp `+`. The set never mixes weights randomly — heavy (`┏━┓`) is reserved
for *emphasis*, so weight carries meaning.

### Title embedded in the top border

Charts writes the panel title *into* the top rule: `╭─ Step ──────────╮`. It
saves a row, anchors the panel, and looks composed. We adopt it verbatim.

### Sub-cell density glyphs

Charts uses the eighth-block ramp (`▁▂▃▄▅▆▇█`) and shade ramp (`░▒▓█`) to show
density without spending extra columns. We reuse exactly these for sparklines,
meters, placeholder text, and modal backdrops. They are the texture that makes
monochrome ASCII look *designed* rather than *typed*.

### Calculated spacing, not magic strings

Charts never hand-types spaces. Every gap is `inner - labelWidth - meterWidth …`.
Spacing is a computed token, so it is consistent everywhere. Our kit mirrors this
with a spacing scale (`0 1 2 3 4 6 8` cells) and a default gutter of `2`.

### Geometry > color

Charts' light and dark themes are byte-identical after stripping color — only the
ink changes, never the layout. The lesson for etch: design the *layout* in pure
monochrome; treat the render background (paper vs terminal) as a swappable skin.
Our samples prove this — the same `.txt` renders on cream paper or deep-ocean
terminal with zero layout change.

---

## 3. The freeze-verify lesson

You cannot trust your editor to tell you whether box-drawing lines up.
Proportional fonts (and even some "monospace" fonts for specific glyphs) advance
box-drawing characters by fractional widths, so a frame that is *correct* can
*look* ragged, and a frame that is *broken* can *look* fine. The only reliable
check is to render through a real monospace font and read the result.

**The workflow, every time:**

```
write .txt  →  freeze --font.family Menlo  →  READ the PNG  →  fix  →  repeat
```

We wrapped this in [`samples/freeze.sh`](./samples/freeze.sh): it pins
`--font.family Menlo` and a syntax theme (`github` for the cream-paper Balsamiq
look, `nord` on `#0F2C4A` for the dark-terminal look). Render, then actually look
at the image — alignment bugs are obvious in the PNG and invisible in the source.

### This caught two real bugs in the prototype

The freeze-verify step earned its place immediately:

1. **`ipsum` off-by-one.** The placeholder-text generator didn't count the space
   between word-chunks, so it overflowed its box by one cell and pushed that
   row's border out. Invisible in the editor; obvious in the PNG.

2. **`╲ ╱ ╳` are not single-cell in Menlo.** The diagonal box-drawing glyphs
   (U+2571–2573) render *wider than one cell*, so the literal "rectangle with an
   X" image placeholder broke alignment. The glyph audit
   ([`samples/glyphs.png`](./samples/glyphs.png)) shows 16 diagonals pushing a
   trailing string ~3 cells right of 16 pipes (`align C` vs `align B`).
   **Resolution:** the image placeholder is a dashed box with a centered label —
   no diagonals. The diagonals are banned from the glyph allowlist (see the spec).

Every other glyph we use — `╭─╮│╰╯├┤┬┴┼ ┏━┓┃┗┛ ┌╌┐╎ ░▒▓█ ▁▂▃▄▅▆▇█ ☰ ⌕ ● ○ ✓ › → ↑ ↓ ★ ◆ •`
— audited as true single-cell width in Menlo. That allowlist *is* the safe
palette.

---

## 4. Synthesis — what etch should adopt

1. **A token system** ("Tailwind for the CLI"): a spacing scale in cells, a
   default gutter, and a small set of standard frame widths — **mobile-first**
   (phone = 40 cells) with a **very wide** desktop (104 cells). Full spec in the
   [component-library spec](./2026-06-04-component-library-spec.md).
2. **The alignment law:** every row padded to one identical width before the
   right border. Non-negotiable.
3. **One glyph set** with rounded corners, weight reserved for emphasis, shade
   ramps for texture — restricted to the Menlo-safe allowlist.
4. **The Balsamiq placeholder vocabulary:** shaded word-chunks for copy, solid
   blocks for headings, dashed regions for images/placeholders, sample data for
   metrics. Rough on purpose.
5. **Freeze-verify** as the authoring loop and as a contributor gate.

### The one decision that needs Andrew

etch's contract today mandates **pure ASCII** (`test/contract.test.ts` rejects
any non-ASCII byte). Every technique above that makes a wireframe *beautiful* —
rounded box-drawing, shade ramps, the placeholder vocabulary — uses Unicode
box-drawing, which is forbidden by that rule. `@staub/charts` is beautiful
*because* it uses these glyphs.

The [`05-ascii-vs-unicode`](./samples/05-ascii-vs-unicode.png) sample renders the
identical screen both ways. Both are perfectly aligned (the system works in
either). But pure-ASCII (`####`, `::::`, `#==#`) reads as crude ASCII art, while
Unicode reads as a designed wireframe. Box-drawing characters are universally
monospace-safe and render correctly in terminals, Slack, and GitHub — the
"pure ASCII" rule was a v0.1 paste-safety choice, not a hard constraint.

**Recommendation:** relax the contract from "pure ASCII" to "an allowlist of
Menlo-safe box-drawing + shade glyphs." This is the prerequisite for everything
else. Holding for Andrew's call before touching `SKILL.md`.
