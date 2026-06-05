// Mobile feed / inbox — phone width (40). Nav bar, tabs, list, compose CTA.
import { T, G, frame, tabs, listItem, cta, avatar, hr, statusBar, pad, render } from './kit.mjs';

const W = T.w.phone;        // 40
const bodyW = W - 2 - T.gutter * 2; // 34

const navRow = G.menu + '   Inbox' +
  pad(G.search + '    ' + avatar('A'), bodyW - (G.menu + '   Inbox').length, 'right');

const tabRow = tabs([
  { label: 'All', active: true },
  { label: 'Unread', active: false },
  { label: 'Flagged', active: false },
], bodyW);

const items = [
  ['J', 'Jane Cooper', '2m'],
  ['W', 'Wade Warren', '1h'],
  ['E', 'Esther Howard', '3h'],
];
const list = [];
items.forEach((it, i) => {
  list.push(...listItem(it[0], it[1], it[2], bodyW));
  if (i < items.length - 1) { list.push(''); list.push(hr(bodyW)); list.push(''); }
});

const content = [
  statusBar(bodyW),
  '',
  navRow,
  '',
  ...tabRow,
  '',
  ...list,
  '',
  ...cta('+ Compose', bodyW, 'primary'),
];

console.log(render(frame(W, content, { title: 'Inbox' })));
