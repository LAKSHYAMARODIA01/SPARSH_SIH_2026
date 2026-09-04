"use client";

import React, { useState } from "react";

export default function AdminTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("problem_statement");
  const [copied, setCopied] = useState(false);

  const templates: Record<string, { title: string; category: string; desc: string; text: string }> = {
    problem_statement: {
      title: "Outcome-Based Problem Statement Formulation Template",
      category: "Department Framework",
      desc: "Standardized format for government departments to define baseline metrics, target outcomes, and budget ceilings.",
      text: `================================================================================
MAHARASHTRA STATE INNOVATION SOCIETY (MSInS)
STANDARD OUTCOME-BASED PROBLEM STATEMENT TEMPLATE
================================================================================

1. DEPARTMENT INFORMATION
   - Ministry / Department Name: [Name]
   - Nodal Officer: [Officer Name & Designation]
   - Contact Email: [dept.officer@sparsh-gov.in]

2. PROBLEM CONTEXT & OPERATIONAL BOTTLENECK
   - Baseline Situation: [Describe current operational pain point]
   - Impact: [Quantitative measure of delay, cost overhead, or risk]

3. TARGET SUCCESS OUTCOME METRIC
   - Quantitative Outcome: [e.g. Reduce commuter delay by 25%]
   - Measurement Methodology: [e.g. Independent telemetry verification]

4. SANDBOX PILOT CONSTRAINTS
   - Maximum Budget Ceiling: ₹[Amount up to ₹30,00,000]
   - Pilot Duration: [90 - 180 Days]
   - GFR Rule 173/174 Exemption: APPLIED (Prior turnover waived for DPIIT startups)

5. DATA & IP SENSITIVITY LEVEL
   - Sensitivity: [LOW / MEDIUM / HIGH]
   - Cybersecurity Protocol: CERT-In compliance required for edge sensors.`,
    },
    pilot_agreement: {
      title: "Controlled Sandbox Pilot Agreement (v2026.1)",
      category: "Legal & Contracting",
      desc: "Milestone-linked escrow payment contract legally binding state departments and DPIIT startups.",
      text: `================================================================================
MAHARASHTRA STATE INNOVATION POLICY 2026
CONTROLLED SANDBOX PILOT AGREEMENT
================================================================================

THIS AGREEMENT is entered into on [Date] by and between:
1. GOVERNMENT OF MAHARASHTRA (represented by [Department Name]), AND
2. [Startup Name] (DPIIT Reg: [DPIIT Number]).

WHEREAS:
A. The Department requires innovative pilot testing under GFR Rule 173/174 exemptions.
B. Payment shall be managed strictly via the MSInS RBI-Compliant Escrow Account.

TERMS & ESCROW MILESTONES:
- Milestone 1 (30%): Prototype Installation & Sensor Calibration.
- Milestone 2 (40%): Live Telemetry Evidence & 20% Outcome Verification.
- Milestone 3 (30%): Final Handover & Independent Validator Report.

IP & DATA CLAUSE:
- Background IP remains 100% property of the Startup.
- Foreground data generated during pilot remains property of Govt of Maharashtra.`,
    },
    ip_framework: {
      title: "Data & Intellectual Property Sharing Framework",
      category: "IP & Governance",
      desc: "Standard IP clause waiving Govt claim on startup core IP while preserving state data sovereignty.",
      text: `================================================================================
MSInS DATA & INTELLECTUAL PROPERTY GOVERNANCE PROTOCOL
================================================================================

1. INTELLECTUAL PROPERTY SOVEREIGNTY
   - Startup retains full title, copyright, and patent ownership of all core AI models, algorithms, hardware designs, and source code.
   - Government receives a non-exclusive, non-transferable license to use the solution for the duration of the pilot.

2. DATA SOVEREIGNTY & PRIVACY
   - All state citizen data must be stored locally within India in encrypted Supabase / GCP data centers.
   - Zero third-party data harvesting or commercial monetization allowed.`,
    },
    scale_recommendation: {
      title: "Independent Validation & GeM Scale-Up Format",
      category: "Procurement Transition",
      desc: "Formal evaluation format for scaling validated pilots across all 36 districts of Maharashtra.",
      text: `================================================================================
INDEPENDENT VALIDATION & GeM STATEWIDE SCALE RECOMMENDATION
================================================================================

PILOT ID: [Pilot ID]
VALIDATOR: [COEP Tech / IIT Bombay / Quality Council of India]

1. FIELD PERFORMANCE SUMMARY
   - Target Metric: [Expected Outcome]
   - Verified Achievement: [Actual Outcome verified in field]
   - Cost-Benefit Ratio: [ROI Calculation]

2. RECOMMENDATION FOR STATEWIDE SCALE
   [  ] OPTION A: Scale Statewide across 36 Districts via GeM Direct Listing.
   [  ] OPTION B: Scale within Departmental Scope.
   [  ] OPTION C: Refine & Re-test.`,
    },
  };

  const activeTemplate = templates[selectedTemplate];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTemplate.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-gradient-to-r from-[#0d0f14] via-[#12141c] to-[#07080a] border border-[#242728] rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-mono font-semibold">
              MSInS Procurement Standard
            </span>
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-[10px] font-mono font-semibold">
              GFR 173/174 Pre-Approved
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Procurement Standard Templates Hub
          </h1>
          <p className="text-xs text-[#9c9c9d]">
            Standardized legal contracts, problem statement guidelines, IP sharing frameworks, and GeM scale-up formats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List Selector */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Template Library</h2>
          {Object.entries(templates).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={`w-full text-left p-4 rounded-xl border transition space-y-1.5 ${
                selectedTemplate === key
                  ? "bg-[#14161f] border-emerald-500 text-white shadow-lg"
                  : "bg-[#0d0d0d] border-[#242728] text-[#9c9c9d] hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">{t.category}</span>
                {selectedTemplate === key && <span className="text-emerald-400 font-bold text-xs">Active</span>}
              </div>
              <h4 className="font-bold text-white text-xs">{t.title}</h4>
              <p className="text-[11px] text-[#6c6d6e] line-clamp-2">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Live Template Viewer */}
        <div className="lg:col-span-2 p-6 bg-[#0d0d0d] border border-[#242728] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#242728] pb-4 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase">{activeTemplate.category}</span>
              <h2 className="text-base font-bold text-white">{activeTemplate.title}</h2>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {copied ? "✓ Copied to Clipboard!" : "Copy Template Text"}
            </button>
          </div>

          <p className="text-xs text-[#cdcdcd] italic p-3 bg-[#111317] border border-[#242728] rounded-xl">
            "{activeTemplate.desc}"
          </p>

          <pre className="p-4 bg-[#07080a] border border-[#242728] rounded-xl font-mono text-xs text-[#a3b8cc] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
            {activeTemplate.text}
          </pre>
        </div>
      </div>
    </div>
  );
}
