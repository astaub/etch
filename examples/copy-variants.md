```markdown
# Wireframe Alternatives: Pricing copy alternatives
Shape: copy
Track: wireframe-pricing-copy
Source: "Users hesitate on pricing page before choosing a plan."

## Alternative 1 (XS)
- Title: Clarify value in first line
- Rationale: Most friction is uncertainty; first-line copy should reduce decision cost.
- Change list:
  - Replace hero copy with a direct outcome statement
  - Keep card labels unchanged
  - File-level note: `pages/pricing.tsx`
- Effort: XS
- How we'll know it worked: Price-page click-through rises from `9.2%` to `>= 11.0%` and trial-to-paid stays stable or improves.

| Field | Alternative A | Alternative B |
|---|---|---|
| Hero h1 | Ship faster with a plan that fits | Pick your first plan in under 30 seconds |
| Subcopy | No setup, no guesswork | Start now, change anytime |

## Alternative 2 (S)
- Title: Add risk reduction copy
- Rationale: Reduce hesitation by foregrounding reversal path and trial expectations.
- Change list:
  - Add secondary text under each plan: "Pause anytime", "No hidden fees"
  - Add FAQ teaser link next to top action button
  - File-level note: `components/pricing/PricingCard.tsx`
- Effort: S
- How we'll know it worked: Plan card click-through rises from `9.2%` to `>= 12.0%` and FAQ taps increase by `>= 20%`.

| Field | Alternative A | Alternative B |
|---|---|---|
| Hero h1 | Compare plans side by side | Choose one plan, switch anytime |
| Risk line | Full control, cancel anytime | No commitment for the first 14 days |

## Alternative 3 (M)
- Title: Decision-based copy path
- Rationale: Move from generic promises to role-specific framing to improve relevance.
- Change list:
  - Add role tabs: `Solo`, `Small team`, `Operations`
  - Swap hero and CTA copy per selected role
  - File-level notes: `components/pricing/RoleTabs.tsx`, `pages/pricing.tsx`
- Effort: M
- How we'll know it worked: Pricing page depth (scroll depth 75%+) rises from `38%` to `>= 48%` and checkout starts rise from `6.2%` to `>= 8.0%`.

| Role | Copy A | Copy B |
|---|---|---|
| Solo | "For one team, one workflow, one goal" | "Get started quickly, avoid setup noise" |
| Small team | "Keep everyone in sync" | "Ship together with shared views" |
| Operations | "Reduce handoff and review time" | "Standardize outputs in one place" |
```
