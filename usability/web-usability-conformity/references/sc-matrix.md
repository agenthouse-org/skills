# WCAG 2.2 Level A + AA success-criterion matrix

Default scope for this skill. Titles are W3C public names. Test class: **A** automated, **S** semi-automated, **M** manual/agent, **H** human confirmation.

EN column: clause 9 id (`9.` + WCAG id).

## Perceivable

| SC | Title | Lvl | EN | Class | Test method |
|---|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | 9.1.1.1 | S | DOM: `img`/`svg`/`canvas`/icons have accessible name or are marked decorative; axe `image-alt`; agent: meaning of alt |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | 9.1.2.1 | M | Detect media; require transcript/alternative |
| 1.2.2 | Captions (Prerecorded) | A | 9.1.2.2 | M | Captions present for prerecorded video+audio; H for quality |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | A | 9.1.2.3 | M | AD or full text alternative for video |
| 1.2.4 | Captions (Live) | AA | 9.1.2.4 | M | Live captions if live audio present |
| 1.2.5 | Audio Description (Prerecorded) | AA | 9.1.2.5 | M | AD for prerecorded video |
| 1.3.1 | Info and Relationships | A | 9.1.3.1 | S | Headings, lists, tables, labels in DOM/ARIA; axe structure rules; agent: visual vs programmatic |
| 1.3.2 | Meaningful Sequence | A | 9.1.3.2 | M | DOM/reading order matches meaning; CSS order misuse |
| 1.3.3 | Sensory Characteristics | A | 9.1.3.3 | M | Instructions do not rely only on shape/color/location/sound |
| 1.3.4 | Orientation | AA | 9.1.3.4 | S | Content usable in portrait and landscape unless essential |
| 1.3.5 | Identify Input Purpose | AA | 9.1.3.5 | A | Autocomplete tokens on common personal data fields |
| 1.4.1 | Use of Color | A | 9.1.4.1 | S | Color not sole means; axe + visual check of charts/links |
| 1.4.2 | Audio Control | A | 9.1.4.2 | S | Auto-playing audio >3s has pause/stop/volume |
| 1.4.3 | Contrast (Minimum) | AA | 9.1.4.3 | A | axe `color-contrast`; spot-check text over images |
| 1.4.4 | Resize Text | AA | 9.1.4.4 | S | Zoom 200%; no loss of content/function |
| 1.4.5 | Images of Text | AA | 9.1.4.5 | M | Prefer real text; exceptions essential |
| 1.4.10 | Reflow | AA | 9.1.4.10 | S | Playwright ~320 CSS px width; no 2D scrolling for text except exceptions |
| 1.4.11 | Non-text Contrast | AA | 9.1.4.11 | S | UI component / graphic contrast; axe + visual |
| 1.4.12 | Text Spacing | AA | 9.1.4.12 | S | Override line/paragraph/letter/word spacing; no clipping |
| 1.4.13 | Content on Hover or Focus | AA | 9.1.4.13 | S | Hover/focus content dismissible, hoverable, persistent |

## Operable

| SC | Title | Lvl | EN | Class | Test method |
|---|---|---|---|---|---|
| 2.1.1 | Keyboard | A | 9.2.1.1 | S | Playwright keyboard-only path through primary flows |
| 2.1.2 | No Keyboard Trap | A | 9.2.1.2 | S | Tab/Shift+Tab escape all components |
| 2.1.4 | Character Key Shortcuts | A | 9.2.1.4 | M | Single-key shortcuts remappable/off or only when focused |
| 2.2.1 | Timing Adjustable | A | 9.2.2.1 | M | Time limits adjustable/extendable/off unless essential |
| 2.2.2 | Pause, Stop, Hide | A | 9.2.2.2 | S | Moving/blinking/scrolling/auto-updating can be paused |
| 2.3.1 | Three Flashes or Below Threshold | A | 9.2.3.1 | S | No content flashes more than 3/sec |
| 2.4.1 | Bypass Blocks | A | 9.2.4.1 | A | Skip link or landmarks/headings for repeated blocks |
| 2.4.2 | Page Titled | A | 9.2.4.2 | A | Non-empty descriptive `document.title` |
| 2.4.3 | Focus Order | A | 9.2.4.3 | S | Tab order preserves meaning/operability |
| 2.4.4 | Link Purpose (In Context) | A | 9.2.4.4 | M | Link text + context identifies purpose |
| 2.4.5 | Multiple Ways | AA | 9.2.4.5 | M | ≥2 ways to find pages (nav, search, sitemap) except process steps |
| 2.4.6 | Headings and Labels | AA | 9.2.4.6 | M | Headings/labels describe topic/purpose |
| 2.4.7 | Focus Visible | AA | 9.2.4.7 | S | Visible focus indicator on keyboard focus |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | 9.2.4.11 | S | Focused component not entirely hidden by author content (sticky/cookie) |
| 2.5.1 | Pointer Gestures | A | 9.2.5.1 | M | Multipoint/path gestures have single-pointer alternative |
| 2.5.2 | Pointer Cancellation | A | 9.2.5.2 | M | Down-event alone does not complete action (or undoable) |
| 2.5.3 | Label in Name | A | 9.2.5.3 | S | Accessible name contains visible label text |
| 2.5.4 | Motion Actuation | A | 9.2.5.4 | M | Device motion has UI alternative and can be disabled |
| 2.5.7 | Dragging Movements | AA | 9.2.5.7 | S | Dragging has single-pointer alternative unless essential |
| 2.5.8 | Target Size (Minimum) | AA | 9.2.5.8 | A | Targets ≥24×24 CSS px or spacing exception; Playwright boxes |

## Understandable

| SC | Title | Lvl | EN | Class | Test method |
|---|---|---|---|---|---|
| 3.1.1 | Language of Page | A | 9.3.1.1 | A | `html[lang]` present and valid |
| 3.1.2 | Language of Parts | AA | 9.3.1.2 | M | Foreign passages marked `lang` |
| 3.2.1 | On Focus | A | 9.3.2.1 | S | Focusing does not change context unexpectedly |
| 3.2.2 | On Input | A | 9.3.2.2 | S | Changing settings does not auto-submit unexpectedly |
| 3.2.3 | Consistent Navigation | AA | 9.3.2.3 | M | Repeated nav consistent across pages |
| 3.2.4 | Consistent Identification | AA | 9.3.2.4 | M | Same functions identified consistently |
| 3.2.6 | Consistent Help | A | 9.3.2.6 | M | Help mechanisms consistent when provided |
| 3.3.1 | Error Identification | A | 9.3.3.1 | S | Errors identified in text; axe forms |
| 3.3.2 | Labels or Instructions | A | 9.3.3.2 | A | Inputs have labels/instructions |
| 3.3.3 | Error Suggestion | AA | 9.3.3.3 | M | Suggestions when known |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | 9.3.3.4 | M | Review/confirm/reversible for high-stakes |
| 3.3.7 | Redundant Entry | A | 9.3.3.7 | M | No re-entry of same data in one process |
| 3.3.8 | Accessible Authentication (Minimum) | AA | 9.3.3.8 | S | No cognitive test; paste allowed; alternatives |

## Robust

| SC | Title | Lvl | EN | Class | Test method |
|---|---|---|---|---|---|
| 4.1.2 | Name, Role, Value | A | 9.4.1.2 | S | Custom controls expose name/role/value; axe ARIA |
| 4.1.3 | Status Messages | AA | 9.4.1.3 | S | Status messages via role/live regions without focus steal |

## Not required for WCAG 2.2 conformity

| Former SC | Note |
|---|---|
| 4.1.1 Parsing | Obsolete in WCAG 2.2. Still run `html-validate` as engineering hygiene; do not fail “WCAG 2.2 AA” solely on 4.1.1. |

## How to fill the report

1. For each row applicable to the scoped content, set verdict.
2. Mark media SCs `not applicable` when no audio/video in scope (state why).
3. Mark process-only SCs carefully (e.g. 2.4.5 exception for multi-step processes).
4. Use harness JSON for Class A/S evidence; document agent steps for M/H.
