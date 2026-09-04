"use client";

import React, { useState } from "react";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName } from "@/data/mockData";

export default function StartupDiscoverPage() {
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [filterSector, setFilterSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const myStartup = getStartupByEmailOrName("founder@cognitive.sparsh.in");

  const challenges = [
    {
      id: "c1111111-1111-4111-a111-111111111102",
      dept: "Department of Transport & Road Safety",
      title: "Pune Urban Junction Adaptive Traffic Signal Control",
      budget: "₹30,00,000",
      duration: "90 Days",
      sector: "Traffic AI",
      sensitivity: "MEDIUM",
      matchScore: 94,
      aiRationale: "Direct capability match with Computer Vision & Edge AI sensors. GFR Rule 173/174 turnover relaxation active.",
    },
    {
      id: "c1111111-1111-4111-a111-111111111103",
      dept: "Department of Agriculture & Farmer Welfare",
      title: "Hyperspectral Yield Prediction for Vidarbha Cotton",
      budget: "₹20,00,000",
      duration: "150 Days",
      sector: "AgriTech",
      sensitivity: "LOW",
      matchScore: 78,
      aiRationale: "High computer vision overlap; requires satellite GIS model integration.",
    },
    {
      id: "c1111111-1111-4111-a111-111111111104",
      dept: "Water Resources & Irrigation Department",
      title: "Canal Seepage Detection & Automated Sluice Control",
      budget: "₹35,00,000",
      duration: "90 Days",
      sector: "Water Systems",
      sensitivity: "LOW",
      matchScore: 82,
      aiRationale: "IoT edge telemetry component matches startup sensor stack.",
    },
    {
      id: "c1111111-1111-4111-a111-111111111101",
      dept: "Department of Public Health & Family Welfare",
      title: "Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs",
      budget: "₹25,00,000",
      duration: "120 Days",
      sector: "HealthTech",
      sensitivity: "HIGH",
      matchScore: 65,
      aiRationale: "Requires medical device certifications; low primary domain overlap.",
    },
  ];

  const filteredChallenges = challenges.filter((c) => {
    const matchesSector = filterSector === "all" || c.sector.toLowerCase().includes(filterSector.toLowerCase());
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#14161c] text-[#57c1ff] border border-[#242728] rounded text-[11px] font-mono font-semibold">
              AI Department Match Active
            </span>
            <span className="px-2.5 py-0.5 bg-[#14161c] text-[#59d499] border border-[#242728] rounded text-[11px] font-mono font-semibold">
              GFR Rule 173/174 Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Discover Maharashtra State Procurement Challenges
          </h1>
          <p className="text-xs text-[#9c9c9d]">
            Charters ranked by Groq Llama 3.3 70B & pgvector compatibility scores against <strong className="text-white">{myStartup.name}</strong>.
          </p>
        </div>
        <button
          onClick={() => setIsPitchDeckOpen(true)}
          className="px-4 py-2.5 bg-white text-black hover:bg-[#e8e8e8] font-semibold text-xs rounded-md shadow-md transition flex items-center gap-2"
        >
          Preview My Pitch Deck
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center justify-between flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search charters by title or department..."
            className="w-full px-3.5 py-2 bg-[#101114] border border-[#242728] rounded-lg text-white focus:outline-none focus:border-[#434345]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#9c9c9d]">Filter Sector:</span>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-3 py-2 bg-[#101114] border border-[#242728] rounded-lg text-white focus:outline-none focus:border-[#434345]"
          >
            <option value="all">All Sectors</option>
            <option value="Traffic AI">Traffic AI / Mobility</option>
            <option value="AgriTech">AgriTech / GIS</option>
            <option value="Water Systems">Water Systems / IoT</option>
            <option value="HealthTech">HealthTech / Triage</option>
          </select>
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((c) => (
          <div
            key={c.id}
            className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl flex flex-col justify-between space-y-4 hover:border-[#434345] transition group relative overflow-hidden"
          >
            {/* Match Score Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#9c9c9d] block truncate">{c.dept}</span>
                <h3 className="font-bold text-white text-base group-hover:text-[#59d499] transition">{c.title}</h3>
              </div>
              <div className="text-right shrink-0">
                <span className="px-3 py-1 bg-[#1c1213] text-[#ff6161] border border-[#ff6161]/40 rounded-lg font-mono font-extrabold text-xs block">
                  {c.matchScore}% Match
                </span>
                <span className="text-[10px] text-[#6c6d6e]">AI Score</span>
              </div>
            </div>

            {/* AI Rationale Box */}
            <div className="p-3 bg-[#111317] border border-[#242728] rounded-lg space-y-1">
              <span className="text-[10px] text-[#57c1ff] font-bold uppercase tracking-wider block font-mono">AI Match Rationale</span>
              <p className="text-[#cdcdcd] text-xs leading-relaxed">{c.aiRationale}</p>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#242728] text-xs">
              <div>
                <span className="text-[10px] text-[#9c9c9d] block">Budget Ceiling</span>
                <span className="font-bold text-white font-mono">{c.budget}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9c9c9d] block">Pilot Period</span>
                <span className="font-semibold text-[#cdcdcd]">{c.duration}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9c9c9d] block">Data Sensitivity</span>
                <span className="font-mono text-[#57c1ff] font-bold">{c.sensitivity}</span>
              </div>
            </div>

            {/* Apply Button */}
            <a
              href={`/dashboard/startup/discover/${c.id}/apply`}
              className="block text-center py-2.5 bg-[#101111] hover:bg-[#18191a] text-white border border-[#242728] font-bold text-xs rounded-md shadow-md transition"
            >
              Submit Proposal & Pitch Deck &rarr;
            </a>
          </div>
        ))}
      </div>

      {/* Embedded Pitch Deck Modal */}
      <PitchDeckModal
        startup={myStartup}
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </div>
  );
}
