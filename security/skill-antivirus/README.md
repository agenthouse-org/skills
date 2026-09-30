# Skill Antivirus

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.3.0`
- **ZIP:** [skill-antivirus-v0.3.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/skill-antivirus-v0.3.0.zip)
- **Release:** [release-2026-09-30](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-30)
- **Install:** `npx skills add agenthouse-org/skills --skill skill-antivirus`

### Install with your agent

Copy this prompt into your AI agent (Claude Code, Codex, Cursor, Gemini CLI, or a chat app). It installs the skill or, where it cannot, tells you how:

```text
Please install the agent skill "skill-antivirus" for me.

Skill: skill-antivirus v0.3.0 by AgentHouse. Review agent skills (SKILL.md, skill folders, or ZIP packages) with deterministic static analysis plus LLM heuristic review of every file.
Files: https://github.com/agenthouse-org/skills/tree/main/security/skill-antivirus
ZIP: https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/skill-antivirus-v0.3.0.zip
SHA-256: https://github.com/agenthouse-org/skills/releases/download/release-2026-09-30/skill-antivirus-v0.3.0.zip.sha256

Steps:
1. Tell me which agent you are and where you load skills from. Ask whether I want it for this project only or for all my projects, unless I already said.
2. If you can run shell commands and Node.js 22.20 or newer is available, run:
   npx skills add agenthouse-org/skills --skill skill-antivirus
3. Otherwise download the ZIP, compare its SHA-256 with the checksum file, and extract the skill-antivirus folder into your skills folder (for example .claude/skills/, .agents/skills/, .gemini/skills/, or .cursor/skills/).
4. If you cannot run commands or write files, give me short step-by-step instructions for adding the ZIP in this app instead.
5. Do not run any script from the skill during installation. Read its SKILL.md and tell me in two sentences what it does and whether it needs extra tools such as Node.js, Python, or a browser.
6. Confirm where it is installed and show me one example prompt to start using it.
```
<!-- DOWNLOAD_END -->

An AgentHouse security skill that statically reviews untrusted agent skills before you install or trust them.

Dual-use:

- **Agent orchestration** — static scan + LLM heuristic review of every file (ZIP staged read-only)
- **CLI scanner** — deterministic static analysis with human + JSON output

It never executes submitted skill code, never auto-uploads samples, and does not automatically block installs (advisory only).

## Capabilities

- scan `SKILL.md`, skill directories, and ZIP packages
- `--stage` safely extracts ZIPs to a temp dir for full-file LLM review
- detect prompt injection, secret harvest, exfiltration, unsafe scripts, dependency/install hazards, executables, and archive attacks
- flag `.exe` / `.vbs` / `.hta` / etc. for classic antivirus (optional user-consented VirusTotal hint)
- emit `CLEAN`, `REVIEW`, or `UNSAFE`
- self-test via an inert EICAR-style fixture (text only)

## Install

```bash
npx skills add AgentHouse-org/skills --skill skill-antivirus
```

## CLI

```bash
python scripts/scan_skill.py path/to/SKILL.md
python scripts/scan_skill.py path/to/skill-folder --json-out scan.json
python scripts/scan_skill.py path/to/skill.zip --stage --json-out scan.json
```

stdlib only — no third-party packages, no network. See `references/containment.md`.

## Self-test fixture

```bash
python scripts/scan_skill.py fixtures/eicar-test-skill --json-out eicar-scan.json
```

The fixture is inert text modeled on the EICAR antivirus test concept. It must never be executed or uploaded as malware.

## Layout

| Path | Role |
|---|---|
| `SKILL.md` | Agent entry / orchestration |
| `scripts/scan_skill.py` | Deterministic scanner |
| `references/` | Taxonomy, verdicts, checklist, false positives |
| `templates/scan-report.md` | Human report shape |
| `examples/` | Worked reviews |
| `fixtures/eicar-test-skill/MARKER.md` | Inert detection self-test (not a second `SKILL.md`) |

## Limitations

Static analysis cannot guarantee the absence of malware. Treat `UNSAFE` as “do not trust without remediation,” not as automatic enforcement.

---

EU AI Act disclosure: **AI MODIFIED**
