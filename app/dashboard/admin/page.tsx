import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          MSInS Cross-Department Control Center
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Statewide innovation overview, global escrow ledger health, and jury panel assignments.
        </p>
      </div>

      {/* Analytics Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Active State Charters</span>
          <p className="text-2xl font-bold text-white mt-1">18</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Active Pilots in Execution</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">7</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">Total Escrow Reserved</span>
          <p className="text-2xl font-bold text-purple-400 mt-1">₹1.85 Cr</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg">
          <span className="text-xs text-[#9c9c9d]">GeM Scaled Solutions</span>
          <p className="text-2xl font-bold text-blue-400 mt-1">4</p>
        </div>
      </div>

      {/* Cross Department Table */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Active Department Charters Overview
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cdcdcd]">
            <thead className="bg-[#121212] text-white border-b border-[#242728]">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3">Challenge Title</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Jury Panel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242728]">
              <tr>
                <td className="p-3 font-medium text-white">Transport Dept</td>
                <td className="p-3">Pune Traffic Adaptive Signals</td>
                <td className="p-3">₹25,00,000</td>
                <td className="p-3"><span className="text-amber-400">Milestone Pilot</span></td>
                <td className="p-3">3 Evaluators Assigned</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Health Dept</td>
                <td className="p-3">Rural Maternal Tele-Diagnostics</td>
                <td className="p-3">₹40,00,000</td>
                <td className="p-3"><span className="text-emerald-400">Demo Scheduled</span></td>
                <td className="p-3">4 Evaluators Assigned</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
