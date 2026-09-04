"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AIMatchingModal from "@/components/AIMatchingModal";
import StartupProfileModal from "@/components/StartupProfileModal";
import PitchDeckModal from "@/components/PitchDeckModal";
import EscrowPaymentGatewayModal from "@/components/EscrowPaymentGatewayModal";
import { getStartupByEmailOrName, StartupData } from "@/data/mockData";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isAIMatchOpen, setIsAIMatchOpen] = useState(false);
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"charters" | "startups" | "escrow" | "ai">("charters");
  const [searchQuery, setSearchQuery] = useState("");
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleQuickLogin = async (demoEmail: string, targetRole: string) => {
    setLoggingIn(demoEmail);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: "Sparsh@2026",
      });

      if (error) {
        console.error("Login Error:", error.message);
        setLoggingIn(null);
        return;
      }

      const roleDashboards: Record<string, string> = {
        department_officer: "/dashboard/department",
        startup_founder: "/dashboard/startup",
        msins_admin: "/dashboard/admin",
        evaluator: "/dashboard/evaluator",
        validator: "/dashboard/validator",
      };

      const target = roleDashboards[targetRole] || "/dashboard/startup";
      router.push(target);
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoggingIn(null);
    }
  };

  const cognitiveStartup = getStartupByEmailOrName("founder@cognitive.sparsh.in");

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] font-sans flex flex-col selection:bg-red-500 selection:text-white relative overflow-hidden">
      {/* Signature Red Diagonal Stripe Gradient Band (DESIGN-raycast hero motif) */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-[#ff5757]/20 via-[#a1131a]/15 to-transparent pointer-events-none transform -skew-y-3 origin-top-left z-0 opacity-70" />

      {/* Universal Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 px-6 max-w-5xl mx-auto text-center space-y-6">
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#101114] text-red-400 border border-red-900/50 rounded-full text-xs font-mono shadow-inner">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          MAHARASHTRA STATE INNOVATION SOCIETY (MSInS) • SIH 2026 PS ID 26136
        </div>

        {/* Display Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-feature-ss03 max-w-4xl mx-auto">
          Startup Procurement, Acceleration & Escrow Scaling Hub
        </h1>

        <p className="text-base sm:text-lg text-[#cdcdcd] max-w-2xl mx-auto leading-relaxed">
          Accelerated government pilot procurement for DPIIT-recognized startups under GFR Rule 173/174 exemptions with automated AI matchmaking and performance-linked escrow ledger payments.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          <a
            href="/login"
            className="px-6 py-3 bg-white text-black font-extrabold text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition shadow-xl flex items-center gap-2"
          >
            Access Portal Login →
          </a>
          <button
            onClick={() => setIsAIMatchOpen(true)}
            className="px-6 py-3 bg-[#101114] hover:bg-[#1a1c22] text-white border border-[#242728] font-bold text-xs sm:text-sm rounded-lg transition flex items-center gap-2"
          >
            Run AI Matchmaker Engine
          </button>
        </div>
      </section>

      {/* HERO COMMAND-PALETTE MOCKUP (DESIGN-raycast load-bearing UI screenshot motif) */}
      <section className="relative z-10 px-6 pb-16 max-w-5xl mx-auto w-full">
        <div className="bg-[#0d0d0d] border border-[#242728] rounded-2xl shadow-2xl overflow-hidden text-xs">
          {/* Command Palette Header */}
          <div className="px-4 py-3 bg-[#101114] border-b border-[#242728] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-[#9c9c9d] font-mono text-[11px] ml-2">SPARSH Command Palette (⌘ K)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#9c9c9d]">
              <span className="px-1.5 py-0.5 bg-[#18191c] border border-[#242728] rounded">⌘ K</span>
              <span className="px-1.5 py-0.5 bg-[#18191c] border border-[#242728] rounded">Esc</span>
            </div>
          </div>

          {/* Search Field Bar */}
          <div className="p-4 border-b border-[#242728] bg-[#07080a] flex items-center gap-3">
            <span className="text-[#9c9c9d] font-mono text-xs">FIND</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenge charters, DPIIT startups, escrow status, AI match scores..."
              className="w-full bg-transparent text-white font-medium focus:outline-none placeholder-[#6a6b6c] text-sm"
            />
          </div>

          {/* Segmented Filter Pills */}
          <div className="p-3 bg-[#0d0d0d] border-b border-[#242728] flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("charters")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeTab === "charters" ? "bg-[#101111] text-white border border-[#242728]" : "text-[#9c9c9d] hover:text-white"
              }`}
            >
              Challenge Charters (4 Active)
            </button>
            <button
              onClick={() => setActiveTab("startups")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeTab === "startups" ? "bg-[#101111] text-white border border-[#242728]" : "text-[#9c9c9d] hover:text-white"
              }`}
            >
              DPIIT Verified Startups (22 Active)
            </button>
            <button
              onClick={() => setActiveTab("escrow")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeTab === "escrow" ? "bg-[#101111] text-white border border-[#242728]" : "text-[#9c9c9d] hover:text-white"
              }`}
            >
              Escrow Ledger (₹1.85 Cr)
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeTab === "ai" ? "bg-[#101111] text-white border border-[#242728]" : "text-[#9c9c9d] hover:text-white"
              }`}
            >
              Groq AI Matchmaker
            </button>
          </div>

          {/* Interactive Row Mockup */}
          <div className="p-4 space-y-2.5 bg-[#0a0b0d]">
            {activeTab === "charters" && (
              <>
                <div
                  onClick={() => setIsAIMatchOpen(true)}
                  className="p-3.5 bg-[#121215] hover:bg-[#181920] border border-[#242728] rounded-xl flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400 font-mono text-xs font-bold">
                      TRF
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Pune Urban Junction Adaptive Traffic Signal Control</h4>
                      <p className="text-[11px] text-[#9c9c9d]">Transport Dept • Budget: ₹30,00,000 • Status: Active Pilot</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded font-semibold text-[11px]">
                    94% AI Match
                  </span>
                </div>

                <div
                  onClick={() => setIsAIMatchOpen(true)}
                  className="p-3.5 bg-[#121215] hover:bg-[#181920] border border-[#242728] rounded-xl flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">
                      HLT
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs</h4>
                      <p className="text-[11px] text-[#9c9c9d]">Health Dept • Budget: ₹25,00,000 • Status: Demo Scheduled</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded font-semibold text-[11px]">
                    91% AI Match
                  </span>
                </div>
              </>
            )}

            {activeTab === "startups" && (
              <>
                <div
                  onClick={() => {
                    setSelectedStartup(cognitiveStartup);
                    setIsProfileOpen(true);
                  }}
                  className="p-3.5 bg-[#121215] hover:bg-[#181920] border border-[#242728] rounded-xl flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                      C
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Cognitive Signals India Pvt Ltd</h4>
                      <p className="text-[11px] text-[#9c9c9d]">DPIIT-2024-10492 • GFR Rule 173/174 Exemption Verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStartup(cognitiveStartup);
                        setIsPitchDeckOpen(true);
                      }}
                      className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold text-[11px]"
                    >
                      Pitch Deck
                    </button>
                    <span className="text-[#9c9c9d] font-mono text-[11px]">View Profile →</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === "escrow" && (
              <div
                onClick={() => setIsEscrowOpen(true)}
                className="p-3.5 bg-[#121215] hover:bg-[#181920] border border-[#242728] rounded-xl flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                    ESC
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Milestone 2: Real-time Telemetry & 20% Flow Increase</h4>
                    <p className="text-[11px] text-[#9c9c9d]">Beneficiary: Cognitive Signals India • Transport Dept Escrow</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">₹10,00,000</span>
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded font-semibold text-[10px]">
                    Click to Release
                  </span>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div
                onClick={() => setIsAIMatchOpen(true)}
                className="p-4 bg-[#121215] hover:bg-[#181920] border border-purple-800/60 rounded-xl space-y-2 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 text-sm">Groq Llama 3.3 70B File Note Justification</span>
                  <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[10px] font-mono">
                    94% Cosine Match
                  </span>
                </div>
                <p className="text-[#cdcdcd] italic text-[11px]">
                  "Startup's adaptive edge-vision telemetry directly matches Pune Traffic's outcome metric of 25% throughput increase without hardware replacements."
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1-CLICK DEMO LOGIN SELECTOR SECTION */}
      <section className="py-16 px-6 bg-[#0d0d0d] border-t border-b border-[#242728]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs text-emerald-400 font-mono font-semibold">UNIVERSAL DEMO PASSWORD: Sparsh@2026</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instant 1-Click Role Access Portals
            </h2>
            <p className="text-sm text-[#9c9c9d]">Select any demo persona below to log in directly into their isolated role portal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              {
                role: "department_officer",
                email: "health.dept@sparsh-gov.in",
                name: "Dr. Rajesh Kulkarni",
                title: "Health Officer",
                desc: "Public Health & Family Welfare",
              },
              {
                role: "department_officer",
                email: "transport.dept@sparsh-gov.in",
                name: "Anand Bhosale",
                title: "Transport Officer",
                desc: "Transport & Road Safety",
              },
              {
                role: "startup_founder",
                email: "founder@cognitive.sparsh.in",
                name: "Aarav Mehta",
                title: "Startup Founder",
                desc: "Cognitive Signals India",
              },
              {
                role: "msins_admin",
                email: "admin.chief@sparsh.in",
                name: "Dr. Ashish Deshmukh",
                title: "MSInS Chief Admin",
                desc: "State Operations Command",
              },
              {
                role: "evaluator",
                email: "evaluator.deshmukh@sparsh.in",
                name: "Prof. Ramesh Deshmukh",
                title: "Jury Evaluator",
                desc: "IIT Bombay Tech Advisor",
              },
            ].map((persona, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickLogin(persona.email, persona.role)}
                disabled={loggingIn === persona.email}
                className="p-4 bg-[#121215] hover:bg-[#1a1c22] border border-[#242728] hover:border-emerald-800/60 rounded-xl text-left space-y-2 transition flex flex-col justify-between group disabled:opacity-50"
              >
                <div>
                  <span className="font-bold text-white text-sm block group-hover:text-emerald-400 transition">
                    {persona.title}
                  </span>
                  <span className="text-[11px] text-[#9c9c9d] block mt-0.5">{persona.desc}</span>
                </div>
                <div className="pt-2 border-t border-[#242728] text-[10px] font-mono text-[#6a6b6c]">
                  {loggingIn === persona.email ? "Logging in..." : persona.email}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6 STAGE PIPELINE ROADMAP */}
      <section id="pipeline" className="py-16 px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enforced 6-Stage Innovation Pathway
          </h2>
          <p className="text-sm text-[#9c9c9d]">
            Every challenge moves through an audited state machine to guarantee speed, transparency, and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: "01", name: "Challenge Charter", desc: "Outcome-based problem wizard with real-time AI feedback." },
            { step: "02", name: "AI Matchmaking", desc: "pgvector similarity search + Groq Llama file note justifications." },
            { step: "03", name: "Demo Day Jury", desc: "Weighted 4-part rubric evaluation by expert jury panels." },
            { step: "04", name: "Milestone Escrow", desc: "3-5 milestone budget reserve with instant verification release." },
            { step: "05", name: "Validation", desc: "Third-party independent validation against original metrics." },
            { step: "06", name: "Statewide Scale", desc: "Pre-filled GeM Startup Runway export & public registry listing." },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-2">
              <span className="text-xs font-mono text-red-400 font-bold">{item.step}</span>
              <h3 className="font-semibold text-sm text-white">{item.name}</h3>
              <p className="text-xs text-[#9c9c9d]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLIC SUCCESS REGISTRY */}
      <section id="registry" className="py-16 px-6 bg-[#0d0d0d] border-t border-[#242728]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Public Success Registry</h2>
              <p className="text-sm text-[#9c9c9d]">Proven, validated startup solutions scaled across Maharashtra departments.</p>
            </div>
            <span className="px-3.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold">
              4 Scaled Solutions Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#111317] border border-[#242728] rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">Scaled Statewide • GeM #GEM-2026-9901</span>
                <span className="text-xs text-[#9c9c9d]">Transport Dept</span>
              </div>
              <h3 className="font-bold text-lg text-white">Cognitive Signals — Adaptive Traffic Edge Signals</h3>
              <p className="text-xs text-[#cdcdcd] leading-relaxed">
                Achieved 26.4% reduction in peak-hour delays across Karve Road, Pune without physical road geometry changes.
              </p>
              <div className="pt-3 flex items-center justify-between text-xs text-[#9c9c9d] border-t border-[#242728]">
                <span>Validator: Dr. Anil Patil (COEP Tech)</span>
                <span className="text-white font-bold">Budget: ₹30,00,000</span>
              </div>
            </div>

            <div className="p-6 bg-[#111317] border border-[#242728] rounded-2xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">Scaled Departmentally • GeM #GEM-2026-4412</span>
                <span className="text-xs text-[#9c9c9d]">Public Health Dept</span>
              </div>
              <h3 className="font-bold text-lg text-white">HealthPulse — Gadchiroli Remote AI Tele-Triage</h3>
              <p className="text-xs text-[#cdcdcd] leading-relaxed">
                Deployed across 42 Primary Health Centres, enabling 92% diagnostic accuracy for maternal risk triage.
              </p>
              <div className="pt-3 flex items-center justify-between text-xs text-[#9c9c9d] border-t border-[#242728]">
                <span>Validator: Quality Council of India</span>
                <span className="text-white font-bold">Budget: ₹25,00,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (DESIGN-raycast footer-section spec) */}
      <footer className="py-12 px-6 border-t border-[#242728] bg-[#07080a] text-xs text-[#6a6b6c] space-y-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="font-bold text-white text-base font-mono">SPARSH</span>
            <span className="text-xs text-[#9c9c9d] border-l border-[#242728] pl-3">
              Maharashtra State Innovation Society (MSInS)
            </span>
          </div>

          <div className="flex items-center gap-6 text-[#cdcdcd]">
            <a href="/login" className="hover:text-white transition">Sign In</a>
            <a href="/signup" className="hover:text-white transition">Register Startup</a>
            <a href="/#pipeline" className="hover:text-white transition">6-Stage Pathway</a>
            <a href="/#registry" className="hover:text-white transition">Success Registry</a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[#242728] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© 2026 Government of Maharashtra • Department of Skills, Employment, Entrepreneurship & Innovation.</p>
          <p className="font-mono text-[#9c9c9d]">SIH 2026 PS ID 26136 • Single-Server App Router Architecture</p>
        </div>
      </footer>

      {/* Modals */}
      <AIMatchingModal
        isOpen={isAIMatchOpen}
        onClose={() => setIsAIMatchOpen(false)}
      />
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
      <EscrowPaymentGatewayModal
        isOpen={isEscrowOpen}
        onClose={() => setIsEscrowOpen(false)}
      />
    </div>
  );
}
