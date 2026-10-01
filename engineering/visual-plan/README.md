# Visual Plan

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** [visual-plan-v0.1.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/visual-plan-v0.1.0.zip)
- **Release:** [release-2026-10-01](https://github.com/agenthouse-org/skills/releases/tag/release-2026-10-01)
- **Install:** `npx skills add agenthouse-org/skills --skill visual-plan`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "visual-plan" for me.

Skill: visual-plan v0.1.0 by agenthouse. Draft local wireframes and mermaid architecture diagrams before implementation.
Files: https://github.com/agenthouse-org/skills/tree/main/engineering/visual-plan
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/visual-plan-v0.1.0.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/visual-plan-v0.1.0.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill visual-plan
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the visual-plan folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

Draft local wireframes and mermaid ERD/UML before implementation. Keep the conversation to a short Decide list. No hosted renderer or account is required.

## Example prompt

```text
Use $visual-plan for the empty-cart screen and the order records. Fidelity is wireframe. List open decisions with a recommended option.
```

## Included smoke test

See [examples/smoke-test.md](examples/smoke-test.md).

---

EU AI Act disclosure: **AI MODIFIED**
