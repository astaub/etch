#!/usr/bin/env bash
# freeze.sh — the freeze-verify step. Render a .txt wireframe to PNG through a
# real monospace font (Menlo) so the box-drawing lines up exactly as a terminal
# draws it. Proportional fonts misalign box-drawing and give FALSE failures, so
# we always pin --font.family Menlo before reading the result.
#
#   ./freeze.sh <input.txt> <output.png> [paper|dark]
set -euo pipefail
in="$1"; out="$2"; theme="${3:-paper}"

if [ "$theme" = "dark" ]; then
  bg="#0F2C4A"        # charts "ocean deep"
  border="#1E4A78"
  syntax="nord"       # soft light-blue ink on ocean
else
  bg="#FBF7EF"        # Balsamiq paper / cream
  border="#E2D9C8"
  syntax="github"     # crisp black ink on paper
fi

freeze "$in" -o "$out" \
  --theme "$syntax" \
  --font.family "Menlo" \
  --font.size 14 \
  --line-height 1.2 \
  --padding 28 \
  --margin 24 \
  --background "$bg" \
  --border.radius 10 \
  --border.width 1 \
  --border.color "$border" \
  --shadow.blur 28 --shadow.x 0 --shadow.y 14
echo "froze $in -> $out ($theme)"
