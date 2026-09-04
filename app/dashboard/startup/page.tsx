import React from "react";

export default function StartupDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Startup Founder Portal
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Track open Maharashtra state challenges, application statuses, and milestone escrow payouts.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Applications Submitted</span>
          <p className="text-2xl font-bold text-white mt-1">3</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Shortlisted Challenges</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">1</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Escrow Funds Reserved</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">₹15,00,000</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Escrow Funds Released</span>
          <p className="text-2xl font-bold text-blue-400 mt-1">₹5,00,000</p>
        </div>
      </div>

      {/* Active Milestone Workspace */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Active Pilot: Pune Traffic Edge AI Optimization
        </h2>
        
        <div className="space-y-3">
          <div className="p-4 bg-[#121212] border border-[#242728] rounded-md flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-mono">Milestone 1 — VERIFIED & PAID</span>
              <h4 className="font-medium text-white">Sensor Calibration & Baseline Deployment</h4>
              <p className="text-xs text-[#9c9c9d]">Released: ₹5,00,000 via Escrow Ledger</p>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded border border-emerald-800">
              Paid
            </span>
          </div>

          <div className="p-4 bg-[#121212] border border-[#242728] rounded-md flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-400 font-mono">Milestone 2 — DUE IN 5 DAYS</span>
              <h4 className="font-medium text-white">Real-Time Flow Telemetry & 20% Throughput Proof</h4>
              <p className="text-xs text-[#9c9c9d]">Reserved: ₹5,00,000 in Escrow</p>
            </div>
            <button className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200 transition">
              Upload Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
