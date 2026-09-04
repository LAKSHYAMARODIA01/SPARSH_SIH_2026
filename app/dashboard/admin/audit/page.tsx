import React from "react";

export default function AdminAuditPage() {
  const logs = [
    { time: "2026-09-04 14:22:01", user: "health.dept@sparsh-gov.in", action: "PUBLISH_CHARTER", entity: "challenge_charters", id: "#c1111111-1111-4111-a111-111111111101" },
    { time: "2026-09-04 12:10:45", user: "evaluator.deshmukh@sparsh.in", action: "SUBMIT_EVALUATION", entity: "demo_evaluations", id: "#score-9901" },
    { time: "2026-09-03 16:05:12", user: "transport.dept@sparsh-gov.in", action: "VERIFY_MILESTONE", entity: "milestones", id: "#81111111-1111-4111-a111-111111111101" },
    { time: "2026-09-03 16:05:13", user: "SYSTEM_ESCROW_ENGINE", action: "RELEASE_ESCROW_FUNDS", entity: "escrow_ledger_entries", id: "#e1111111-1111-4111-a111-111111111101" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Immutable System Audit Trail
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Append-only state transition audit trail documenting every evaluation score, milestone verification, and payment trigger.
        </p>
      </div>

      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">System Audit Log Entries</h2>
          <button className="px-3 py-1 bg-[#121212] hover:bg-[#242728] border border-[#242728] text-white rounded">
            Export Audit Trail (CSV)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#cdcdcd]">
            <thead className="bg-[#121212] text-white border-b border-[#242728]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User / Service</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Entity</th>
                <th className="p-3">Entity Reference ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242728]">
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-mono text-[#9c9c9d]">{log.time}</td>
                  <td className="p-3 font-medium text-white">{log.user}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[#101111] border border-[#242728] font-mono text-emerald-400 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-[#9c9c9d]">{log.entity}</td>
                  <td className="p-3 font-mono text-xs">{log.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
