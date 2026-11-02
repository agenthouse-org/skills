# Blueprints

The scaffold has one story and five deterministic motion directions. Choose one with `new-ad.mjs --blueprint NAME`, then rewrite the copy, colors, and layout for the brief. A blueprint is a starting constraint, not a finished ad.

| Blueprint | Motion language | Best fit |
| --- | --- | --- |
| `calm` | Settled rises, a quiet field, chips and a rail | Default, considered product stories |
| `loud` | Scale and angle on arrival, moving chips | A starting point for bold launches; adjust tempo and color to suit |
| `orbit` | Angled headline arrival and rotating chip group | Spatial systems, platforms, ecosystems |
| `cascade` | Lateral headline entry, two-column chip cascade, stepped hand-off | Process, sequence, before/after stories |
| `dimensional` | Rotating 3D knot, lit in the accent color | Depth, physical forms and product storytelling; requires WebGL |

All blueprints read `--e`, `--m`, `--p`, and `--t` from the shared stage clock. They do not use wall-clock time, randomness, CSS keyframes, or transitions, so scrubbing and frame-accurate export remain stable.

To add a blueprint, add a named selector block to `templates/scene.css`, add it to the allowed list in `scripts/new-ad.mjs`, document its intended motion here, and add a scaffold/strict-check test. Keep the existing copy keys so the packer remains language-safe.
