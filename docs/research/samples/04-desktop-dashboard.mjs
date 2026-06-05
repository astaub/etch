// Desktop dashboard — VERY WIDE (104). Same tokens as mobile, more columns.
import {
  T, G, frame, divider, hr, ipsum, meter, status, avatar, tabs, joinH, pad,
  sparkline, render,
} from './kit.mjs';

const W = T.w.desktop; // 104
const inner = W - 2;

// ---- top bar (brand left · search center · avatar right) ----
const topInner = inner - T.gutter * 2; // body width inside the bar
const brand = G.menu + '  Acme Analytics';
const right = status('Live') + '    ' + G.search + ' Search        ' + avatar('AS');
const topBar = frame(W, [brand + pad(right, topInner - brand.length, 'right')], {
  padY: 0,
});

// ---- sidebar (nav) ----
const SB = 22;
const navItems = [
  ['◆ Dashboard', true], ['  Reports', false], ['  Funnels', false],
  ['  Audiences', false], ['  Experiments', false], ['  Settings', false],
];
const sidebar = frame(SB, [
  ...navItems.map(([label, active]) => (active ? G.Hh + ' ' + label.trim() : label)),
  '',
  hr(SB - 2 - T.gutter * 2),
  '',
  avatar('AS') + ' Andrew',
  '┄┄┄┄┄┄┄┄┄┄',
], { title: 'Menu' });

// ---- metric card ----
const metric = (label, value, delta, spark, w) =>
  frame(w, [value, delta, '', spark], { title: label, padY: 1 });
const cards = joinH([
  { lines: metric('Active users', '12,480', '↑ 12%  vs last wk', sparkline(19, 0), 25), width: 25 },
  { lines: metric('Conversion', '3.1%', '↑ 0.4pp', sparkline(19, 1.6), 25), width: 25 },
  { lines: metric('Revenue', '$48.2k', '↓ 2%  vs last wk', sparkline(20, 3.1), 26), width: 26 },
], 2);

// ---- bar chart card ----
const heights = [3, 5, 4, 6, 7, 5, 8, 6, 7, 9, 6, 8];
const labels = ['Jan', '', 'Mar', '', 'May', '', 'Jul', '', 'Sep', '', 'Nov', ''];
const CH = 80, cInner = CH - 2 - T.gutter * 2;
const chMax = 9;
const barRows = [];
for (let r = chMax; r >= 1; r--) {
  let row = '';
  for (const h of heights) row += (h >= r ? G.sh.full : ' ') + '  ';
  barRows.push(row.trimEnd());
}
const axis = labels.map((l) => pad(l, 3)).join('');
const chart = frame(CH, [
  ...barRows,
  hr(cInner),
  axis,
], { title: 'Signups — last 12 months' });

// ---- table card ----
const tcol = [29, 14, 14, 18]; // name, plan, status, mrr — sums to width 80
const tInner = tcol.reduce((a, b) => a + b, 0) + tcol.length + 1; // borders
const tcell = (s, w, al) => ' ' + pad(s, w - 2, al) + ' ';
const trow = (a, b, c, d) =>
  G.v + tcell(a, tcol[0], 'left') + G.v + tcell(b, tcol[1], 'left') +
  G.v + tcell(c, tcol[2], 'left') + G.v + tcell(d, tcol[3], 'right') + G.v;
const tline = (l, m, rr) =>
  l + tcol.map((c) => G.h.repeat(c)).join(m) + rr;
const table = [
  tline(G.tl, G.teeT, G.tr),
  trow('Customer', 'Plan', 'Status', 'MRR'),
  tline(G.teeL, G.cross, G.teeR),
  trow('Acme Inc', 'Scale', status('Active'), '$1,200'),
  trow('Globex Corp', 'Pro', status('Active'), '$840'),
  trow('Initech', 'Starter', status('Idle', false), '$120'),
  trow('Umbrella LLC', 'Pro', status('Active'), '$760'),
  tline(G.bl, G.teeB, G.br),
];

// ---- compose main column ----
const main = [
  ...cards,
  '',
  ...chart,
  '',
  ...table,
];

// ---- page ----
const page = [
  ...topBar,
  '',
  ...joinH([{ lines: sidebar, width: SB }, { lines: main, width: 80 }], 2),
];

console.log(render(page));
