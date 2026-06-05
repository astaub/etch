```markdown
# Wireframe Alternatives: Dashboard card component variants
Shape: component
Track: wireframe-dashboard-component
Source: "The settings dashboard shows too much dense data in one view."

## Alternative 1 (XS)
- Title: Compressed metric strip
- Rationale: Keep layout and context but reduce visual density; safer for first iteration.
- Change list:
  - `settings_dashboard` -> tighten spacing and align metrics into two-column grid
  - Move explanatory footnotes into tooltip
  - File-level note: `components/MetricCard.tsx`
- Effort: XS
- How we'll know it worked: 7-day return-to-action rate increases from `16%` to `>= 19%` and time-to-first-action decreases from `54s` to `<= 45s`.

```text
╭──────────────────┬──────────────────╮
│ Metric           │            Value │
├──────────────────┼──────────────────┤
│ Active users     │            1,240 │
│ Conversion       │             3.1% │
│ Errors today     │                4 │
│ Setup complete   │              72% │
╰──────────────────┴──────────────────╯
```

## Alternative 2 (S)
- Title: Tabbed insight sections
- Rationale: Reduce overload by separating primary actions from diagnostic details.
- Change list:
  - `DashboardHome` -> add tabs: `Overview`, `Activity`, `Settings`
  - Keep current cards but hide secondary rows by default
  - File-level note: `components/dashboard/Tabs.tsx`
- Effort: S
- How we'll know it worked: 24-hour revisit rate rises from `31%` to `>= 35%` and bounce on dashboard reload decreases by `15%`.

```text
Overview   Activity   Settings
━━━━━━━━   ········   ········

╭─ Active users ────────╮    ╭─ Conversion ──────────╮
│                       │    │                       │
│  12,480               │    │  3.1%                 │
│  ↑ 12%  vs last wk    │    │  ↑ 0.4pp              │
│                       │    │                       │
╰───────────────────────╯    ╰───────────────────────╯

── Show more ─────────────────────────────────────────
Secondary insights stay hidden until expanded.
```

## Alternative 3 (M)
- Title: Configurable card grid
- Rationale: Give users control over what they see next, which lowers cognitive load on high-density pages.
- Change list:
  - Add "Customize cards" toggle in dashboard header
  - Introduce card-level visibility preferences
  - Persist visibility in user settings
  - File-level notes: `components/dashboard/GridManager.tsx`, `api/dashboard/settings` endpoint
- Effort: M
- How we'll know it worked: Reduction in support tag "too much information" by `30%` and 14-day retention of active users moves `>= +4pp`.

```text
╭─ My dashboard ───────────────────────────────────────╮
│  ◆ 4 of 9 cards visible          [ Customize ]       │
╰──────────────────────────────────────────────────────╯

╭─ Revenue ─────────────╮    ╭─ Signups ─────────────╮
│                       │    │                       │
│  $48.2k               │    │  1,204                │
│  ▆▇██▆▅▃▃▄▅▄▃▂▂       │    │  ▅▄▃▂▁▃▄▆▇▇▆▅▅▅       │
│                       │    │                       │
╰───────────────────────╯    ╰───────────────────────╯

┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
╎ +  Add card                                          ╎
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
```
```
