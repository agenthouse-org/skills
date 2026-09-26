# Frontend Acceptance

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.2.0`
- **ZIP:** [frontend-acceptance-v0.2.0.zip](https://github.com/agenthouse-org/skills/releases/download/release-2026-09-26/frontend-acceptance-v0.2.0.zip)
- **Release:** [release-2026-09-26](https://github.com/agenthouse-org/skills/releases/tag/release-2026-09-26)
- **Install:** `npx skills add agenthouse-org/skills --skill frontend-acceptance`
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
