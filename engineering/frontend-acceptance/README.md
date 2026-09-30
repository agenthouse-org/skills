# Frontend Acceptance

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.2.0`
- **ZIP:** [frontend-acceptance-v0.2.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/frontend-acceptance-v0.2.0.zip)
- **Release:** [release-2026-09-30](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-30)
- **Install:** `npx skills add agenthouse-org/skills --skill frontend-acceptance`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "frontend-acceptance" for me.

Skill: frontend-acceptance v0.2.0 by Neri GmbH. Design and verify frontend changes through explicit design principles, browser-driven acceptance tests, and screenshot evidence.
Files: https://github.com/agenthouse-org/skills/tree/main/engineering/frontend-acceptance
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/frontend-acceptance-v0.2.0.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/frontend-acceptance-v0.2.0.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill frontend-acceptance
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the frontend-acceptance folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

Make frontend work demonstrable, not merely plausible. This skill helps coding agents establish a design contract, define browser-visible acceptance criteria, exercise the actual UI, inspect screenshots, and return concise evidence.

It is deliberately browser-tool agnostic and self-contained. It uses only browser automation already available in the coding environment. Its included Markdown evidence record keeps proof alongside the project; it has no dependency on an external evidence service, package, framework, CLI, or document format.

## Install

Install the skill using the CLI:

```bash
npx skills add agenthouse-org/skills --skill frontend-acceptance
```

Alternatively, use the release ZIP linked above or copy `engineering/frontend-acceptance` from a checkout into your agent's supported skill directory.

This replaces `frontend-ttd`. Update explicit invocations to `$frontend-acceptance` and remove the previous installed skill after installing the replacement to avoid duplicate discovery. Existing installations are not automatically renamed. The acceptance method is unchanged.

## Example prompt

```text
Use $frontend-acceptance to add a compact mobile navigation menu. Infer provisional design principles from the existing application, list the acceptance checks before editing, test the menu with a real browser at 375px and desktop width, inspect screenshots, and return the evidence record.
```

## Included smoke test

See [examples/smoke-test.md](examples/smoke-test.md) for a short, repeatable request that reveals whether an agent establishes a design contract before making changes and supplies browser-and-screenshot evidence afterward.

---

EU AI Act disclosure: **AI MODIFIED**
