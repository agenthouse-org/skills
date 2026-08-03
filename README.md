<div align="center">

```text
     _                    _   _   _                      
    / \   __ _  ___ _ __ | |_| | | | ___  _   _ ___  ___
   / _ \ / _` |/ _ \ '_ \| __| |_| |/ _ \| | | / __|/ _ \
  / ___ \ (_| |  __/ | | | |_|  _  | (_) | |_| \__ \  __/
 /_/   \_\__, |\___|_| |_|\__|_| |_|\___/ \__,_|___/\___|
         |___/

                    S K I L L S
```

# AgentHouse Skills

**Open-source skills for AI agents that do real business work.**

[![GitHub release](https://img.shields.io/github/v/release/AgentHouse-org/skills?display_name=tag)](https://github.com/AgentHouse-org/skills/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Publisher](https://img.shields.io/badge/Publisher-AgentHouse-black)](https://agenthouse.org)

</div>

---

## What is this?

AgentHouse Skills is an open-source collection of reusable skills for AI agents.

Each skill provides structured instructions, reference material, templates, and examples that help an agent perform a specific professional task consistently.

The skills are designed for compatible `SKILL.md`-based agents and tools, including Claude Code, Codex, Gemini CLI, Cursor, and other agent systems.

---

# 🚀 Quick Start

### Discover available skills

```bash
npx skills add AgentHouse-org/skills --list
```

### Install a specific skill

```bash
npx skills add AgentHouse-org/skills --skill adaptive-sales-qualification
```

### Install interactively

```bash
npx skills add AgentHouse-org/skills
```

The CLI automatically discovers every folder containing a valid `SKILL.md`.

> **Requirements**
>
> - Node.js **22.20.0** or newer
> - `npx` (included with Node.js)

---

## 📦 Available Skills

<!-- SKILLS_TABLE_START -->
| Skill | Purpose | Version | Files | Download |
|---|---|---:|---|---|
| [Adaptive Sales Qualification](https://github.com/AgentHouse-org/skills/tree/main/sales/adaptive-sales-qualification) | Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process. Designed primarily for B2B sales and adaptable to high-consideration B2C, custom industries, geographies, products, sales cycles, and costs of sale. | `0.1.1` | [View](https://github.com/AgentHouse-org/skills/tree/main/sales/adaptive-sales-qualification) | [ZIP](https://github.com/AgentHouse-org/skills/releases/download/release-2026-08-03/adaptive-sales-qualification-v0.1.1.zip) |
<!-- SKILLS_TABLE_END -->

---

# ⭐ Featured Skill

## Adaptive Sales Qualification

An evidence-based qualification system for AI sales agents.

It evaluates:

- Leads
- Accounts
- Opportunities
- Buying Centers
- Tenders & Procurement
- Competition
- Probability to Close
- Cost of Sale
- Opportunity Cost

The skill automatically adapts to:

- Industry
- Product
- Geography
- Sales Motion
- Deal Size
- Buying Complexity
- Sales Cycle
- Delivery Complexity
- Risk

Install directly:

```bash
npx skills add AgentHouse-org/skills --skill adaptive-sales-qualification
```

---

# 💾 Manual Installation

Download the latest ZIP from GitHub Releases:

https://github.com/AgentHouse-org/skills/releases

Extract the folder into your preferred AI agent.

Typical locations:

```text
.claude/skills/<skill-name>/
.agents/skills/<skill-name>/
.gemini/skills/<skill-name>/
```

---

# 📁 Repository Structure

```text
skills/
└── sales/
    └── adaptive-sales-qualification/
        ├── SKILL.md
        ├── README.md
        ├── config/
        ├── references/
        ├── templates/
        └── examples/
```

Category folders are optional.

The discovery workflow searches the repository for every `SKILL.md`.

---

# 📖 Skill Structure

| Path | Purpose |
|------|---------|
| `SKILL.md` | Primary agent instructions |
| `README.md` | Human documentation |
| `config/` | Company-specific configuration |
| `references/` | Methods and supporting knowledge |
| `templates/` | Output templates |
| `examples/` | Worked examples |

Only `SKILL.md` is mandatory.

---

# ⚙️ Automatic Releases

Every skill declares its own version.

Example:

```yaml
name: "adaptive-sales-qualification"
version: 0.1.1
```

GitHub Actions automatically:

- discovers skills
- validates metadata
- builds one ZIP per skill
- generates SHA-256 checksums
- publishes GitHub Releases
- updates the skill catalogue in this README

---

# 🤝 Contributing

Contributions are welcome.

A good skill should:

- solve a real-world problem
- have a unique purpose
- use kebab-case naming
- include valid YAML frontmatter
- separate facts from assumptions
- avoid proprietary framework reproduction
- include examples
- be safe and reusable

---

# 📄 License

Unless otherwise stated, all skills are released under the MIT License.

---

# 🌍 Publisher

**AgentHouse / Neri GmbH**

- Website: https://agenthouse.org
- GitHub: https://github.com/AgentHouse-org

---

<div align="center">

## Build agents that know how to work.

⭐ If you find these skills useful, consider starring the repository.

</div>