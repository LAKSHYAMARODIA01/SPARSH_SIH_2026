"use client";

import React, { useState } from "react";
import StartupProfileModal from "@/components/StartupProfileModal";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName, StartupData } from "@/data/mockData";

export default function AdminDirectoryPage() {
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const panel = [
    { name: "Prof. Ramesh Deshmukh", org: "IIT Bombay", role: "Evaluator", email: "evaluator.deshmukh@sparsh.in" },
    { name: "Dr. Sunita Sharma", org: "VNJTI Mumbai", role: "Evaluator", email: "evaluator.sharma@sparsh.in" },
    { name: "Dr. Anil Patil", org: "COEP Tech University", role: "Validator", email: "validator.patil@sparsh.in" },
    { name: "Meera Joshi", org: "Quality Council of India", role: "Validator", email: "validator.joshi@sparsh.in" },
  ];

  const featuredStartups = [
    getStartupByEmailOrName("founder@cognitive.sparsh.in"),
    getStartupByEmailOrName("founder@healthpulse.sparsh.in"),
    getStartupByEmailOrName("founder@agrisense.sparsh.in"),
  ];

  const handleOpenProfile = (s: StartupData) => {
    setSelectedStartup(s);
    setIsProfileOpen(true);
  };

  const handleOpenDeck = (s: StartupData) => {
    setSelectedStartup(s);
    setIsPitchDeckOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            State Panel Experts & Startup Directory
          </h1>
          <p className="text-sm text-[#9c9c9d]">
            Manage jury members, independent validators, and verified DPIIT startups across Maharashtra.
          </p>
        </div>
        <button
          onClick={() => alert("Add Expert Panel Member Modal triggered")}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
        >
          + Add Expert Panel Member
        </button>
      </div>

      {/* Featured DPIIT Startups Section */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <h2 className="text-lg font-semibold text-white">Registered DPIIT Verified Startups</h2>
          <span className="text-xs text-emerald-400 font-mono">22 Active Vendors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {featuredStartups.map((startup, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#121215] border border-[#242728] hover:border-emerald-800/60 rounded-xl space-y-3 transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono block">{startup.dpiit}</span>
                <h3 className="font-bold text-white text-sm">{startup.name}</h3>
                <p className="text-[#9c9c9d] text-[11px]">Founder: {startup.founder}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {startup.sectorTags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 bg-[#171920] text-gray-300 rounded text-[10px]">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2 border-t border-[#242728]">
                <button
                  onClick={() => handleOpenProfile(startup)}
                  className="flex-1 py-1.5 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] rounded-lg font-medium transition text-center"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleOpenDeck(startup)}
                  className="flex-1 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 rounded-lg font-medium transition text-center"
                >
                  Pitch Deck
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jury Panel Directory */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4">
        <h2 className="text-lg font-semibold text-white">Registered Panel Experts</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cdcdcd]">
            <thead className="bg-[#121212] text-white border-b border-[#242728]">
              <tr>
                <th className="p-3">Full Name</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Panel Role</th>
                <th className="p-3">Email Address</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242728]">
              {panel.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#111317] transition">
                  <td className="p-3 font-medium text-white">{p.name}</td>
                  <td className="p-3 text-gray-300">{p.org}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        p.role === "Evaluator"
                          ? "bg-blue-950 text-blue-400 border border-blue-800"
                          : "bg-cyan-950 text-cyan-400 border border-cyan-800"
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-gray-300">{p.email}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert(`Assigning ${p.name} to Challenge Charter...`)}
                      className="px-3 py-1.5 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] rounded-lg text-[11px] font-medium transition"
                    >
                      Assign to Charter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
