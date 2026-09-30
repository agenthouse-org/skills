# Positioning brief smoke test

Give an agent with this skill the following request:

```text
Use $positioning-brief. Write a brief for agenthouse DealDesk that we can use for a short ad.
Source: https://agenthouse.org/en/dealdesk/
```

The run passes when the agent:

1. reads the page before asking anything;
2. asks at most a few questions, one at a time, each with a proposed answer, or states its assumptions when told to skip;
3. names the audience, the trigger, and the current alternatives;
4. writes one positioning statement and one promise;
5. chooses a narrative framework, says why in one sentence, and writes the arc in three to six steps;
6. gives every proof point a source and keeps a do-not-claim list;
7. saves `brief.md` from the template and reports the open assumptions.

The run fails if it invents customers, results, or ratings, fills every framework mechanically, or writes the ad instead of the brief.
