import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

// Contract test for the etch example artifacts. etch ships as a no-build markdown
// skill, so there is no library to import — the "unit under test" is each file in
// examples/, which must conform to the output contract documented in SKILL.md
// ("Output format" + "Output quality gates"). If the contract in SKILL.md changes,
// update the assertions here to match.

const here = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(here, '..', 'examples');

const SHAPES = ['page', 'flow', 'component', 'copy', 'diff'] as const;
const EFFORTS = ['XS', 'S', 'M', 'L'];

// Filename stem -> expected shape, so a renamed/miscategorized example is caught.
const FILE_SHAPE: Record<string, string> = {
  'page-before-after': 'page',
  'flow-rearrange': 'flow',
  'component-variants': 'component',
  'copy-variants': 'copy',
  'diff-shape': 'diff',
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface Alt {
  n: number;
  effort: string;
  index: number;
}

function parseAlternatives(text: string): Alt[] {
  const altRe = /^## Alternative (\d+) \((XS|S|M|L)\)\s*$/gm;
  const alts: Alt[] = [];
  let m: RegExpExecArray | null;
  while ((m = altRe.exec(text)) !== null) {
    alts.push({ n: Number(m[1]), effort: m[2], index: m.index });
  }
  return alts;
}

const files = readdirSync(examplesDir).filter((f) => f.endsWith('.md'));

describe('examples/ directory', () => {
  it('contains at least one example', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('covers all five documented shapes', () => {
    const shapes = new Set(
      files.map((f) => {
        const m = readFileSync(join(examplesDir, f), 'utf8').match(/^Shape:\s*(\S+)/m);
        return m?.[1];
      }),
    );
    for (const shape of SHAPES) {
      expect(shapes, `no example covers shape "${shape}"`).toContain(shape);
    }
  });
});

for (const file of files) {
  describe(`examples/${file}`, () => {
    const text = readFileSync(join(examplesDir, file), 'utf8');
    const lines = text.split('\n');
    const trimmed = [...lines];
    while (trimmed.length && trimmed[trimmed.length - 1] === '') trimmed.pop();
    const alts = parseAlternatives(text);

    it('is one fenced ```markdown block', () => {
      expect(trimmed[0]).toBe('```markdown');
      expect(trimmed[trimmed.length - 1]).toBe('```');
    });

    it('is pure ASCII', () => {
      const nonAscii = lines
        .map((line, i) => (/[^\x00-\x7F]/.test(line) ? i + 1 : 0))
        .filter(Boolean);
      expect(nonAscii, `non-ASCII on line(s) ${nonAscii.join(', ')}`).toEqual([]);
    });

    it('has no images, HTML, or links', () => {
      expect(text, 'must not embed images').not.toMatch(/!\[/);
      expect(text, 'must not contain HTML tags').not.toMatch(/<[a-zA-Z/][^>]*>/);
      expect(text, 'must not contain external URLs').not.toMatch(/https?:\/\//);
    });

    it('has the required header lines in order', () => {
      expect(text).toMatch(/^# Wireframe Alternatives: .+/m);
      const shapeMatch = text.match(/^Shape:\s*(\S+)\s*$/m);
      expect(shapeMatch, 'missing "Shape:" line').not.toBeNull();
      const shape = shapeMatch![1];
      expect(SHAPES as readonly string[]).toContain(shape);
      const stem = basename(file, '.md');
      if (FILE_SHAPE[stem]) expect(shape).toBe(FILE_SHAPE[stem]);
      expect(text, 'missing "Track:" line').toMatch(/^Track:\s*\S+/m);
      expect(text, 'missing "Source:" line').toMatch(/^Source:\s*.+/m);
    });

    it('has 1..7 alternatives numbered sequentially from 1', () => {
      expect(alts.length).toBeGreaterThanOrEqual(1);
      expect(alts.length).toBeLessThanOrEqual(7);
      alts.forEach((alt, i) => expect(alt.n).toBe(i + 1));
    });

    it('gives each alternative the required fields with a matching effort', () => {
      alts.forEach((alt, i) => {
        const end = i + 1 < alts.length ? alts[i + 1].index : text.length;
        const block = text.slice(alt.index, end);
        for (const field of ['Title', 'Rationale', 'Change list', "How we'll know it worked"]) {
          expect(block, `Alternative ${alt.n} missing "- ${field}:"`).toMatch(
            new RegExp(`^- ${escapeRe(field)}:`, 'm'),
          );
        }
        const effortLine = block.match(/^- Effort:\s*(\S+)\s*$/m);
        expect(effortLine, `Alternative ${alt.n} missing "- Effort:"`).not.toBeNull();
        expect(EFFORTS).toContain(effortLine![1]);
        expect(effortLine![1], `Alternative ${alt.n} effort disagrees with heading`).toBe(alt.effort);
      });
    });

    it('contains at least one ASCII sketch (```text block or table)', () => {
      const hasTextBlock = /^```text\s*$/m.test(text);
      const hasTable = /^\|.*\|\s*$/m.test(text);
      expect(hasTextBlock || hasTable).toBe(true);
    });
  });
}
