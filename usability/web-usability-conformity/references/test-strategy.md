# Test strategy

## Goal

**100% conformity coverage** = every applicable WCAG 2.2 Level A and AA success criterion has:

1. A defined test method (automated, agent judgment, or human confirmation)
2. A recorded verdict with evidence

This is **not** “axe returned zero violations.”

## Dual layers (both mandatory)

```text
┌─────────────────────────────────────────┐
│  Technical: DOM / HTML / axe-core       │
│  scripts/audit.mjs → technical findings │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│  Visual / interaction: Playwright         │
│  keyboard, focus, reflow, targets, etc. │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│  Understandability: agent review        │
│  references/understandability.md        │
└─────────────────────────────────────────┘
```

Never claim conformity after only one layer.

## Automation classes

| Class | Meaning | Examples |
|---|---|---|
| **A** — Automated | Harness can pass/fail with high confidence | Missing `lang`, axe contrast, unlabeled input, duplicate `id` |
| **S** — Semi-automated | Tool flags candidates; agent confirms | Decorative vs informative `alt`, focus obscured by overlay |
| **M** — Manual / agent | Judgment required | Meaningful link purpose in context, caption quality, reading order vs visual order |
| **H** — Human confirmation | Expert or stakeholder needed | Live sign-language quality, legal applicability of BFSG exemptions |

See `sc-matrix.md` for the class of each SC.

## Harness workflow (Reach / Audit)

1. `npm install` in this skill folder (first run)
2. `npx playwright install chromium`
3. `node scripts/audit.mjs --url <URL> --out audit-report.json [--screenshots]`
4. Read JSON + any screenshot paths
5. Complete remaining SCs from `sc-matrix.md` using agent/browser judgment
6. Fill `templates/conformity-report.md`
7. If Reach: fix → re-run steps 3–6

### Fixtures (self-test)

```text
node scripts/audit.mjs --fixture fixtures/pass-basic.html --out /tmp/pass.json
node scripts/audit.mjs --fixture fixtures/fail-basic.html --out /tmp/fail.json
```

Expect `pass-basic` to have no critical harness fails; `fail-basic` to surface known defects (missing lang/alt/label, etc.).

## Maintain mode

Copy patterns into the **user’s** project (do not rely on this skill’s `node_modules` at runtime in CI forever):

Suggested artifacts:

- `tests/a11y/audit.spec.ts` (or `.mjs`) — axe + DOM checks on key routes
- `tests/a11y/keyboard.spec.ts` — tab order / focus visible on primary flow
- `tests/a11y/reflow.spec.ts` — 320 CSS px and/or 200% zoom smoke
- `package.json` scripts: `"test:a11y": "playwright test tests/a11y"`

Install browsers in the **target** project: `npx playwright install --with-deps chromium` (CI).

Do **not** ship Chromium inside the skill ZIP.

## Evidence rules

- Prefer machine output (JSON rule IDs, selectors) over vague prose
- On visual fails, keep a screenshot path in the report
- Quote minimal DOM snippets (attribute-level), not whole pages
- Mark `not applicable` with a one-line reason (e.g. “no video on scoped pages”)

## Honesty

- Partial automation ≠ full WCAG
- Passing fixtures ≠ the user’s product passes
- Norms “met” only when applicable SCs are `pass` or justified `not applicable`, with `needs human confirmation` listed as open risk
