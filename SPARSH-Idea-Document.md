# SPARSH — Idea Document
### What we are building, how we are building it, and how it solves PS 26136 — point by point

---

## 1. The Problem, Restated Precisely

The problem statement gives two sides of the same failure:

**Departments** don't know how to buy innovation. They can write a tender for "500 laptops, ISO-certified vendor, 3 years' turnover" — but they can't easily write "we have an operational problem, we don't know the solution yet, and we want to try something new without betting the whole budget on it." Conventional procurement (GFR rules, tender formats, vendor eligibility) was built for standardized goods, not experimental pilots.

**Startups** can't sell to government even when they have the right solution. Turnover/experience thresholds disqualify them before they're even evaluated on merit. Sales cycles run 12–18 months with no visibility into what departments actually need. And even when they win work, payment often lags months behind delivery — which kills a startup's cash flow faster than losing the deal would.

The result: departments stay with safe, familiar vendors; startups stay out of government; genuinely useful innovation never gets tested, let alone scaled.

**The problem is not "there's no marketplace."** GeM already exists. GeM's Startup Runway already exists. DPIIT relaxations already exist on paper. **The problem is that no one has connected these into a single, enforced, low-friction pathway** — so each department reinvents the wheel, badly, every time it wants to try a startup solution.

---

## 2. The Exact Idea

**SPARSH is not a new marketplace. It's the missing connective layer between problem and proof.**

Concretely: a digital pipeline that takes a department from *"we have a problem"* to *"we have a paid, validated, and scale-ready startup solution"* in six enforced steps — Challenge Charter → AI Matching → Demo Day → Milestone Pilot (with escrow) → Independent Validation → Scale.

The idea has exactly three working parts. Everything else in the platform (dashboards, templates, notifications) exists only to support these three:

1. **A form that forces good problem statements.** Departments don't naturally write outcome-based problems — they write requirement lists. SPARSH's Challenge Charter is a structured wizard (Problem → Success Metric → Budget Ceiling → Timeline → Data Sensitivity) with AI feedback that rejects vague or unmeasurable inputs before publish. This single design choice is what makes everything downstream — matching, evaluation, validation — possible at all. Garbage charter in, garbage pipeline out; so we fix it at the source.

2. **An AI layer that shortlists startups with a reason, not just a score.** Departments won't trust a black-box ranking. So the matching engine (embeddings + Groq-generated justification) doesn't just say "Startup X: 87% match" — it says *why*: which part of the startup's stated capability overlaps with which part of the department's stated problem. That justification is what turns an AI suggestion into something a department officer can defend in a file note.

3. **Milestone-locked escrow so payment stops being the risk.** Every pilot is broken into 3–5 milestones before it starts. A startup gets paid when it submits evidence and the department verifies it — not when a finance department eventually processes a PO six months later. This is the single change that most directly answers the startup side of the problem statement ("unclear payment milestones," "cash-flow problems").

Nothing here requires inventing new legal authority. GFR Rule 173/174 already permits startup relaxations. GeM's Startup Runway already exists as a scale-up channel. Maharashtra's 2025 Startup Policy already funds pilots. **SPARSH's job is orchestration, not policy creation** — which is also exactly why it's fast to build and easy to defend as feasible.

---

## 3. How We Are Solving Each Part of the Problem Statement

| Problem statement said... | SPARSH's answer |
|---|---|
| Departments struggle to formulate outcome-based problem statements | Guided Charter wizard + real-time AI feedback that blocks vague success metrics before publish |
| Departments struggle to discover suitable startups | AI matching engine surfaces a ranked, justified shortlist automatically on publish — no manual searching |
| Departments struggle to evaluate novel technologies | Fixed, weighted evaluator rubric at Demo Day (technical fit, feasibility, cost realism, team capability) — structured scoring, not subjective gut calls |
| Departments struggle to structure controlled pilots | Pilot Setup screen forces milestone definition (3–5 milestones, amounts summing to budget ceiling) before a pilot can start — no undefined-scope pilots |
| Departments struggle to manage IP/data | Every Charter declares a data-sensitivity tier at creation; high-sensitivity pilots require a signed data/IP clause before the startup gets any data access — enforced by the workflow, not a policy document nobody reads |
| Departments struggle to measure pilot results | Independent validator (distinct from department and evaluator) submits a structured report against the original success metric — no self-graded pilots |
| Departments struggle to transition pilots into procurement/scale-up | Scale Decision screen auto-generates a GeM Startup Runway listing draft, so a successful pilot doesn't die in paperwork limbo |
| Startups struggle with prior-turnover/experience requirements | Eligibility screening auto-applies GFR Rule 173/174 relaxations at application time — startups aren't filtered out before they're even seen |
| Startups face long sales cycles with no visibility | Open Discover Challenges board — every published Charter is visible to every eligible startup, no relationship-gated tendering |
| Startups face unclear payment milestones | Milestones and amounts are defined and visible before the pilot starts — no ambiguity about what triggers payment |
| Startups face cash-flow problems from slow payment | Escrow ledger releases funds on verified milestone completion, not on a slow downstream finance cycle |
| Need for a transparent, competitive, legally compliant pathway | Every state transition (shortlist, score, verify, validate, scale) is logged in an immutable audit trail — any decision can be traced to a person, a timestamp, and a reason |

---

## 4. How We Are Proceeding (Execution Plan)

We are **not** building all six pipeline stages to production depth at once. We're building a thin, working slice through the *entire* pipeline first, because a judge/stakeholder needs to see the full journey — problem to paid, validated pilot — even in rough form, before any single stage deserves more polish.

### Phase 0 — Foundation (before any screen is built)
- Lock the data model (Charter, Application, Pilot, Milestone, EscrowLedgerEntry, ValidationReport — already specified in the SRS).
- Stand up FastAPI + PostgreSQL + pgvector, auth with role-based access (department / startup / admin / evaluator / validator).
- Wire the Groq client as an isolated service so it can be swapped or mocked without touching business logic.

### Phase 1 — Charter → Match (the trust-building half)
- Build the Charter wizard with AI feedback.
- Build the matching pipeline: embed Charter, cosine-similarity against startup capability vectors, Groq-generated justification per match.
- This phase alone proves the hardest technical claim in the pitch — that AI can meaningfully shortlist, with a reason a government officer can trust.

### Phase 2 — Demo Day → Pilot → Escrow (the accountability half)
- Build the evaluator rubric and scoring aggregation.
- Build the milestone builder and evidence submission/verification flow.
- Build the escrow ledger as a state machine (`reserved → released`), logged, not actually moving money yet — the state machine is the deliverable, real PFMS integration is a later, separate engineering task.

### Phase 3 — Validation → Scale (the proof half)
- Build the independent validator report flow.
- Build the Scale Decision screen and the auto-generated GeM listing draft.
- Build the public Success Registry, so the platform's value compounds — every scaled pilot becomes visible precedent for the next department considering a startup.

### Phase 4 — Cross-cutting hardening
- Audit logging on every transition (built incrementally alongside Phases 1–3, not bolted on after).
- Notifications (milestone due/overdue, shortlist ready, validation complete).
- Responsive pass per the responsiveness guide — startup portal mobile-first, department/admin desktop-first.

### What we deliberately mock, and why
- **DPIIT/Udyam/GST verification** — mocked as a verified/unverified flag for MVP. Real integration is a partnership/API-access problem, not a technical one, and shouldn't block proving the core pipeline.
- **PFMS fund movement** — the escrow *state machine* is what we build; actual money movement requires treasury-level integration that's out of scope for a prototype and doesn't change what we're proving.
- **GeM live listing** — we generate the structured draft; actually posting to GeM requires their API partnership, which is a post-selection integration conversation, not a build blocker now.

This sequencing means that at every checkpoint, we have a **complete, demoable pipeline** — just with a rougher edge on the stage we haven't reached yet — rather than one perfect stage and five empty ones.

---

## 5. Why This Actually Solves It (Not Just Automates It)

The problem statement's real ask isn't "digitize procurement paperwork" — it's "make departments comfortable trusting startups, and make startups comfortable trusting government payment." Both are trust problems, and SPARSH's three mechanisms are specifically trust mechanisms, not just efficiency mechanisms:

- The Charter wizard doesn't just save typing time — it forces the department to commit to a measurable outcome up front, so there's no room for "we didn't like it" as an unaccountable rejection reason later.
- The AI justification doesn't just rank startups — it gives the department officer a defensible reason they can put in a file note, which is what actually unblocks risk-averse decision-making in government.
- The escrow milestone system doesn't just track payments — it removes the single biggest reason startups avoid government contracts in the first place.

That's the idea: **use structure and enforcement, not just software, to convert an existing but unused legal/procedural pathway into one that departments and startups will actually walk.**
