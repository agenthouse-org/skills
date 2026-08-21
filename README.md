<div align="center">
# agenthouse Skills

**Open-source skills for AI agents that do real business work.**

[![GitHub release](https://img.shields.io/github/v/release/agenthouse-org/skills?display_name=tag)](https://github.com/agenthouse-org/skills/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Publisher](https://img.shields.io/badge/Publisher-agenthouse-black)](https://agenthouse.org)

</div>

---

## What is this?

agenthouse Skills is an open-source collection of reusable skills for AI agents.

Each skill provides structured instructions, reference material, templates, and examples that help an agent perform a specific professional task consistently.

The skills are designed for compatible `SKILL.md`-based agents and tools, including Claude Code, Codex, Gemini CLI, Cursor, and other agent systems.

---

# 🚀 Quick Start

### Fastest: Load from ZIP URL

If you already have a ZIP link, paste it directly into your AI agent (for example ChatGPT or Claude) and ask it to load/import the skill.

ZIP links are available in:

- [the skill table below](#skill-table)
- the [Skills Directory](https://agenthouse-org.github.io/skills/) (search by category)
- GitHub Releases: https://github.com/agenthouse-org/skills/releases

### CLI (NPX)

Discover available skills:

```bash
npx skills add agenthouse-org/skills --list
```

Install a specific skill:

```bash
npx skills add agenthouse-org/skills --skill adaptive-sales-qualification
```

Install interactively:

```bash
npx skills add agenthouse-org/skills
```

The CLI automatically discovers every folder containing a valid `SKILL.md`.

> **Requirements**
>
> - Node.js **22.20.0** or newer
> - `npx` (included with Node.js)

---

<a id="skill-table"></a>
## 📦 Available Skills

Browse with search and categories: **[Skills Directory](https://agenthouse-org.github.io/skills/)**

<!-- SKILLS_TABLE_START -->
| Skill | Purpose | Version | Files | Download |
|---|---|---:|---|---|
| [Ai Content Disclosure](https://github.com/agenthouse-org/skills/tree/main/governance/ai-content-disclosure) | Assess AI-generated and AI-modified content, determine applicable transparency disclosures, and apply visible disclosure labels and official EU AI icons in support of Article 50 of the EU AI Act. | `0.1.0` | [View](https://github.com/agenthouse-org/skills/tree/main/governance/ai-content-disclosure) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-08-10-2/ai-content-disclosure-v0.1.0.zip) |
| [Build Innovation Capacity](https://github.com/agenthouse-org/skills/tree/main/innovation/build-innovation-capacity) | Help executives and founders understand where organizational attention is consumed, distinguish operational work from implementation and exploratory innovation, release capacity for unconventional ideas, and turn promising ideas into validated change using the Alpha Pyramid framework. Use for innovation stagnation, operational overload, strategy renewal, transformation reviews, organizational design, assumption testing, and leadership workshops. | `0.1.0` | [View](https://github.com/agenthouse-org/skills/tree/main/innovation/build-innovation-capacity) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-08-10-2/build-innovation-capacity-v0.1.0.zip) |
| [Create Role Profile](https://github.com/agenthouse-org/skills/tree/main/organization-design/create-role-profile) | Interview a user to define an organizational role, clarify its purpose, domains, responsibilities, authority, obligations, boundaries, requirements, holder, and approval, then create a professional role profile as DOCX or Excel. Use when designing roles, clarifying accountability, separating roles from job positions, preparing organizational changes, improving handoffs, hiring, onboarding, governance, or documenting decision rights. | `0.1.0` | [View](https://github.com/agenthouse-org/skills/tree/main/organization-design/create-role-profile) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-08-10-2/create-role-profile-v0.1.0.zip) |
| [Adaptive Sales Qualification](https://github.com/agenthouse-org/skills/tree/main/sales/adaptive-sales-qualification) | Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process. Designed primarily for B2B sales and adaptable to high-consideration B2C, custom industries, geographies, products, sales cycles, and costs of sale. | `0.1.2` | [View](https://github.com/agenthouse-org/skills/tree/main/sales/adaptive-sales-qualification) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-08-10-2/adaptive-sales-qualification-v0.1.2.zip) |
| [Skill Antivirus](https://github.com/agenthouse-org/skills/tree/main/security/skill-antivirus) | Review agent skills (SKILL.md, skill folders, or ZIP packages) with deterministic static analysis plus LLM heuristic review of every file. Stages ZIPs read-only to temp, never executes content, and flags executables for classic antivirus. Dual-use CLI and agent orchestration. | `0.3.0` | [View](https://github.com/agenthouse-org/skills/tree/main/security/skill-antivirus) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-08-10-2/skill-antivirus-v0.3.0.zip) |
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
npx skills add agenthouse-org/skills --skill adaptive-sales-qualification
```

---

# 💾 Manual Extraction (Fallback)

If your tool does not support direct URL import, download and extract the ZIP into your preferred AI agent.

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
| `README.md` | Human documentation (ZIP links are auto-updated between `DOWNLOAD` markers) |
| `config/` | Company-specific configuration |
| `references/` | Methods and supporting knowledge |
| `templates/` | Output templates |
| `examples/` | Worked examples |

Only `SKILL.md` is mandatory. If a skill `README.md` exists, release automation keeps a download section between `<!-- DOWNLOAD_START -->` and `<!-- DOWNLOAD_END -->`.

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
- updates ZIP download sections in the root and skill READMEs
- deploys the searchable Skills Directory to GitHub Pages

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

**agenthouse / Neri GmbH**

- Website: https://agenthouse.org
- GitHub: https://github.com/agenthouse-org

---

<div align="center">

## Build agents that know how to work.

⭐ If you find these skills useful, consider starring the repository.

</div>
