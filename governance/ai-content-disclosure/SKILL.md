---
name: "ai-content-disclosure"
description: "Assess AI-generated and AI-modified content, determine applicable transparency disclosures, and apply visible disclosure labels and official EU AI icons in support of Article 50 of the EU AI Act."
version: 0.1.1
author: "Neri GmbH"
license: MIT
price: 0
tags:
  - ai-transparency
  - eu-ai-act
  - article-50
  - ai-generated-content
  - ai-modified-content
  - deepfake
  - content-labelling
  - image-processing
  - compliance
  - free
ai_disclosure: "PARTIALLY AI-MODIFIED"
---

# AI Content Disclosure

Classify content, decide whether a visible AI disclosure is required or advisable, select the official EU icon, and apply it consistently. Supports compliance work; not legal advice and not a guarantee of compliance.

## Contents

- [Terminology](#terminology)
- [When to use](#when-to-use)
- [Setup](#setup)
- [Workflow](#workflow)
- [Review](#review)
- [Operating procedure](references/operating-procedure.md) — steps, output format, guardrails
- [Article 50 decision guide](references/article-50-decision-guide.md)
- [Placement and accessibility](references/placement-and-accessibility.md)

## Terminology

Use these labels exactly when selecting an EU icon: **Fully AI-Generated**, **Partially AI-Modified**, or **Basic icon** with clear custom text. Do not replace official labels with ambiguous shorthand in user-facing content.

## When to use

Publish or prepare AI-generated/modified media; assess deep-fake or public-interest Article 50(4) cases; voluntary transparency labelling; place an official EU AI icon; write disclosure/alt text; distinguish visible labelling from provider-side machine-readable marking.

## Setup

Icons live in `assets/eu-ai-icons/PNG` and `assets/eu-ai-icons/SVG`.

**Python** (Pillow + CairoSVG):

```bash
pip install -r requirements.txt
python scripts/apply_disclosure.py input.jpg output.png \
  --icon "assets/eu-ai-icons/SVG/LABEL_AI GENERATED_black.svg" \
  --corner bottom-right
```

**Node.js** (sharp):

```bash
npm install
node scripts/apply-disclosure.mjs input.jpg output.png \
  --icon "assets/eu-ai-icons/SVG/LABEL_AI GENERATED_black.svg" \
  --corner bottom-right
```

Prefer these scripts for deterministic placement. Options: `--corner`, `--relative-width`, `--margin`, `--overwrite`.

## Workflow

```
- [ ] Establish facts (modality, role, authenticity risk, exceptions)
- [ ] Classify: Fully AI-Generated / Partially AI-Modified / AI-assisted only / Unknown
- [ ] Determine disclosure status
- [ ] Select official icon and contrast variant
- [ ] Choose placement; prefer deterministic script
- [ ] Write new output; preserve original
- [ ] Add accessible text / alt where the channel allows
- [ ] Note any separate machine-readable (Article 50(2)) duties
```

Execute detail from [references/operating-procedure.md](references/operating-procedure.md). Read the decision guide and placement reference before judging.

## Review

- [ ] Official terminology preserved
- [ ] Icon not distorted, redrawn, or semantically altered
- [ ] Original file not overwritten unless requested
- [ ] Uncertainty and compliance caveat stated
- [ ] Icon use is not claimed as full compliance

## Quick start

```text
Assess this content under the AI Content Disclosure skill. Determine whether it is Fully AI-Generated, Partially AI-Modified, AI-assisted only, or unknown; assess the Article 50 disclosure status; select the appropriate official EU icon; and apply it deterministically without overwriting the original.
```

---

EU AI Act disclosure for this skill: **PARTIALLY AI-MODIFIED**
