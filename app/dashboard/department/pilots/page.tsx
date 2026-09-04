"use client";

import React, { useState } from "react";
import EscrowPaymentGatewayModal from "@/components/EscrowPaymentGatewayModal";
import StartupProfileModal from "@/components/StartupProfileModal";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName, StartupData } from "@/data/mockData";

export default function DepartmentPilotsPage() {
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const cognitiveStartup = getStartupByEmailOrName("founder@cognitive.sparsh.in");

  const [isReleased, setIsReleased] = useState(false);

  const handleVerify = () => {
    setIsGatewayOpen(true);
  };

  const handleSuccess = () => {
    setIsReleased(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Pilot Evidence Review & Milestone Verification Queue
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Review startup evidence submissions and verify milestones to trigger escrow fund releases.
        </p>
      </div>

      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <h2 className="text-lg font-semibold text-white">Pending Evidence Submissions</h2>
          <span className="text-xs text-amber-400 font-mono font-semibold">1 Action Item Requiring Officer Approval</span>
        </div>

        <div className="p-5 bg-[#121215] border border-[#242728] rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#242728] pb-3 flex-wrap gap-2">
            <div>
              <span className="text-amber-400 font-mono text-[11px] block">
                Milestone 2: Real-time Telemetry & 20% Flow Increase
              </span>
              <button
                onClick={() => {
                  setSelectedStartup(cognitiveStartup);
                  setIsProfileOpen(true);
                }}
                className="font-bold text-white text-base hover:text-emerald-400 transition text-left"
              >
                Cognitive Signals India Pvt Ltd (Pune Traffic Pilot)
              </button>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#9c9c9d] block">Escrow Amount</span>
              <span className="text-lg font-extrabold text-white">₹10,00,000</span>
            </div>
          </div>

          <div className="p-4 bg-[#0a0b0d] border border-[#242728] rounded-xl text-[#cdcdcd] space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-white">Evidence Submitted:</strong> Karve Road 14-Day Traffic Telemetry Logs (CSV), Video Analytics Proof (MP4)
            </p>
            <p>
              <strong className="text-white">Startup Field Notes:</strong> Demonstrated 22.4% average delay reduction across 4 key junctions during peak morning hours without physical road geometry changes.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {!isReleased ? (
              <button
                onClick={handleVerify}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                Verify & Release Escrow Funds (₹10,00,000)
              </button>
            ) : (
              <span className="px-4 py-2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl font-bold text-xs">
                ✓ Escrow Disbursed to Startup Bank Account (#TXN-ESCROW-2026-9901)
              </span>
            )}

            <button
              onClick={() => {
                setSelectedStartup(cognitiveStartup);
                setIsPitchDeckOpen(true);
              }}
              className="px-4 py-2.5 bg-[#16181d] hover:bg-[#22252c] text-emerald-300 border border-emerald-800/80 font-semibold rounded-xl transition"
            >
              View Proposal Pitch Deck
            </button>
            <button
              onClick={() => {
                setSelectedStartup(cognitiveStartup);
                setIsProfileOpen(true);
              }}
              className="px-4 py-2.5 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] font-semibold rounded-xl transition"
            >
              View Startup Profile
            </button>
          </div>
        </div>
      </div>

      <EscrowPaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        milestoneTitle="Milestone 2: Real-time Telemetry & 20% Flow Increase"
        vendorName={cognitiveStartup.name}
        amount="₹10,00,000"
        departmentName="Department of Transport & Road Safety"
        onSuccess={handleSuccess}
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
    </div>
  );
}
