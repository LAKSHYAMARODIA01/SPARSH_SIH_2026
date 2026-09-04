import React from "react";

export default function ValidatorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Assigned Pilot Validation Queue
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Review completed pilot evidence against original outcome metrics and issue formal validation reports.
        </p>
      </div>

      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Completed Pilot Pending Validation: Cognitive Signals (Pune Traffic)
        </h2>

        <div className="p-4 bg-[#121212] border border-[#242728] rounded-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#242728] pb-3">
            <div>
              <h4 className="font-medium text-white">Original Metric: 25% Traffic Throughput Increase</h4>
              <p className="text-xs text-[#9c9c9d]">5 Milestones Completed • All Escrow Funds Verified & Paid</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
              Ready for Decision
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-[#9c9c9d]">Validation Decision Outcome</label>
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-2 text-white">
                <input type="radio" name="outcome" value="pass" defaultChecked className="accent-cyan-500" />
                PASS (Statewide Scale Eligible)
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="radio" name="outcome" value="conditional" className="accent-cyan-500" />
                CONDITIONAL PASS
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="radio" name="outcome" value="fail" className="accent-cyan-500" />
                FAIL
              </label>
            </div>
          </div>

          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded transition">
            Publish Official Validation Report
          </button>
        </div>
      </div>
    </div>
  );
}
