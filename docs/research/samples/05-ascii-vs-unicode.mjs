// A/B — the SAME signup screen rendered with Unicode box-drawing (left) vs the
// pure-ASCII set etch's contract currently mandates (right). Shows what the
// "pure ASCII" rule costs in beauty. Both are perfectly aligned; only the ink
// differs.
import {
  T, G, frame, field, cta, orRule, pill, stepper, ipsum, headline, joinH,
  setAscii, render, pad,
} from './kit.mjs';

const W = T.w.phone;
const bodyW = W - 2 - T.gutter * 2;

function buildSignup() {
  return frame(W, [
    ...headline(bodyW, 0.5),
    '',
    ...ipsum(bodyW, 1, G.sh.full),
    ...ipsum(bodyW, 2),
    '',
    ...field('Email', 'you@example.com', bodyW),
    '',
    ...cta('Create account', bodyW, 'primary'),
    '',
    orRule('or', bodyW),
    '',
    pill('Continue with Google'),
    '',
    stepper(3, 1) + '   Step 1 of 3',
  ], { title: 'Sign up' });
}

const unicode = buildSignup();
setAscii();
const ascii = buildSignup();

const out = [
  pad('Unicode box-drawing  (proposed)', W + 4) + 'Pure ASCII  (current contract)',
  '',
  ...joinH([{ lines: unicode, width: W }, { lines: ascii, width: W }], 4),
];
console.log(render(out));
