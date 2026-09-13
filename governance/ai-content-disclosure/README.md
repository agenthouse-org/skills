# AI Content Disclosure

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** [ai-content-disclosure-v0.1.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-13/ai-content-disclosure-v0.1.0.zip)
- **Release:** [release-2026-09-13](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-13)
- **Install:** `npx skills add agenthouse-org/skills --skill ai-content-disclosure`
<!-- DOWNLOAD_END -->

An open AgentHouse skill for assessing and applying AI-content disclosures in support of Article 50 of the EU AI Act.

## Capabilities

- classifies content as **Fully AI-Generated**, **Partially AI-Modified**, AI-assisted only, or unknown;
- distinguishes required disclosure from voluntary transparency practice;
- selects the official EU icon and contrast variant;
- places SVG or PNG icon assets deterministically on raster images;
- produces accessible disclosure text and a compact decision record;
- distinguishes visible labels from machine-readable provider marking.

## Install

```bash
npx skills add AgentHouse-org/skills --skill ai-content-disclosure
```

## Scripts

Python:

```bash
pip install Pillow cairosvg
python scripts/apply_disclosure.py input.jpg output.png \
  --icon assets/eu-ai-icons/svg/fully-ai-generated-black.svg \
  --corner bottom-right
```

Node.js:

```bash
npm install sharp
node scripts/apply-disclosure.mjs input.jpg output.png \
  --icon assets/eu-ai-icons/svg/fully-ai-generated-black.svg \
  --corner bottom-right
```

Both scripts accept SVG or PNG icons and produce a raster output. SVG is recommended as the repository source asset because it scales cleanly; PNG remains useful for environments without SVG rendering support.

## Legal scope

The official icons are optional tools supporting Article 50(4) disclosure. Their use alone does not establish compliance. The skill is not legal advice.
