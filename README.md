# AgentHouse Skills

Open-source, reusable AI agent skills developed by AgentHouse and Neri GmbH.

The repository contains practical skills for compatible AI agents and
SKILL.md-based platforms. Each skill is maintained in its own folder and can
be downloaded and installed independently.

## Available Skills

<!-- SKILLS_TABLE_START -->
| Skill | Purpose | Version | Files | Download |
|---|---|---:|---|---|
| [Adaptive Sales Qualification](https://github.com/AgentHouse-org/skills/tree/main/sales/adaptive-sales-qualification) | Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process. Designed primarily for B2B sales and adaptable to high-consideration B2C, custom industries, geographies, products, sales cycles, and costs of sale. | `0.1.1` | [View](https://github.com/AgentHouse-org/skills/tree/main/sales/adaptive-sales-qualification) | [ZIP](https://github.com/AgentHouse-org/skills/releases/download/release-2026-08-03/adaptive-sales-qualification-v0.1.1.zip) |
<!-- SKILLS_TABLE_END -->

## Repository Structure

Each skill is stored in its own folder containing a `SKILL.md` file.

The repository supports categories and arbitrary folder depth, for example:

```text
sales/
└── adaptive-sales-qualification/
    ├── SKILL.md
    ├── README.md
    ├── config/
    ├── references/
    ├── templates/
    └── examples/