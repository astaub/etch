// Mobile signup — phone width (40). Mobile-first: design the narrow frame first.
import {
  T, G, frame, field, cta, orRule, pill, stepper, ipsum, headline, statusBar,
  render,
} from './kit.mjs';

const W = T.w.phone;        // 40
const bodyW = W - 2 - T.gutter * 2; // 34

const content = [
  statusBar(bodyW),
  '',
  '',
  ...headline(bodyW, 0.42),           // brand wordmark
  '',
  ...ipsum(bodyW, 2),                 // subcopy
  '',
  '',
  ...field('Email', 'you@example.com', bodyW),
  '',
  ...field('Password', '••••••••', bodyW),
  '',
  '',
  ...cta('Create account', bodyW, 'primary'),
  '',
  orRule('or', bodyW),
  '',
  pill('Continue with Google'),
  '',
  '',
  stepper(3, 1) + '   Step 1 of 3',
];

console.log(render(frame(W, content, { title: 'Sign up' })));
