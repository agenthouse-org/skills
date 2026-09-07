---
name: "web-usability-conformity"
description: "Audit, reach, and maintain web usability and accessibility conformity against WCAG 2.2 Level AA (ISO/IEC 40500:2025), with EN 301 549, BITV 2.0, and BFSG mapping. Runs mandatory technical DOM/HTML tests and visual Playwright checks, plus understandability review. Use when the user asks for accessibility, WCAG, BITV, BFSG, EN 301 549, ISO 40500, usability conformity, keyboard/contrast audits, or Playwright a11y regression tests."
version: 0.1.0
author: "Neri GmbH"
license: MIT
price: 0
tags:
  - accessibility
  - usability
  - wcag
  - wcag-2.2
  - iso-40500
  - en-301-549
  - bitv
  - bfsg
  - playwright
  - axe
  - understandability
  - free
ai_disclosure: "PARTIALLY AI-MODIFIED"
---

# Web Usability Conformity

## Purpose

Use this skill to **reach** and **maintain** web usability and accessibility conformity.

Default technical target: **WCAG 2.2 Level A + AA** (same technical content as **ISO/IEC 40500:2025 Edition 2.0**). Also report mapping to **EN 301 549** clause 9, **BITV 2.0**, and **BFSG**.

**Honesty bound:** “100% conformity” means every applicable A+AA success criterion has a defined test path and a recorded verdict (`pass` / `fail` / `not applicable` / `needs human confirmation`). It does **not** mean axe-core or HTML validation alone is sufficient. This skill is not a certified BITV-Test and is not legal advice.

## When to use

- Audit a URL, local app, or frontend code for WCAG / BITV / BFSG readiness
- Fix accessibility and understandability defects, then retest
- Add Playwright + DOM regression checks so conformity is maintained
- Report which norms are met, partially met, or out of scope

## When not to use

- As a substitute for a formal accredited accessibility audit or legal opinion
- To enforce gender-inclusive language (Gendern) — see guardrails
- To claim AAA conformity unless the user explicitly expands scope
- To redesign UX for conversion aesthetics alone (use a UX skill for that)

## Required references

Read before judging findings:

1. `references/norms-mapping.md` — WCAG 2.2, ISO/IEC 40500, EN 301 549, BITV 2.0, BFSG
2. `references/sc-matrix.md` — every A+AA success criterion and how to test it
3. `references/understandability.md` — Principle 3 + cognitive load; gender-language policy
4. `references/test-strategy.md` — dual layers, automation limits, maintain mode
5. `templates/conformity-report.md` — report shape

Optional: `examples/sample-report.md`.

## Guardrails

You MUST:

- Run **both** technical (DOM/HTML) and visual/interaction (Playwright) layers before claiming conformity
- Record a verdict for **every applicable** WCAG 2.2 A+AA success criterion in scope
- Name which norms are met / partially met / N/A with evidence
- Prefer plain language that aids readability
- Preserve working functionality while fixing defects
- State remaining human-confirmation items explicitly

You MUST NOT:

- Enforce, rewrite for, or fail content solely because it lacks gender-inclusive language (Gendersternchen, Doppelpunkt-innen, Binnen-I, or similar). Do not treat unmarked or generic masculine German as a defect. Ignore inclusive-language debates; focus on readability and WCAG Understandable criteria.
- Claim that zero axe violations equals WCAG conformity
- Embed or quote substantial ISO/IEC 40500 PDF text (copyright); cite SC IDs/titles only
- Claim legal presumption of conformity or a certified audit
- Ship or require browsers inside the skill ZIP; install Playwright browsers at run time

## Operating procedure

### 1. Intake

Confirm target: live URL, local URL, or frontend project path. Ask only if missing.

Confirm mode:

- **Reach** — audit, fix, retest until remaining fails are only human-confirmation items (or user stops)
- **Maintain** — add/adapt regression tests into the user’s project
- **Audit-only** — report without code changes

### 2. Norm set

Default:

- WCAG 2.2 Level A + AA (W3C Recommendation, 12 December 2024)
- ISO/IEC 40500:2025 Ed. 2.0 (identical technical content; cite, do not reproduce)

Also report:

- EN 301 549 clause 9 (`9.x.x.x` ↔ WCAG `x.x.x`)
  - V3.2.1 ≈ WCAG 2.1 AA (often still the OJ-cited legal reference)
  - V4.1.1 ≈ WCAG 2.2 AA (adds six web SCs; meeting 2.2 AA covers 2.1 AA plus those extras)
- BITV 2.0 (public sector → EN 301 549; extra homepage duties marked separately)
- BFSG / EAA (private-sector consumer products/services → EN 301 549 technical bar)

AAA is out of scope unless the user asks.

### 3. Scope (WCAG-EM style)

Select representative pages and flows, not a single screenshot. Prefer:

- Home / landing
- Auth (login, register, password reset)
- Primary task forms
- Search / filter results
- Error and empty states
- Media-heavy pages if present
- Cookie/consent and sticky chrome if present

Document URL, viewport(s), and auth needs.

### 4. Technical tests (DOM / HTML) — mandatory

From this skill’s root, after `npm install` and `npx playwright install chromium`:

```text
node scripts/audit.mjs --url <URL> --out audit-report.json
```

Or against fixtures:

```text
node scripts/audit.mjs --fixture fixtures/pass-basic.html --out audit-report.json
```

The harness must cover (at least):

- Document `lang`, `title`, unique `id`s
- Landmarks, heading outline, skip link presence when needed
- Images: `alt` rules; iframes: accessible name
- Forms: labels, `aria-invalid` / `aria-describedby` associations
- Dangerous `tabindex` patterns
- `@axe-core/playwright` with WCAG 2.2 A+AA tags
- Serialized HTML checks via `html-validate` when available

Treat harness JSON as mandatory evidence. Do not skip this layer.

### 5. Visual / interaction tests (Playwright) — mandatory

Drive the UI as a user (not screenshot-only):

- Keyboard-only tab order and visible focus
- Focus not fully obscured (WCAG **2.4.11**) — sticky headers, cookie banners
- Zoom 200% and narrow viewport reflow (~320 CSS px)
- Target size via bounding boxes (**2.5.8**, 24×24 CSS px with exceptions)
- Dragging has a single-pointer alternative when dragging is used (**2.5.7**)
- No seizure-risk flashing; respect reduced-motion where relevant
- Evidence screenshots on fail (stored under the report `outDir` when configured)

The audit script includes Playwright interaction checks; extend with project-specific flows when maintaining.

### 6. Understandability review

Apply `references/understandability.md`:

- Task and next action are obvious
- Labels and errors explain what happened and how to fix it
- Jargon explained; page language matches `lang`
- Consistent navigation and help (**3.2.6**)
- Accessible authentication (**3.3.8**) — no memory puzzles; paste / password managers work
- Cognitive load: short sentences, clear headings, no surprise context changes

**Gender language:** out of scope. Do not enforce inclusive forms; do not flag their absence.

### 7. Verdict

For every applicable SC in `references/sc-matrix.md`, record:

| Verdict | Meaning |
|---|---|
| `pass` | Evidence shows the criterion is met on scoped pages |
| `fail` | Evidence shows a defect |
| `not applicable` | Feature/content type absent (state why) |
| `needs human confirmation` | Automation + agent judgment insufficient (e.g. caption quality, meaningful alt) |

Attach evidence: tool rule IDs, DOM snippets, screenshots, keyboard notes.

### 8. Reach (fix mode)

1. Fix highest-severity fails first (keyboard traps, missing names, contrast, form errors)
2. Re-run technical + visual layers after each meaningful batch
3. Stop when remaining items are only `needs human confirmation` or user-accepted risks
4. Summarize what changed and which norms moved from partial to met

### 9. Maintain mode

Copy or adapt:

- `scripts/audit.mjs` patterns
- Playwright specs for keyboard, focus-not-obscured, target size, reflow
- CI-friendly `npm` scripts into the user’s project

Do not install browsers into this skill’s published ZIP; document `npx playwright install` for the target project.

## Output format

Use `templates/conformity-report.md`. Always include:

1. **Scope** — pages, viewports, date
2. **Norms met** — WCAG 2.2 AA, ISO/IEC 40500:2025, EN 301 549 (version caveat), BITV 2.0, BFSG
3. **Summary counts** — pass / fail / N/A / needs confirmation
4. **Per-SC table** — id, title, verdict, evidence
5. **Understandability findings**
6. **Technical harness results** (axe + DOM + html-validate)
7. **Visual / Playwright results**
8. **Remediation** (if Reach) or **test artifacts added** (if Maintain)
9. **Compliance caveat**

## Quick start

```text
Use web-usability-conformity to audit this URL for WCAG 2.2 AA / ISO/IEC 40500 conformity. Run technical DOM/HTML and Playwright visual tests, review understandability (do not enforce gender language), produce a norms-met report, then fix fails and retest.
```

```text
node scripts/audit.mjs --url http://localhost:3000 --out audit-report.json --screenshots
```

## Permissions

- Read files: yes
- Write files: optional (fixes, reports, maintain-mode specs)
- Execute scripts: yes (`npm install`, Playwright, audit harness)
- Browser/network: yes (target under test; official W3C/EN guidance if needed)
- Legal decision-making: no; escalate ambiguous regulatory questions

---

EU AI Act disclosure for this skill: **PARTIALLY AI-MODIFIED**
