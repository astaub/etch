#!/usr/bin/env node
// Contract test for etch example artifacts.
//
// etch is a no-build markdown skill, so this test has zero dependencies: it is a
// plain Node script you run directly:
//
//     node test/contract.test.mjs
//
// It asserts that every file in examples/ conforms to the output contract
// documented in SKILL.md ("Output format" + "Output quality gates"). If the
// contract in SKILL.md changes, update the assertions here to match.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const examplesDir = join(root, "examples");

const SHAPES = ["page", "flow", "component", "copy", "diff"];
const EFFORTS = ["XS", "S", "M", "L"];

// Filename stem -> expected shape, so a renamed/miscategorized example is caught.
const FILE_SHAPE = {
  "page-before-after": "page",
  "flow-rearrange": "flow",
  "component-variants": "component",
  "copy-variants": "copy",
  "diff-shape": "diff",
};

const failures = [];
const checkedShapes = new Set();

function fail(file, msg) {
  failures.push(`${file}: ${msg}`);
}

function checkExample(file, text) {
  const lines = text.split("\n");
  // Trailing newline produces a final empty element; ignore it for fence checks.
  const trimmed = [...lines];
  while (trimmed.length && trimmed[trimmed.length - 1] === "") trimmed.pop();

  // 1. Whole artifact is one fenced ```markdown block.
  if (trimmed[0] !== "```markdown") {
    fail(file, 'must start with a "```markdown" fence');
  }
  if (trimmed[trimmed.length - 1] !== "```") {
    fail(file, 'must end with a closing "```" fence');
  }

  // 2. Pure ASCII — no images, no HTML, no links.
  const nonAscii = [];
  lines.forEach((line, i) => {
    if (/[^\x00-\x7F]/.test(line)) nonAscii.push(i + 1);
  });
  if (nonAscii.length) {
    fail(file, `must be pure ASCII; non-ASCII on line(s) ${nonAscii.join(", ")}`);
  }
  if (/!\[/.test(text)) fail(file, "must not embed images (![...])");
  if (/<[a-zA-Z/][^>]*>/.test(text)) fail(file, "must not contain HTML tags");
  if (/https?:\/\//.test(text)) fail(file, "must not contain external URLs");

  // 3. Required header lines.
  if (!/^# Wireframe Alternatives: .+/m.test(text)) {
    fail(file, 'missing "# Wireframe Alternatives: <summary>" heading');
  }
  const shapeMatch = text.match(/^Shape:\s*(\S+)\s*$/m);
  if (!shapeMatch) {
    fail(file, 'missing "Shape:" line');
  } else {
    const shape = shapeMatch[1];
    if (!SHAPES.includes(shape)) {
      fail(file, `Shape "${shape}" is not one of ${SHAPES.join(", ")}`);
    }
    checkedShapes.add(shape);
    const stem = basename(file, ".md");
    if (FILE_SHAPE[stem] && FILE_SHAPE[stem] !== shape) {
      fail(file, `Shape "${shape}" does not match expected "${FILE_SHAPE[stem]}" for this file`);
    }
  }
  if (!/^Track:\s*\S+/m.test(text)) fail(file, 'missing "Track:" line');
  if (!/^Source:\s*.+/m.test(text)) fail(file, 'missing "Source:" line');

  // 4. Alternatives: ## Alternative N (EFFORT), numbered sequentially from 1.
  const altRe = /^## Alternative (\d+) \((XS|S|M|L)\)\s*$/gm;
  const alts = [];
  let m;
  while ((m = altRe.exec(text)) !== null) {
    alts.push({ n: Number(m[1]), effort: m[2], index: m.index });
  }
  if (alts.length === 0) {
    fail(file, 'no "## Alternative N (EFFORT)" headings found');
  }
  if (alts.length < 1 || alts.length > 7) {
    fail(file, `alternative count ${alts.length} outside 1..7`);
  }
  alts.forEach((alt, i) => {
    if (alt.n !== i + 1) {
      fail(file, `alternative numbering not sequential: expected ${i + 1}, got ${alt.n}`);
    }
  });

  // 5. Each alternative block carries the required fields.
  alts.forEach((alt, i) => {
    const end = i + 1 < alts.length ? alts[i + 1].index : text.length;
    const block = text.slice(alt.index, end);
    for (const field of ["Title", "Rationale", "Change list", "How we'll know it worked"]) {
      if (!new RegExp(`^- ${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:`, "m").test(block)) {
        fail(file, `Alternative ${alt.n} missing "- ${field}:"`);
      }
    }
    const effortLine = block.match(/^- Effort:\s*(\S+)\s*$/m);
    if (!effortLine) {
      fail(file, `Alternative ${alt.n} missing "- Effort:"`);
    } else if (!EFFORTS.includes(effortLine[1])) {
      fail(file, `Alternative ${alt.n} effort "${effortLine[1]}" not one of ${EFFORTS.join(", ")}`);
    } else if (effortLine[1] !== alt.effort) {
      fail(file, `Alternative ${alt.n} effort "${effortLine[1]}" disagrees with heading "(${alt.effort})"`);
    }
  });

  // 6. Each artifact carries at least one ASCII sketch: a nested ```text block
  //    or a markdown table.
  const hasTextBlock = /^```text\s*$/m.test(text);
  const hasTable = /^\|.*\|\s*$/m.test(text);
  if (!hasTextBlock && !hasTable) {
    fail(file, "missing an ASCII sketch (no ```text block or table)");
  }
}

const files = readdirSync(examplesDir).filter((f) => f.endsWith(".md"));
if (files.length === 0) {
  fail("examples/", "no example files found");
}
for (const f of files) {
  checkExample(`examples/${f}`, readFileSync(join(examplesDir, f), "utf8"));
}

// 7. The shipped examples must cover all five documented shapes.
for (const shape of SHAPES) {
  if (!checkedShapes.has(shape)) {
    fail("examples/", `no example covers shape "${shape}"`);
  }
}

if (failures.length) {
  console.error(`FAIL — ${failures.length} contract violation(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`PASS — ${files.length} example(s) conform to the output contract.`);
