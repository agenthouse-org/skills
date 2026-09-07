# Web Usability Conformity

<!-- DOWNLOAD_START -->
## Download

- **Version:** `0.1.0`
- **ZIP:** _Published on the next `release-*` tag_
- **Release:** _Pending first release including this skill_
- **Install:** `npx skills add agenthouse-org/skills --skill web-usability-conformity`
<!-- DOWNLOAD_END -->

An AgentHouse skill to **reach** and **maintain** web usability and accessibility conformity.

## Default target

- **WCAG 2.2 Level A + AA** (W3C)
- **ISO/IEC 40500:2025 Edition 2.0** (same technical content as WCAG 2.2)
- Mapping to **EN 301 549** clause 9, **BITV 2.0**, and **BFSG**

“100% conformity” means every applicable A+AA success criterion has a test path and a recorded verdict — not “axe found zero issues.”

## Capabilities

- Dual mandatory test layers: **technical** (DOM / HTML / axe-core) and **visual** (Playwright interaction)
- Full WCAG 2.2 A+AA matrix with automation class per criterion
- Understandability review (Principle 3 + cognitive load)
- Explicit **non-enforcement** of gender-inclusive language (keeps readability first)
- Norms-met reporting with legal caveats
- Reach (fix + retest) and Maintain (project regression tests) modes

## Install

```bash
npx skills add agenthouse-org/skills --skill web-usability-conformity
```

## Harness

From this skill folder:

```bash
npm install
npx playwright install chromium
node scripts/audit.mjs --url http://localhost:3000 --out audit-report.json --screenshots
```

Self-test against fixtures:

```bash
npm run self-test
```

Browsers are **not** shipped inside the skill ZIP; install Playwright browsers at run time.

## Structure

| Path | Purpose |
|------|---------|
| `SKILL.md` | Agent instructions |
| `references/norms-mapping.md` | WCAG / ISO / EN / BITV / BFSG |
| `references/sc-matrix.md` | Success criteria and test methods |
| `references/understandability.md` | Understandable + gender-language policy |
| `references/test-strategy.md` | Dual-layer strategy and maintain mode |
| `scripts/audit.mjs` | Dual-layer audit harness |
| `fixtures/` | Pass/fail HTML self-tests |
| `templates/conformity-report.md` | Report template |

## Scope notes

- Not a certified BITV-Test or legal advice
- AAA out of default scope
- Do not copy ISO PDF text into projects; cite SC IDs/titles only

## License

MIT
