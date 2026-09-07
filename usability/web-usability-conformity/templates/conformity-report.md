# Web usability conformity report

## Meta

- **Date:**
- **Mode:** Audit-only / Reach / Maintain
- **Target:**
- **Scoped pages / flows:**
- **Viewports:**
- **Harness report:** (path to `audit-report.json`)

## Norms

| Norm | Status | Notes |
|---|---|---|
| WCAG 2.2 Level A + AA | met / partially met / not met | |
| ISO/IEC 40500:2025 Ed. 2.0 | met / partially met / not met | Same technical content as WCAG 2.2 |
| EN 301 549 clause 9 (web) | met / partially met / not met | State V3.2.1 vs V4.1.1 caveat |
| BITV 2.0 | N/A / partially met / met | Extra homepage duties if public sector |
| BFSG / EAA | N/A / assumed in scope / not assessed legally | Technical bar via EN 301 549 |

### Norms narrative

[1–3 sentences: what is met on the scoped pages, with evidence bound.]

## Summary counts

| Verdict | Count |
|---|---:|
| pass | |
| fail | |
| not applicable | |
| needs human confirmation | |

Harness snapshot:

- axe violations:
- technical issues (DOM/html-validate/axe):
- visual / Playwright issues:
- critical or serious:

## Per-SC results

Complete every applicable row from `references/sc-matrix.md`.

| SC | Title | Verdict | Evidence |
|---|---|---|---|
| 1.1.1 | Non-text Content | | |
| … | … | | |

(Attach full table or link to filled matrix.)

## Understandability findings

| Page / flow | Observation | SC | Severity | Suggested fix |
|---|---|---|---|---|
| | | | | |

**Gender language:** not evaluated / not enforced (out of scope).

## Technical layer (DOM / HTML / axe)

- Key failures:
- html-validate (hygiene only; 4.1.1 obsolete in WCAG 2.2):

## Visual / Playwright layer

- Keyboard / focus:
- Focus not obscured (2.4.11):
- Reflow / resize:
- Target size (2.5.8):
- Dragging (2.5.7):
- Screenshots:

## Remediation (Reach) or tests added (Maintain)

1.
2.

## Remaining risks

-
-

## Compliance caveat

This report is an engineering conformity assessment using automated tools, Playwright interaction checks, and agent review. It is **not** a certified BITV-Test, accredited audit, or legal advice. “Norms met” refers to tested success criteria on the scoped pages with the evidence listed above. Open `needs human confirmation` items remain residual risk.
