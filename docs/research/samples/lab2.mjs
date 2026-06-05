// lab2 — text placeholder, round 2. Goal: obviously-a-mockup AND clean/airy.
const out = [];
const L = (s) => out.push(s);
const sec = (t) => { out.push(''); out.push(`── ${t}`); out.push(''); };

sec('Inside a card body (gutter 2), 2 lines + ragged. Pick the beautiful one.');

const card = (label, lines) => {
  const W = 46, inner = W - 2;
  L(`╭─ ${label} ${'─'.repeat(inner - 3 - label.length)}╮`);
  L(`│${' '.repeat(inner)}│`);
  L(`│  ███████████  ${' '.repeat(inner - 2 - 13)}│`); // heading
  L(`│${' '.repeat(inner)}│`);
  for (const ln of lines) L(`│  ${ln}${' '.repeat(inner - 2 - [...ln].length)}│`);
  L(`│${' '.repeat(inner)}│`);
  L(`╰${'─'.repeat(inner)}╯`);
  L('');
};

card('A  light shade ░ chunks', ['░░░░ ░░░░░░░ ░░░ ░░░░░░ ░░░░░ ░░░░', '░░░░░░ ░░░░ ░░░']);
card('B  dashed text lines ┄', ['┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄', '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄']);
card('C  lower bar lines ▁', ['▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁', '▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁']);
card('D  light rule lines ─', ['────────────────────────────────', '─────────────────']);
card('E  medium shade ▒, airy', ['▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒', '▒▒▒▒▒▒  ▒▒▒▒  ▒▒▒']);
card('F  greeked lorem', ['Lorem ipsum dolor sit amet, conse', 'adipiscing elit sed.']);

console.log(out.join('\n'));
