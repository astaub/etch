// Component catalog — every component in the kit, rendered once with a label.
import {
  T, G, frame, divider, hr, ipsum, headline, button, pill, field, fieldInline,
  image, avatar, status, tabs, meter, stepper, joinH, render, pad, blank,
} from './kit.mjs';

const W = T.w.desktop; // 104, wide desktop sheet
const out = [];
const sec = (t) => { out.push('', `── ${t} ` + '─'.repeat(W - 4 - t.length), ''); };

out.push('etch component library  ·  v0  ·  Tailwind-for-the-CLI tokens'.padEnd(W));
out.push('spacing scale (cells): 0 1 2 3 4 6 8   ·   gutter 2   ·   widths: phone 40 / tablet 64 / desktop 104');

sec('BUTTONS  — line weight = hierarchy');
out.push(...joinH([
  { lines: ['primary (heavy)', '', ...button('Get started', 'primary')], width: 24 },
  { lines: ['secondary (light)', '', ...button('Learn more', 'secondary')], width: 24 },
  { lines: ['ghost', '', '', 'Cancel ' + G.arrow, ''], width: 18 },
  { lines: ['pill (inline)', '', '', pill('Save'), ''], width: 16 },
], 4));

sec('INPUTS');
out.push(...joinH([
  { lines: field('Email', 'you@example.com', 34), width: 34 },
  { lines: field('Password', '••••••••', 26), width: 26 },
], 4));
out.push('');
out.push(...fieldInline(G.search + '  Search', '', 48));

sec('STATUS · BADGES · AVATARS · TOGGLES');
out.push(
  status('Active', true) + '    ' + status('Idle', false) + '    ' +
  '[ NEW ]   [ BETA ]   ' + avatar('A') + ' ' + avatar('JD') + '   ' +
  'toggle:  [ ●·· ] off   [ ··● ] on'
);

sec('PROGRESS · STEPPER');
out.push('meter   ' + meter(0.6, 28));
out.push('stepper ' + stepper(3, 2) + '   Step 2 of 3');

sec('TABS (underline = active)');
out.push(...tabs([
  { label: 'Overview', active: true },
  { label: 'Activity', active: false },
  { label: 'Settings', active: false },
], W));

sec('IMAGE PLACEHOLDER (dashed = placeholder region)');
out.push(...joinH([
  { lines: image(24, 7), width: 24 },
  { lines: image(28, 7, 'logo'), width: 28 },
], 4));

sec('CARD (title in the top border)');
out.push(...frame(48, [
  ...headline(44),
  '',
  ...ipsum(42, 2),
  '',
  ...button('Open', 'secondary'),
], { title: 'Card title' }));

sec('TABLE (numeric right-aligned, header divider)');
const tW = 60, tInner = tW - 2;
const col = [22, 14, tInner - 22 - 14 - 2]; // name, status, value (+2 separators)
const cell = (s, w, align) => ' ' + pad(s, w - 2, align) + ' ';
const trow = (a, b, c) =>
  G.v + cell(a, col[0], 'left') + G.v + cell(b, col[1], 'left') +
  G.v + cell(c, col[2], 'right') + G.v;
out.push(G.tl + '─'.repeat(col[0]) + G.teeT + '─'.repeat(col[1]) + G.teeT + '─'.repeat(col[2]) + G.tr);
out.push(trow('Name', 'Status', 'Value'));
out.push(G.teeL + '─'.repeat(col[0]) + G.cross + '─'.repeat(col[1]) + G.cross + '─'.repeat(col[2]) + G.teeR);
out.push(trow('Acme Inc', status('Active'), '$1,200'));
out.push(trow('Globex', status('Idle', false), '$840'));
out.push(G.bl + '─'.repeat(col[0]) + G.teeB + '─'.repeat(col[1]) + G.teeB + '─'.repeat(col[2]) + G.br);

console.log(render(out));
