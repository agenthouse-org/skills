# Motion Ad

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.2.2`
- **ZIP:** [motion-ad-v0.2.2.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/motion-ad-v0.2.2.zip)
- **Release:** [release-2026-10-03-2](https://github.com/agenthouse-org/skills/releases/tag/release-2026-10-03-2)
- **Install:** `npx skills add agenthouse-org/skills --skill motion-ad`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "motion-ad" for me.

Skill: motion-ad v0.2.2 by agenthouse. Build a browser-played HTML motion graphic for a product, idea, or message.
Files: https://github.com/agenthouse-org/skills/tree/main/marketing/motion-ad
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/motion-ad-v0.2.2.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/motion-ad-v0.2.2.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill motion-ad
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the motion-ad folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

Build a short HTML motion graphic for a product, idea, or message. It plays in the browser, one page per language. A WebM export is available when you need a file for a platform that does not play HTML.

## Example prompts

```text
Use $motion-ad. Make a 15-second HTML motion ad for this product. Read the page before writing claims. 16:9.
```

```text
Use $positioning-brief, then $motion-ad. Build the brief from our website first, then a 15-second ad from its story arc.
```

```text
Use $motion-ad. Make a loud version of this ad: same claims, hard cuts, big type.
```

```text
Use $motion-ad. Add a German version from the German product page, check that it fits, and export both as WebM.
```

## Worked examples

[examples/dealdesk](examples/dealdesk) is a 15-second DealDesk ad in English and German. Watch it live: **[English](https://agenthouse-org.github.io/skills/demos/motion-ad/dealdesk/index.en.html)** · **[Deutsch](https://agenthouse-org.github.io/skills/demos/motion-ad/dealdesk/index.de.html)**. Space pauses, R replays, `?present=1` hides the controls.

[examples/dealdesk-loud](examples/dealdesk-loud) is the same ad from the same claims in the loud register: slams, hard cuts, a color flip at every beat. Watch it live: **[English](https://agenthouse-org.github.io/skills/demos/motion-ad/dealdesk-loud/index.en.html)** · **[Deutsch](https://agenthouse-org.github.io/skills/demos/motion-ad/dealdesk-loud/index.de.html)**.

The skills directory publishes every packed example page (`examples/<name>/index.html` or `index.<lang>.html`) as a live demo on each release.

## Scripts

Run from the skill directory with Node 18 or newer.

| Script | Does |
|---|---|
| `scripts/new-ad.mjs` | Scaffolds a scene folder (markup, styles, English copy) |
| `scripts/pack.mjs` | Packs a scene and a copy file into one self-contained page, or `--all` languages |
| `scripts/check-ad.mjs` | Static checks: clock, beats, reduced motion, no video, no leftovers, no default looks (glows, filter grades, emoji, randomness) |
| `scripts/render.mjs` | Browser checks and export: `--fit`, `--stills`, `--webm` |

`render.mjs` needs `npm install` (for `playwright-core`), Chrome or Edge, and `ffmpeg` for WebM.

## Included smoke test

See [examples/smoke-test.md](examples/smoke-test.md).

---

EU AI Act disclosure: **AI MODIFIED**
