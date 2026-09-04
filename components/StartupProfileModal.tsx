"use client";

import React, { useState } from "react";
import { StartupData } from "@/data/mockData";
import PitchDeckModal from "./PitchDeckModal";

interface StartupProfileModalProps {
  startup: StartupData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StartupProfileModal({ startup, isOpen, onClose }: StartupProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "roadmap">("overview");
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  if (!isOpen || !startup) return null;

  const ROADMAP_STAGES = [
    {
      stage: 1,
      title: "Challenge Discovery & AI Matching",
      status: "completed",
      date: "Aug 10, 2026",
      desc: "Startup discovered department charter and passed AI compatibility screening (94% score).",
    },
    {
      stage: 2,
      title: "Jury Shortlisting & Eligibility",
      status: "completed",
      date: "Aug 18, 2026",
      desc: "Verified DPIIT registration and GFR Rule 173/174 exemption. Approved by MSInS Jury.",
    },
    {
      stage: 3,
      title: "Demo Day Presentation",
      status: "completed",
      date: "Aug 25, 2026",
      desc: "Presented 5-slide interactive pitch deck to Joint Secretary & Evaluators. Score: 92/100.",
    },
    {
      stage: 4,
      title: "Controlled Sandbox Pilot & Escrow",
      status: "in_progress",
      date: "Sep 01, 2026",
      desc: "Active pilot in Pune. Milestone 1 released (₹10L), Milestone 2 evidence submitted.",
    },
    {
      stage: 5,
      title: "Independent Validation & GeM Scale",
      status: "upcoming",
      date: "Nov 2026",
      desc: "Independent validation by COEP Tech & direct procurement listing on GeM portal.",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className="w-full max-w-2xl bg-[#0b0c0e] border border-[#242728] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Top Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-[#101319] to-[#0b0c0e] border-b border-[#242728] relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#18191c] hover:bg-[#26282d] text-gray-400 hover:text-white flex items-center justify-center text-base transition"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
                {startup.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-tight">{startup.name}</h2>
                  {startup.verified && (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[11px] font-semibold flex items-center gap-1">
                      ✓ DPIIT Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#9c9c9d]">
                  Founder: <strong className="text-white">{startup.founder}</strong> ({startup.email})
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 mt-6 border-b border-[#242728]/80 pb-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 border-b-2 transition ${
                  activeTab === "overview"
                    ? "border-emerald-500 text-white font-bold"
                    : "border-transparent text-[#9c9c9d] hover:text-white"
                }`}
              >
                Company Profile & Credentials
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`pb-2 border-b-2 transition flex items-center gap-1.5 ${
                  activeTab === "roadmap"
                    ? "border-emerald-500 text-white font-bold"
                    : "border-transparent text-[#9c9c9d] hover:text-white"
                }`}
              >
                Procurement Roadmap Tracker
                <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 rounded text-[10px]">Active</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#cdcdcd]">
            {activeTab === "overview" && (
              <>
                {/* Sector Tags */}
                <div className="space-y-2">
                  <span className="text-[#9c9c9d] font-semibold uppercase tracking-wider text-[10px]">Sector Focus Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.sectorTags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#14161c] border border-[#242728] rounded-full text-emerald-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Official Credentials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#111317] border border-[#242728] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#9c9c9d] font-medium block">DPIIT Number</span>
                    <span className="font-mono text-white font-bold">{startup.dpiit}</span>
                  </div>
                  <div className="p-3 bg-[#111317] border border-[#242728] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#9c9c9d] font-medium block">Udyam Registration</span>
                    <span className="font-mono text-white font-bold">{startup.udyam}</span>
                  </div>
                  <div className="p-3 bg-[#111317] border border-[#242728] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#9c9c9d] font-medium block">GSTIN Certificate</span>
                    <span className="font-mono text-white font-bold">{startup.gstin}</span>
                  </div>
                </div>

                {/* GFR Exemption Status Box */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs">GFR Rule 173/174 Exemption Active</span>
                    <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded text-[10px] font-mono">MSInS Exemption</span>
                  </div>
                  <p className="text-[#a3b8cc] text-[11px] leading-relaxed">
                    This startup is officially recognized under the Maharashtra State Innovation Policy. Prior turnover and prior experience clauses are legally waived for state pilot procurement.
                  </p>
                </div>

                {/* Match Score (If applicable) */}
                {startup.matchScore && (
                  <div className="p-4 bg-[#111317] border border-[#242728] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#9c9c9d] uppercase tracking-wider block">AI Match Compatibility Score</span>
                      <span className="text-sm font-semibold text-white">Calculated via Groq Llama 3.3 70B & pgvector</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-400 bg-emerald-950/50 px-3 py-1 border border-emerald-800 rounded-lg">
                      {startup.matchScore}%
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "roadmap" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#111317] border border-[#242728] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#9c9c9d] uppercase tracking-wider block">Lifecycle Status</span>
                    <span className="text-sm font-bold text-emerald-400">Stage 4: Controlled Sandbox Pilot</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-mono text-[11px]">
                    80% Progress
                  </span>
                </div>

                {/* Timeline Component */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#242728]">
                  {ROADMAP_STAGES.map((step) => (
                    <div key={step.stage} className="relative flex items-start gap-4">
                      {/* Step Circle */}
                      <div
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step.status === "completed"
                            ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30"
                            : step.status === "in_progress"
                            ? "bg-amber-500 text-black animate-pulse"
                            : "bg-[#1c1e22] text-[#6c6d6e] border border-[#242728]"
                        }`}
                      >
                        {step.stage}
                      </div>

                      <div className="p-4 bg-[#101216] border border-[#242728] rounded-xl flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-xs">{step.title}</h4>
                          <span className="text-[10px] text-[#6c6d6e] font-mono">{step.date}</span>
                        </div>
                        <p className="text-[#9c9c9d] text-[11px]">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setIsPitchDeckOpen(true)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
              >
                Open Interactive Pitch Deck
              </button>
              <button
                onClick={() => alert(`Initiating direct communication with founder ${startup.founder} (${startup.email})`)}
                className="px-4 py-2.5 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] font-semibold rounded-xl text-xs transition"
              >
                Contact Founder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Pitch Deck Modal */}
      <PitchDeckModal
        startup={startup}
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </>
  );
}
