"use client";

import React, { useState, use } from "react";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName, getCharterById } from "@/data/mockData";

export default function StartupApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const charterId = resolvedParams?.id || "c1111111-1111-4111-a111-111111111103";
  const charter = getCharterById(charterId);

  const [deckUrl, setDeckUrl] = useState("https://storage.sparsh.in/decks/cognitive_traffic_deck.pdf");
  const [statement, setStatement] = useState(
    `Our adaptive telemetry system directly addresses the target outcome metric for "${charter.title}" using real-time edge AI telemetry without altering infrastructure.`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const myStartup = getStartupByEmailOrName("founder@cognitive.sparsh.in");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs text-emerald-400 font-mono font-semibold">
          ✓ DPIIT Exemption Active (GFR Rule 173/174)
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Submit Challenge Application Proposal
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Your verified DPIIT credentials and pitch deck will be evaluated by the Groq AI Matchmaking Engine.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 bg-[#0d0d0d] border border-emerald-800/60 rounded-2xl space-y-4 text-center animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <h3 className="text-xl font-bold text-white">Application Submitted Successfully!</h3>
          <p className="text-xs text-[#cdcdcd]">
            Your proposal has been logged on the state ledger. The AI Matchmaker has assigned an initial compatibility score of <strong>94%</strong>.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setIsPitchDeckOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
            >
              Preview Submitted Deck
            </button>
            <a
              href="/dashboard/startup/workspace"
              className="px-4 py-2 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] font-semibold text-xs rounded-xl transition inline-block"
            >
              Go to Founder Workspace →
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#cdcdcd] font-medium">Pitch Deck Document Link / PDF URL</label>
              <button
                type="button"
                onClick={() => setIsPitchDeckOpen(true)}
                className="text-emerald-400 font-semibold hover:underline text-[11px]"
              >
                Preview Interactive Deck
              </button>
            </div>
            <input
              type="url"
              required
              value={deckUrl}
              onChange={(e) => setDeckUrl(e.target.value)}
              placeholder="https://storage.sparsh.in/decks/startup_pitch_deck.pdf"
              className="w-full px-3 py-2.5 bg-[#101114] border border-[#242728] rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[#cdcdcd] mb-1 font-medium">Capability & Solution Statement</label>
            <textarea
              rows={4}
              required
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Detail how your solution directly addresses the department's outcome metric..."
              className="w-full px-3 py-2.5 bg-[#101114] border border-[#242728] rounded-xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="p-4 bg-[#12141a] border border-[#242728] rounded-xl text-[#9c9c9d] space-y-1.5 leading-relaxed">
            <p><strong className="text-white">Auto-Attached Government Credentials:</strong></p>
            <p>• DPIIT Recognition: <span className="text-emerald-400 font-mono font-bold">#DPIIT-2024-10492</span> (Verified)</p>
            <p>• GFR Rule 173/174 Exemption: <span className="text-emerald-400 font-bold">APPLIED</span> (Prior turnover waived)</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            Submit Official Proposal & Trigger AI Matchmaker
          </button>
        </form>
      )}

      <PitchDeckModal
        startup={myStartup}
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </div>
  );
}
