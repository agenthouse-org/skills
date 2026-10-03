# AI Content Disclosure

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.1`
- **ZIP:** [ai-content-disclosure-v0.1.1.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03/ai-content-disclosure-v0.1.1.zip)
- **Release:** [release-2026-10-03](https://github.com/agenthouse-org/skills/releases/tag/release-2026-10-03)
- **Install:** `npx skills add agenthouse-org/skills --skill ai-content-disclosure`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "ai-content-disclosure" for me.

Skill: ai-content-disclosure v0.1.1 by Neri GmbH. Assess AI-generated and AI-modified content, determine applicable transparency disclosures, and apply visible disclosure labels and official EU AI icons in support of Article 50 of the EU AI Act.
Files: https://github.com/agenthouse-org/skills/tree/main/governance/ai-content-disclosure
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03/ai-content-disclosure-v0.1.1.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03/ai-content-disclosure-v0.1.1.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill ai-content-disclosure
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the ai-content-disclosure folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
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
