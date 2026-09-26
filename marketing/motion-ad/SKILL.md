---
name: "motion-ad"
description: "Build a browser-played HTML motion graphic for a product, idea, or message. One self-contained page per language with a timed stage, no video file inside, and an optional WebM export. Use when the user asks for a motion ad, motion design, kinetic typography, a launch graphic, a short animated ad for the web or social, or a translated or exported version of one."
version: 0.1.0
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

## Rules

- Read the destination page, brief, or repo before writing copy. Prices, counts, speeds, guarantees, and "free" must appear there. Compress a sentence that is actually on the page; do not add a claim. If the user wants copy the page does not support, write it and say so once.
- Do not invent customers, reviews, ratings, logos, or results. No proof row when there is no real number. No picture of a person you do not have.
- Match the brand: colors, type, logo, tone. No hype, no exclamation marks, no emoji unless the brand uses them.
- Story motion comes from the stage clock (`--e`, `--m`, `--x`, `--p`, `--t`). Do not use CSS `animation` or `transition` for the story. Scrubbing has to land on the same pose as playback.
- Keep the runtime, `#bar`, `window.ad`, and the reduced-motion path. Remove `data-scaffold` before delivery.
- Deliver a new file. Do not overwrite an earlier version.

## Workflow

```
- [ ] Research the subject and the page the ad points at
- [ ] Storyboard 4–5 beats
- [ ] Scaffold, then rewrite copy, color, and layout
- [ ] check-ad.mjs --strict
- [ ] Play it in a browser and fix what you can see
- [ ] More languages, if asked: one copy file each, then render.mjs --fit
- [ ] WebM, if asked: render.mjs --webm
```

1. Research. Note the promise, the audience, the format, and only the facts you can point at. Pull colors and the logo from the live site or the design system. Ask only if the subject or the destination is missing.

2. Storyboard. One short headline per beat. Overlap beats by about 0.2–0.4s. The last beat holds. Read [references/craft.md](references/craft.md) before you invent a transition.

3. Scaffold a scene folder from this skill's directory:

```bash
node scripts/new-ad.mjs --dir ad --lang en
```

This writes `ad/scene.html` (markup with `{{key}}` slots), `ad/scene.css`, `ad/copy.en.json` (the words), and a packed `ad/index.en.html`. Optional: `--duration`, `--width`, `--height`. The scaffold beats are timed for 15s at 1920×1080. If you change the stage size, re-place the layout. 1080×1350 is a 4:5 feed. 1080×1920 is a 9:16 story. Do not just squash a 16:9 layout into another frame. For a one-off single-language page, `--out ad/index.html --title "Name"` packs the scaffold straight to one file.

4. Edit the scene folder, not the packed page. Replace every scaffold line. Put every visible word in the copy file. Set the brand on `#stage` (`--paper`, `--ink`, `--muted`, `--accent`). Study [examples/dealdesk](examples/dealdesk) for the level of finish, not for its colors or claims. Pack after each change:

```bash
node scripts/pack.mjs --scene ad --all
```

5. Check:

```bash
node scripts/check-ad.mjs ad/index.en.html --strict
```

6. Open the file in a browser. It autoplays. Space pauses. `R` replays. The range scrubs. `?present=1` hides the bar. Seek to each beat just after it has arrived, and once in the hold. Fix overlap, clipping, crowded type, leftovers from the scaffold, and labels that the picture does not support. With reduced motion, the piece holds the end card and does not autoplay.

To rebuild the worked example after editing its scene files:

```bash
node scripts/pack.mjs --scene examples/dealdesk --all
```

## Languages

One scene, one `copy.<lang>.json` per language, one packed `index.<lang>.html` per language. The copy file is a flat map of key to plain string. `title` sets the page title and `sr` is the screen-reader summary. `pack.mjs` escapes HTML, fails on a missing key, and warns on unused ones. `--all` also fails when a language lacks a key that English has.

- Translate from the destination page in that language, not from your English copy. Use its terms for steps, buttons, and the tagline, and link its URL. If the page does not exist in that language, say so and translate the claims literally.
- Keep the beat structure and timing. Rewrite a headline if the literal translation breaks the rhythm; keep line breaks at sense breaks.
- German, French, and Finnish run 20–35% longer than English. Put `data-fit` on every text box that has a fixed width (titles, card labels, captions, buttons). The runtime shrinks its font-size until it and its `.ln` lines fit, down to 60% (`data-fit="0.5"` for 50%). Give those boxes a real width (`left` and `right`, or `width`) and `overflow: hidden` so there is something to fit into.
- Mark decoration that is meant to run off the frame, such as outline marquees, with `data-bleed`.

Then check each language in a real browser:

```bash
node scripts/render.mjs ad/index.en.html ad/index.de.html --fit
```

`--fit` samples every beat at 70% and the hold. It fails on text that is cut off, spills out of its card or the stage, overlaps other text, or is still too wide at the smallest `data-fit` size. Then look at stills of each language, because the script cannot judge the rhythm:

```bash
node scripts/render.mjs ad/index.de.html --stills
```

Stills go to `renders/<name>-stills/`. `--stills 1.2,4.5` picks times; `--dir` moves them.

## Export

Only when the user asks for a video file. The HTML stays the source; the export is a recording of it.

```bash
npm install
node scripts/render.mjs ad/index.en.html --webm ad/renders/ad-en.webm
```

This needs `playwright-core` (from `npm install` in the skill directory), Chrome or Edge (`--channel msedge`, or `--browser <path>`), and `ffmpeg` on the PATH (or `--ffmpeg <path>`). It loads the page with `?present=1`, seeks the clock frame by frame at the stage size, and encodes VP9 WebM. `--fps 30` and `--crf 32` are the defaults; a lower `--crf` is sharper and larger. It refuses to overwrite a file without `--force`. Frame capture is exact, so the export matches a scrub of the page. The output is silent.

Run `--fit` before exporting each language. Report the file size and look at a frame of the WebM.

## Clock

`window.ad.seek(seconds)`, `.play()`, `.pause()`, `.getTime()`, `.duration`, and `.fitted` (a promise that resolves once fonts have loaded and `data-fit` has run).

Each `.beat` has `data-in` and `data-out` in seconds, plus optional `data-enter`, `data-exit`, and `data-hold="1"`. While it is on, the beat exposes:

| Property | Meaning |
|---|---|
| `--e` | Entrance, eased, 0–1 |
| `--m` | Entrance with a slight overshoot, for transforms |
| `--x` | Exit, 0–1. Stays 0 on a held beat |
| `--p` | Progress across the whole beat, 0–1 |
| `--t` | Progress across the whole piece, on `#stage` |

`.stagger` sets `--d` on each child. Children fade and rise from `--e` and `--m`. Put a second motion on an inner element so it does not fight that `transform`.

`.ln` is a masked line: `<span class="ln" style="--d: 0.2"><span>Text</span></span>`. `.draw` on an SVG path with `pathLength="1"` draws it from `--k`. The recipes for wipes, drawn lines, and product demos are in [references/craft.md](references/craft.md).

Wrap beat content in `.sheet` so the exit fade has something to fade.

## Delivery

Report the file path for each language, the beat times and lines, and any claim you compressed or could not ground. If you exported, give the WebM path and size. Do not describe a video you did not make.
