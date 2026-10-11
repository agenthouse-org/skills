---
name: "motion-ad"
description: "Develop a browser-played HTML motion ad from idea and storyboard through review, or build in one pass when requested. One self-contained page per language with a timed stage, no video file inside, and an optional WebM export. Use for motion ads, kinetic typography, launch graphics, and translated or exported versions."
version: 0.2.4
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

## Contents

- [Rules](#rules)
- [Setup](#setup)
- [Workflow](#workflow)
- [Review](#review)
- [Story arcs](references/story.md)
- [Craft](references/craft.md)
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

For an open-ended request, offer two or three distinct creative directions before writing the finished ad. For each, give the central idea, audience insight, story arc, visual approach, and ending action; recommend one and say why. Keep claims tied to the source. Ask the user to choose or adjust a direction, then continue. If the user supplied a complete direction or asks for a one-shot result, state reasonable assumptions and proceed without adding a gate.

### 2. Storyboard and layout

After the direction is chosen, propose four or five beats from one arc in [references/story.md](references/story.md). Before building the polished ad, share a compact storyboard with timing, each beat's job, exact on-screen copy, frame composition, and hand-off to the next beat. For layout-heavy work, make a simple frame wireframe or storyboard contact sheet; use text or ASCII layout when visual-authoring tools are unavailable. Ask for feedback at this point. If the user asks to proceed, treat that as approval and build.

Check that the beats form a logical sequence, each changes the audience's understanding, and repeated ideas are deliberate. A viewer should be able to explain why each beat follows the previous one. Give the turn enough room, keep each frame focused on one idea, and let the end card hold. Read [references/craft.md](references/craft.md) before inventing a transition. For detailed collaboration and review criteria, see [references/collaborative-workflow.md](references/collaborative-workflow.md).

### 3. Build and inspect

Use the storyboard as the source of truth for copy, layout, and timing. Scaffold with `new-ad.mjs`, edit the scene folder (not the packed page), and pack with `pack.mjs --all`. Put every visible word in the copy file. Set brand colors on `#stage`.

Run `check-ad.mjs --strict`, then use `render.mjs --fit` for every language and inspect stills or the running page when browser access is available. Check settled frames and beat hand-offs for text collisions, clipping, duplicated or contradictory messages, and entrances that obscure copy. Fix each issue and recheck. If the current model or environment lacks a needed tool, use the strongest available fallback and say exactly what was and was not visually verified; never report a browser review that did not happen. Languages, clock API, `data-fit`, and `--webm` detail: [references/runtime.md](references/runtime.md).

## Review

- [ ] The user-approved direction and storyboard match the built ad, unless the user chose one-shot
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
