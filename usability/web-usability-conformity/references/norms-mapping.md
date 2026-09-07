# Norms mapping

Cite public success-criterion IDs and titles only. Do not reproduce ISO/IEC 40500 PDF text.

## Primary technical target

| Norm | Role |
|---|---|
| **WCAG 2.2 Level A + AA** (W3C Recommendation, 12 December 2024) | Testable success criteria used by this skill |
| **ISO/IEC 40500:2025 Edition 2.0** | ISO/IEC publication of WCAG 2.2; identical technical content for the purposes of this skill |

Meeting WCAG 2.2 A+AA on the scoped pages means the technical bar of ISO/IEC 40500:2025 A+AA is met for those pages.

AAA is out of default scope.

## EN 301 549 (clause 9 — web)

EN 301 549 maps web requirements to WCAG via clause 9:

- EN `9.x.x.x` ↔ WCAG success criterion `x.x.x`
- Levels **A and AA** are the usual legal/procurement bar (AAA not generally required)

Version caveat (report both when relevant):

| EN 301 549 | WCAG reference | Notes |
|---|---|---|
| **V3.2.1** (2021) | WCAG **2.1** AA | Often still the Official Journal–cited reference for presumption of conformity |
| **V4.1.1** (2026) | WCAG **2.2** AA | Adds WCAG 2.2 web SCs; check whether OJ citation applies in the user’s jurisdiction |

### WCAG 2.2 AA web extras vs WCAG 2.1 AA

When reporting EN 301 549 coverage, note these WCAG 2.2 A/AA criteria (not in 2.1):

| WCAG | Level | EN 301 549 (clause 9) |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | 9.2.4.11 |
| 2.5.7 Dragging Movements | AA | 9.2.5.7 |
| 2.5.8 Target Size (Minimum) | AA | 9.2.5.8 |
| 3.2.6 Consistent Help | A | 9.3.2.6 |
| 3.3.7 Redundant Entry | A | 9.3.3.7 |
| 3.3.8 Accessible Authentication (Minimum) | AA | 9.3.3.8 |

WCAG **4.1.1 Parsing** is obsolete/void in WCAG 2.2; still run HTML validity as good engineering practice, but do not treat 4.1.1 as a required SC for 2.2 conformity.

**Implication:** Conforming to WCAG 2.2 AA implies WCAG 2.1 AA plus the six extras above (for content types in scope).

## BITV 2.0 (Germany — public sector)

- Barrierefreie-Informationstechnik-Verordnung points at **EN 301 549** for technical requirements.
- Applies primarily to **public bodies**.
- Extra duties (e.g. explanations in **Leichte Sprache** and **Gebärdensprache** on certain entry pages) are **separate** from WCAG SC tables. Mark them `not applicable` for typical private apps; evaluate when the user is a public-sector site.

## BFSG / EAA (Germany / EU — private sector)

- Barrierefreiheitsstärkungsgesetz implements the European Accessibility Act for many **consumer-facing** products and services.
- Technical bar for websites/apps is **EN 301 549** (not a separate SC list).
- Meeting WCAG 2.2 AA (and documenting EN clause 9 coverage) is the practical engineering target; legal applicability depends on product type, audience, and exemptions — escalate to counsel when asked for legal certainty.

## How to phrase “norms met”

Prefer factual wording:

> On the scoped pages, all applicable WCAG 2.2 Level A and AA success criteria were tested. Verdicts: N pass, M fail, K not applicable, H needs human confirmation. This aligns with ISO/IEC 40500:2025 A+AA for those pages. EN 301 549 clause 9 web criteria corresponding to WCAG 2.2 AA are [met / partially met]. BITV 2.0 extra homepage duties: [N/A | assessed]. BFSG applicability: [assumed in scope by user | not assessed legally].

Never claim:

- Certified BITV-Test result
- Automatic legal presumption of conformity
- “100% WCAG” based only on axe-core
