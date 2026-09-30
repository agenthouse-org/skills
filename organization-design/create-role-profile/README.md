# Create Role Profile

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** [create-role-profile-v0.1.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/create-role-profile-v0.1.0.zip)
- **Release:** [release-2026-09-30](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-30)
- **Install:** `npx skills add agenthouse-org/skills --skill create-role-profile`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "create-role-profile" for me.

Skill: create-role-profile v0.1.0 by Neri GmbH. Interview a user to define an organizational role, clarify its purpose, domains, responsibilities, authority, obligations, boundaries, requirements, holder, and approval, then create a professional role profile as DOCX or Excel.
Files: https://github.com/agenthouse-org/skills/tree/main/organization-design/create-role-profile
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/create-role-profile-v0.1.0.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/create-role-profile-v0.1.0.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill create-role-profile
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the create-role-profile folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

An organization-design skill that interviews users, clarifies accountability and decision rights, and creates a professional role profile as DOCX or Excel.

The model is derived from *Die Alpha Pyramide* by Valerio Neri and the accompanying NERI role-description templates.

## The profile covers

- role purpose and outcomes;
- bounded domains;
- requirements;
- responsibilities;
- information, decision, functional-direction, policy, control, and participation authority;
- quality-control, reporting, and approval obligations;
- interfaces, boundaries, holder, and approval.

## Example prompt

```text
Use the Create Role Profile skill to define a new Operations Lead role. Ask one important question at a time, identify missing or conflicting authority, and create the approved result as an Excel workbook.
```

---

EU AI Act disclosure: **AI MODIFIED**
