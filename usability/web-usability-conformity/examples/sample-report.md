# Sample conformity report (illustrative)

## Meta

- **Date:** 2026-09-07
- **Mode:** Audit-only
- **Target:** `fixtures/fail-basic.html` (local fixture server)
- **Scoped pages / flows:** Single fixture page
- **Viewports:** 1280×800; reflow 320×800
- **Harness report:** `.audit-self-test/fail.json`

## Norms

| Norm | Status | Notes |
|---|---|---|
| WCAG 2.2 Level A + AA | not met | Multiple A/AA fails on fixture |
| ISO/IEC 40500:2025 Ed. 2.0 | not met | Same technical bar as WCAG 2.2 |
| EN 301 549 clause 9 (web) | not met | Corresponding 9.x.x.x criteria fail |
| BITV 2.0 | N/A | Fixture is not a public-sector site |
| BFSG / EAA | N/A | Fixture only; legal applicability not assessed |

### Norms narrative

On the scoped fixture page, applicable WCAG 2.2 A+AA criteria are **not** met. Failures include missing `lang`, empty title, missing image `alt`, unlabeled inputs, low contrast, and a fixed overlay that can obscure focus (2.4.11). ISO/IEC 40500:2025 A+AA and EN 301 549 clause 9 web criteria mapped to these SCs are therefore not met for this page.

## Summary counts

| Verdict | Count |
|---|---:|
| pass | 8 (illustrative subset with no related content) |
| fail | 12 |
| not applicable | 15 (no audio/video, no multi-page nav, etc.) |
| needs human confirmation | 2 |

Harness snapshot (example):

- axe violations: several (contrast, label, html-has-lang, …)
- technical issues: present
- visual issues: focus obscured by `#cookie`, small target button
- critical or serious: > 0

## Per-SC results (excerpt)

| SC | Title | Verdict | Evidence |
|---|---|---|---|
| 1.1.1 | Non-text Content | fail | `img` without `alt` (DOM + axe) |
| 1.4.3 | Contrast (Minimum) | fail | axe `color-contrast` on heading/body |
| 2.4.1 | Bypass Blocks | fail | No skip link; no main landmark |
| 2.4.2 | Page Titled | fail | Empty `document.title` |
| 2.4.11 | Focus Not Obscured (Minimum) | fail | Fixed `#cookie` overlay may cover focused controls |
| 2.5.8 | Target Size (Minimum) | fail | `.tiny` button ~16×16 CSS px |
| 3.1.1 | Language of Page | fail | Missing `html lang` |
| 3.3.2 | Labels or Instructions | fail | Name/email inputs without labels |
| 1.2.2 | Captions (Prerecorded) | not applicable | No video |
| 3.2.6 | Consistent Help | not applicable | Single page; no help mechanism |

## Understandability findings

| Page / flow | Observation | SC | Severity | Suggested fix |
|---|---|---|---|---|
| Fixture | Link text “Click here” does not describe purpose | 2.4.4 | major | Name the destination in the link text |
| Fixture | Unlabeled fields; no error guidance pattern | 3.3.2 | blocking | Add visible `<label for>` |

**Gender language:** not evaluated / not enforced (out of scope).

## Technical layer (DOM / HTML / axe)

- Missing `lang`, empty title, unlabeled controls, image without `alt`, positive `tabindex`
- axe WCAG 2.2 A+AA tags reported contrast and name/label violations
- html-validate may report additional hygiene issues (not treated as WCAG 4.1.1)

## Visual / Playwright layer

- Tab focus may land under the fixed cookie banner (2.4.11)
- Small icon button below 24×24 CSS px (2.5.8)
- Reflow at 320px: review any horizontal overflow if present

## Remediation (Reach) or tests added (Maintain)

1. Add `lang`, descriptive title, main landmark, skip link
2. Label all inputs; provide meaningful alt or mark decorative
3. Raise contrast to ≥4.5:1 for body text
4. Enlarge targets; dismissible cookie UI that does not fully obscure focus
5. Re-run `node scripts/audit.mjs --fixture fixtures/fail-basic.html` until critical/serious clear, then complete full SC matrix

## Remaining risks

- Caption and media SCs not exercised on this fixture
- Meaningful alt quality still needs human confirmation on real content

## Compliance caveat

This sample is illustrative for skill authors and agents. It is not a certified audit or legal advice.
