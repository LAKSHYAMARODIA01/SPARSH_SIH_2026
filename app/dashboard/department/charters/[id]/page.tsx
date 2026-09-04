"use client";

import React, { useState, use } from "react";
import AIMatchingModal from "@/components/AIMatchingModal";
import StartupProfileModal from "@/components/StartupProfileModal";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName, getCharterById, MOCK_STARTUPS, StartupData } from "@/data/mockData";

export default function CharterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const charterId = resolvedParams?.id || "c1111111-1111-4111-a111-111111111102";
  const charter = getCharterById(charterId);

  const [isAIMatchOpen, setIsAIMatchOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const matchedStartup = MOCK_STARTUPS[charter.matchedStartupKey] || getStartupByEmailOrName("founder@cognitive.sparsh.in");

  const handleOpenProfile = (startup: StartupData) => {
    setSelectedStartup(startup);
    setIsProfileOpen(true);
  };

  const handleOpenDeck = (startup: StartupData) => {
    setSelectedStartup(startup);
    setIsPitchDeckOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400">Charter ID: #{charter.id}</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {charter.title}
          </h1>
          <p className="text-sm text-[#9c9c9d]">
            {charter.department} • Budget Ceiling: {charter.budget}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIMatchOpen(true)}
            className="px-4 py-2 bg-[#101111] hover:bg-[#18191c] text-[#57c1ff] border border-[#242728] font-bold text-xs rounded-lg transition flex items-center gap-1.5"
          >
            Run AI Matchmaker Engine
          </button>
          <span className="px-3 py-2 bg-[#14161c] text-[#cdcdcd] border border-[#242728] rounded-lg text-xs font-mono font-semibold">
            {charter.stageLabel}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-2">
          <h3 className="font-semibold text-white text-sm">Problem Statement</h3>
          <p className="text-[#cdcdcd] leading-relaxed">
            {charter.problem}
          </p>
        </div>

        <div className="p-5 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-2">
          <h3 className="font-semibold text-white text-sm">Target Success Outcome Metric</h3>
          <p className="text-[#cdcdcd] leading-relaxed">
            {charter.successMetric}
          </p>
        </div>
      </div>

      {/* AI Matched Startup Shortlist */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Matched Shortlist (Groq Llama 3.3 70B)</h2>
            <p className="text-xs text-[#9c9c9d]">Ranked by pgvector Cosine Similarity Embeddings</p>
          </div>
          <button
            onClick={() => setIsAIMatchOpen(true)}
            className="text-xs text-[#57c1ff] font-semibold hover:underline"
          >
            Re-run Matchmaker &rarr;
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-5 bg-[#121214] border border-[#242728] hover:border-[#434345] rounded-xl space-y-3 transition">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 font-extrabold bg-[#1c1213] text-[#ff6161] border border-[#ff6161]/40 rounded-lg text-xs font-mono">
                  {charter.matchScore}% Match
                </span>
                <button
                  onClick={() => handleOpenProfile(matchedStartup)}
                  className="font-bold text-white text-sm hover:text-[#59d499] transition text-left"
                >
                  {matchedStartup.name}
                </button>
                <span className="px-2 py-0.5 bg-[#10141a] text-[#57c1ff] border border-[#242728] rounded text-[10px] font-mono">
                  DPIIT Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDeck(matchedStartup)}
                  className="px-3 py-1.5 bg-[#101111] hover:bg-[#18191a] text-[#59d499] border border-[#242728] rounded-lg font-medium transition"
                >
                  View Pitch Deck
                </button>
                <span className="text-[#59d499] font-bold px-3 py-1 bg-[#14161c] border border-[#242728] rounded-lg font-mono">
                  Selected Finalist
                </span>
              </div>
            </div>

            <p className="text-[#cdcdcd] p-3 bg-[#0a0b0d] border border-[#242728] rounded-lg italic">
              "{charter.aiJustification}"
            </p>

            <div className="flex items-center justify-between pt-1 text-[11px] text-[#9c9c9d]">
              <span>{charter.gfrStatus}</span>
              <button
                onClick={() => handleOpenProfile(matchedStartup)}
                className="text-white hover:underline font-medium"
              >
                View Full Founder & Technical Profile &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Matching Modal */}
      <AIMatchingModal
        isOpen={isAIMatchOpen}
        onClose={() => setIsAIMatchOpen(false)}
        charterTitle={charter.title}
        departmentName={charter.department}
      />

      {/* Profile & Pitch Deck Modals */}
      <StartupProfileModal
        startup={selectedStartup}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <PitchDeckModal
        startup={selectedStartup}
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </div>
  );
}
