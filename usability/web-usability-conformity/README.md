# Web Usability Conformity

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** [web-usability-conformity-v0.1.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/web-usability-conformity-v0.1.0.zip)
- **Release:** [release-2026-10-01](https://github.com/agenthouse-org/skills/releases/tag/release-2026-10-01)
- **Install:** `npx skills add agenthouse-org/skills --skill web-usability-conformity`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "web-usability-conformity" for me.

Skill: web-usability-conformity v0.1.0 by Neri GmbH. Audit, reach, and maintain web usability and accessibility conformity against WCAG 2.2 Level AA (ISO/IEC 40500:2025), with EN 301 549, BITV 2.0, and BFSG mapping.
Files: https://github.com/agenthouse-org/skills/tree/main/usability/web-usability-conformity
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/web-usability-conformity-v0.1.0.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/web-usability-conformity-v0.1.0.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill web-usability-conformity
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the web-usability-conformity folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

An agenthouse skill to **reach** and **maintain** web usability and accessibility conformity.

## Default target

- **WCAG 2.2 Level A + AA** (W3C)
- **ISO/IEC 40500:2025 Edition 2.0** (same technical content as WCAG 2.2)
- Mapping to **EN 301 549** clause 9, **BITV 2.0**, and **BFSG**

“100% conformity” means every applicable A+AA success criterion has a test path and a recorded verdict — not “axe found zero issues.”

## Capabilities

- Dual mandatory test layers: **technical** (DOM / HTML / axe-core) and **visual** (Playwright interaction)
- Full WCAG 2.2 A+AA matrix with automation class per criterion
- Understandability review (Principle 3 + cognitive load)
- Explicit **non-enforcement** of gender-inclusive language (keeps readability first)
- Norms-met reporting with legal caveats
- Reach (fix + retest) and Maintain (project regression tests) modes

## Install

```bash
npx skills add agenthouse-org/skills --skill web-usability-conformity
```

## Harness

From this skill folder:

```bash
npm install
npx playwright install chromium
node scripts/audit.mjs --url http://localhost:3000 --out audit-report.json --screenshots
```

Self-test against fixtures:

```bash
npm run self-test
```

Browsers are **not** shipped inside the skill ZIP; install Playwright browsers at run time.

## Structure

| Path | Purpose |
|------|---------|
| `SKILL.md` | Agent instructions |
| `references/norms-mapping.md` | WCAG / ISO / EN / BITV / BFSG |
| `references/sc-matrix.md` | Success criteria and test methods |
| `references/understandability.md` | Understandable + gender-language policy |
| `references/test-strategy.md` | Dual-layer strategy and maintain mode |
| `scripts/audit.mjs` | Dual-layer audit harness |
| `fixtures/` | Pass/fail HTML self-tests |
| `templates/conformity-report.md` | Report template |

## Scope notes

- Not a certified BITV-Test or legal advice
- AAA out of default scope
- Do not copy ISO PDF text into projects; cite SC IDs/titles only

## License

MIT
