# Craft

The piece should feel directed. A fade between centered lines is not a motion ad.

Every choice needs a reason you can name: the brand, the audience, or the message. A color, a move, or a shape picked because it looked good by default is what makes an ad look generated. When you cannot say where a choice came from, replace it with one you can.

## Time

15 seconds unless the user asks for another length. Four or five beats. One idea on screen.

Give a line enough time to be read out loud once, then a short hold. A four-word headline wants about a second and a half of clear time. Entrances sit around 0.6–0.9s. Exits around 0.3s. Overlap the exit of one beat with the entrance of the next so the stage never goes empty.

Burst, then hold. After each key arrival, leave 0.4–0.8s of stillness or slow drift before the next move. A beat where nothing moves at all is a slide; a beat where everything moves at once is noise.

The end beat holds. Do not loop unless asked.

## Type

Two sizes do the work: a display line and a quiet line under it. Two lines is usually the maximum. At 1920px wide, display type is roughly 120–180px and font-weight 700, with at least 72px of margin. If a beat still looks like a document, the type is too small or the field is too empty. Use a full-bleed color change when the idea changes.

Mark one accent, not the whole sentence. The accent is a color or a weight, and it has to be a word that deserves it.

Uppercase is for kickers, widely tracked, not for headlines.

Type lives where the eye already is. Do not park a headline at the top edge while the action happens lower down.

Design for the longest language first. A layout that only fits English breaks in German. Leave about a third of spare width in every fixed box, keep masked lines on one line (`.ln` does not wrap), and let `data-fit` take up the rest. If `data-fit` has to drop below about 70%, rewrite the line or widen the box instead.

## Motion

Use two or three moves in the whole piece, repeated on purpose:

- Words that rise and settle, staggered
- A rule that draws on (`scaleX` from the left)
- Parts that start aligned and drift apart
- A row of steps that locks onto a line
- A circle that opens into the end card

`--m` settles with a light overshoot of about 4%. Use it on `transform` only. Keep opacity on `--e` or on the stagger's `--c`. Bigger bounce belongs to a character or mascot, never to type or interface.

Give the piece one recurring element the brand already owns: the logo mark, a signature button, a product state. Build it once and reuse it, so the eye has something to follow across beats. Holding the accent color back until the turn, then letting it appear first on that element, makes the turn land.

Background shapes move less than the type. The field can drift off `--t`. The headline should not.

Hard cuts are fine when the idea changes (the old way, then the new way). Do not cross-fade two headlines that occupy the same spot.

The best hand-off between beats is a match: the object leaving one beat becomes the object entering the next, in the same place or shape. A wipe is the next best choice when it comes from the brand or the story (a card sliding, a button opening). Nothing should appear or vanish within a frame or two.

Allowed properties for story motion: `transform`, `opacity`, `clip-path`. No layout animation. No `@keyframes`. No `transition` on the story.

## Techniques

CSS order is `clamp(min, value, max)`. Write `clamp(0, expr, 1)`. `clamp(expr, 0, 1)` does not cap at 1; the checker rejects it.

A sub-window of the clock: `--k: clamp(0, (var(--p) - 0.3) / 0.1, 1)` runs from 0 to 1 between 30% and 40% of the beat. Ease it with `calc(var(--k) * (2 - var(--k)))` or smoothstep `calc(var(--k) * var(--k) * (3 - 2 * var(--k)))`.

**Masked line.** `<span class="ln" style="--d: 0.2"><span>Line</span></span>`. The inner span rises out of a clip. `--win` sets how long it takes. Keep `--d + --win` under 1, or the line never lands. For a word that builds letter by letter, give each letter span its own `--d` and a shorter `--c` window.

**Wipe between beats.** The next beat enters on top and clips itself open: `clip-path: inset(calc((1 - var(--wp)) * 100%) 0 0 0)` (up), `inset(0 calc((1 - var(--wp)) * 100%) 0 0)` (across), or `circle(calc(var(--wp) * 150%) at 80% 50%)`. Use `--wp: clamp(0, var(--e) * 1.6, 1)` so the wipe is fast while the copy inside keeps settling. Keep the old beat on (`data-out` after the wipe closes) so there is never a gap. Change the background color at every wipe.

**Drawn line.** An SVG path with `pathLength="1"` and `class="draw"` draws from `--k`. A moving packet is a short dash: `stroke-dasharray: 0.03 2; stroke-dashoffset: calc(var(--k) * -0.97)`. Put cards above the line so it only shows in the gaps.

**Things that light up as the line passes.** Give each item its position on the line (`--f`) and light it with `clamp(0, (var(--k) - var(--f) + 0.01) * 30, 1)`.

**Product demo.** Build the interface in HTML, not a screenshot you do not have. Toggles, a number slot (`translateY(calc(var(--n) * -1em))`), a total that grows, a button that presses and turns. A cursor moves between exact stage coordinates as a sum of eased segments. Label it "Illustration" when it is not the real product.

**Hand-off.** End on the element that just acted. The last circle wipe can grow out of the button that was clicked.

## Loud register

Loud is a delivery, not a different message. The words, the claims, and the arc stay; tempo, scale, and color go up. [examples/dealdesk-loud](../examples/dealdesk-loud) is the DealDesk piece from the same copy.

What changes:

- **Tempo.** Entrances land in 0.15–0.3s. Beats cut hard: the next beat enters on top with an opaque background, overlapping the last by about 0.05s, with no fade.
- **Scale.** Display type at 200–300px, one line or one word filling the frame. Several short words can pile up across the frame on purpose.
- **Color.** A full-bleed flip at every beat, from the brand palette only. Four or five flips in 15 seconds, never a strobe.
- **Angle.** Small tilts (±3–8°) on stickers and bands. Headlines people must read stay level or close to it.

What does not change:

- Each line still gets its reading time after it lands: about a second for a short headline. Loud is fast in, then still.
- One accent, one call to action, the end card holds calm enough to read the URL.
- No bounce. The punch comes from scale, cuts, and color, not from overshoot eases.
- No more than three full-frame flashes in any one second. Large, bright color flips count as flashes.
- The reduced-motion path still holds the end card.

Techniques:

**Slam.** The element starts oversized and lands in a few frames: `--s: clamp(0, (var(--p) - var(--d)) / 0.05, 1)`, eased with `--se: calc(1 - (1 - var(--s)) * (1 - var(--s)) * (1 - var(--s)))`, then `transform: scale(calc(1 + (1 - var(--se)) * 1.6)); opacity: clamp(0, var(--s) * 4, 1)`. Put `data-fit` on the slamming element itself.

**Pile.** Short words on solid stickers slam in one after another, each at its own spot and tilt, until the frame is full. Then one band slams across them with the actual line. Each sticker has its own background, so the fit check treats the pile as separate boxes.

**Impact.** When the key line lands, knock the whole sheet for a few frames: a small translate, a fraction of a degree, and a 5% scale so no edge shows. It decays within about 0.2s.

**Split headline.** Render the headline twice, in a top half and a bottom half that each clip it, so together they read as one line. Then drive the halves apart and let the next line appear in the gap. Mark the second copy `aria-hidden`.

**Snap sequence.** Instead of showing a row of steps, show one step word at a time in the same spot, each pushing the last one out sideways in a few frames, while a rail below fills node by node. Hold the last step.

**Pressed button.** A big button, a cursor that arrives, a press of a few pixels, the label turning, and a stamp slamming across it. Then the end card opens out of the button.

## What to cut

- A full-bleed gradient with a centered sentence and a fade
- Radial glows, spotlight orbs, and vignettes as a backdrop
- CSS filters (`grayscale`, `sepia`, `saturate`, `hue-rotate`) standing in for a color world. Author the colors.
- Soft drop shadows on cards and panels. Give containers a border and flat color; only things that get pressed have depth.
- A grid of cards or icons standing in for an explanation
- More than one call to action
- A fake rating, a fake customer, a fake "10×"
- Emoji, exclamation marks, or a tone the brand does not use
- Photos you cannot trace to the user or the live site
- Any beat that needs sound to make sense

## Review

Scrub, do not only watch. At each of these moments the frame should still make sense as a poster:

- Just after the first headline has settled
- The middle of each later beat
- The hold on the end card
- The overlap between two beats

Look for type leaving the frame, chips covering the headline, two beats saying different things at once, gray text too small to read, and a last frame that does not say what to do.

`?present=1` is the clean frame. The control bar is for review, not part of the ad.

Review every language, not just the first one. `render.mjs --fit` catches clipped and overlapping text. It does not catch a translation that lands the accent on the wrong word or a headline that now needs three lines.
