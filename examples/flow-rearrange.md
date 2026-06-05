```markdown
# Wireframe Alternatives: Checkout flow rearrange
Shape: flow
Track: wireframe-checkout-flow
Source: "Users often abandon after entering payment details."

## Alternative 1 (XS)
- Title: Move confirmation before payment details
- Rationale: Reduce friction by showing expected delivery and plan details before asking for payment; fewer premature drop-offs.
- Change list:
  - Route `checkout/confirm` -> `checkout/review` before `checkout/payment`
  - Reuse existing confirmation component, no backend shape change
  - File-level note: `routes/checkout.ts` and `components/CheckoutReview.tsx`
- Effort: XS
- How we'll know it worked: Checkout start-to-payment-step drop improves from `55%` to `>= 61%` with no increase in payment errors.

```text
╭─ Checkout · review-first ─────────────╮
│                                       │
│  ●━━━●━━━●───○   payment is last      │
│                                       │
╰───────────────────────────────────────╯

   ╭───────────────────╮
   │ Choose plan       │
   ╰───────────────────╯
            ↓
   ╭───────────────────╮
   │ Review plan       │   →  see price details
   ╰───────────────────╯
            ↓
   ╭───────────────────╮
   │ Add payment       │   →  use a saved method
   ╰───────────────────╯
            ↓
   ┏━━━━━━━━━━━━━━━━━━━┓
   ┃ Confirm  →  ✓     ┃
   ┗━━━━━━━━━━━━━━━━━━━┛
```

## Alternative 2 (S)
- Title: Add trust checkpoint before payment
- Rationale: Add transparent, one-line risk reducer before payment entry to reduce uncertainty-driven exits.
- Change list:
  - Insert `TrustStrip` after plan selection with "money-back + receipt" copy
  - Keep current flow order
  - Add one inline support note with expected response time
  - File-level note: `components/TrustStrip.tsx`, `routes/checkout.ts`
- Effort: S
- How we'll know it worked: Checkout completion rises from `24%` to `>= 27%` and help-center exits per visit drops by `25%`.

```text
╭─ Checkout · trust checkpoint ─────────╮
│                                       │
│  ●━━━●━━━○───○   Step 2 of 4          │
│                                       │
╰───────────────────────────────────────╯

   ╭───────────────────╮
   │ Choose plan       │
   ╰───────────────────╯
            ↓
   ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
   ╎ Trust strip       ╎   money-back · receipt · SLA
   └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
            ↓
   ╭───────────────────╮
   │ Payment           │
   ╰───────────────────╯
            ↓
   ┏━━━━━━━━━━━━━━━━━━━┓
   ┃ Confirm  →  ✓     ┃
   ┗━━━━━━━━━━━━━━━━━━━┛
```

## Alternative 3 (M)
- Title: Reorder by intent with delayed payment step
- Rationale: Delay payment entry until after plan confirmation and billing frequency confirmation to reduce perceived commitment.
- Change list:
  - Split checkout into two routes:
    - `checkout/review`
    - `checkout/payment`
  - Add explicit cancel-free `Need change` link on review
  - Add exit modal on payment step to retain users who hesitate
  - File-level note: `routes/checkout.ts`, `components/CheckoutPayment.tsx`, `components/ReviewStep.tsx`
- Effort: M
- How we'll know it worked: Checkout completion improves from `24%` to `>= 30%` with conversion to plan selection unchanged and no increase in payment attempts.

```text
╭─ Checkout · intent split ─────────────╮
│                                       │
│  ●━━━●───○───○   delayed payment      │
│                                       │
╰───────────────────────────────────────╯

   ╭───────────────────╮
   │ Pick plan         │   →  select billing
   ╰───────────────────╯
            ↓
   ╭───────────────────╮
   │ Review & confirm  │
   ╰───────────────────╯
        ↓             ↓
   need edit?     looks good
        ↓             ↓
   back to plan   ╭───────────────────╮
                  │ Add payment       │
                  ╰───────────────────╯
                          ↓
                  ┏━━━━━━━━━━━━━━━━━━━┓
                  ┃ Receipt  →  ✓     ┃
                  ┗━━━━━━━━━━━━━━━━━━━┛
```
```
