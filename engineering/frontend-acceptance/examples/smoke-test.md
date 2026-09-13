# Frontend Acceptance smoke test

Give an agent with this skill the following request in a small web application that has a homepage and a narrow viewport mode:

```text
Use $frontend-acceptance to change the homepage primary action from a text link to a button. Keep the existing product style. It must remain easy to find and use at 375px and desktop width.
```

The run passes when the agent:

1. finds existing design guidance or explicitly states that it is inferring provisional principles;
2. names observable functional, visual, responsive, and accessibility acceptance checks before implementation;
3. exercises the changed path in a real browser at both requested viewport classes;
4. captures and inspects screenshots, explaining what they show; and
5. identifies the automated checks run and any remaining gap instead of asserting success without evidence.

The run fails if it silently invents a design system, reports only a code-level test, or claims a screenshot inspection it did not perform.
