```markdown
# Wireframe Alternatives: Password reset modal component
Shape: component
Track: wireframe-reset-modal
Source: "Users abandon password reset when the confirmation modal feels risky."

## Alternative 1 (XS)
- Title: Clear confirm modal
- Rationale: Keep the existing modal shape, but make the irreversible action and escape path easier to scan.
- Change list:
  - `ResetPasswordModal` -> clarify title and primary action label
  - Move risk detail into short body copy
  - Keep current footer structure
- Effort: XS
- How we'll know it worked: reset completion rate moves from `42%` to `>= 47%` within 14 days.

```text
╭─ Reset password ───────────────────────────╮
│                                            │
│  █████████████                             │
│                                            │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄                            │
│  ┄┄┄┄┄┄┄┄                                  │
│                                            │
│  Cancel →         ┏━━━━━━━━━━━━━━┓         │
│                   ┃ Send reset   ┃         │
│                   ┗━━━━━━━━━━━━━━┛         │
│                                            │
╰────────────────────────────────────────────╯
```

## Alternative 2 (S)
- Title: Email-aware modal
- Rationale: Showing the destination email reduces uncertainty without adding a new page or flow step.
- Change list:
  - Add destination email row to the modal body
  - Add secondary "change email" text action
  - Keep the same modal width and primary button placement
- Effort: S
- How we'll know it worked: support contacts tagged `reset email` decrease from `18` to `<= 12` per week.

```text
╭─ Send reset link ──────────────────────────╮
│                                            │
│  ███████████████                           │
│                                            │
│  Email                                     │
│  ╭────────────────────────────────╮        │
│  │ reader@example.com             │        │
│  ╰────────────────────────────────╯        │
│                                            │
│  Change email →   ┏━━━━━━━━━━━━━━┓         │
│                   ┃ Send link    ┃         │
│                   ┗━━━━━━━━━━━━━━┛         │
│                                            │
╰────────────────────────────────────────────╯
```

## Alternative 3 (M)
- Title: State-aware reset modal
- Rationale: Folding loading and sent states into the same component makes progress visible and lowers repeat-click confusion.
- Change list:
  - Add `loading` and `sent` states to the component API
  - Swap primary action copy by state
  - Add success status row after the send action resolves
- Effort: M
- How we'll know it worked: duplicate reset requests within 10 minutes drop from `21%` to `<= 14%`.

```text
loading
╭─ Send reset link ──────────────────────────╮
│                                            │
│  ███████████████                           │
│                                            │
│  ● Sending link                            │
│  ███████████████░░░░░░░░░░░░  54%          │
│                                            │
│  Cancel →         ┏━━━━━━━━━━━━━━┓         │
│                   ┃ Sending...   ┃         │
│                   ┗━━━━━━━━━━━━━━┛         │
│                                            │
╰────────────────────────────────────────────╯

sent
╭─ Check your inbox ─────────────────────────╮
│                                            │
│  ✓ Link sent                               │
│                                            │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄                            │
│  ┄┄┄┄┄┄┄┄                                  │
│                                            │
│  Close →          ╭──────────────╮         │
│                   │ Resend link  │         │
│                   ╰──────────────╯         │
│                                            │
╰────────────────────────────────────────────╯
```
```
