# Collaborative workflow

Use this workflow when the user is exploring a message or visual direction, or when a polished ad would be costly to revise. Skip stages the user has already completed. If the user asks for a one-shot result, do the work in one pass and state assumptions rather than forcing review gates.

## Start from evidence

Read the destination page and any supplied brief or brand references before proposing claims or design. Record only what those sources support: audience, problem, promise, proof, constraints, tone, action, brand colors, type, and available assets. Keep unknowns visible as questions or assumptions. Never let the model's fluency substitute for evidence.

Ask only for missing information that would change the ad. Ask one concise question at a time. When a key choice is open, make it easy to answer with a small set of concrete options and a recommendation.

## Explore ideas before execution

For an open-ended brief, present two or three genuinely different concepts. Each concept should fit in a few lines:

- **Idea:** the one change or insight the viewer should take away.
- **Arc:** how the message moves from opening to action.
- **Visual approach:** a specific, brand-grounded image, object, or motion principle.
- **Ending:** the supported call to action.

Explain the trade-off between concepts and recommend one. Do not present several cosmetic variations of the same idea. Wait for the user to choose or redirect before writing final copy or polished HTML. A complete user brief, an explicit “go ahead,” or a one-shot request is enough to proceed.

## Storyboard before polished HTML

Turn the selected idea into four or five beats. Use a compact table:

| Time | Beat job | On-screen copy | Frame / motion | Why it follows |
|---|---|---|---|---|

Keep one primary message per beat. The final column must describe a real progression, such as setup → turn → response → ask, not just say “next.” If two beats do the same job, combine or rewrite them. Avoid repeating a list of product categories in the setup, explanation, resolution, and end card unless each repetition adds meaning.

Before coding, sketch the key frame for every beat. Use a contact sheet or simple wireframe when visual tools are available; otherwise show a text layout such as `headline upper-left / product diagram right / supporting line below`. Name the copy and major elements, their relative placement, and any intentional overlap. The user should be able to assess the story and composition without reviewing implementation code.

Show the storyboard and wireframe together for feedback. Continue after the user's approval or instruction to proceed. If they request changes, revise the concept or storyboard first, then build from the accepted version.

## Build from the accepted plan

Treat the accepted storyboard as the source of truth. Keep beat order, claims, headline, visual hierarchy, and CTA aligned with it. If implementation reveals a real constraint, explain the trade-off and offer the smallest relevant change instead of silently changing the story.

Use the tools available in the current model and environment; do not assume every model can render HTML, inspect a browser, create images, or run scripts. Preserve the review goals when a tool is missing:

- With a browser and `render.mjs`, inspect settled frames and transitions, and run `--fit` for text collisions and clipping.
- Without a browser, use the static checker and fit checker if available, then report that visual inspection remains unverified. Ask for a screenshot or user preview only when it is needed to finish visual review.
- Without visual-authoring tools, use a text wireframe. Do not imply it is a rendered mockup.
- Use image generation only when it materially helps and is available; it does not replace the storyboard or evidence-based claims.

## Review logic and readability

Review the ad at three levels:

1. **Story:** Can someone understand why each beat follows the one before it, with sound off? Remove nonessential beats and unsupported claims.
2. **Frame:** At each settled beat, is the headline readable, is supporting copy subordinate, and are all elements within the stage? Mark deliberate overlaps; fix accidental overlaps.
3. **Hand-off:** At the transition, do outgoing and incoming elements collide, contradict each other, or leave an unreadable interval? Check the overlap itself, not only each beat in isolation.

Also check the first headline after it lands, the midpoint of the explanation, and the held end card. Keep the copy readable at the final display size. A passing script is evidence for the checks it performs, not proof that the story or visual design works.
