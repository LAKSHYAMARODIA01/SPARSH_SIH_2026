"use client";

import React, { useState } from "react";
import PitchDeckModal from "@/components/PitchDeckModal";
import StartupProfileModal from "@/components/StartupProfileModal";
import { getStartupByEmailOrName } from "@/data/mockData";

export default function StartupWorkspacePage() {
  const [evidenceUrl, setEvidenceUrl] = useState("https://storage.sparsh.in/evidence/karve_road_telemetry_sep2026.csv");
  const [evidenceNotes, setEvidenceNotes] = useState(
    "Calibrated 12 camera edge sensors at Karve Road junctions. Real-time telemetry confirms 22% increase in vehicle throughput during peak evening hours."
  );
  const [submitted, setSubmitted] = useState(true);
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const myStartup = getStartupByEmailOrName("founder@cognitive.sparsh.in");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-gradient-to-r from-[#0d0f14] via-[#12141c] to-[#07080a] border border-[#242728] rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[11px] font-semibold">
              ✓ DPIIT Registered & Verified
            </span>
            <span className="px-2.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[11px] font-semibold">
              Stage 4: Active Sandbox Pilot
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Startup Procurement Execution Workspace
          </h1>
          <p className="text-xs text-[#9c9c9d]">
            Logged in as <strong className="text-white">{myStartup.name}</strong> ({myStartup.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeckOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
          >
            Open Pitch Deck
          </button>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-4 py-2.5 bg-[#14161d] hover:bg-[#1f222b] text-white border border-[#242728] font-semibold text-xs rounded-xl transition"
          >
            View Roadmap
          </button>
        </div>
      </div>

      {/* Procurement Roadmap Tracker Bar */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Procurement Lifecycle Pathway Progress
          </h2>
          <span className="text-xs font-mono font-bold text-emerald-400">80% Completed</span>
        </div>

        {/* Progress Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#111317] border border-emerald-800/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">STAGE 1 ✓</span>
            <span className="font-bold text-white block">AI Discovery</span>
            <span className="text-[10px] text-[#9c9c9d]">Matched (94%)</span>
          </div>
          <div className="p-3 bg-[#111317] border border-emerald-800/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">STAGE 2 ✓</span>
            <span className="font-bold text-white block">Jury Shortlist</span>
            <span className="text-[10px] text-[#9c9c9d]">DPIIT & GFR Exemption</span>
          </div>
          <div className="p-3 bg-[#111317] border border-emerald-800/60 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">STAGE 3 ✓</span>
            <span className="font-bold text-white block">Demo Day Pitch</span>
            <span className="text-[10px] text-[#9c9c9d]">Score: 92/100</span>
          </div>
          <div className="p-3 bg-gradient-to-r from-amber-950/40 to-[#12141a] border border-amber-600/60 rounded-xl space-y-1 animate-pulse">
            <span className="text-[10px] text-amber-400 font-bold block">STAGE 4 [ACTIVE]</span>
            <span className="font-bold text-white block">Sandbox Pilot</span>
            <span className="text-[10px] text-amber-300 font-mono">₹30L Escrow Contract</span>
          </div>
          <div className="p-3 bg-[#111317] border border-[#242728] opacity-60 rounded-xl space-y-1">
            <span className="text-[10px] text-[#6c6d6e] font-bold block">STAGE 5</span>
            <span className="font-bold text-[#cdcdcd] block">GeM Scale-Up</span>
            <span className="text-[10px] text-[#6c6d6e]">Nov 2026 Target</span>
          </div>
        </div>
      </div>

      {/* Milestone Execution & Evidence Submission */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#242728] pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Active Pilot Contract & Escrow Milestones</h2>
            <p className="text-xs text-[#9c9c9d]">Contract: Pune Karve Road Traffic Control (#71111111-1111-4111-a111-111111111101)</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl text-xs font-mono font-bold">
            Escrow Wallet: ₹20,00,000 Remaining
          </span>
        </div>

        {/* Milestone Cards */}
        <div className="space-y-4 text-xs">
          {/* Milestone 1 */}
          <div className="p-4 bg-[#111317] border border-emerald-900/40 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-bold">
                  ✓ PAID & RELEASED
                </span>
                <span className="font-mono text-[#9c9c9d]">Aug 15, 2026</span>
              </div>
              <h4 className="font-bold text-white text-sm">Milestone 1: Camera Edge Sensor Calibration</h4>
              <p className="text-[#9c9c9d]">Installed & calibrated 12 camera edge sensors at Karve Road junctions.</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-white font-mono block">₹10,00,000</span>
              <span className="text-[10px] text-emerald-400 font-semibold">RBI RTGS Direct Deposit</span>
            </div>
          </div>

          {/* Milestone 2 */}
          <form onSubmit={handleSubmit} className="p-5 bg-[#12141c] border border-amber-600/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#242728] pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[10px] font-bold animate-pulse">
                    EVIDENCE SUBMITTED — UNDER REVIEW
                  </span>
                  <span className="font-mono text-[#9c9c9d]">Due Sep 15, 2026</span>
                </div>
                <h4 className="font-bold text-white text-base">Milestone 2: Real-time Telemetry & 20% Flow Increase</h4>
                <p className="text-[#cdcdcd]">Demonstrate 20% throughput increase in live traffic simulation during peak hours.</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-400 font-mono block">₹10,00,000</span>
                <span className="text-[10px] text-[#9c9c9d]">Reserved in Escrow Ledger</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#cdcdcd] font-bold mb-1">Evidence Telemetry File URL (CSV, MP4, PDF)</label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#101114] border border-[#242728] rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[#cdcdcd] font-bold mb-1">Field Telemetry Verification Summary</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#101114] border border-[#242728] rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {submitted ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 font-bold text-center">
                  ✓ Evidence Log Submitted! Department Officer & Independent Validator notified for payout verification.
                </div>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition"
                >
                  Submit Telemetry Evidence for Escrow Release
                </button>
              )}
            </div>
          </form>

          {/* Milestone 3 */}
          <div className="p-4 bg-[#111317] border border-[#242728] opacity-60 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#171920] text-[#9c9c9d] border border-[#242728] rounded text-[10px] font-bold">
                  LOCKED UNTIL MILESTONE 2
                </span>
                <span className="font-mono text-[#9c9c9d]">Due Oct 30, 2026</span>
              </div>
              <h4 className="font-bold text-white text-sm">Milestone 3: Final 25% Reduction & Handover Report</h4>
              <p className="text-[#9c9c9d]">Final field validation report confirmed by COEP Tech validator.</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-white font-mono block">₹10,00,000</span>
              <span className="text-[10px] text-[#6c6d6e]">Pending Escrow Lock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PitchDeckModal
        startup={myStartup}
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
      />
      <StartupProfileModal
        startup={myStartup}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
