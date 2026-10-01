# Positioning Brief

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** [positioning-brief-v0.1.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/positioning-brief-v0.1.0.zip)
- **Release:** [release-2026-10-01](https://github.com/agenthouse-org/skills/releases/tag/release-2026-10-01)
- **Install:** `npx skills add agenthouse-org/skills --skill positioning-brief`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "positioning-brief" for me.

Skill: positioning-brief v0.1.0 by agenthouse. Clarify who an offer is for, what it changes for them, and why they should believe it, then write a short positioning and messaging brief that other work can reuse.
Files: https://github.com/agenthouse-org/skills/tree/main/marketing/positioning-brief
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/positioning-brief-v0.1.0.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-10-01/positioning-brief-v0.1.0.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill positioning-brief
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the positioning-brief folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

Clarify who an offer is for, what it changes for them, and why they should believe it. The result is a one-page brief that copy, ads, landing pages, pitches, and campaigns can reuse.

## What it covers

- audience and the trigger that makes them look now;
- jobs, pains, and gains, and the alternatives they use today;
- the difference, the value it creates, and the proof, each with a source;
- a positioning statement, one promise, and a do-not-claim list;
- a story arc from a narrative framework: strategic narrative, PAS, BAB, ABT, or AIDA.

The agent reads the available sources first and asks only for what is missing, one question at a time, with a proposed answer to confirm or correct.

## Example prompts

```text
Use $positioning-brief. Write a brief for our new product from the website and the call notes in ./calls. Ask me only what you cannot find.
```

```text
Use $positioning-brief, then $motion-ad. Build the brief first, then a 15-second ad from its arc.
```

## Included smoke test

See [examples/smoke-test.md](examples/smoke-test.md).

---

EU AI Act disclosure: **AI MODIFIED**
