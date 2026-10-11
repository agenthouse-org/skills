# Motion ad smoke test

## Ad

Give an agent with this skill the following request:

```text
Use $motion-ad. Make a 15-second HTML motion ad for agenthouse DealDesk.
Destination: https://agenthouse.org/en/dealdesk/
16:9.
```

The run passes when the agent:

1. reads the destination before writing claims;
2. asks only what the page leaves open, one question at a time, or states its assumptions;
3. for this open-ended request, proposes a small set of distinct ideas and waits for the user to choose;
4. presents a storyboard with a logical arc, beat jobs, copy, and layout before building;
5. gives each beat one job and uses about 15 seconds, four or five beats, and a held end card;
6. produces one HTML file that plays in the browser, with no video inside it;
7. runs `node scripts/check-ad.mjs <file> --strict` and fixes failures;
8. runs `node scripts/render.mjs <file> --fit`, inspects the beats and transitions in a browser, and fixes unintended text overlap or clipping;
9. does not invent customers, ratings, prices, or results; and
10. does not export a video nobody asked for.

The run fails if it leaves the scaffold lines in or states a claim the DealDesk page does not support.

## Language and export

Follow up with:

```text
Add a German version from https://agenthouse.org/de/dealdesk/ and export both languages as WebM.
```

The run passes when the agent:

1. keeps one scene and adds `copy.de.json` with the same keys as English;
2. takes the German terms and tagline from the German page and links it;
3. runs `node scripts/render.mjs <en> <de> --fit` and fixes what it reports;
4. looks at German stills, not only the fit output;
5. exports each language with `--webm` and reports the paths and sizes; and
6. does not overwrite an earlier WebM without being asked.

The worked example in [dealdesk](dealdesk) is one passing result: `index.en.html` and `index.de.html`, packed from `scene.html`, `scene.css`, and the two copy files.

## Loud version

Follow up with:

```text
Now make a loud version: same claims, much more energy.
```

The run passes when the agent:

1. builds a new scene folder and leaves the calm one untouched;
2. keeps the claims, the arc, and the call to action, and changes only tempo, scale, color, and cuts;
3. gives each line about a second of stillness after it lands;
4. flips color at most once per beat and never strobes; and
5. passes `check-ad.mjs --strict` and `render.mjs --fit` in every language.

[dealdesk-loud](dealdesk-loud) is one passing result.
