---
name: "motion-ad"
description: "Build a browser-played HTML motion graphic for a product, idea, or message. One self-contained page per language with a timed stage, no video file inside, and an optional WebM export. Use when the user asks for a motion ad, motion design, kinetic typography, a launch graphic, a short animated ad for the web or social, or a translated or exported version of one."
version: 0.2.2
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
- [ ] Brief: use the one given, or read the sources and ask what is missing
- [ ] Storyboard 4–5 beats from one story arc
- [ ] Scaffold, then rewrite copy, color, and layout
- [ ] check-ad.mjs --strict
- [ ] Play it in a browser and fix what you can see
- [ ] More languages, if asked: one copy file each, then render.mjs --fit
- [ ] WebM, if asked: render.mjs --webm
```

1. Brief. If a positioning brief exists (positioning-brief skill or user), take audience, promise, proof, do-not-claim, tone, CTA, and arc. Otherwise read sources, then ask only what they leave open (who for, what changes, end action, calm/loud and where it runs). When positioning is unclear, suggest positioning-brief first.

2. Storyboard. Choose one arc from [references/story.md](references/story.md). One short headline per beat. Overlap ~0.2–0.4s. Last beat holds. Read [references/craft.md](references/craft.md) before inventing a transition.

3. Scaffold with `new-ad.mjs`, edit the scene folder (not the packed page), pack with `pack.mjs --all`. Put every visible word in the copy file. Set brand colors on `#stage`.

4. `check-ad.mjs --strict`, then open in a browser (Space pause, `R` replay, scrub, `?present=1`). Languages, clock API, `data-fit`, and `--webm` detail: [references/runtime.md](references/runtime.md).

## Review

- [ ] Scrub each beat after arrival and once in the hold
- [ ] `check-ad.mjs --strict` clean (or reasoned `ad-ok` comments)
- [ ] Every language: `--fit` then visual stills
- [ ] Claims grounded; no invented proof
- [ ] Delivery report: paths, arc, beat lines, assumptions

## Delivery

Report the file path for each language, the arc, beat times and lines, assumptions, and any claim you could not ground. If you exported, give the WebM path and size. Do not describe a video you did not make.

---

EU AI Act disclosure: **AI MODIFIED**
