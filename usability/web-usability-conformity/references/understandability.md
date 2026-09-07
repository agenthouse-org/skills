# Understandability

WCAG Principle 3 (**Understandable**) plus practical cognitive-load review. Complements Perceivable, Operable, and Robust checks.

## WCAG Principle 3 (A + AA in default scope)

| SC | Title | Level | What to verify |
|---|---|---|---|
| 3.1.1 | Language of Page | A | `html lang` correct |
| 3.1.2 | Language of Parts | AA | Passages in another language marked |
| 3.2.1 | On Focus | A | Focus does not trigger unexpected context change |
| 3.2.2 | On Input | A | Changing a setting does not unexpected-navigate without warning |
| 3.2.3 | Consistent Navigation | AA | Repeated nav in same relative order |
| 3.2.4 | Consistent Identification | AA | Same function → same label/icon pattern |
| 3.2.6 | Consistent Help | A | Help mechanisms (contact, chat, FAQ link) in consistent place when provided |
| 3.3.1 | Error Identification | A | Errors described in text |
| 3.3.2 | Labels or Instructions | A | Inputs have labels/instructions |
| 3.3.3 | Error Suggestion | AA | Suggestions when known, unless security risk |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | Review / confirm / reversible for high-stakes submissions |
| 3.3.7 | Redundant Entry | A | Do not re-ask info already provided in the same process (unless essential) |
| 3.3.8 | Accessible Authentication (Minimum) | AA | No cognitive function test for auth; allow paste, password managers, alternatives |

## Practical understandability checklist

Apply on every scoped page/flow:

1. **Purpose** — Within a few seconds, is it clear what this screen is for?
2. **Next action** — Is the primary action obvious and distinctly labelled?
3. **Labels** — Do control names match what users expect? Avoid vague “OK” / “Submit” when the verb can name the outcome.
4. **Errors** — Do messages say what failed and how to fix it?
5. **Jargon** — Are domain terms explained or avoided for the audience?
6. **Language match** — Visible language matches `lang` (and parts are marked).
7. **Predictability** — Navigation, help, and chrome stay consistent across the flow.
8. **Cognitive load** — Prefer short sentences, one idea per heading, progressive disclosure over walls of text.
9. **Auth** — Login does not rely on remembering a puzzle, transcription, or similar cognitive test (**3.3.8**).
10. **Help** — If help is offered, it appears in a consistent relative location (**3.2.6**).

## Gender-inclusive language — out of scope

**Do not enforce** gender-inclusive language (German *Gendern*, Gendersternchen `*innen`, Doppelpunkt-innen `:innen`, Binnen-I, or similar constructions).

- WCAG does **not** require inclusive/gendered forms.
- Do **not** fail, rewrite, or recommend changes solely to add gender-inclusive forms.
- Do **not** treat unmarked or generic masculine German as an accessibility or understandability defect.
- Prefer **readability**: clear, plain wording that the audience can scan and understand.
- If the user’s style guide already requires a specific voice, follow that guide for tone — but never invent a gender-language requirement from this skill.

Ignore debates about inclusive language; focus on WCAG Understandable criteria and cognitive load.

## Evidence for the report

For understandability findings, record:

- Page / flow
- Observation (specific)
- Related SC(s) if any
- Severity (blocking / major / minor)
- Suggested plain-language fix (without introducing gender-language requirements)
