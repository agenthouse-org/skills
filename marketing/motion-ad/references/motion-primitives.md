# Motion primitives

Choose motion to communicate an idea: convergence for connection, a shape change for transformation, a burst for release, or a wipe for a hand-off. Anticipation, timing, follow-through and readable holds give motion weight; effects alone do not. The shared clock keeps the same pose during playback, seeking and export.

The shell includes optional CSS primitives. Use each on a separate wrapper when combining transforms; set `--motion` on the element carrying the class to a clamped value between 0 and 1. By default it reads the beat entrance `--e`. Use `--p` and a sub-window for an event later in a beat. These are building blocks, not standalone scenes.

```html
<div class="motion-reveal" style="--motion: clamp(0, (var(--p) - 0.2) / 0.25, 1)">Reveal</div>
<div class="motion-pop"><div class="motion-morph"></div></div>
<div class="motion-burst" aria-hidden="true">
  <i style="--dx: -120px; --dy: -90px; --spin: -90deg"></i>
  <i style="--dx: 140px; --dy: -70px; --spin: 120deg"></i>
</div>
```

Give burst children size, color, position and `--dx`/`--dy`; their entrance progress moves them outward and fades them. `motion-morph` changes a box into a circle and rotates it; it is not arbitrary SVG path morphing. `motion-orbit` rotates its element: offset a nested child from the transform origin to make it travel on a circular path. `motion-reveal` clips from left to right and `motion-pop` scales in. For draw-on lines use the existing `.draw` SVG helper. To create implosion, reverse the progress using `--motion: calc(1 - var(--e))`. Use the effect as decoration when it does not carry meaning, and keep critical text readable.

For more varied work, invent a scene-specific deterministic function of the stage clock: interpolate coordinates or path points, use staggered progress windows, and use fixed, authored particle offsets or a seeded sequence generated once. Never depend on fresh randomness, time, simulation history or independent animation loops. Inspect intermediate frames and beat hand-offs, not just the final still. Use no animation or flashing as a substitute for a reduced-motion end card.

## Optional 3D

Choose HTML/CSS/SVG for ordinary 2D scenes. For a 3D starting point, run `npm install` in the skill directory, then `node scripts/new-ad.mjs --dir ad --blueprint dimensional`. The packer bundles the pinned Three.js dependency only when the scene contains `<canvas data-motion-three>`. Put a scene-specific `scene-3d.js` alongside `scene.html`; the packer uses it instead of the stock renderer. It must expose `window.MotionAd3D.mount(stage)`, set the canvas `data-three-status` to `ready` or `unavailable`, and return `render(time, duration)` whose pose follows absolute time. Keep the WebGL fallback and disposal behavior shown in [the DealDesk 3D example](../examples/dealdesk-3d/scene-3d.js). Three.js is MIT licensed; the packer embeds its license in the output.

Producer mode: map each beat to a spatial action and meaningful object; use changing depth, scale, light, perspective and camera framing to show relationships and a clear narrative turn. For a bold request, choreograph decisive moves, lighting, spatial transitions and dimensional type rather than merely adding more decoration. Explore dimensional text with CSS perspective and extrusion, or actual 3D text when font licensing and implementation permit. Keep an accessible DOM equivalent and the intended language's actual copy; never put the only essential copy in WebGL. Avoid a single generic object spinning beside a sequence of flat slides. Place labels, objects and decorative geometry so they cannot unintentionally intersect or obscure one another throughout camera moves. Prototype and inspect arrivals, holds, transitions and the final card, including canvas edges and long translations. Adapt the 3D composition rather than using an unrelated stock form as the whole concept.

The object uses WebGL. If initialization fails, the underlying 2D field remains and `render.mjs --fit` reports the 3D failure. Verify playback, seeking, capture, reduced motion, and fallback in the target browser; rendered pixels may differ across GPUs. Never rely on the 3D object for essential text. Use `preserveDrawingBuffer` for captured frames. For more complex 3D animation, drive all object, camera and mixer state from absolute time; [AnimationMixer.setTime](https://threejs.org/docs/pages/AnimationMixer.html) supports this.

References: [IBM animation principles](https://www.ibm.com/design/language/animation/classic-principles/), [Three.js AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html), and [Three.js animation system](https://threejs.org/manual/en/animation-system.html).
