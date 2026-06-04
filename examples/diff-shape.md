```markdown
# Wireframe Alternatives: Settings deletion flow diff
Shape: diff
Track: wireframe-settings-delete-flow
Source: "Users click delete by mistake because delete action is too close to save."

## Alternative 1 (XS)
- Title: Move button hierarchy only
- Rationale: The smallest safe change is to reduce accidental clicks while keeping flow intact.
- Change list:
  - `account/settings` -> place `Save changes` above `Delete account`
- Effort: XS
- How we'll know it worked: Mistaken delete attempts per 1,000 settings sessions drop from `6.0` to `<= 4.0` and successful saves stay within 2% of baseline.

```text
BEFORE                         AFTER
-------------------------------------------
| [Delete account]             | [Save changes]
| [Save changes]               | [Delete account]
-------------------------------------------
```

## Alternative 2 (S)
- Title: Two-step delete confirmation
- Rationale: Add explicit confirmation while keeping main task flow unchanged.
- Change list:
  - `account/settings` -> clicking delete opens modal confirmation
  - Add confirmation text: "This cannot be undone"
  - File-level note: `components/settings/DeleteButton.tsx`
- Effort: S
- How we'll know it worked: Mistaken delete attempts fall from `6.0` to `<= 2.5` and completion rate for legitimate deletes changes by less than `3%`.

```text
BEFORE                                      AFTER
---------------------------------------+-----------------------------------
[Delete account]                         | [Delete account]
                                        |   -> [Confirm deletion modal]
                                        |      [Cancel] [Delete permanently]
---------------------------------------+-----------------------------------
```

## Alternative 3 (M)
- Title: Dedicated danger zone
- Rationale: Separate destructive actions from standard settings controls to reduce cognitive overload.
- Change list:
  - Add `Danger zone` section
  - Move delete flow into separate route `/settings/danger-zone`
  - Add checkbox acknowledgement before delete modal
  - File-level notes: `pages/settings/index.tsx`, `pages/settings/danger.tsx`
- Effort: M
- How we'll know it worked: Mistaken delete attempts drop to `<= 1.0` and complaint tickets about accidental account loss are `0` for 14 days of shipping.

```text
BEFORE                                              AFTER
-----------------------------------------+--------------------------------------------
[Notifications] [Billing] [Account]        | [Notifications] [Billing] [Account]
[Delete account]                         | [Danger Zone]
                                          +------------------------------+
                                          | [Go to Danger Zone]          |
                                          +------------------------------+
                                                      |
                                                      v
                                          [Delete account] -> confirm checkbox -> modal
-----------------------------------------+--------------------------------------------
```
```
