# Runtime, languages, and export

Detail for the stage clock, multi-language packing, and optional WebM export. Keep using the checklist in `SKILL.md`.

## Languages

One scene, one `copy.<lang>.json` per language, one packed `index.<lang>.html` per language. The copy file is a flat map of key to plain string. `title` sets the page title and `sr` is the screen-reader summary. `pack.mjs` escapes HTML, fails on a missing key, and warns on unused ones. `--all` also fails when a language lacks a key that English has.

- Translate from the destination page in that language, not from your English copy. Use its terms for steps, buttons, and the tagline, and link its URL. If the page does not exist in that language, say so and translate the claims literally.
- Keep the beat structure and timing. Rewrite a headline if the literal translation breaks the rhythm; keep line breaks at sense breaks.
- German, French, and Finnish run 20–35% longer than English. Put `data-fit` on every text box that has a fixed width (titles, card labels, captions, buttons). The runtime shrinks its font-size until it and its `.ln` lines fit, down to 60% (`data-fit="0.5"` for 50%). Give those boxes a real width (`left` and `right`, or `width`) and `overflow: hidden` so there is something to fit into.
- Mark decoration that is meant to run off the frame, such as outline marquees or a split-headline half that clips on purpose, with `data-bleed`.
- `data-fit` measures once, at the start, when entrances have not landed. Put it on the element that scales or slams, not on its parent, or the parent measures its child at full oversize and shrinks for nothing.

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
| `--m` | Entrance with a light settle (about 4% overshoot), for transforms |
| `--x` | Exit, 0–1. Stays 0 on a held beat |
| `--p` | Progress across the whole beat, 0–1 |
| `--t` | Progress across the whole piece, on `#stage` |

These names are taken, and custom properties inherit. Do not use `--x` or `--e` for your own positions: a child reading `left: var(--x)` gets the exit value. Use names like `--lx` and `--ly`.

`.stagger` sets `--d` on each child. Children fade and rise from `--e` and `--m`. Put a second motion on an inner element so it does not fight that `transform`.

`.ln` is a masked line: `<span class="ln" style="--d: 0.2"><span>Text</span></span>`. `.draw` on an SVG path with `pathLength="1"` draws it from `--k`. The recipes for wipes, drawn lines, and product demos are in [craft.md](craft.md).

Wrap beat content in `.sheet` so the exit fade has something to fade.
