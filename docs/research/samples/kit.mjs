// kit.mjs — PROTOTYPE scaffold for the etch wireframe design system.
//
// This is NOT part of the etch skill (etch ships as Markdown; an agent hand-
// authors the ASCII). This kit exists only to PROVE the token system produces
// pixel-aligned output and to generate the sample frames Andrew is reviewing.
// Every public helper enforces the cardinal rule: every row in a frame is
// padded to one identical inner width before the right border is appended.
//
// Tokens live in T below. Glyphs in G. Everything else composes those.

// ---------------------------------------------------------------------------
// TOKENS — "Tailwind for the CLI". All horizontal units are character cells.
// ---------------------------------------------------------------------------
export const T = {
  // Frame widths (outer, includes the 2 border columns). Mobile-first.
  w: { phone: 40, phoneLg: 46, tablet: 64, desktop: 104, desktopXl: 124 },
  // Horizontal spacing scale (cells).
  s: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 6: 6, 8: 8 },
  gutter: 2, // default inner padding each side
  // Vertical rhythm (blank rows).
  v: { 0: 0, 1: 1, 2: 2 },
};

// ---------------------------------------------------------------------------
// GLYPHS — "the ink". One coherent box-drawing set + the placeholder language.
// ---------------------------------------------------------------------------
export const G = {
  // light frame (default)
  tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│',
  // junctions
  teeL: '├', teeR: '┤', teeT: '┬', teeB: '┴', cross: '┼',
  // heavy frame (emphasis: primary CTA, active card)
  Htl: '┏', Htr: '┓', Hbl: '┗', Hbr: '┛', Hh: '━', Hv: '┃',
  Hjoin: { teeT: '┳', teeB: '┻' },
  // dashed frame (placeholder region)
  Dh: '╌', Dv: '╎', Dtl: '┌', Dtr: '┐', Dbl: '└', Dbr: '┘',
  // shades (density / placeholder text / overlays)
  sh: { 1: '░', 2: '▒', 3: '▓', full: '█' },
  // meter
  meterFull: '█', meterTrack: '░',
  // glyph furniture
  chevron: '›', menu: '☰', search: '⌕', check: '✓', dotF: '●', dotE: '○',
  arrow: '→', up: '↑', down: '↓', star: '★',
};

// ASCII fallback profile — mutate G in place so every component degrades to
// pure ASCII (etch's current contract). Used only to A/B the two aesthetics.
export function setAscii() {
  Object.assign(G, {
    tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|',
    teeL: '+', teeR: '+', teeT: '+', teeB: '+', cross: '+',
    Htl: '#', Htr: '#', Hbl: '#', Hbr: '#', Hh: '=', Hv: '#',
    Dh: '-', Dv: ':', Dtl: '+', Dtr: '+', Dbl: '+', Dbr: '+',
    sh: { 1: '.', 2: ':', 3: '#', full: '#' },
    meterFull: '#', meterTrack: '.',
    chevron: '>', menu: '=', search: '?', check: 'x', dotF: '*', dotE: 'o',
    arrow: '->', up: '^', down: 'v', star: '*',
  });
}

// ---------------------------------------------------------------------------
// width-safe string helpers (all glyphs above are single-cell in Menlo)
// ---------------------------------------------------------------------------
const len = (s) => Array.from(s).length;
const repeat = (ch, n) => ch.repeat(Math.max(0, n));

export function pad(s, width, align = 'left') {
  s = String(s);
  const gap = width - len(s);
  if (gap <= 0) return s;
  if (align === 'right') return repeat(' ', gap) + s;
  if (align === 'center') {
    const l = Math.floor(gap / 2);
    return repeat(' ', l) + s + repeat(' ', gap - l);
  }
  return s + repeat(' ', gap);
}

// blank line(s) of a given inner width
export const blank = (n = 1) => Array(n).fill('');

// ---------------------------------------------------------------------------
// FRAME — wrap content lines in a titled box, padding every row to inner width.
// width = outer width. content = array of strings (logical, unpadded).
// opts: { title, weight: 'light'|'heavy'|'dashed', gutter, padY }
// ---------------------------------------------------------------------------
export function frame(width, content, opts = {}) {
  const { title = '', weight = 'light', gutter = T.gutter, padY = 1 } = opts;
  const inner = width - 2; // space between the two border columns
  const box =
    weight === 'heavy'
      ? { tl: G.Htl, tr: G.Htr, bl: G.Hbl, br: G.Hbr, h: G.Hh, v: G.Hv }
      : weight === 'dashed'
      ? { tl: G.Dtl, tr: G.Dtr, bl: G.Dbl, br: G.Dbr, h: G.Dh, v: G.Dv }
      : { tl: G.tl, tr: G.tr, bl: G.bl, br: G.br, h: G.h, v: G.v };

  // top border, with optional title embedded
  let top;
  if (title) {
    const label = ` ${title} `;
    const after = inner - 1 - len(label); // 1 lead dash before the label
    top = box.tl + box.h + label + repeat(box.h, after) + box.tr;
  } else {
    top = box.tl + repeat(box.h, inner) + box.tr;
  }
  const bottom = box.bl + repeat(box.h, inner) + box.br;

  const bodyW = inner - gutter * 2;
  const wrap = (line) =>
    box.v + repeat(' ', gutter) + pad(line, bodyW) + repeat(' ', gutter) + box.v;

  const rows = [...blank(padY), ...content, ...blank(padY)].map(wrap);
  return [top, ...rows, bottom];
}

// horizontal rule INSIDE a frame body (returns a logical line of given bodyW)
export const hr = (bodyW, ch = G.h) => repeat(ch, bodyW);

// a full-width section divider that ties into the frame walls; use as content
// line wrapper-aware: returns a string that frame() will pad — but for a clean
// tie-in we expose divider() that yields the ├───┤ row at a given OUTER width.
export function divider(width, weight = 'light') {
  const inner = width - 2;
  if (weight === 'heavy') return G.teeL + repeat(G.Hh, inner) + G.teeR; // mixed; rarely used
  return G.teeL + repeat(G.h, inner) + G.teeR;
}

// ---------------------------------------------------------------------------
// COMPONENTS — each returns an array of logical lines (no outer border); drop
// them into frame() content, or into joinH for multi-column desktop layouts.
// ---------------------------------------------------------------------------

// placeholder text. words = rough chunk pattern that reads as "copy goes here".
export function ipsum(width, lines = 2, shade = G.sh[2]) {
  // deterministic word-chunk pattern, ragged last line
  const chunks = [4, 7, 3, 6, 5, 8, 2, 5, 4, 6];
  const out = [];
  for (let r = 0; r < lines; r++) {
    let line = '';
    let i = r * 3;
    const target = r === lines - 1 ? Math.floor(width * 0.6) : width;
    while (len(line) < target) {
      const sep = line ? 1 : 0;
      const room = target - len(line) - sep;
      if (room <= 0) break;
      const w = chunks[i % chunks.length];
      const word = repeat(shade, Math.min(w, room));
      line += (line ? ' ' : '') + word;
      i++;
    }
    out.push(line);
  }
  return out;
}

// heading placeholder (chunky solid)
export const headline = (width, frac = 0.55) =>
  ipsum(Math.floor(width * frac), 1, G.sh.full);

// inline button. variant: 'primary'(heavy box), 'secondary'(light box), 'ghost'
export function button(label, variant = 'secondary') {
  const text = ` ${label} `;
  const w = len(text);
  if (variant === 'primary') {
    return [
      G.Htl + repeat(G.Hh, w) + G.Htr,
      G.Hv + text + G.Hv,
      G.Hbl + repeat(G.Hh, w) + G.Hbr,
    ];
  }
  if (variant === 'ghost') return [`${label} ${G.arrow}`];
  return [
    G.tl + repeat(G.h, w) + G.tr,
    G.v + text + G.v,
    G.bl + repeat(G.h, w) + G.br,
  ];
}

// inline pill button (1 row): [ Label ]
export const pill = (label) => `[ ${label} ]`;

// full-width CTA button box, centered label. variant heavy=primary.
export function cta(label, width, variant = 'primary') {
  const inner = width - 2;
  const b = variant === 'primary'
    ? { tl: G.Htl, tr: G.Htr, bl: G.Hbl, br: G.Hbr, h: G.Hh, v: G.Hv }
    : { tl: G.tl, tr: G.tr, bl: G.bl, br: G.br, h: G.h, v: G.v };
  return [
    b.tl + repeat(b.h, inner) + b.tr,
    b.v + pad(label, inner, 'center') + b.v,
    b.bl + repeat(b.h, inner) + b.br,
  ];
}

// "──── or ────" divider with a centered label, total = width
export function orRule(label, width) {
  const text = ` ${label} `;
  const side = Math.floor((width - len(text)) / 2);
  return repeat(G.h, side) + text + repeat(G.h, width - side - len(text));
}

// input field: label above, boxed value/placeholder below. width = field width.
export function field(label, placeholder, width) {
  const inner = width - 2;
  return [
    label,
    G.tl + repeat(G.h, inner) + G.tr,
    G.v + ' ' + pad(placeholder, inner - 2, 'left') + ' ' + G.v,
    G.bl + repeat(G.h, inner) + G.br,
  ];
}

// single-line compact field: │ label            value │ style, width = full
export function fieldInline(label, value, width) {
  const inner = width - 2;
  const left = label;
  const right = value;
  const mid = inner - 2 - len(left) - len(right);
  return [G.tl + repeat(G.h, inner) + G.tr,
    G.v + ' ' + left + repeat(' ', Math.max(1, mid)) + right + ' ' + G.v,
    G.bl + repeat(G.h, inner) + G.br];
}

// image placeholder = a DASHED region (the "this is a placeholder" signal) with
// a centered label. NB: diagonal glyphs ╲ ╱ ╳ are NOT single-cell in Menlo
// (they break alignment — verified by freeze), so we never use them. The dashed
// border alone carries the "image goes here" meaning.
export function image(width, rows = 5, label = 'image') {
  const inner = width - 2;
  const top = G.Dtl + repeat(G.Dh, inner) + G.Dtr;
  const bot = G.Dbl + repeat(G.Dh, inner) + G.Dbr;
  const mid = Math.floor(rows / 2);
  const body = [];
  for (let r = 0; r < rows; r++) {
    body.push(G.Dv + (r === mid ? pad(label, inner, 'center') : repeat(' ', inner)) + G.Dv);
  }
  return [top, ...body, bot];
}

// avatar token (1 cell tall): ( A )
export const avatar = (ch = 'A') => `( ${ch} )`;

// list item: avatar + title (left) + meta + chevron (right), shaded subtitle.
// returns 2 logical lines sized to bodyW.
export function listItem(initials, title, meta, bodyW) {
  const av = avatar(initials);
  const right = `${meta}  ${G.chevron}`;
  const left = `${av}  ${title}`;
  const mid = bodyW - len(left) - len(right);
  const line1 = left + repeat(' ', Math.max(1, mid)) + right;
  const line2 = repeat(' ', len(av) + 2) + ipsum(bodyW - len(av) - 2, 1)[0];
  return [line1, line2];
}

// status: ● Active / ○ Idle
export const status = (label, on = true) => `${on ? G.dotF : G.dotE} ${label}`;

// tab bar (underline style). tabs = [{label, active}], width = full body width
export function tabs(items, bodyW) {
  const gap = 3;
  const labels = items.map((t) => t.label);
  const line1 = labels.join(repeat(' ', gap));
  const line2 = items
    .map((t) => repeat(t.active ? G.Hh : '·', len(t.label)))
    .join(repeat(' ', gap));
  return [line1, line2];
}

// progress meter: ████████░░░░░░  60%
export function meter(frac, cells, showPct = true) {
  const fillN = Math.round(frac * cells);
  const bar = repeat(G.meterFull, fillN) + repeat(G.meterTrack, cells - fillN);
  return showPct ? `${bar}  ${Math.round(frac * 100)}%` : bar;
}

// stepper: ●━━━●━━━○  with active count
export function stepper(total, current) {
  let s = '';
  for (let i = 1; i <= total; i++) {
    s += i <= current ? G.dotF : G.dotE;
    if (i < total) s += repeat(i < current ? G.Hh : G.h, 3);
  }
  return s;
}

// ---------------------------------------------------------------------------
// LAYOUT — join blocks horizontally (desktop multi-column). Pads each block to
// its width and stacks them side by side with a gap. blocks = [{lines, width}].
// ---------------------------------------------------------------------------
export function joinH(blocks, gap = 2) {
  const height = Math.max(...blocks.map((b) => b.lines.length));
  const out = [];
  for (let r = 0; r < height; r++) {
    let row = '';
    blocks.forEach((b, i) => {
      const line = b.lines[r] ?? '';
      row += pad(line, b.width);
      if (i < blocks.length - 1) row += repeat(' ', gap);
    });
    out.push(row.replace(/\s+$/, ''));
  }
  return out;
}

// render an array of lines to a string
export const render = (lines) => lines.join('\n');
