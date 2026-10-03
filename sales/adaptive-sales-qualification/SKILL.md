---
name: "adaptive-sales-qualification"
description: "Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process. Designed primarily for B2B sales and adaptable to high-consideration B2C, custom industries, geographies, products, sales cycles, and costs of sale."
version: 0.1.3
author: "Neri GmbH"
license: MIT
price: 0
tags:
  - sales
  - lead-qualification
  - opportunity-management
  - account-qualification
  - b2b
  - b2c
  - tender
  - buying-center
  - free
ai_disclosure: "AI MODIFIED"
---

# Adaptive Sales Qualification

Assess a lead, account, and opportunity separately and together. Produce four decisions: qualification status, pursuit priority, probability to close, and the next best verification action. Score evidence, not optimism. Framework-neutral; does not reproduce proprietary methodologies.

## Contents

- [When to use](#when-to-use)
- [Required files](#required-files)
- [Workflow](#workflow)
- [Review](#review)
- [Operating procedure](references/operating-procedure.md) — full phases, labels, guardrails, permissions
- [Qualification model](references/qualification-model.md)
- [Adaptation rules](references/adaptation-rules.md)
- [Probability model](references/probability-model.md)
- [Buying center](references/buying-center.md)
- [Tender assessment](references/tender-assessment.md) — when a tender or formal procurement is involved
- [Competitive assessment](references/competitive-assessment.md) — when competitors are known or likely
- [Assessment template](templates/assessment-output.md)

## When to use

Use when qualifying a lead, deciding whether an account is worth pursuing, verifying an opportunity, reviewing pipeline quality, preparing discovery, deciding whether to bid on a tender, or choosing continue / nurture / reduce effort / partner / refer / no-bid / abandon.

Do **not** use as legal or compliance advice; to manipulate or discriminate; to invent buying signals; or for low-value transactional purchases where qualification costs more than it saves.

Designed primarily for B2B; also for high-consideration B2C with meaningful cost, complexity, risk, or multiple participants.

## Required files

Read when available: `config/company-policy.md`, the reference files linked under Contents, and `templates/assessment-output.md`.

## Workflow

Copy and track:

```
- [ ] Localize language if needed
- [ ] Retrieve context (memory, CRM, policy) before asking
- [ ] Identify object: lead / account / opportunity / all three
- [ ] Select depth: Lightweight / Standard / Strategic
- [ ] Check hard rules first
- [ ] Assess evidence and discovery quality
- [ ] Ask only decision-relevant questions
- [ ] Score lead, account, opportunity, combined
- [ ] Estimate probability; evaluate seller economics
- [ ] Handle tender / competition if relevant
- [ ] Produce overview card, then deeper detail on request
- [ ] Offer config update only with explicit approval
```

Execute each checked step using [references/operating-procedure.md](references/operating-procedure.md). Infer end-user language first; translate questions and output when needed.

Primary status: Qualified / Conditionally qualified / Nurture / Disqualified / No-bid / Insufficient evidence. Priority: High / Medium / Low / Do not pursue.

## Review

Before delivering, confirm:

- [ ] Facts, buyer-reported, inferred, and unknown are labeled
- [ ] No invented budget, authority, urgency, or competitor
- [ ] Hard disqualifiers and contradictions are visible in the short overview
- [ ] Probability is a range when uncertainty is material
- [ ] Next action is the cheapest verification that could change the decision

## Quick start

```text
Assess this lead, account, and opportunity using the Adaptive Sales Qualification skill.

First retrieve relevant product, industry, geography, sales-cycle, buying-center, and company-policy context from available memory and sources. Ask only for information that could materially change the decision.

Provide qualification status, priority, probability to close, evidence confidence, key risks, missing evidence, opportunity-cost assessment, and the next best action.
```

---

EU AI Act disclosure: **AI MODIFIED**
