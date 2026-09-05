# Frontend TTD

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** Published automatically with the next agenthouse Skills release.
- **Install:** `npx skills add agenthouse-org/skills --skill frontend-ttd`
<!-- DOWNLOAD_END -->

Make frontend work demonstrable, not merely plausible. This skill helps coding agents establish a design contract, define browser-visible acceptance criteria, exercise the actual UI, inspect screenshots, and return concise evidence.

It is deliberately browser-tool agnostic and self-contained. It uses only browser automation already available in the coding environment. Its included Markdown evidence record keeps proof alongside the project; it has no dependency on an external evidence service, package, framework, CLI, or document format.

## Install

```bash
npx skills add agenthouse-org/skills --skill frontend-ttd
```

Compatible agents that use the open `SKILL.md` convention can also install the published ZIP, or copy the `frontend-ttd` folder into their skills location. Common project locations include `.agents/skills/`, `.claude/skills/`, and `.gemini/skills/`.

## Example prompt

```text
Use $frontend-ttd to add a compact mobile navigation menu. Infer provisional design principles from the existing application, list the acceptance checks before editing, test the menu with a real browser at 375px and desktop width, inspect screenshots, and return the evidence record.
```

## Included smoke test

See [examples/smoke-test.md](examples/smoke-test.md) for a short, repeatable request that reveals whether an agent establishes a design contract before making changes and supplies browser-and-screenshot evidence afterward.

---

EU AI Act disclosure: **AI MODIFIED**
