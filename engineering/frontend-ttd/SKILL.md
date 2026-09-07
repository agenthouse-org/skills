---
name: "frontend-ttd"
description: "Design and verify frontend changes through explicit design principles, browser-driven acceptance tests, and screenshot evidence. Use when building or changing a web UI where visual quality, responsive behavior, accessibility, and proof of the delivered result matter."
version: 0.1.0
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

# Frontend TTD

Use test-driven design (TTD) to make a frontend change observable before calling it complete. TTD here means: define the design intent and user-visible acceptance criteria, exercise the UI in a real browser, inspect screenshots, and turn discovered regressions into durable automated coverage.

Browser automation is evidence, not a substitute for judgment. A passing DOM assertion does not prove that the layout is usable or visually correct; a screenshot does not prove that the interaction works. Use both where applicable.

## Start with a design contract

Before changing UI, locate existing design principles in the brief, design system, product documentation, component library, CSS tokens, or nearby screens. Summarize only the principles that govern the requested change.

If no usable principles exist, tell the user and offer these choices:

1. provide principles or a design reference;
2. let the agent propose a concise, project-specific set for approval; or
3. allow the agent to infer provisional principles from the codebase and label them as assumptions.

Do not silently invent a brand identity, visual direction, or product requirement. When an urgent implementation must proceed, infer the smallest defensible contract from existing UI and record what needs confirmation.

A useful contract covers hierarchy, spacing and alignment, typography, color and states, responsive behavior, accessibility, and any relevant content rules. Convert it into observable criteria such as “the primary action remains visible without horizontal scrolling at 320px” rather than vague claims such as “looks polished.”

## Define acceptance before implementation

Write a compact test matrix for the changed journey. Include only states that can reveal a meaningful failure:

| Type | What to specify |
|---|---|
| Functional | entry point, user action, expected state, and error or empty path where relevant |
| Visual | viewport, state, concrete visual assertions, and screenshot checkpoint |
| Responsive | the smallest and largest relevant viewport or breakpoint transition |
| Accessibility | keyboard path, focus visibility/order, labels, semantic roles, and contrast or motion requirements when relevant |

Use stable, user-facing locators (role, label, visible text) where possible. Avoid assertions that merely mirror implementation details. Do not add brittle full-page pixel snapshots without defined review criteria; crop or checkpoint the relevant state and inspect it deliberately.

## Implement and exercise the UI

1. Inspect the project for its existing test runner, browser automation, dev-server command, conventions, and baseline UI. Reuse them.
2. Use the least invasive browser-automation capability already available in the environment. The skill does not require or install a particular framework, CLI, service, or package.
3. Implement the smallest change that meets the contract.
4. Run the normal automated checks, then run the browser journey against the real application.
5. Capture screenshots at every visual checkpoint. Inspect the image, not just the command exit code, at the specified viewport(s).
6. Check overflow, clipping, layering, loading/error states, focus, and the changed interaction. Exercise realistic content where that can alter layout.
7. When a defect appears, add or strengthen a durable test first when practical, fix it, and repeat the browser check. Do not declare success while a known acceptance criterion fails.

Prefer deterministic fixtures, stable viewport and device scale settings, and waits for meaningful readiness rather than arbitrary delays. Avoid modifying production data or external services merely to test a UI unless the user has authorized that scope.

## Deliver evidence

For every completed frontend task, report:

- the design contract and any assumptions or user decisions;
- the acceptance cases exercised and their result;
- screenshots with a short statement of what each demonstrates;
- automated checks run; and
- known gaps, deferred states, or follow-up tests.

Use [templates/evidence-record.md](templates/evidence-record.md) when a durable handoff artifact is useful. Keep screenshots, browser-test output, and the completed record with the project using ordinary repository files; the skill requires no external evidence service, package, or document format. Never claim visual inspection you did not perform.

## Completion bar

Call a frontend change complete only when the changed journey works in a real browser, the agreed visual criteria have been inspected at the relevant viewports, and the permanent test suite covers the highest-value behavior. Explain any deliberate exception plainly.

## Quick start

```text
Use $frontend-ttd for this UI change. First identify or establish the design contract. Define functional, visual, responsive, and accessibility acceptance checks before editing. Implement the smallest change, test the real browser journey, inspect screenshots at the relevant viewports, and return an evidence record with assumptions and any gaps.
```

---

EU AI Act disclosure: **AI MODIFIED**
