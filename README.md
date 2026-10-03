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

### Easiest: ask your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It shows you the skills, lets you pick, and installs them, or tells you how where it cannot:

```text
Please help me install agent skills from agenthouse.

Catalogue: https://agenthouse-org.github.io/skills/skills.json
Repository: https://github.com/agenthouse-org/skills

Steps:
1. Read the catalogue. List the skills grouped by category, each with its name and a one-line purpose. If I already named a skill or a task, suggest the matching ones first.
2. Let me pick one or more. Do not install anything I did not pick.
3. Tell me which agent you are and where you load skills from. Ask whether I want the skills for this project only or for all my projects, unless I already said.
4. For each skill I picked, follow its "agentPrompt" in the catalogue: install with "npx skills add agenthouse-org/skills --skill <name>" when you can run commands and Node.js 22.20 or newer is available; otherwise download its "downloadUrl" ZIP, check it against "checksumUrl", and extract it into your skills folder.
5. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIPs in this app instead.
6. Do not run any script from a skill during installation. For each skill, tell me in two sentences what it does and whether it needs extra tools.
7. Confirm where each skill is installed and show me one example prompt for each.
```

Every skill also has its own ready-made prompt: in its README under **Install with your agent**, in the **Agent install** column of the [skill table](#skill-table), and behind **Copy agent prompt** in the [Skills Directory](https://agenthouse-org.github.io/skills/).

### Load from ZIP URL

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
| Skill | Purpose | Version | Files | Download | Agent install |
|---|---|---:|---|---|---|
| [Frontend Acceptance](https://github.com/agenthouse-org/skills/tree/main/engineering/frontend-acceptance) | Design and verify frontend changes through explicit design principles, browser-driven acceptance tests, and screenshot evidence. Use when building or changing a web UI where visual quality, responsive behavior, accessibility, and proof of the delivered result matter. | `0.2.1` | [View](https://github.com/agenthouse-org/skills/tree/main/engineering/frontend-acceptance) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/frontend-acceptance-v0.2.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/engineering/frontend-acceptance#install-with-your-agent) |
| [Visual Plan](https://github.com/agenthouse-org/skills/tree/main/engineering/visual-plan) | Draft local wireframes and mermaid architecture diagrams before implementation. Use when a UI layout, data model, or API shape must be seen and decided before code, or when the user asks for a mockup, wireframe, ERD, UML, or visual plan. | `0.1.1` | [View](https://github.com/agenthouse-org/skills/tree/main/engineering/visual-plan) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/visual-plan-v0.1.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/engineering/visual-plan#install-with-your-agent) |
| [Ai Content Disclosure](https://github.com/agenthouse-org/skills/tree/main/governance/ai-content-disclosure) | Assess AI-generated and AI-modified content, determine applicable transparency disclosures, and apply visible disclosure labels and official EU AI icons in support of Article 50 of the EU AI Act. | `0.1.1` | [View](https://github.com/agenthouse-org/skills/tree/main/governance/ai-content-disclosure) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/ai-content-disclosure-v0.1.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/governance/ai-content-disclosure#install-with-your-agent) |
| [Build Innovation Capacity](https://github.com/agenthouse-org/skills/tree/main/innovation/build-innovation-capacity) | Help executives and founders understand where organizational attention is consumed, distinguish operational work from implementation and exploratory innovation, release capacity for unconventional ideas, and turn promising ideas into validated change using the Alpha Pyramid framework. Use for innovation stagnation, operational overload, strategy renewal, transformation reviews, organizational design, assumption testing, and leadership workshops. | `0.1.1` | [View](https://github.com/agenthouse-org/skills/tree/main/innovation/build-innovation-capacity) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/build-innovation-capacity-v0.1.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/innovation/build-innovation-capacity#install-with-your-agent) |
| [Motion Ad](https://github.com/agenthouse-org/skills/tree/main/marketing/motion-ad) | Build a browser-played HTML motion graphic for a product, idea, or message. One self-contained page per language with a timed stage, no video file inside, and an optional WebM export. Use when the user asks for a motion ad, motion design, kinetic typography, a launch graphic, a short animated ad for the web or social, or a translated or exported version of one. | `0.2.2` | [View](https://github.com/agenthouse-org/skills/tree/main/marketing/motion-ad) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/motion-ad-v0.2.2.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/marketing/motion-ad#install-with-your-agent) |
| [Positioning Brief](https://github.com/agenthouse-org/skills/tree/main/marketing/positioning-brief) | Clarify who an offer is for, what it changes for them, and why they should believe it, then write a short positioning and messaging brief that other work can reuse. Reads the available sources first, consults the user only on what is missing, and chooses a narrative framework such as strategic narrative, PAS, BAB, ABT, or AIDA. Use when the user asks for positioning, an ideal customer profile, a value proposition, key messages, a story line, or a brief for an ad, landing page, pitch, or campaign. | `0.1.1` | [View](https://github.com/agenthouse-org/skills/tree/main/marketing/positioning-brief) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/positioning-brief-v0.1.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/marketing/positioning-brief#install-with-your-agent) |
| [Create Role Profile](https://github.com/agenthouse-org/skills/tree/main/organization-design/create-role-profile) | Interview a user to define an organizational role, clarify its purpose, domains, responsibilities, authority, obligations, boundaries, requirements, holder, and approval, then create a professional role profile as DOCX or Excel. Use when designing roles, clarifying accountability, separating roles from job positions, preparing organizational changes, improving handoffs, hiring, onboarding, governance, or documenting decision rights. | `0.1.1` | [View](https://github.com/agenthouse-org/skills/tree/main/organization-design/create-role-profile) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/create-role-profile-v0.1.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/organization-design/create-role-profile#install-with-your-agent) |
| [Adaptive Sales Qualification](https://github.com/agenthouse-org/skills/tree/main/sales/adaptive-sales-qualification) | Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process. Designed primarily for B2B sales and adaptable to high-consideration B2C, custom industries, geographies, products, sales cycles, and costs of sale. | `0.1.3` | [View](https://github.com/agenthouse-org/skills/tree/main/sales/adaptive-sales-qualification) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/adaptive-sales-qualification-v0.1.3.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/sales/adaptive-sales-qualification#install-with-your-agent) |
| [Skill Antivirus](https://github.com/agenthouse-org/skills/tree/main/security/skill-antivirus) | Review agent skills (SKILL.md, skill folders, or ZIP packages) with deterministic static analysis plus LLM heuristic review of every file. Stages ZIPs read-only to temp, never executes content, and flags executables for classic antivirus. Dual-use CLI and agent orchestration. | `0.3.1` | [View](https://github.com/agenthouse-org/skills/tree/main/security/skill-antivirus) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/skill-antivirus-v0.3.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/security/skill-antivirus#install-with-your-agent) |
| [Web Usability Conformity](https://github.com/agenthouse-org/skills/tree/main/usability/web-usability-conformity) | Audit, reach, and maintain web usability and accessibility conformity against WCAG 2.2 Level AA (ISO/IEC 40500:2025), with EN 301 549, BITV 2.0, and BFSG mapping. Runs mandatory technical DOM/HTML tests and visual Playwright checks, plus understandability review. Use when the user asks for accessibility, WCAG, BITV, BFSG, EN 301 549, ISO 40500, usability conformity, keyboard/contrast audits, or Playwright a11y regression tests. | `0.1.1` | [View](https://github.com/agenthouse-org/skills/tree/main/usability/web-usability-conformity) | [ZIP](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-03-2/web-usability-conformity-v0.1.1.zip) | [Prompt](https://github.com/agenthouse-org/skills/tree/main/usability/web-usability-conformity#install-with-your-agent) |
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

Only `SKILL.md` is mandatory. If a skill `README.md` exists, release automation keeps a download section and the **Install with your agent** prompt between `<!-- DOWNLOAD_START -->` and `<!-- DOWNLOAD_END -->`. The prompt is built from the skill's frontmatter (`name`, `version`, `author`, `description`), so it never needs editing by hand.

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
- writes a copy-paste agent install prompt into every skill README and every Skills Directory card
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
