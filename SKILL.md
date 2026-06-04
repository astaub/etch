---
name: etch
description: |
  Turn a brief into ordered ASCII wireframe alternatives for experimentation.
  Supports page, flow, component, copy, and diff shapes.
allowed-tools: Read
version: 0.1.0
---

# Etch

`etch` outputs alternative UI concepts directly in chat-friendly text.
No rendering dependency, no images, no external IDs.

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

## Render

Render each shape in pure ASCII.

- **page**: boxed areas with sections and hierarchy
- **flow**: arrows with branch labels, failure branch if relevant
- **component**: variant table and quick composition notes
- **copy**: table-driven copy alternatives
- **diff**: side-by-side or before/after textual diff

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

Return **one markdown block** only, wrapped in one fenced block.
No images, no screenshots, no external links, no HTML.

```markdown
# Wireframe Alternatives: <brief summary>
Shape: <shape>
Source: <brief id or short summary>
Track: <slug>

## Alternative 1: <Title>
- Rationale: ...
- Change list:
  - ...
  - ...
- Effort: XS
- How we'll know it worked: <metric> moves from <A> to >= <B> within <N> days

## Alternative 2: ...
...
```

## Output quality gates

- Keep all wording customer-agnostic.
- Keep all file paths synthetic unless they came from trusted input.
- Keep one brief sentence before the block:
  - “Generated N alternatives from shape S using evidence from ...”
- If assumptions are missing, call them out explicitly and still output a conservative
  draft.
- If `count` is omitted, default to `3`.
- If `count` is outside `1..7`, clamp to `1..7` and continue.

## Host adapter boundary

The core does not resolve local project paths or write files.
Host adapters pass resolved brief text, choose defaults, and handle write paths.
