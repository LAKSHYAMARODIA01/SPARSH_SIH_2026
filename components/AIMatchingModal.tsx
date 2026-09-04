"use client";

import React, { useState } from "react";
import { getStartupByEmailOrName, StartupData } from "@/data/mockData";
import StartupProfileModal from "./StartupProfileModal";
import PitchDeckModal from "./PitchDeckModal";

interface AIMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  charterTitle?: string;
  departmentName?: string;
}

export default function AIMatchingModal({
  isOpen,
  onClose,
  charterTitle = "Pune Urban Junction Adaptive Traffic Signal Control",
  departmentName = "Department of Transport & Road Safety",
}: AIMatchingModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasRun, setHasRun] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const matchedResults = [
    {
      startup: getStartupByEmailOrName("founder@cognitive.sparsh.in"),
      score: 94,
      justification:
        "AI File Note: Cognitive Signals' adaptive edge-vision telemetry directly matches Pune Traffic's outcome metric of 25% throughput increase without hardware replacements.",
      rank: 1,
    },
    {
      startup: getStartupByEmailOrName("founder@healthpulse.sparsh.in"),
      score: 88,
      justification:
        "AI File Note: Solution offers reliable telemetry sensor integration suitable for municipal data feeds, though primary domain is health diagnostic triage.",
      rank: 2,
    },
    {
      startup: getStartupByEmailOrName("founder@agrisense.sparsh.in"),
      score: 82,
      justification:
        "AI File Note: High satellite GIS capability; adaptable for urban land-use heatmaps and traffic corridor spatial overlays.",
      rank: 3,
    },
  ];

  const handleRunMatch = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasRun(true);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
        <div className="w-full max-w-3xl bg-[#0b0c0e] border border-[#242728] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 bg-[#101216] border-b border-[#242728] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">
                AI
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  SPARSH AI Matchmaking Engine (Groq Llama 3.3 70B)
                </h3>
                <p className="text-xs text-[#9c9c9d]">
                  pgvector Cosine Similarity & Automated File Note Justification
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-base transition"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#cdcdcd]">
            {/* Charter Context Card */}
            <div className="p-4 bg-[#111317] border border-[#242728] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#9c9c9d] uppercase tracking-wider block">Target Challenge Charter</span>
                <span className="font-bold text-white text-sm">{charterTitle}</span>
                <p className="text-[11px] text-gray-400 mt-0.5">{departmentName}</p>
              </div>
              <button
                onClick={handleRunMatch}
                disabled={isScanning}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition shadow-lg shrink-0 flex items-center gap-1.5"
              >
                {isScanning ? "Scanning 22 Startups..." : "Re-run AI Matchmaker"}
              </button>
            </div>

            {/* SCANNING ANIMATION STATE */}
            {isScanning && (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto" />
                <p className="font-semibold text-white">Running Groq AI Capability Vector Analysis...</p>
                <p className="text-[#9c9c9d]">Evaluating 22 DPIIT-registered startups against outcome benchmarks...</p>
              </div>
            )}

            {/* MATCH RESULTS CARDS */}
            {!isScanning && hasRun && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Top Matched Startup Finalists</h4>
                  <span className="text-[11px] text-emerald-400 font-mono">3 Verified Matches Found</span>
                </div>

                <div className="space-y-3">
                  {matchedResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#111317] border border-[#242728] hover:border-purple-900/60 rounded-xl space-y-3 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-bold text-xs flex items-center justify-center">
                            #{item.rank}
                          </span>
                          <h5 className="font-bold text-white text-sm">{item.startup.name}</h5>
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-semibold">
                            DPIIT Verified
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 font-black text-xs rounded-lg">
                            {item.score}% Match
                          </span>
                        </div>
                      </div>

                      <p className="p-3 bg-[#0d0e11] border border-[#242728] rounded-lg text-[#d1d5db] italic">
                        "{item.justification}"
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedStartup(item.startup);
                            setIsProfileOpen(true);
                          }}
                          className="px-3 py-1.5 bg-[#171920] hover:bg-[#232630] text-white border border-[#242728] rounded-lg font-medium transition"
                        >
                          View Startup Profile
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStartup(item.startup);
                            setIsPitchDeckOpen(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 rounded-lg font-medium transition"
                        >
                          View Pitch Deck
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </>
  );
}
