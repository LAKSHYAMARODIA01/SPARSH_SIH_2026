# SPARSH — Startup Procurement, Acceleration, Risk-sharing & Scaling Hub
### Software Requirements Specification (SRS) & Platform Blueprint
**SIH 2026 · PS ID 26136 · Government of Maharashtra — MSInS, DSEEI**
**Proposed Stack:** Next.js (App Router) · FastAPI · PostgreSQL + pgvector · Shadcn/UI · Groq (LLM inference)

---

## 1. What we are actually building (in plain terms)

Forget "portal" — SPARSH is a **workflow engine with six locked stages**, not a generic CRUD app. Every problem statement, startup, pilot, and payment moves through the same pipeline, and the platform's entire job is to make each stage transparent, auditable, and fast:

```
1. Challenge Charter → 2. AI Shortlist → 3. Demo Day → 4. Milestone Pilot (Escrow) → 5. Independent Validation → 6. Scale-up
```

Three actors use one shared system, each seeing a different slice of it:

| Actor | What they do on SPARSH |
|---|---|
| **Department (Govt.)** | Posts an outcome-based problem, reviews AI-shortlisted startups, scores demos, defines pilot milestones, approves payments, reads validation reports, decides to scale. |
| **Startup** | Discovers open challenges, applies with eligibility proof (DPIIT/Udyam/GST), pitches at Demo Day, executes pilot against milestones, submits evidence, gets paid from escrow. |
| **MSInS Admin / Evaluator / Validator** | Configures challenge templates, manages eligibility rules, runs the jury workflow, assigns independent validators, monitors escrow, publishes scale-up decisions, and views cross-department analytics. |

The single biggest technical risk in the original problem statement is **trust** — departments don't trust unproven vendors, and startups don't trust slow, opaque government payment cycles. SPARSH's actual product bet is: **make every step state-machine-driven and every payment milestone-triggered**, so trust is enforced by the system, not by relationships.

---

## 2. Core Product Idea (the differentiator)

Most procurement portals are e-marketplaces (catalogs + PO). SPARSH is different — it is a **pilot-first innovation pipeline** with three concrete mechanisms that make it a real, buildable product rather than a slide:

1. **Challenge Charter Builder** — a guided form (not a blank text box) that forces departments to write outcome-based problem statements using a fixed template: Problem → Success Metric → Budget Ceiling → Pilot Duration → Data/IP Sensitivity Level. This structured input is what makes AI matching and evaluation possible later.
2. **AI Matching Engine (Groq-powered)** — turns each Challenge Charter into an embedding, matches it against a startup capability index (self-declared + DPIIT/GeM data), and uses a Groq-hosted LLM to generate a **ranked shortlist with a plain-language justification** for each match ("why this startup fits this problem"), not just a similarity score.
3. **Escrow-Linked Milestone Contracts** — every pilot is broken into 3–5 milestones at creation time. Funds for each milestone are marked (virtually, via a ledger — real fund custody happens through PFMS/treasury integration) and released only when: (a) startup submits evidence, (b) department verifies, (c) system auto-checks the milestone's due date/SLA. This removes "startup did the work but payment is stuck for 6 months" — the single most common startup complaint in public procurement.

Everything else (dashboards, notifications, document templates) exists to support these three mechanisms.

---

## 3. Tech Stack & Why

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | **Next.js 15 (App Router) + TypeScript** | Server components for dashboard-heavy pages, route groups per role (`/dept/*`, `/startup/*`, `/admin/*`), built-in API proxying to FastAPI. |
| UI Kit | **Shadcn/UI** | You're supplying your own `design.md` — Shadcn is unstyled-by-default (Radix primitives + Tailwind), so your design tokens drop in cleanly without fighting a themed component library. |
| Backend | **FastAPI (Python 3.12)** | Async-native, Pydantic v2 for strict schema validation (critical for legally-binding Challenge Charters and eligibility data), auto-generated OpenAPI docs for integration partners (GeM/DPIIT teams). |
| Database | **PostgreSQL 16 + pgvector extension** | Relational integrity for contracts/milestones/payments (this data cannot be eventually-consistent) + vector column for AI matching embeddings — no separate vector DB needed at this scale. |
| AI Inference | **Groq API** (Llama 3.3 70B or similar hosted model) | Used for: (a) embedding generation for matching, (b) shortlist justification generation, (c) Challenge Charter quality scoring/feedback, (d) evaluator scoring assistance. Groq's low-latency inference matters because shortlist generation is a synchronous, user-facing action (department clicks "Generate Shortlist" and waits). |
| Auth | **NextAuth (Auth.js) on frontend + JWT verified by FastAPI**, roles: `department_officer`, `startup_founder`, `msins_admin`, `evaluator`, `validator` | RBAC is non-negotiable — this is a government system handling procurement decisions. |
| File/Doc Storage | S3-compatible object storage (or MahaMeghraj state cloud storage) | Pilot evidence, pitch decks, contracts, validation reports. |
| Background Jobs | **Celery + Redis** (or FastAPI `BackgroundTasks` for MVP) | Milestone due-date reminders, escrow release triggers, embedding re-indexing. |
| Payments (simulated for hackathon scope) | Escrow ledger table + PFMS integration stub | Real fund movement is out of scope for a prototype; the ledger *state machine* is what you build and demo. |

---

## 4. System Architecture (high level)

```
┌─────────────────────────────┐
│  Next.js App (Vercel/Node)  │
│  /dept  /startup  /admin    │
│  Shadcn UI + your design.md │
└──────────────┬───────────────┘
               │ REST (JSON) — typed via OpenAPI codegen
┌──────────────▼───────────────┐
│         FastAPI Backend       │
│  Routers: charters, startups, │
│  matching, evaluations,       │
│  pilots, escrow, validation   │
├───────────────────────────────┤
│  Services layer (business     │
│  rules, state machine guards) │
├───────────────────────────────┤
│  Groq client (async) ─────────┼──► Groq API (LLM + embeddings)
├───────────────────────────────┤
│  SQLAlchemy 2.0 + Alembic     │
└──────────────┬────────────────┘
               │
     ┌─────────▼──────────┐
     │ PostgreSQL+pgvector │
     └─────────────────────┘

External integration stubs (mocked for MVP, real for production):
GeM Startup Runway API · DPIIT Startup India registry · Udyam/GST verification · PFMS payment gateway
```

**Key architectural decision:** the pipeline stages are implemented as an explicit **state machine per Challenge** (not just a status enum). Illegal transitions (e.g., releasing a milestone payment before evidence is verified) are rejected at the service layer, not just hidden in the UI. This is the part of the system that actually earns government trust in a demo.

---

## 5. Data Model (core entities)

```
Department (id, name, ministry, contact_officer_id)
User (id, role, name, email, org_id, verified)
Startup (id, name, dpiit_number, udyam_number, gstin, sector_tags[], capability_embedding[vector], verified_status)

ChallengeCharter (
  id, department_id, title, problem_description,
  success_metric, budget_ceiling, pilot_duration_days,
  data_ip_sensitivity ENUM(low, medium, high),
  status ENUM(draft, published, shortlisting, demo_scheduled,
              piloting, validating, scaled, closed),
  charter_embedding[vector], created_at
)

Application (id, charter_id, startup_id, pitch_deck_url, eligibility_snapshot JSON, status)

ShortlistResult (id, charter_id, startup_id, match_score, ai_justification TEXT, rank)

DemoEvaluation (id, application_id, evaluator_id, score, notes, criteria_breakdown JSON)

Pilot (id, charter_id, startup_id, contract_url, ip_clause_type, start_date, end_date, status)

Milestone (id, pilot_id, title, description, due_date, amount,
           status ENUM(pending, evidence_submitted, verified, paid, overdue))

MilestoneEvidence (id, milestone_id, submitted_by, file_urls[], notes, submitted_at)

EscrowLedgerEntry (id, pilot_id, milestone_id, amount, type ENUM(reserved, released, refunded), timestamp)

ValidationReport (id, pilot_id, validator_id, outcome ENUM(pass, conditional, fail), report_url, metrics JSON)

ScaleDecision (id, pilot_id, decision ENUM(scale_statewide, scale_department, reject), rationale, gem_listing_ref)
```

---

## 6. Functional Requirements (SRS core — mapped to the 6 stages)

### FR-1 — Challenge Charter Builder (Department)
- FR-1.1: Department officer creates a Charter via a **multi-step guided form**, not free text: Problem → Outcome Metric → Budget Ceiling → Timeline → Data Sensitivity → Eligibility Rules.
- FR-1.2: On each step, the system calls Groq to give **real-time feedback** ("This success metric is not measurable — try adding a numeric target").
- FR-1.3: Charter cannot move to `published` unless all required fields pass validation (Pydantic schema + AI completeness check).
- FR-1.4: Departments can select from **pre-approved legal templates** (pilot agreement, IP/data clause, NDA) — stored as versioned documents, auto-attached to the Charter.

### FR-2 — Startup Discovery & Application
- FR-2.1: Startups browse/search open Charters, filterable by sector, budget, department, sensitivity level.
- FR-2.2: Startup profile stores DPIIT number, Udyam number, GSTIN — verified via integration stub (mock API returning verified/unverified for MVP).
- FR-2.3: Eligibility screening auto-flags startups that don't meet turnover/experience relaxation criteria per GFR Rule 173/174, before human review.
- FR-2.4: Application requires: capability statement, pitch deck upload, and a short "why us" text — this text feeds the matching embedding.

### FR-3 — AI Matching Engine (Groq)
- FR-3.1: On Charter publish, system generates a Charter embedding via Groq/embedding model and computes cosine similarity against all eligible Startup capability embeddings (pgvector `<=>` operator).
- FR-3.2: Top-N (configurable, default 10) startups are shortlisted automatically; department can also manually add/remove.
- FR-3.3: For each shortlisted startup, Groq generates a **2–3 sentence justification** referencing specific overlap between the Charter's problem and the startup's stated capability — this is shown to the department, not just a raw score.
- FR-3.4: Matching must complete in a bounded time (target: <15s for a shortlist of 10) — this is why Groq's inference speed is the explicit design choice over a slower hosted model.

### FR-4 — Demo Day & Evaluation
- FR-4.1: MSInS Admin schedules a Demo Day, assigns an evaluator panel (min 3) to a Charter.
- FR-4.2: Evaluators score each shortlisted startup against a **fixed rubric** (technical fit, feasibility, cost realism, team capability) — weighted scoring, not free-form ranking.
- FR-4.3: System computes an aggregate score; ties are flagged for manual admin resolution.
- FR-4.4: Selected finalist(s) move the Charter to `piloting`; others get an automated, templated rejection notice with feedback.

### FR-5 — Milestone Pilot & Escrow
- FR-5.1: On pilot start, department and startup jointly define 3–5 milestones (title, due date, deliverable description, payment amount) — sum of milestone amounts must equal budget ceiling.
- FR-5.2: Startup submits evidence (files/links/notes) per milestone.
- FR-5.3: Department reviews evidence and either **Verifies** (triggers escrow release request) or **Rejects with reason** (milestone reopens, due date can be extended once).
- FR-5.4: Escrow ledger records `reserved → released` state transitions; released amount is what would be sent to PFMS in production (stub in MVP — log the transaction, don't move real money).
- FR-5.5: Overdue milestones (past due_date, still `pending`) auto-flag on both dashboards and trigger a reminder notification.

### FR-6 — Independent Validation
- FR-6.1: On pilot completion, MSInS Admin assigns an independent validator (third-party, distinct from department and evaluator).
- FR-6.2: Validator submits a structured report: metrics against original success metric, pass/conditional/fail outcome, supporting evidence.
- FR-6.3: Report is visible to department + MSInS; not editable by department (integrity requirement).

### FR-7 — Scale-Up Decision
- FR-7.1: Based on validation outcome, MSInS/department records a Scale Decision: scale statewide, scale to specific departments, or reject with reason.
- FR-7.2: If "scale statewide," system generates a pre-filled listing draft for GeM Startup Runway (export as structured JSON/PDF — real GeM API integration is a post-MVP item).
- FR-7.3: Successful pilots appear in a public **Success Registry** (read-only, for other departments to discover proven solutions without re-running the whole pipeline).

### FR-8 — Cross-Cutting
- FR-8.1: Full audit log on every state transition (who, when, what changed) — required for a government procurement system.
- FR-8.2: Role-based dashboards (Section 8 below).
- FR-8.3: Notifications (in-app + email) on: shortlist ready, demo scheduled, milestone due/overdue, payment released, validation complete.
- FR-8.4: Document generation: Charter PDF, Pilot Agreement PDF, Validation Report PDF (templated, not manually typed each time).

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Role-based access control at API layer; all uploaded documents scanned; audit trail immutable (append-only table); CERT-In-aligned security review before handling live government data. |
| Data/IP | Every Charter declares a sensitivity tier; high-sensitivity pilots require signed data-handling agreement before startup gets data access — enforced by workflow, not policy alone. |
| Performance | AI shortlist generation < 15s (p95); dashboard pages < 2s TTI. |
| Availability | Target 99.5% during business hours (MVP scope; production would need HA deployment on state cloud). |
| Auditability | Every payment release, evaluation score, and validation outcome must be traceable to a specific user and timestamp — non-negotiable for a public-funds system. |
| Accessibility | WCAG 2.1 AA minimum (government-facing UI requirement). |
| Extensibility | Same Charter → Match → Pilot → Validate → Scale pipeline should work unmodified for any other state (per the pitch's "36+ states replicable" claim) — so tenant/department config must not be hardcoded. |

---

## 8. Screens (functional spec — you'll skin these with your design.md)

### 8.1 Department Portal (`/dept/*`)
1. **Dashboard** — active Charters by stage (kanban-style: Draft / Published / Shortlisting / Demo / Piloting / Validating / Scaled), pending actions counter (milestones to verify, evaluations to submit).
2. **New Challenge Charter (wizard)** — 5-step form: Problem → Metric → Budget/Timeline → Data Sensitivity → Legal templates. Live AI feedback panel on the side (Groq).
3. **Charter Detail / Shortlist View** — Charter summary + AI-generated shortlist table (startup name, match score, AI justification, verified badges), with manual add/remove.
4. **Demo Day Scheduler** — pick date, assign evaluators from a directory, invite shortlisted startups.
5. **Pilot Setup** — milestone builder (add/edit/reorder milestones, amount auto-sums against budget ceiling with a live remaining-budget indicator).
6. **Milestone Review Queue** — list of evidence submissions awaiting verify/reject, with inline document viewer.
7. **Validation Report Viewer** — read-only report + metrics chart.
8. **Scale Decision Screen** — decision form + auto-generated GeM listing draft preview.

### 8.2 Startup Portal (`/startup/*`)
1. **Dashboard** — applied/shortlisted/active pilots, upcoming milestone deadlines, payment status timeline.
2. **Discover Challenges** — searchable/filterable list of open Charters with budget, sector, department, sensitivity badges.
3. **Charter Detail + Apply** — full problem description, apply form (capability statement, pitch deck upload).
4. **My Applications** — status tracker per application (Applied → Shortlisted → Demo → Selected/Rejected).
5. **Pilot Workspace** — milestone list with due dates, evidence upload per milestone, status badges (pending/submitted/verified/paid).
6. **Escrow/Payment Tracker** — ledger view: reserved amount, released amount, pending amount, per milestone.
7. **Profile & Verification** — DPIIT/Udyam/GST fields with verification status badges.

### 8.3 MSInS Admin Portal (`/admin/*`)
1. **Control Center Dashboard** — cross-department analytics (Charters by stage, total escrow reserved/released, average time-to-pilot, success rate).
2. **Charter Template Manager** — CRUD for legal templates, eligibility rule sets, rubric weightings.
3. **Evaluator/Validator Directory** — assign panel members to Charters, conflict-of-interest flagging.
4. **Evaluation Console** — rubric-based scoring UI used by evaluators during Demo Day (weighted sliders, notes field).
5. **Escrow Oversight** — global ledger view across all pilots, overdue milestone alerts.
6. **Success Registry (public-facing)** — read-only showcase of scaled solutions, searchable by other departments.
7. **Audit Log Viewer** — filterable, exportable log of every state transition.

### 8.4 Shared
- **Auth screens** (login, role-based redirect, org verification pending state).
- **Notification center** (in-app feed).
- **Document viewer/generator** (Charter PDF, Pilot Agreement PDF, Validation Report PDF).

---

## 9. Key API Surface (FastAPI routers — representative, not exhaustive)

```
POST   /charters/                    create charter (draft)
POST   /charters/{id}/publish        validate + publish, triggers matching job
GET    /charters/{id}/shortlist      get AI shortlist + justifications
POST   /charters/{id}/shortlist/refresh   re-run matching

POST   /applications/                startup applies to a charter
GET    /applications/mine            startup's application list

POST   /evaluations/                 submit demo day score
GET    /charters/{id}/evaluations    aggregate scores for a charter

POST   /pilots/                      create pilot from selected application
POST   /pilots/{id}/milestones       define milestones
POST   /milestones/{id}/evidence     submit evidence (startup)
POST   /milestones/{id}/verify       verify + trigger escrow release (department)
GET    /pilots/{id}/escrow-ledger    ledger history

POST   /validations/                 submit validation report
POST   /scale-decisions/             record scale decision + generate GeM draft

POST   /ai/charter-feedback          Groq: live charter quality feedback
POST   /ai/match                     Groq+pgvector: generate shortlist
```

---

## 10. Groq Integration Points (explicit)

| Use case | Input | Output | Model call type |
|---|---|---|---|
| Charter embedding | Charter text (problem + metric) | Vector for pgvector storage | Embedding |
| Startup capability embedding | Startup profile + past pilot summaries | Vector for pgvector storage | Embedding |
| Shortlist justification | Charter text + startup profile (top-N by cosine similarity) | 2–3 sentence rationale per match | Chat completion, low temperature |
| Charter quality feedback | In-progress charter draft | Structured critique (missing metric, vague scope, unrealistic timeline) | Chat completion, JSON-mode/structured output |
| Evaluator scoring assist (optional) | Pitch deck summary + rubric | Suggested score + reasoning (human overrides always allowed) | Chat completion |

*Note: if Groq's catalog doesn't expose a dedicated embeddings endpoint, use a small open embedding model (e.g., a sentence-transformer served locally or via another provider) for the vector step, and reserve Groq specifically for the fast, user-facing generation/justification calls — that's where its latency advantage actually matters in the UX.*

---

## 11. MVP Scope for a Hackathon Demo (suggested cut line)

Build fully: Charter creation wizard → AI matching + justification → Demo evaluation → Milestone pilot with evidence + verify/release (simulated escrow) → Validation report → Scale decision screen.

Stub/mock: real PFMS money movement, live GeM/DPIIT API calls (use realistic mock data), real CERT-In audit (describe process, don't implement).

This scope covers all six pipeline stages end-to-end, which is what a judging panel actually wants to see working — a thin slice of the *entire* flow beats a deep build of just one stage.

---

## 12. Open Questions to Resolve Before Building

1. Who is authoritative on startup eligibility — do you call DPIIT's real API, or self-certify + manual admin verification for MVP?
2. What counts as "escrow" for the prototype — a ledger table you simulate, or an actual sandboxed payment gateway integration?
3. Multi-department tenancy — is this Maharashtra-only for the hackathon, or should the data model be state-agnostic from day one (recommended, given the "36+ states replicable" pitch)?
4. Evaluator/validator identity — internal government staff only, or can external domain experts be onboarded (affects auth/verification flow)?

