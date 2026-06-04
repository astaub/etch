#!/usr/bin/env node
// render-gallery.mjs — render the README gallery cards from the real example
// artifacts. The point: the gallery is not hand-drawn — it is etch's own output
// (the ASCII sketch from each examples/*.md) dropped into a terminal-style card.
// Source is text; the image is generated. No design tool, true to etch.
//
//   npm run gallery
//
// For each examples/<shape>.md it extracts the richest sketch (the last fenced
// ```text block, or the last Markdown table for table-only shapes), wraps it in
// an SVG terminal card, and rasterizes to assets/gallery/<shape>.png via
// rsvg-convert. If rsvg-convert is absent it writes the .svg and warns, so the
// command still works without the rasterizer.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const examplesDir = join(root, 'examples');
const outDir = join(root, 'assets', 'gallery');

const FONT = "Menlo, 'DejaVu Sans Mono', 'SFMono-Regular', Consolas, monospace";
const FS = 15;     // font size px
const CW = 9.0;    // monospace advance width at FS
const LH = 22;     // line height px
const PADX = 22;   // body left/right padding
const PADY = 18;   // body top/bottom padding
const BAR = 38;    // title-bar height
const SCALE = 2;   // rasterize at 2x for crisp images

const COLORS = {
  bg: '#0d1117',
  bar: '#161b22',
  border: '#30363d',
  text: '#c9d1d9',
  dim: '#8b949e',
  accent: '#58a6ff',
  dots: ['#ff5f56', '#ffbd2e', '#27c93f'],
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Extract { summary, shape, sketch[] } from one example artifact.
function parse(md) {
  const summary = (md.match(/^# Wireframe Alternatives:\s*(.+)$/m) || [])[1]?.trim() ?? '';
  const shape = (md.match(/^Shape:\s*(\S+)/m) || [])[1] ?? '';
  const lines = md.split('\n');

  // richest = last fenced ```text block
  const blocks = [];
  let cur = null;
  for (const line of lines) {
    if (cur === null && /^```text\s*$/.test(line)) { cur = []; continue; }
    if (cur !== null && /^```\s*$/.test(line)) { blocks.push(cur); cur = null; continue; }
    if (cur !== null) cur.push(line);
  }
  if (blocks.length) return { summary, shape, sketch: blocks[blocks.length - 1] };

  // table-only shapes (copy): last contiguous run of pipe rows
  const tables = [];
  let run = null;
  for (const line of lines) {
    if (/^\s*\|.*\|\s*$/.test(line)) { (run ??= []).push(line.trim()); }
    else if (run) { tables.push(run); run = null; }
  }
  if (run) tables.push(run);
  return { summary, shape, sketch: tables.length ? tables[tables.length - 1] : ['(no sketch)'] };
}

function svgCard({ summary, shape, sketch }) {
  // trim leading/trailing blank lines
  while (sketch.length && sketch[0].trim() === '') sketch.shift();
  while (sketch.length && sketch[sketch.length - 1].trim() === '') sketch.pop();

  const header = `etch  ·  shape: ${shape}`;
  const caption = summary;
  const bodyLines = [caption, '', ...sketch];
  const widestChars = Math.max(header.length + 2, ...bodyLines.map((l) => l.length));
  const w = Math.ceil(widestChars * CW + PADX * 2);
  const h = Math.ceil(BAR + PADY * 2 + bodyLines.length * LH);

  const dots = COLORS.dots
    .map((c, i) => `<circle cx="${20 + i * 20}" cy="${BAR / 2}" r="6" fill="${c}"/>`)
    .join('');

  // body text: first line (caption) dim+italic, blank, then sketch in mono
  const x = PADX;
  let y = BAR + PADY + FS;
  const tspans = bodyLines
    .map((line, i) => {
      const fill = i === 0 ? COLORS.dim : COLORS.text;
      const t = `<tspan x="${x}" y="${y}" fill="${fill}" xml:space="preserve">${esc(line) || ' '}</tspan>`;
      y += LH;
      return t;
    })
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="${FONT}" font-size="${FS}">
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="${COLORS.bg}" stroke="${COLORS.border}"/>
  <path d="M0.5 10.5 a10 10 0 0 1 10 -10 h${w - 21} a10 10 0 0 1 10 10 v${BAR - 10} h-${w - 1} z" fill="${COLORS.bar}"/>
  <line x1="0.5" y1="${BAR}.5" x2="${w - 0.5}" y2="${BAR}.5" stroke="${COLORS.border}"/>
  ${dots}
  <text x="${w - PADX}" y="${BAR / 2 + 4}" text-anchor="end" fill="${COLORS.dim}" font-size="13">${esc(header)}</text>
  <text>
    ${tspans}
  </text>
</svg>`;
}

mkdirSync(outDir, { recursive: true });
const files = readdirSync(examplesDir).filter((f) => f.endsWith('.md')).sort();
const hasRsvg = spawnSync('rsvg-convert', ['--version'], { stdio: 'ignore' }).status === 0;
const written = [];

for (const f of files) {
  const data = parse(readFileSync(join(examplesDir, f), 'utf8'));
  const stem = basename(f, '.md');
  const svg = svgCard(data);
  const svgPath = join(outDir, `${stem}.svg`);
  if (hasRsvg) {
    const tmp = join(outDir, `.${stem}.tmp.svg`);
    writeFileSync(tmp, svg);
    const r = spawnSync('rsvg-convert', ['-z', String(SCALE), '-o', join(outDir, `${stem}.png`), tmp]);
    rmSync(tmp, { force: true });
    if (r.status !== 0) { console.error(`rsvg-convert failed for ${stem}`); process.exit(1); }
    written.push(`${stem}.png`);
  } else {
    writeFileSync(svgPath, svg);
    written.push(`${stem}.svg`);
  }
}

if (!hasRsvg) console.warn('rsvg-convert not found — wrote .svg instead of .png. `brew install librsvg` to rasterize.');
console.log(`gallery: rendered ${written.length} card(s) -> assets/gallery/\n  ${written.join('\n  ')}`);
