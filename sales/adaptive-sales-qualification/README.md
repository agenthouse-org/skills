# Adaptive Sales Qualification

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.3`
- **ZIP:** [adaptive-sales-qualification-v0.1.3.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/adaptive-sales-qualification-v0.1.3.zip)
- **Release:** [release-2026-10-03-2](https://github.com/agenthouse-org/skills/releases/tag/release-2026-10-03-2)
- **Install:** `npx skills add agenthouse-org/skills --skill adaptive-sales-qualification`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "adaptive-sales-qualification" for me.

Skill: adaptive-sales-qualification v0.1.3 by Neri GmbH. Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process.
Files: https://github.com/agenthouse-org/skills/tree/main/sales/adaptive-sales-qualification
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/adaptive-sales-qualification-v0.1.3.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/adaptive-sales-qualification-v0.1.3.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill adaptive-sales-qualification
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the adaptive-sales-qualification folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

A free, configurable skill from **Neri GmbH** and **agenthouse** for evidence-based qualification of leads, accounts, and opportunities.

## Package Structure

```text
adaptive-sales-qualification/
├── SKILL.md
├── config/
│   └── company-policy.md
├── references/
│   ├── qualification-model.md
│   ├── adaptation-rules.md
│   ├── probability-model.md
│   ├── buying-center.md
│   ├── tender-assessment.md
│   └── competitive-assessment.md
├── templates/
│   └── assessment-output.md
└── examples/
    ├── simple-b2b-lead.md
    ├── enterprise-opportunity.md
    ├── public-tender.md
    └── high-consideration-b2c.md
```

## Design Principles

- assess lead, account, and opportunity separately;
- combine scores without hiding gating weaknesses;
- retrieve company context before asking;
- adapt depth to sales economics and risk;
- distinguish verified facts from assumptions;
- estimate probability separately from qualification;
- account for cost of sale and opportunity cost;
- allow approved company-specific configuration;
- never silently modify the skill.

## Installation

Place the complete folder in the skill directory used by your compatible agent. Keep the folder structure intact.

## First Configuration

Open `config/company-policy.md` and fill only the information already known. The skill can work with generic defaults and propose additions during real assessments.

## License

MIT

## Author

Neri GmbH

EU AI Act disclosure: **AI MODIFIED**
