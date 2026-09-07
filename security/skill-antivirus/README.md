# Skill Antivirus

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.3.0`
- **ZIP:** [skill-antivirus-v0.3.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-07/skill-antivirus-v0.3.0.zip)
- **Release:** [release-2026-09-07](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-07)
- **Install:** `npx skills add agenthouse-org/skills --skill skill-antivirus`
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
