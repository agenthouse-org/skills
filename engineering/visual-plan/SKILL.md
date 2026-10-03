---
name: "visual-plan"
description: "Draft local wireframes and mermaid architecture diagrams before implementation. Use when a UI layout, data model, or API shape must be seen and decided before code, or when the user asks for a mockup, wireframe, ERD, UML, or visual plan."
version: 0.1.1
author: "agenthouse"
license: MIT
price: 0
tags:
  - engineering
  - wireframe
  - mermaid
  - architecture
  - planning
  - free
ai_disclosure: "AI MODIFIED"
---

# Visual Plan

Produce a short, reviewable plan in Git: semantic HTML wireframes for screens, mermaid for architecture. Do not host a review UI. Do not edit application source while planning.

## Contents

- [Workflow](#workflow)
- [Decide first](#decide-first)
- [Artifacts](#artifacts)
- [Review](#review)
- [Template](templates/visual-plan.md)

## Workflow

```
- [ ] Decide: wireframe / mermaid / both / neither
- [ ] Produce artifacts for the chosen surface
- [ ] List open questions with one recommended default
- [ ] Stop for accept/reject (no implementation yet)
```

## Decide first

Ask only this, then stop if they already chose:

1. Wireframe — UI layout or states
2. Mermaid — schema, API, or architecture
3. Both
4. Neither — copy, docs, one-line, or already specified

Default: wireframe for UI, mermaid for data/API, neither for trivial work. Fidelity is `wireframe` unless the user asks for branded/pixel-accurate design or a clickable prototype.

Reply as **Decide / Artifacts / Open**. Expand only if the user asks.

## Artifacts

- Screens: HTML fragments (no `html`/`head`/`body`/`script`). Real product copy. One surface: `browser`, `desktop`, `mobile`, `popover`, or `panel`.
- Architecture: mermaid `erDiagram`, `classDiagram`, `sequenceDiagram`, `stateDiagram-v2`, `flowchart`, or C4. Never draw ERD arrows inside a product screen.
- Open questions: listed options with one recommended default.

When agenthouse engineering is enrolled, write a visual-plan JSON, set `fields.visualPlan` on the work item, and run `visual-plan check`. Otherwise keep the HTML and mermaid files next to the work.

## Review

The plan is ready when the user can accept or reject each decision without reading a narrative, and the files match the chosen surface. A wireframe is not a pixel baseline. A mermaid diagram is a projection of the intended model, not proof the model is right.

---

EU AI Act disclosure: **AI MODIFIED**
