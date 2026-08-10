# Severity, confidence, and verdicts

## Severity

| Level | Meaning | Typical examples |
|---|---|---|
| `critical` | Likely to cause immediate severe harm if followed | Destructive wipe + exfiltration; remote code execution chain |
| `high` | Clear unsafe intent or high-impact capability | Prompt injection to override safety; secret harvest; persistence; path traversal |
| `medium` | Suspicious and needs human judgment | Network calls without clear need; obfuscation; nested archives; install hooks |
| `low` | Weak signal or low impact alone | Broad wording; single ambiguous URL in docs |

When unsure between two levels, choose the higher severity and lower confidence rather than burying the issue.

## Confidence

| Level | Meaning |
|---|---|
| `high` | Pattern is specific, evidence is clear, little benign explanation |
| `medium` | Plausible risk but could be legitimate skill behavior |
| `low` | Weak heuristic; include only if useful for the reviewer |

Known test signatures (`test-signature`) use **high** confidence that the marker is present, and explanations must state the payload is inert.

## Verdict rules

Compute a provisional verdict from findings, then allow the agent to escalate (never silently downgrade scanner evidence):

| Verdict | Rule |
|---|---|
| `CLEAN` | No findings after scanner + agent review |
| `REVIEW` | Only low/medium findings, or high findings with credible benign purpose that a human should confirm |
| `UNSAFE` | Any `critical` finding, or any `high` finding without a trusted, purpose-aligned justification |

Deterministic CLI default (no agent judgment):

- max severity ≥ `high` → `UNSAFE`
- any finding otherwise → `REVIEW`
- no findings → `CLEAN`

## Report fields (per finding)

Every finding should include:

- `category`
- `severity`
- `confidence`
- `path`
- `line` (when known)
- `evidence` (short excerpt)
- `explanation`
- `remediation`

## Overall confidence

- `high` if any finding has high confidence, or the package is clean after thorough review
- `medium` if findings exist only at medium/low confidence
- State residual uncertainty in the human report limitations section

## Advisory posture

`UNSAFE` means “do not trust/install without remediation,” not “this skill auto-blocked the package.” The scanner and agent must not install, delete, or quarantine user files unless the user explicitly asks for a separate action outside this skill’s default scope.
