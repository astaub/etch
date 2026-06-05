#!/usr/bin/env node
// check-widths.mjs — a cheap companion to the freeze-verify loop (SKILL.md §7).
//
// freeze-verify is the visual gate: render through Menlo and LOOK. This script is
// the fast pre-check: every glyph etch is allowed to use is single-cell in Menlo,
// so a frame is aligned iff its rows share one code-point width. For each ```text
// fenced block in the given Markdown file(s) it prints, per block, the distinct
// row widths — and flags any "framed" run (consecutive lines that open with a
// vertical border │/┃/╎) whose widths disagree, which is the ragged-border bug.
//
//   node tools/check-widths.mjs examples/page-before-after.md
//   node tools/check-widths.mjs examples/*.md
//
// Exit code is non-zero if any framed run is ragged.

import { readFileSync } from 'node:fs';

const BORDER_OPENERS = new Set(['│', '┃', '╎']);
const cp = (s) => [...s].length; // every allowlisted glyph is single-cell

function blocks(text) {
  const out = [];
  const lines = text.split('\n');
  let inBlock = false;
  let buf = [];
  let start = 0;
  lines.forEach((line, i) => {
    if (!inBlock && /^```text\s*$/.test(line)) {
      inBlock = true;
      buf = [];
      start = i + 2; // 1-based, first content line
    } else if (inBlock && /^```\s*$/.test(line)) {
      out.push({ start, lines: buf });
      inBlock = false;
    } else if (inBlock) {
      buf.push(line);
    }
  });
  return out;
}

let bad = 0;
for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, 'utf8');
  const bs = blocks(text);
  console.log(`\n${file}  —  ${bs.length} text block(s)`);
  bs.forEach((b, bi) => {
    // A framed run: maximal consecutive lines whose first non-space char is a
    // vertical border. Each such run must have one width.
    let run = [];
    const flush = () => {
      if (run.length < 2) {
        run = [];
        return;
      }
      const widths = new Set(run.map((r) => cp(r.line)));
      if (widths.size > 1) {
        bad++;
        console.log(`  block ${bi + 1}: RAGGED framed run — widths ${[...widths].join(', ')}`);
        run.forEach((r) => console.log(`    line ${r.n} (w=${cp(r.line)}): ${r.line}`));
      }
      run = [];
    };
    b.lines.forEach((line, li) => {
      const trimmed = line.trimStart();
      const opens = BORDER_OPENERS.has([...trimmed][0]);
      if (opens) run.push({ n: b.start + li, line });
      else flush();
    });
    flush();
    const widths = [...new Set(b.lines.filter((l) => l.trim()).map(cp))].sort((a, c) => a - c);
    console.log(`  block ${bi + 1}: distinct non-blank widths → ${widths.join(', ')}`);
  });
}

if (bad) {
  console.log(`\n✗ ${bad} ragged framed run(s)`);
  process.exit(1);
}
console.log('\n✓ no ragged framed runs');
