```markdown
# Wireframe Alternatives: Signup page before/after
Shape: page
Track: wireframe-signup-page-2026-05-14
Source: "Many users drop during first signup step because fields feel long and the value proposition is unclear."

## Alternative 1 (XS)
- Title: One-step onboarding
- Rationale: Keep current structure but remove the highest-friction action (full name + phone + role) and keep only what is needed to create a basic account.
- Change list:
  - Page section `signup_form` -> reduce required fields to `Email` + `Password`
  - Header copy -> add one-line trust signal below title
  - Primary CTA -> rename to `Create account` from `Start`
- Effort: XS
- How we'll know it worked: Signup start-to-complete rate increases from baseline `42%` to `>= 46%` within 7 days with support volume unchanged (+/-10%).

```text
+----------------------------------------------+
|  LaunchFlow | Create account in 60 seconds    |
+----------------------------------------------+
|  [Minimal hero]                              |
|  "Start in one minute, expand later"         |
+----------------------------------------------+
|  [Email ___________________]                  |
|  [Password ________________]                 |
|  [Create account]                            |
+----------------------------------------------+
|  "No credit card required"                   |
|  [Sign in instead]                           |
+----------------------------------------------+
```

## Alternative 2 (S)
- Title: Trust-first onboarding
- Rationale: Move the value proof above the form and add a lightweight progress cue; this reduces hesitation before first data entry.
- Change list:
  - `hero_copy` block -> add 2 bullets:
    - `No setup fees`
    - `Finish in under 60 seconds`
  - Add `progress_bar` in header with `Step 1 of 2`
  - Keep current fields (`Email`, `Password`) and add optional `Company name` toggle
- Effort: S
- How we'll know it worked: Signup start-to-complete rises from `42%` to `>= 48%` and first-time return rate at 24h increases from `20%` to `>= 23%`.

```text
+----------------------------------------------------+
|  LaunchFlow                                        |
|  Start in under 60 seconds                         |
|  - No setup fees  - Optional company details         |
+----------------------------------------------------+
|  Step 1 of 2                                      |
+----------------------------------------------------+
|  [Email ___________________]                        |
|  [Password ________________]                       |
|  [Create account] [Add optional details]           |
|  By continuing you accept terms                    |
+----------------------------------------------------+
```

## Alternative 3 (M)
- Title: Two-step account + intent confirmation
- Rationale: Ask for signup context after account creation so first step is minimal and non-threatening, while still capturing quality signal for onboarding.
- Change list:
  - `signup_form` -> split into two screens
  - Add screen 2 `account_goal` with single-select options
  - Add `Later` link to skip screen 2
  - File-level concept: `components/signup/SignupFlow.tsx`, `components/signup/SignupGoalStep.tsx`
- Effort: M
- How we'll know it worked: Signup complete (all steps) increases from `18%` to `>= 23%` and onboarding completion within 7 days rises by `+5pp`.

```text
Step 1                                  Step 2
+------------------------------+    +------------------------------+
|  Create account             |    |  Why are you joining?         |
|  Email ___________________   |    |  [Product] [Ops] [Marketing]  |
|  Password ________________   |    |  [Create account now]          |
|  [Create account]            |    |  [Skip for now]               |
|                             |    |                               |
|  Why now: 1 screen only      |    |  Progress: 2/2                |
+------------------------------+    +------------------------------+
```
```
