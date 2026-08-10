# Scan report template

Fill this for the human-readable verdict. Keep it concise.

```markdown
# Skill antivirus report

- **Input:** <path>
- **Verdict:** CLEAN | REVIEW | UNSAFE
- **Confidence:** high | medium | low
- **Scanner:** scripts/scan_skill.py (schema 1.x)
- **Agent review:** completed | partial | scanner-only

## Summary

<2–4 sentences: what was reviewed, main risks, install recommendation>

## Findings

| Severity | Confidence | Category | Location | Evidence | Remediation |
|---|---|---|---|---|---|
| high | high | prompt-injection | SKILL.md:12 | "Ignore all previous…" | Remove override language |

If none: _No findings._

## Agent notes

- Purpose alignment: <match | mismatch | unclear>
- Extra checks beyond scanner: <bullets>
- False-positive considerations: <bullets>

## Limitations

Static and heuristic analysis cannot guarantee the absence of malware. Submitted content was not executed and no network requests were made to exercise it. This result is advisory and does not by itself install, block, or quarantine the package.
```

## JSON

Prefer the scanner’s JSON (`schema_version`, `verdict`, `confidence`, `findings[]`, `limitations`). If the agent adds findings, keep the same field names and note `"source": "agent"` inside explanation or a parallel `agent_findings` array without dropping scanner rows.
