# False positives and ambiguous cases

Heuristic hits are not proof of malice. Downgrade confidence or keep `REVIEW` when the behavior is purpose-aligned and narrowly scoped.

## Often benign

| Pattern | Why it may be OK | Still check |
|---|---|---|
| Documenting `curl` / HTTP APIs | Skill teaches an integration | Does it also send host secrets? |
| Reading `.env` in *your* project skill | Local app config workflow | Does it upload those values? |
| `pip install` / `npm install` of pinned known packages | Needed runtime | postinstall hooks? unexpected registry? |
| Mentions of “API key” in setup docs | User supplies their own key to a declared service | Harvesting language / broad file search? |
| `eval` in a programming-education snippet | Clearly sandboxed teaching content | Obfuscated payload + network? |
| Destructive words in incident-response docs | Describing threats, not instructing wipe | Imperative commands against user paths? |
| Base64 examples in encoding tutorials | Short, explained samples | Large opaque blobs with decode+exec? |

## Rarely benign

- Ignore/override safety or system instructions
- Collect tokens/cookies/clipboard *and* send off-host
- Download remote script and execute
- ZIP path traversal or symlink escape
- Persistence mechanisms unrelated to the skill’s job
- Inert antivirus test markers outside an intentional fixtures/self-test context

## Purpose mismatch rule

If the skill claims “summarize meeting notes” but contains webhook exfiltration or credential scraping, treat as `UNSAFE` even if individual strings could be explained in another product.

## Documentation vs instruction

Prefer evidence from imperative agent instructions and runnable scripts over threat-description prose. When prose is ambiguous, cite it at `low`/`medium` confidence rather than ignoring it.

## This skill’s own fixtures

`fixtures/eicar-test-skill` intentionally contains a `test-signature` marker. Scanning that path should flag it. Scanning the whole `skill-antivirus` skill root will also flag that fixture — expected, not a supply-chain incident in this repository.

## Assets vs executables

| Signal | Typical judgment |
|---|---|
| PNG/SVG icons shipped with a disclosure/labeling skill | `opaque-asset` / docs URLs → often `REVIEW` or dismiss with notes |
| Unexpected `.exe` / `.vbs` / `.hta` inside a markdown skill | `executable-payload` → `UNSAFE` until classic AV + human trust |
| README link to GitHub Releases ZIP | `network-or-download` docs → usually keep `REVIEW`, not `UNSAFE` |
