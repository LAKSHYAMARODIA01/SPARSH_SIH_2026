"use client";

import React, { useState } from "react";
import EscrowPaymentGatewayModal from "@/components/EscrowPaymentGatewayModal";
import PitchDeckModal from "@/components/PitchDeckModal";
import { getStartupByEmailOrName } from "@/data/mockData";

export default function StartupEscrowPage() {
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const myStartup = getStartupByEmailOrName("founder@cognitive.sparsh.in");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Escrow Ledger & Payment Tracker
          </h1>
          <p className="text-sm text-[#9c9c9d]">
            Real-time state machine ledger tracking reserved funds and verified milestone releases.
          </p>
        </div>
        <button
          onClick={() => setIsPitchDeckOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
        >
          View Submitted Pitch Deck
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl">
          <span className="text-xs text-[#9c9c9d]">Total Pilot Contract Ceiling</span>
          <p className="text-2xl font-bold text-white mt-1">₹30,00,000</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl">
          <span className="text-xs text-[#9c9c9d]">Escrow Funds Released (Paid)</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹10,00,000</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl">
          <span className="text-xs text-[#9c9c9d]">Escrow Funds Reserved</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">₹10,00,000</p>
        </div>
      </div>

      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <h2 className="text-lg font-semibold text-white">Immutable Escrow Transaction History</h2>
          <span className="text-xs text-[#9c9c9d] font-mono">DPIIT Verified Account</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cdcdcd]">
            <thead className="bg-[#121212] text-white border-b border-[#242728]">
              <tr>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Milestone</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Type</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242728]">
              <tr className="hover:bg-[#111317] transition">
                <td className="p-3 font-mono text-emerald-400">#e1111111-1111-4111-a111-111111111101</td>
                <td className="p-3 font-medium text-white">Milestone 1: Camera Edge Calibration</td>
                <td className="p-3 font-bold text-white">₹10,00,000</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold text-[11px]">
                    ✓ RELEASED
                  </span>
                </td>
                <td className="p-3 text-gray-400">2026-08-20 14:32</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setIsGatewayOpen(true)}
                    className="px-3 py-1 bg-[#16181d] hover:bg-[#22252c] text-gray-300 border border-[#242728] rounded font-medium transition"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#111317] transition">
                <td className="p-3 font-mono text-amber-400">#e1111111-1111-4111-a111-111111111102</td>
                <td className="p-3 font-medium text-white">Milestone 2: Real-time Telemetry & Flow</td>
                <td className="p-3 font-bold text-white">₹10,00,000</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded font-semibold text-[11px]">
                    ⏳ RESERVED
                  </span>
                </td>
                <td className="p-3 text-gray-400">2026-09-01 09:00</td>
                <td className="p-3 text-right">
                  <span className="text-[11px] text-gray-500 italic">Pending Officer Release</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <EscrowPaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        milestoneTitle="Milestone 1: Camera Edge Sensor Calibration"
        vendorName={myStartup.name}
        amount="₹10,00,000"
        departmentName="Department of Transport & Road Safety"
      />

      <PitchDeckModal
        startup={myStartup}
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </div>
  );
}
