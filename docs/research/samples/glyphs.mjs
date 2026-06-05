// glyph audit — proves which glyphs are single-cell in Menlo. align rows: 16
// glyphs vs 16 pipes; if the trailing ABCDEF starts at the same column, the
// glyphs are single-cell. The diagonals ╲╱╳ FAIL this and are banned.
const out = [
  'box     ╭─╮│╰╯├┤┬┴┼  ┏━┓┃┗┛┳┻  ┌╌┐╎└┘',
  'shade   ░▒▓█ ▁▂▃▄▅▆▇█ ▮▯',
  'icons   ☰ ⌕ ● ○ ✓ › → ↑ ↓ ★ ◆ • ┄',
  '',
  'banned  ╲ ╱ ╳   (NOT single-cell in Menlo — break alignment)',
  '',
  'align A ☰⌕●○✓›→↑↓★◆•┄┏┓┗  ABCDEFGHIJ   <- safe glyphs',
  'align B ||||||||||||||||  ABCDEFGHIJ   <- 16 pipes (reference)',
  'align C ╲╱╳╲╱╳╲╱╳╲╱╳╲╱╳╲  ABCDEFGHIJ   <- diagonals drift right (BAD)',
];
console.log(out.join('\n'));
