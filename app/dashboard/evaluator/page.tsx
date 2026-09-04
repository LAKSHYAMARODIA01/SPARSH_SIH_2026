"use client";

import React, { useState } from "react";
import PitchDeckModal from "@/components/PitchDeckModal";
import StartupProfileModal from "@/components/StartupProfileModal";
import { getStartupByEmailOrName, StartupData } from "@/data/mockData";

export default function EvaluatorDashboardPage() {
  const [selectedStartupKey, setSelectedStartupKey] = useState("cognitive");
  const [techFit, setTechFit] = useState(92);
  const [scalability, setScalability] = useState(88);
  const [gfrCompliance, setGfrCompliance] = useState(95);
  const [costRealism, setCostRealism] = useState(90);
  const [fieldFeasibility, setFieldFeasibility] = useState(94);
  const [evaluatorNotes, setEvaluatorNotes] = useState(
    "Proprietary computer-vision sensors demonstrate exceptional queue reduction metrics. Zero road geometry modification requirement makes this ideal for Pune Karve Road pilot deployment."
  );
  const [submitted, setSubmitted] = useState(false);

  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const startupMap: Record<string, { startup: StartupData; charterTitle: string; dept: string }> = {
    cognitive: {
      startup: getStartupByEmailOrName("founder@cognitive.sparsh.in"),
      charterTitle: "Pune Urban Junction Adaptive Traffic Signal Control",
      dept: "Department of Transport & Road Safety",
    },
    healthpulse: {
      startup: getStartupByEmailOrName("founder@healthpulse.sparsh.in"),
      charterTitle: "Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs",
      dept: "Department of Public Health & Family Welfare",
    },
    agrisense: {
      startup: getStartupByEmailOrName("founder@agrisense.sparsh.in"),
      charterTitle: "Hyperspectral Yield Prediction for Vidarbha Cotton",
      dept: "Department of Agriculture & Farmer Welfare",
    },
  };

  const activeObj = startupMap[selectedStartupKey];
  const activeStartup = activeObj.startup;

  // Calculate weighted total score out of 100
  const weightedScore = Math.round(
    techFit * 0.3 + scalability * 0.2 + gfrCompliance * 0.2 + costRealism * 0.15 + fieldFeasibility * 0.15
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-gradient-to-r from-indigo-950/40 via-[#10121a] to-[#07080a] border border-[#242728] rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded text-[10px] font-mono font-semibold">
              Jury Evaluator Console
            </span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-mono font-semibold">
              MSInS State Jury
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Demo Day Pitch Evaluation & Scoring Console
          </h1>
          <p className="text-xs text-[#9c9c9d]">
            Evaluate shortlisted startup pitch presentations and submit official weighted criteria scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#9c9c9d] block">Composite Jury Score</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{weightedScore}/100</span>
          </div>
        </div>
      </div>

      {/* Candidate Selector */}
      <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl flex items-center justify-between flex-wrap gap-4 text-xs">
        <span className="font-semibold text-[#cdcdcd]">Select Demo Day Presenter:</span>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(startupMap).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedStartupKey(key);
                setSubmitted(false);
              }}
              className={`px-3.5 py-2 rounded-xl font-semibold transition border ${
                selectedStartupKey === key
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "bg-[#111317] text-[#9c9c9d] border-[#242728] hover:text-white"
              }`}
            >
              {item.startup.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Startup Bio Card & Deck Launcher */}
        <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-2xl space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-indigo-400 block">{activeObj.dept}</span>
            <h2 className="text-lg font-bold text-white tracking-tight">{activeStartup.name}</h2>
            <p className="text-xs text-[#9c9c9d]">
              Target Charter: <strong className="text-white">{activeObj.charterTitle}</strong>
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#242728] text-xs">
            <div className="flex justify-between">
              <span className="text-[#9c9c9d]">Founder:</span>
              <span className="font-medium text-white">{activeStartup.founder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9c9c9d]">DPIIT Number:</span>
              <span className="font-mono text-emerald-400">{activeStartup.dpiit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9c9c9d]">GFR Exemption:</span>
              <span className="font-semibold text-emerald-400">Verified Rule 173/174</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsDeckOpen(true)}
              className="w-full py-2.5 bg-white hover:bg-[#e8e8e8] text-black font-bold text-xs rounded-md shadow-md transition flex items-center justify-center gap-2"
            >
              Launch Live 5-Slide Pitch Deck
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full py-2.5 bg-[#101111] hover:bg-[#18191a] text-[#cdcdcd] border border-[#242728] font-semibold text-xs rounded-md transition"
            >
              View Full Company Profile & Roadmap
            </button>
          </div>
        </div>

        {/* Criteria Sliders & Submission Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 p-6 bg-[#0d0d0d] border border-[#242728] rounded-2xl space-y-6">
          <h2 className="text-base font-bold text-white border-b border-[#242728] pb-3">
            Evaluation Rubric Breakdown (Weighted Score Calculation)
          </h2>

          <div className="space-y-5 text-xs">
            {/* Slider 1 */}
            <div className="space-y-1.5 p-3 bg-[#111317] border border-[#242728] rounded-xl">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white">1. Technical Fit & Sensor Accuracy (30% Weight)</label>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">{techFit}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={techFit}
                onChange={(e) => setTechFit(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1.5 p-3 bg-[#111317] border border-[#242728] rounded-xl">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white">2. Scalability Across Maharashtra Districts (20% Weight)</label>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">{scalability}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scalability}
                onChange={(e) => setScalability(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1.5 p-3 bg-[#111317] border border-[#242728] rounded-xl">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white">3. GFR Rule 173/174 Exemption Compliance (20% Weight)</label>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">{gfrCompliance}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gfrCompliance}
                onChange={(e) => setGfrCompliance(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-1.5 p-3 bg-[#111317] border border-[#242728] rounded-xl">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white">4. Cost Realism & Escrow Payment Structure (15% Weight)</label>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">{costRealism}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={costRealism}
                onChange={(e) => setCostRealism(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Slider 5 */}
            <div className="space-y-1.5 p-3 bg-[#111317] border border-[#242728] rounded-xl">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white">5. Field Feasibility & Rapid Deploy Readiness (15% Weight)</label>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">{fieldFeasibility}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fieldFeasibility}
                onChange={(e) => setFieldFeasibility(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Evaluator Notes */}
            <div className="space-y-1.5">
              <label className="block text-[#cdcdcd] font-bold">Official Evaluator Assessment Notes</label>
              <textarea
                rows={3}
                value={evaluatorNotes}
                onChange={(e) => setEvaluatorNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#101114] border border-[#242728] rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 font-bold text-center flex items-center justify-center gap-2">
              ✓ Evaluation Score ({weightedScore}/100) Recorded & Submitted to MSInS State Committee!
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Submit Final Demo Day Evaluation Score ({weightedScore}/100)
            </button>
          )}
        </form>
      </div>

      {/* Modals */}
      <PitchDeckModal
        startup={activeStartup}
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
      />
      <StartupProfileModal
        startup={activeStartup}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
