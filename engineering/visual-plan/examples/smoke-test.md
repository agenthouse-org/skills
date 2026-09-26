# Visual Plan smoke test

Give an agent with this skill the following request for a small checkout change:

```text
Use $visual-plan. I need to see the empty cart before code, and the order records it writes. Do not implement.
```

The run passes when the agent:

1. asks or states the surface choice (wireframe, mermaid, both, neither) and picks both here;
2. writes a semantic HTML fragment for the empty cart and a mermaid `erDiagram` (or equivalent files);
3. lists open decisions with a recommended option;
4. does not edit application source; and
5. keeps the reply short unless asked for more.

The run fails if it dumps a long essay, invents a hosted review UI, treats the wireframe as pixel-accurate, or starts implementing.
