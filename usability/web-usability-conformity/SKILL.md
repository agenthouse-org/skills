---
name: "web-usability-conformity"
description: "Audit, reach, and maintain web usability and accessibility conformity against WCAG 2.2 Level AA (ISO/IEC 40500:2025), with EN 301 549, BITV 2.0, and BFSG mapping. Runs mandatory technical DOM/HTML tests and visual Playwright checks, plus understandability review. Use when the user asks for accessibility, WCAG, BITV, BFSG, EN 301 549, ISO 40500, usability conformity, keyboard/contrast audits, or Playwright a11y regression tests."
version: 0.1.1
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

Reach and maintain conformity against **WCAG 2.2 A+AA** (**ISO/IEC 40500:2025**), mapped to **EN 301 549**, **BITV 2.0**, and **BFSG**. Every applicable SC needs a verdict; axe alone is not enough. Not a certified BITV-Test; not legal advice.

## Contents

- [When to use](#when-to-use)
- [Setup](#setup)
- [Workflow](#workflow)
- [Review](#review)
- [Guardrails](#guardrails)
- [Operating procedure](references/operating-procedure.md)
- [Norms mapping](references/norms-mapping.md)
- [SC matrix](references/sc-matrix.md)
- [Understandability](references/understandability.md)
- [Test strategy](references/test-strategy.md)
- [Report template](templates/conformity-report.md)

## When to use

Audit a URL or frontend, fix then retest, add regression checks, or report norms met. Do not use as an accredited audit, to enforce gender-inclusive language, to claim AAA unless asked, or as pure conversion UX redesign.

## Setup

From this skill’s root (Node.js required):

```bash
npm install
npx playwright install chromium
```

Then audit:

```bash
node scripts/audit.mjs --url <URL> --out audit-report.json --screenshots
```

Fixture self-check: `node scripts/audit.mjs --fixture fixtures/pass-basic.html --out audit-report.json`. Optional: `node scripts/self-test.mjs`. Do not ship browsers inside the published ZIP.

## Workflow

```
- [ ] Confirm target and mode (Reach / Maintain / Audit-only)
- [ ] Confirm norm set (default WCAG 2.2 A+AA)
- [ ] Scope representative pages and flows
- [ ] Run technical DOM/HTML harness
- [ ] Run visual / Playwright interaction checks
- [ ] Understandability review (no gender-language enforcement)
- [ ] Record a verdict for every applicable SC
- [ ] Reach: fix → retest; or Maintain: add project tests
- [ ] Write report from the template
```

Execute detail from [references/operating-procedure.md](references/operating-procedure.md). Read the required references under Contents before judging findings.

## Review

- [ ] Both technical and visual layers ran
- [ ] Every applicable SC has a verdict with evidence
- [ ] Remaining fails are only `needs human confirmation` or user-accepted risks (Reach)
- [ ] Report includes norms caveat (not certified / not legal advice)

## Guardrails

**Must:** both layers before claiming conformity; verdict per applicable SC; name norms met/partial/N/A; plain language; preserve working functionality; state human-confirmation items.

**Must not:** enforce gender-inclusive German forms; equate zero axe violations with WCAG conformity; quote substantial ISO/IEC 40500 PDF text; claim legal presumption or a certified audit.

## Quick start

```text
Use web-usability-conformity to audit this URL for WCAG 2.2 AA / ISO/IEC 40500 conformity. Run technical DOM/HTML and Playwright visual tests, review understandability (do not enforce gender language), produce a norms-met report, then fix fails and retest.
```

---

EU AI Act disclosure for this skill: **PARTIALLY AI-MODIFIED**
