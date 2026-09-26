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
2. produces one HTML file that plays in the browser, with no video inside it;
3. uses about 15 seconds, four or five beats, and a held end card;
4. runs `node scripts/check-ad.mjs <file> --strict` and fixes failures;
5. opens the file and looks at the beats, not only the script output;
6. does not invent customers, ratings, prices, or results; and
7. does not export a video nobody asked for.

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
