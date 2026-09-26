# Motion Ad

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** [motion-ad-v0.1.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-26/motion-ad-v0.1.0.zip)
- **Release:** [release-2026-09-26](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-26)
- **Install:** `npx skills add agenthouse-org/skills --skill motion-ad`
<!-- DOWNLOAD_END -->

Build a short HTML motion graphic for a product, idea, or message. It plays in the browser, one page per language. A WebM export is available when you need a file for a platform that does not play HTML.

## Example prompts

```text
Use $motion-ad. Make a 15-second HTML motion ad for this product. Read the page before writing claims. 16:9.
```

```text
Use $motion-ad. Add a German version from the German product page, check that it fits, and export both as WebM.
```

## Worked example

[examples/dealdesk](examples/dealdesk) is a 15-second DealDesk ad in English and German: [index.en.html](examples/dealdesk/index.en.html) and [index.de.html](examples/dealdesk/index.de.html). Open either in a browser. Space pauses, R replays, `?present=1` hides the controls.

## Scripts

Run from the skill directory with Node 18 or newer.

| Script | Does |
|---|---|
| `scripts/new-ad.mjs` | Scaffolds a scene folder (markup, styles, English copy) |
| `scripts/pack.mjs` | Packs a scene and a copy file into one self-contained page, or `--all` languages |
| `scripts/check-ad.mjs` | Static checks: clock, beats, reduced motion, no video, no leftovers |
| `scripts/render.mjs` | Browser checks and export: `--fit`, `--stills`, `--webm` |

`render.mjs` needs `npm install` (for `playwright-core`), Chrome or Edge, and `ffmpeg` for WebM.

## Included smoke test

See [examples/smoke-test.md](examples/smoke-test.md).

---

EU AI Act disclosure: **AI MODIFIED**
