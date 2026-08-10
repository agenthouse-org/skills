# Adaptive Sales Qualification

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.2`
- **ZIP:** [adaptive-sales-qualification-v0.1.2.zip](https://github.com/AgentHouse-org/skills/releases/download/release-2026-08-10-2/adaptive-sales-qualification-v0.1.2.zip)
- **Release:** [release-2026-08-10-2](https://github.com/AgentHouse-org/skills/releases/tag/release-2026-08-10-2)
- **Install:** `npx skills add AgentHouse-org/skills --skill adaptive-sales-qualification`
<!-- DOWNLOAD_END -->

A free, configurable skill from **Neri GmbH** and **AgentHouse** for evidence-based qualification of leads, accounts, and opportunities.

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
