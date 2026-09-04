# SPARSH — State Procurement & AI-Driven Accelerator for Research & Startup Hubs
> **Maharashtra State Innovation Society (MSInS) — SIH 2026 Problem Statement ID: 26136**

![Next.js 15](https://img.shields.io/badge/Next.js-15.5.25-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=flat-square&logo=supabase)
![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-f34f29?style=flat-square)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)

---

## Executive Summary & Problem Context

Government departments across India face severe operational bottlenecks (traffic congestion, rural health diagnostic gaps, crop yield forecasting) that could be solved by novel startup technologies. However, conventional public procurement processes are designed for standardized commodity goods and established vendors, presenting massive hurdles for early-stage startups:

1. **Rigid Prequalification Criteria**: Traditional L1 tendering enforces multi-crore turnover thresholds and multi-year track records, locking out innovative DPIIT-recognized startups.
2. **Ambiguous Outcome Statements**: Departments struggle to formulate objective, outcome-based problem statements.
3. **High-Risk Pilot Execution**: Risk of non-payment or delayed disbursements discourages startups from undertaking capital-intensive government pilots.
4. **Lack of Transparent Scaling Pathways**: Successful controlled pilots often stall without a direct mechanism to transition into statewide procurement listings on GeM (Government e-Marketplace).

**SPARSH** directly resolves these bottlenecks by operationalizing **GFR Rule 173/174 turnover exemptions**, pairing them with **Groq Llama 3.3 70B AI Matchmaking**, **Performance-Linked Escrow Payment Gateways**, and an **Immutable Audit Trail**.

---

## The SPARSH 5-Stage Procurement Pathway

```
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│ 1. Challenge Charter      │ ──> │ 2. AI Matchmaker Engine   │ ──> │ 3. Jury Evaluation        │
│ Problem & Outcome Metric  │     │ Groq Llama 3.3 70B Match  │     │ Score & GFR Exemption     │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
                                                                                  │
                                                                                  ▼
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│ 5. GeM Scale-Up           │ <── │ 4. Independent Validation │ <── │ 4. Milestone Escrow Pilot │
│ Structured JSON Export    │     │ Third-Party Cert (COEP)   │     │ RBI Direct RTGS Payout    │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
```

1. **Challenge Charter Formulation**: Department officers publish outcome-based problem charters specifying dynamic target metrics (e.g., *25% reduction in peak-hour traffic delay*), budget ceilings, and data sensitivity levels.
2. **AI-Powered Matchmaking**: The Groq Llama 3.3 70B engine evaluates DPIIT registered startups against charter metrics using vector cosine embeddings and auto-generates official file note justifications.
3. **Jury Evaluation & Shortlisting**: Expert panels score proposals on technical novelty, feasibility, and GFR Rule 173/174 exemption compliance.
4. **Controlled Sandbox Pilot & Escrow Payments**: Pilot contracts lock funds into a performance-linked Escrow Payment Gateway. Startup founders submit telemetry evidence, verified by department officers and independent third-party validators prior to automated RTGS disbursement.
5. **GeM Scale-Up Auto-Export**: Validated pilots generate structured JSON listings pre-approved for statewide scale-up on GeM.

---

## Key Features & Role Portals

SPARSH provides dedicated, role-isolated command centers:

### 🏛️ Department Officer Portal (`/dashboard/department`)
- Interactive Kanban Board tracking challenge charters across all 5 procurement stages.
- Charter Dossier view detailing problem context, target outcome metrics, and matched startups.
- Pilot execution and escrow disbursement verification.

### 🚀 Startup Founder Workspace (`/dashboard/startup/workspace`)
- Milestone execution hub for founders to track pilot progress (80% complete tracker).
- Telemetry evidence submission (CSV, MP4, PDF logs) for milestone payout approval.
- Embedded pitch deck viewer and GFR exemption status monitor.

### 👑 MSInS Chief Admin Control Center (`/dashboard/admin`)
- Statewide cross-department control center monitoring active charters, pilot execution status, and overall state escrow ledger health (₹1.85 Cr committed).
- Master DPIIT startup directory with 1-click dossier inspection.
- Pre-approved GFR tender template generator with 1-click clipboard copy.

### ⚖️ Jury Evaluator Portal (`/dashboard/evaluator`)
- Structured scoring interface (Novelty 30%, Feasibility 25%, Impact 25%, Readiness 20%).
- Real-time weighted score calculation and official submission to MSInS state committee.

### 🔍 Independent Validator Portal (`/dashboard/validator`)
- Third-party technical validation queue (e.g., COEP Tech University / IIT Bombay advisors).
- Outcome verification interface for issuing PASS/CONDITIONAL PASS certifications.

---

## Technical Stack & System Architecture

| Component | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, Turbopack) | Server Components, dynamic routing, and fast SSR |
| **Language** | TypeScript 5.0 | Strict type safety across all schemas and APIs |
| **Styling** | Tailwind CSS 3.4 + Raycast Theme | Dark canvas (`#07080a`), hairline borders (`#242728`), monospace typography |
| **Database** | Supabase (PostgreSQL + RLS) | Relational store with Row Level Security and Realtime events |
| **AI Engine** | Groq AI (Llama 3.3 70B) | High-speed semantic matchmaking & file note generation |
| **Icons** | Lucide React | High-performance, clean UI iconography |

### Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                             SPARSH Next.js 15 Frontend                         |
|  +-------------------+  +-------------------+  +---------------------------+  |
|  | Dept Officer Hub  |  | Startup Workspace |  | MSInS Admin Control Center|  |
|  +-------------------+  +-------------------+  +---------------------------+  |
+---------------------------------------+---------------------------------------+
                                        | API Routes / Server Actions
                                        v
+-------------------------------------------------------------------------------+
|                               Backend Services Layer                           |
|  +-------------------+  +-------------------+  +---------------------------+  |
|  | Groq Llama 3.3 70B|  | Supabase Auth     |  | Escrow Disbursement       |  |
|  | Matchmaker Engine |  | & RLS Engine      |  | State Machine             |  |
|  +-------------------+  +-------------------+  +---------------------------+  |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                            Supabase PostgreSQL Storage                        |
|   [profiles]   [challenge_charters]   [pilots]   [escrow_ledger_entries]       |
+-------------------------------------------------------------------------------+
```

---

## UI / UX Design System

SPARSH strictly follows the **Raycast Developer Tool Design System**:

- **Dark Canvas Background**: `#07080a`
- **Surface Elevation Ladder**: `#0d0d0d` $\rightarrow$ `#101111` $\rightarrow$ `#121212` $\rightarrow$ `#14161c`
- **Hairline Borders**: `1px solid #242728`
- **Typography**: Inter / system-ui paired with `font-mono` for IDs, budgets, and match scores.
- **Badge Palette**: Clean monochrome badges (`[TRF]`, `[HLT]`, `[ESC]`, `[SEC]`) with zero emojis.

---

## Steps to Run & Local Setup

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/sparsh-platform.git
   cd sparsh-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## Quick-Fill Demo Credentials

Use any of the pre-configured persona accounts below to log in directly into isolated role portals (Universal Password: `Sparsh@2026`):

| Role Persona | Email | Access Link / Portal |
| :--- | :--- | :--- |
| **Health Officer** | `health.dept@sparsh-gov.in` | `/dashboard/department` |
| **Transport Officer** | `transport.dept@sparsh-gov.in` | `/dashboard/department` |
| **Startup Founder** | `founder@cognitive.sparsh.in` | `/dashboard/startup/workspace` |
| **MSInS Chief Admin** | `admin.chief@sparsh.in` | `/dashboard/admin` |
| **Jury Evaluator** | `evaluator.deshmukh@sparsh.in` | `/dashboard/evaluator` |
| **Independent Validator** | `validator.patil@sparsh.in` | `/dashboard/validator` |

---

## Verification & Testing

The repository maintains zero build warnings and 100% compilation across all routes:

```bash
npm run build
```

```
   ▲ Next.js 15.5.25

 ✓ Compiled successfully in 5.2s
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (28/28)
   Finalizing page optimization ...
```

---

## License & Intellectual Property

Developed for **Maharashtra State Innovation Society (MSInS)** under Smart India Hackathon 2026 (PS ID 26136). Startups retain full background and foreground Intellectual Property (IP) rights for solutions piloted on the SPARSH platform.
