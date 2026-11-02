---
name: "motion-ad"
description: "Develop a browser-played HTML motion ad from idea and storyboard through review, or build in one pass when requested. One self-contained page per language with a timed stage, no video file inside, and an optional WebM export. Use for motion ads, kinetic typography, launch graphics, and translated or exported versions."
version: 0.3.0
author: "agenthouse"
license: MIT
price: 0
tags:
  - marketing
  - motion
  - html
  - advertising
  - free
ai_disclosure: "AI MODIFIED"
---

# Motion ad

Make a short motion graphic as one HTML file that plays in the browser. The piece is the page: no video inside it, and no video export unless the user asks for one. When they do, export WebM from the finished page with `scripts/render.mjs`. Never animate in a video tool.

Default: 15 seconds, 1920×1080, silent, 4 or 5 beats, one idea each. The words have to carry the message with the sound off.

Two registers. **Calm** is the default. **Loud** is for bold, high-energy, or fast-feed asks. Both keep the same claims, arc, and checks. Techniques for loud are in [references/craft.md](references/craft.md#loud-register). Study [examples/dealdesk](examples/dealdesk) (calm) or [examples/dealdesk-loud](examples/dealdesk-loud) (loud) for finish level, not for their colors or claims.

Choose how to collaborate. **Director mode** helps the user shape the idea, storyboard and motion; offer two or three distinct directions and a recommendation, and invite feedback before building. **Producer mode** chooses the creative direction, storyboard and motion from the brief and proceeds in one pass, stating assumptions and decisions at delivery. Respect an explicit choice or one-shot request; otherwise use the existing collaborative workflow. Users can switch modes at any time. A mode does not change sourcing, accessibility, or quality checks.

## Contents

- [Rules](#rules)
- [Setup](#setup)
- [Workflow](#workflow)
- [Review](#review)
- [Story arcs](references/story.md)
- [Craft](references/craft.md)
- [Blueprints](references/blueprints.md) — deterministic motion directions for scaffold variation
- [Motion primitives](references/motion-primitives.md) — composable effects, generative motion, and optional 3D
- [Runtime, languages, export](references/runtime.md) — clock, `data-fit`, `--fit`, `--webm`

## Rules

- Consult, do not interrogate. Ask only what the sources and the brief leave open, one question at a time, with your reading for the user to confirm. If they say go, state your assumptions and continue.
- Read the destination page, brief, or repo before writing copy. Prices, counts, speeds, guarantees, and "free" must appear there. Compress a sentence that is actually on the page; do not add a claim. If the user wants copy the page does not support, write it and say so once.
- Do not invent customers, reviews, ratings, logos, or results. No proof row when there is no real number. No picture of a person you do not have.
- Match the brand: colors, type, logo, tone. No hype, no exclamation marks, no emoji unless the brand uses them.
- Story motion comes from the stage clock (`--e`, `--m`, `--x`, `--p`, `--t`). Do not use CSS `animation` or `transition` for the story. Scrubbing has to land on the same pose as playback.
- Keep the runtime, `#bar`, `window.ad`, and the reduced-motion path. Remove `data-scaffold` before delivery.
- Deliver a new file. Do not overwrite an earlier version.

## Setup

Node.js required. From this skill’s directory:

```bash
# scaffold / pack / check (no extra install)
node scripts/new-ad.mjs --dir ad --lang en
# or choose a starting direction: --blueprint orbit; dimensional needs npm install
node scripts/pack.mjs --scene ad --all
node scripts/check-ad.mjs ad/index.en.html --strict

# fit checks and WebM need playwright-core (+ Chrome/Edge; ffmpeg for --webm)
npm install
node scripts/render.mjs ad/index.en.html --fit
node scripts/render.mjs ad/index.en.html --webm ad/renders/ad-en.webm
```

## Workflow

```
- [ ] Brief and idea: use the one given, or read the sources and agree on a direction
- [ ] Storyboard or wireframe: agree on the sequence and frame layout before building
- [ ] Scaffold, then rewrite copy, color, and layout
- [ ] check-ad.mjs --strict
- [ ] Check timing, text fit, overlaps, and story logic; inspect in a browser when available
- [ ] More languages, if asked: one copy file each, then render.mjs --fit
- [ ] WebM, if asked: render.mjs --webm
```

### 1. Brief and direction

Read the destination page, brief, and brand material first. If a positioning brief exists (positioning-brief skill or user), take its audience, promise, proof, do-not-claim list, tone, CTA, and arc. Otherwise ask only for facts that are missing; keep questions concise and one at a time. When positioning is unclear, suggest positioning-brief first.

In director mode, for an open-ended request, offer two or three genuinely distinct creative directions before writing the finished ad. For each, describe the idea, story arc, visual approach, motion and ending; recommend one and say why. Include suitable blueprints and custom directions, in plain language. The user need not know blueprint names. In producer mode, choose the strongest direction and proceed. Keep claims tied to the source. If the user supplied a complete direction or asks for a one-shot result, state reasonable assumptions and proceed without adding a gate.

When the user asks for a 3D ad, producer mode must design a spatial story: decide what the objects represent, how they transform or interact across beats, and how camera, lighting and dimensional typography support the message. The stock rotating knot is only a technical scaffold, not a finished 3D direction. Build a scene-specific 3D composition, with readable accessible text, and inspect it in motion and at hand-offs. Use [motion primitives](references/motion-primitives.md#optional-3d) for the implementation and fallback contract.

### 2. Storyboard and layout

After the direction is chosen, propose four or five beats from one arc in [references/story.md](references/story.md). In director mode, share a compact storyboard with timing, each beat's job, exact on-screen copy, frame composition, and hand-off; invite feedback before building. For layout-heavy work, make a simple frame wireframe or storyboard contact sheet. In producer mode, use the storyboard internally and proceed; explain the choices at delivery.

Check that the beats form a logical sequence, each changes the audience's understanding, and repeated ideas are deliberate. A viewer should be able to explain why each beat follows the previous one. Give the turn enough room, keep each frame focused on one idea, and let the end card hold. Read [references/craft.md](references/craft.md) before inventing a transition. For detailed collaboration and review criteria, see [references/collaborative-workflow.md](references/collaborative-workflow.md).

### 3. Build and inspect

Use the storyboard as the source of truth for copy, layout, and timing. Scaffold with `new-ad.mjs`, edit the scene folder (not the packed page), and pack with `pack.mjs --all`. Put every visible word in the copy file. Set brand colors on `#stage`. Choose a starting blueprint from [references/blueprints.md](references/blueprints.md), or invent a scene from the brief. For composable reveals, bursts, morphs, and optional 3D, read [references/motion-primitives.md](references/motion-primitives.md). Motion must remain deterministic and clock-driven.

Run `check-ad.mjs --strict`, then use `render.mjs --fit` for every language and inspect stills or the running page when browser access is available. Check settled frames and beat hand-offs for text collisions, clipping, duplicated or contradictory messages, and entrances that obscure copy. Fix each issue and recheck. If the current model or environment lacks a needed tool, use the strongest available fallback and say exactly what was and was not visually verified; never report a browser review that did not happen. Languages, clock API, `data-fit`, and `--webm` detail: [references/runtime.md](references/runtime.md).

## Review

- [ ] The built ad follows the chosen direction and storyboard; producer mode records its assumptions
- [ ] Every beat advances a clear, logical story; repeated copy is intentional
- [ ] Scrub each beat after arrival, at each hand-off, and once in the hold
- [ ] No unintended text overlaps, clipping, or competing headlines; use `--fit` and visual inspection where available
- [ ] `check-ad.mjs --strict` clean (or reasoned `ad-ok` comments)
- [ ] Every language: `--fit` then visual stills
- [ ] Claims grounded; no invented proof
- [ ] Report any visual or runtime checks that the available tools could not perform
- [ ] Delivery report: paths, arc, beat lines, assumptions

## Delivery

Report the file path for each language, the arc, beat times and lines, assumptions, and any claim you could not ground. If you exported, give the WebM path and size. Do not describe a video you did not make.

---

EU AI Act disclosure: **AI MODIFIED**
