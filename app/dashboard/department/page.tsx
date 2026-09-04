"use client";

import React, { useState } from "react";
import StartupProfileModal from "@/components/StartupProfileModal";
import AIMatchingModal from "@/components/AIMatchingModal";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName, StartupData, MOCK_STARTUPS } from "@/data/mockData";

export default function DepartmentDashboardPage() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAIMatchOpen, setIsAIMatchOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const stages = [
    { id: 1, name: "1. Challenge Charter", count: 2, badge: "Draft / Published" },
    { id: 2, name: "2. AI Match", count: 4, badge: "Shortlisted" },
    { id: 3, name: "3. Demo Day", count: 1, badge: "Scheduled" },
    { id: 4, name: "4. Milestone Pilot", count: 3, badge: "Escrow Reserved" },
    { id: 5, name: "5. Validation", count: 1, badge: "Under Review" },
    { id: 6, name: "6. Scale-Up", count: 2, badge: "GeM Exported" },
  ];

  const charters = [
    {
      id: "c1111111-1111-4111-a111-111111111102",
      title: "Pune Urban Junction Adaptive Traffic Signal Control",
      stageId: 4,
      stageLabel: "4. Milestone Pilot",
      department: "Department of Transport & Road Safety",
      budget: "₹30,00,000",
      duration: "90 Days",
      dataSensitivity: "MEDIUM",
      problem: "Severe rush-hour bottlenecks on Karve Road and Hinjewadi IT corridor due to fixed-timer traffic signals.",
      successMetric: "Reduce peak-hour commuter delay times by minimum 25% without altering physical road geometry.",
      matchedStartupKey: "cognitive-signals",
      matchScore: 94,
      aiJustification: "Startup's adaptive edge-vision system matches Pune Traffic's outcome metric of 25% throughput increase without hardware replacements.",
      gfrStatus: "GFR Rule 173/174 Turnover Exemption Active",
    },
    {
      id: "c1111111-1111-4111-a111-111111111101",
      title: "Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs",
      stageId: 3,
      stageLabel: "3. Demo Day",
      department: "Department of Public Health & Family Welfare",
      budget: "₹25,00,000",
      duration: "120 Days",
      dataSensitivity: "HIGH",
      problem: "Primary Health Centres in remote Gadchiroli lack specialist doctors, leading to delayed maternal and emergency diagnostics.",
      successMetric: "Achieve 90% diagnostic accuracy vs certified doctors and reduce triage transfer delays by 40%.",
      matchedStartupKey: "healthpulse",
      matchScore: 91,
      aiJustification: "Portable diagnostic kit running offline LLM & ECG analysis matches Gadchiroli PHC constraint of zero cellular connectivity.",
      gfrStatus: "GFR Rule 173/174 Turnover Exemption Active",
    },
    {
      id: "c1111111-1111-4111-a111-111111111103",
      title: "Hyperspectral Yield Prediction for Vidarbha Cotton",
      stageId: 1,
      stageLabel: "1. Challenge Charter",
      department: "Department of Agriculture & Farmer Welfare",
      budget: "₹20,00,000",
      duration: "150 Days",
      dataSensitivity: "LOW",
      problem: "Pest outbreaks and unpredictable rain ruin cotton crop yields in Yavatmal and Wardha without early warning.",
      successMetric: "Provide 14-day advance pest risk warning with >85% field validation accuracy across 5000 hectares.",
      matchedStartupKey: "agrisense",
      matchScore: 88,
      aiJustification: "Multispectral satellite telemetry combined with micro-weather station AI model provides early warning for Pink Bollworm.",
      gfrStatus: "GFR Rule 173/174 Turnover Exemption Active",
    },
  ];

  const filteredCharters = selectedStage
    ? charters.filter((c) => c.stageId === selectedStage)
    : charters;

  const handleOpenStartupProfile = (startupKey: string) => {
    const startup = MOCK_STARTUPS[startupKey] || getStartupByEmailOrName(startupKey);
    setSelectedStartup(startup);
    setIsProfileOpen(true);
  };

  const handleOpenPitchDeck = (startupKey: string) => {
    const startup = MOCK_STARTUPS[startupKey] || getStartupByEmailOrName(startupKey);
    setSelectedStartup(startup);
    setIsPitchDeckOpen(true);
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#14161c] text-[#cdcdcd] border border-[#242728] rounded text-[11px] font-mono">
              State Portal ID: PS-26136
            </span>
            <span className="px-2 py-0.5 bg-[#14161c] text-[#59d499] border border-[#242728] rounded text-[11px] font-mono">
              MSInS GFR Rule 173/174 Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Department Challenge Pipeline
          </h1>
          <p className="text-xs text-[#9c9c9d]">
            Manage outcome-based problem charters, inspect AI shortlists, review startup dossiers, and monitor milestone escrow pilots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIMatchOpen(true)}
            className="px-4 py-2.5 bg-[#101111] hover:bg-[#18191c] text-[#57c1ff] border border-[#242728] text-xs font-semibold rounded-md transition"
          >
            Run AI Matchmaker
          </button>
          <a
            href="/dashboard/department/charters/new"
            className="px-4 py-2.5 bg-white text-black hover:bg-[#e8e8e8] font-semibold text-xs rounded-md transition"
          >
            + Create Challenge Charter
          </a>
        </div>
      </div>

      {/* Interactive Kanban Pipeline Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#9c9c9d]">
          <span>Pipeline Stage Navigation (Click stage to inspect active charters)</span>
          {selectedStage && (
            <button
              onClick={() => setSelectedStage(null)}
              className="text-white hover:underline text-[11px]"
            >
              Clear Filter (Show All 6 Stages)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage) => {
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition ${
                  isSelected
                    ? "bg-[#14161c] border-white text-white shadow-lg"
                    : "bg-[#0d0d0d] border-[#242728] text-[#9c9c9d] hover:border-[#434345] hover:text-white"
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider block text-[#9c9c9d]">
                    {stage.badge}
                  </span>
                  <h3 className="font-semibold text-xs text-white mt-1">{stage.name}</h3>
                </div>
                <div className="pt-3 border-t border-[#242728] mt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#6a6b6c]">Active</span>
                  <span className="text-base font-bold text-white font-mono">{stage.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed View of Problem Charters & Matched Startups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {selectedStage
                ? `Active Charters in ${stages.find((s) => s.id === selectedStage)?.name}`
                : "Active Department Problem Charters & Startup AI Shortlists"}
            </h2>
            <p className="text-xs text-[#9c9c9d]">
              Click any startup or charter card below to inspect full DPIIT profile, pitch deck, or procurement roadmap.
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-[#101111] text-[#cdcdcd] border border-[#242728]">
            Showing {filteredCharters.length} Problem Charters
          </span>
        </div>

        <div className="space-y-5">
          {filteredCharters.map((charter) => {
            const startup = MOCK_STARTUPS[charter.matchedStartupKey] || getStartupByEmailOrName(charter.matchedStartupKey);

            return (
              <div
                key={charter.id}
                className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-5 hover:border-[#434345] transition"
              >
                {/* Charter Header */}
                <div className="flex items-start justify-between flex-wrap gap-4 border-b border-[#242728] pb-4">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2 py-0.5 bg-[#14161c] text-[#57c1ff] border border-[#242728] rounded font-mono text-[10px]">
                        {charter.stageLabel}
                      </span>
                      <span className="text-[#9c9c9d]">{charter.department}</span>
                      <span className="text-[#6a6b6c]">•</span>
                      <span className="font-mono text-[#6a6b6c]">{charter.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{charter.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/dashboard/department/charters/${charter.id}`}
                      className="px-3.5 py-2 bg-[#101111] hover:bg-[#18191a] text-white border border-[#242728] font-semibold text-xs rounded-md transition"
                    >
                      View Full Charter Dossier &rarr;
                    </a>
                  </div>
                </div>

                {/* Problem & Outcome Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#101111] border border-[#242728] rounded-md space-y-1.5">
                    <span className="text-[10px] text-[#9c9c9d] font-semibold uppercase tracking-wider block">
                      Problem Context
                    </span>
                    <p className="text-[#cdcdcd] leading-relaxed">{charter.problem}</p>
                  </div>

                  <div className="p-4 bg-[#101111] border border-[#242728] rounded-md space-y-1.5">
                    <span className="text-[10px] text-[#9c9c9d] font-semibold uppercase tracking-wider block">
                      Target Outcome Metric
                    </span>
                    <p className="text-[#cdcdcd] leading-relaxed">{charter.successMetric}</p>
                  </div>

                  <div className="p-4 bg-[#101111] border border-[#242728] rounded-md space-y-2">
                    <span className="text-[10px] text-[#9c9c9d] font-semibold uppercase tracking-wider block">
                      Procurement Constraints
                    </span>
                    <div className="space-y-1 text-[#cdcdcd]">
                      <div className="flex justify-between">
                        <span className="text-[#9c9c9d]">Budget Ceiling:</span>
                        <span className="font-bold text-white font-mono">{charter.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9c9c9d]">Pilot Duration:</span>
                        <span>{charter.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9c9c9d]">Data Sensitivity:</span>
                        <span className="font-mono text-[#57c1ff]">{charter.dataSensitivity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matched Startup Detail Card */}
                <div className="p-5 bg-[#121212] border border-[#242728] rounded-md space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#242728] pb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-2.5 py-1 bg-[#1c1213] text-[#ff6161] border border-[#ff6161]/40 font-mono font-bold text-xs rounded">
                        {charter.matchScore}% AI Match
                      </span>

                      <button
                        onClick={() => handleOpenStartupProfile(charter.matchedStartupKey)}
                        className="text-base font-bold text-white hover:text-[#59d499] transition text-left"
                      >
                        {startup.name}
                      </button>

                      <span className="px-2 py-0.5 bg-[#10141a] text-[#57c1ff] border border-[#242728] text-[10px] font-mono rounded">
                        DPIIT Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPitchDeck(charter.matchedStartupKey)}
                        className="px-3 py-1.5 bg-[#101111] hover:bg-[#18191a] text-[#59d499] border border-[#242728] text-xs font-medium rounded transition"
                      >
                        View Interactive Pitch Deck
                      </button>
                      <button
                        onClick={() => handleOpenStartupProfile(charter.matchedStartupKey)}
                        className="px-3 py-1.5 bg-[#101111] hover:bg-[#18191a] text-white border border-[#242728] text-xs font-medium rounded transition"
                      >
                        Inspect Full Profile & Roadmap &rarr;
                      </button>
                    </div>
                  </div>

                  {/* AI Justification Notes */}
                  <div className="p-3 bg-[#0a0b0d] border border-[#242728] rounded text-xs text-[#cdcdcd] space-y-1">
                    <span className="text-[10px] text-[#57c1ff] font-mono uppercase tracking-wider block font-bold">
                      Groq Llama 3.3 70B AI Justification File Note
                    </span>
                    <p className="italic">"{charter.aiJustification}"</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#9c9c9d] flex-wrap gap-2">
                    <span>Founder: <strong className="text-white">{startup.founder}</strong> ({startup.email})</span>
                    <span className="font-mono text-[#59d499]">{charter.gfrStatus}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Directory of All Registered Startups */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <div>
            <h2 className="text-base font-bold text-white">All Registered Startup Company Dossiers</h2>
            <p className="text-xs text-[#9c9c9d]">Click any company to open full DPIIT credentials, Udyam registration, and procurement roadmap.</p>
          </div>
          <span className="text-xs font-mono text-[#9c9c9d]">22 Startups Registered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {Object.values(MOCK_STARTUPS).map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setSelectedStartup(st);
                setIsProfileOpen(true);
              }}
              className="p-4 bg-[#121212] border border-[#242728] hover:border-[#59d499] rounded-md text-left space-y-2 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#59d499]">DPIIT Verified</span>
                <span className="text-[10px] text-[#9c9c9d] font-mono">{st.dpiit}</span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-[#59d499] transition">{st.name}</h4>
              <p className="text-[#9c9c9d] text-[11px]">Founder: {st.founder}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {st.sectorTags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#101111] border border-[#242728] rounded text-[#9c9c9d] text-[10px]">
                    #{tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <StartupProfileModal
        startup={selectedStartup}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <AIMatchingModal
        isOpen={isAIMatchOpen}
        onClose={() => setIsAIMatchOpen(false)}
        charterTitle="Pune Urban Junction Adaptive Traffic Signal Control"
        departmentName="Department of Transport & Road Safety"
      />
      <PitchDeckModal
        startup={selectedStartup}
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </div>
  );
}
