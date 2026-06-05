// Very-wide desktop (124) — a kanban board. Shows the card/column system at
// scale: same tokens, many columns, perfectly aligned.
import { T, G, frame, headline, ipsum, avatar, joinH, pad, render } from './kit.mjs';

const W = T.w.desktopXl; // 124

// top bar
const topInner = W - 2 - T.gutter * 2;
const left = G.menu + '  Acme  ' + G.chevron + '  Sprint 14';
const right = '◆ Board    ☰ List    ⌕ Search    ( AS )';
const topBar = frame(W, [left + pad(right, topInner - left.length, 'right')], { padY: 0 });

// a task card spanning the full column width w
function taskCard(w, tag, who, titleFrac) {
  const bodyW = w - 2 - T.gutter * 2;
  return frame(w, [
    ...headline(bodyW, titleFrac),
    ...ipsum(bodyW, 1),
    '',
    pad(`[ ${tag} ]`, bodyW - avatar(who).length, 'left') + avatar(who),
  ], { padY: 1 });
}

// borderless column: header + rule, then full-width cards stacked.
function column(title, count, cards, colW) {
  const head = pad(title, colW - 4) + pad(String(count), 4, 'right');
  const out = [head, repeat('─', colW), ''];
  cards.forEach((c, i) => { out.push(...c); if (i < cards.length - 1) out.push(''); });
  return out;
}
const repeat = (ch, n) => ch.repeat(n);

const colW = [29, 29, 30, 30];

const cols = [
  column('Backlog', 3, [
    taskCard(colW[0], 'Design', 'JD', 0.7),
    taskCard(colW[0], 'Research', 'AS', 0.55),
    taskCard(colW[0], 'Copy', 'MK', 0.6),
  ], colW[0]),
  column('In progress', 2, [
    taskCard(colW[1], 'Eng', 'JD', 0.6),
    taskCard(colW[1], 'Design', 'AS', 0.75),
  ], colW[1]),
  column('Review', 2, [
    taskCard(colW[2], 'Eng', 'MK', 0.65),
    taskCard(colW[2], 'QA', 'AS', 0.5),
  ], colW[2]),
  column('Done', 1, [
    taskCard(colW[3], 'Ship', 'JD', 0.7),
  ], colW[3]),
];

const board = joinH(cols.map((lines, i) => ({ lines, width: colW[i] })), 2);

console.log(render([...topBar, '', ...board]));
