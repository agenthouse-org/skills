---
name: "frontend-acceptance"
description: "Design and verify frontend changes through explicit design principles, browser-driven acceptance tests, and screenshot evidence. Use when building or changing a web UI where visual quality, responsive behavior, accessibility, and proof of the delivered result matter."
version: 0.2.1
author: "Neri GmbH"
license: MIT
price: 0
tags:
  - frontend
  - ui
  - browser-testing
  - visual-regression
  - accessibility
  - tdd
  - design
  - free
ai_disclosure: "AI MODIFIED"
---

# Frontend Acceptance

Make frontend acceptance observable before calling a change complete: design contract, acceptance criteria, real-browser exercise, screenshot inspection, durable coverage. Browser automation is evidence, not a substitute for judgment. No particular framework or package is required or installed by this skill — reuse what the project already has.

## Contents

- [Workflow](#workflow)
- [Design contract](#design-contract)
- [Acceptance matrix](#acceptance-matrix)
- [Implement and exercise](#implement-and-exercise)
- [Review](#review)
- [Evidence template](templates/evidence-record.md)

## Workflow

```
- [ ] Establish or confirm the design contract
- [ ] Write the acceptance matrix (functional / visual / responsive / a11y)
- [ ] Implement the smallest change that meets the contract
- [ ] Run project checks, then the real browser journey
- [ ] Capture and inspect screenshots at checkpoints
- [ ] Strengthen tests for defects found; re-verify
- [ ] Deliver an evidence record
```

## Design contract

Before changing UI, locate existing design principles in the brief, design system, docs, component library, CSS tokens, or nearby screens. Summarize only what governs the change.

If none exist, tell the user and offer: (1) they provide principles, (2) you propose a concise project-specific set for approval, or (3) you infer provisional principles from the codebase and label them as assumptions.

Do not silently invent a brand or product requirement. Cover hierarchy, spacing, typography, color/states, responsive behavior, accessibility, and content rules. Convert into observable criteria (“primary action visible without horizontal scroll at 320px”), not “looks polished.”

## Acceptance matrix

Include only states that can reveal a meaningful failure:

| Type | What to specify |
|---|---|
| Functional | entry point, user action, expected state, error/empty path |
| Visual | viewport, state, concrete assertions, screenshot checkpoint |
| Responsive | smallest and largest relevant viewport or breakpoint |
| Accessibility | keyboard path, focus, labels, roles, contrast/motion when relevant |

Prefer stable user-facing locators. Avoid brittle full-page pixel snapshots without review criteria.

## Implement and exercise

1. Reuse the project’s test runner, browser automation, and dev-server command.
2. Use the least invasive browser capability already available.
3. Implement the smallest change that meets the contract.
4. Run normal automated checks, then the browser journey against the real app.
5. Capture screenshots at every visual checkpoint; inspect the image at the specified viewport(s).
6. Check overflow, clipping, layering, loading/error states, focus, and the changed interaction.
7. On defect: strengthen a durable test when practical, fix, repeat. Do not declare success while a known criterion fails.

Prefer deterministic fixtures and meaningful readiness waits. Do not modify production data or external services unless authorized.

## Review

Call complete only when the changed journey works in a real browser, agreed visual criteria were inspected at the relevant viewports, and the permanent suite covers the highest-value behavior. Explain deliberate exceptions.

Evidence report: design contract and assumptions; cases and results; screenshots with what each shows; checks run; gaps. Use [templates/evidence-record.md](templates/evidence-record.md) when useful. Never claim visual inspection you did not perform.

## Quick start

```text
Use $frontend-acceptance for this UI change. First identify or establish the design contract. Define functional, visual, responsive, and accessibility acceptance checks before editing. Implement the smallest change, test the real browser journey, inspect screenshots at the relevant viewports, and return an evidence record with assumptions and any gaps.
```

---

EU AI Act disclosure: **AI MODIFIED**
