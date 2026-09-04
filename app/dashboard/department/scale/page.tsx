import React from "react";

export default function ScaleDecisionPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Scale Decision & GeM Startup Runway Auto-Export
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Transition validated successful pilots into statewide procurement listings on GeM.
        </p>
      </div>

      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4 text-xs">
        <h2 className="text-lg font-semibold text-white">Pilot: Pune Traffic Adaptive Signal Control</h2>

        <div className="p-4 bg-[#121212] border border-[#242728] rounded-md space-y-2">
          <p><strong className="text-white">Validation Result:</strong> PASS (Certified by Dr. Anil Patil, COEP Tech University)</p>
          <p><strong className="text-white">Validated Outcome:</strong> 26.4% commute delay reduction achieved.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-[#cdcdcd] font-medium">Official Scale Decision</label>
          <select className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none">
            <option value="scale_statewide">Scale Statewide across all Municipal Corporations</option>
            <option value="scale_department">Scale Departmentally (Pune District Only)</option>
            <option value="reject">Do Not Scale</option>
          </select>
        </div>

        <div className="p-4 bg-[#101111] border border-[#242728] rounded-md space-y-2">
          <h3 className="font-semibold text-white">Auto-Generated GeM Startup Runway Listing Draft</h3>
          <pre className="p-3 bg-[#07080a] text-emerald-400 font-mono text-[11px] rounded overflow-x-auto">
{`{
  "gem_listing_ref": "GEM-2026-9901",
  "category": "Smart City Traffic AI Systems",
  "vendor_name": "Cognitive Signals India Pvt Ltd",
  "dpiit_number": "DPIIT-2024-10492",
  "validated_performance_metric": "26.4% Peak Commute Delay Reduction",
  "state_precedent": "Govt of Maharashtra - Department of Transport",
  "gfr_relaxation_status": "Rule 173/174 Exempt"
}`}
          </pre>
        </div>

        <button className="px-4 py-2 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 transition">
          Export Structured JSON & Publish to GeM Registry
        </button>
      </div>
    </div>
  );
}
