"use client";

import React, { useState } from "react";
import { evaluateCharterQuality } from "@/utils/ai/groq";

export default function NewCharterWizardPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [metric, setMetric] = useState("");
  const [budget, setBudget] = useState("2500000");
  const [duration, setDuration] = useState("90");
  const [sensitivity, setSensitivity] = useState("medium");
  
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiCheck = async () => {
    if (!problem || !metric) return;
    setLoadingAi(true);
    const res = await evaluateCharterQuality(problem, metric);
    setAiScore(res.score);
    setAiFeedback(res.feedback);
    setLoadingAi(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create Challenge Charter — Step {step} of 4
        </h1>
        <p className="text-sm text-[#9c9c9d]">
          Formulate an outcome-based problem statement with live Groq AI quality scoring.
        </p>
      </div>

      {/* Stepper bar */}
      <div className="flex items-center gap-2 border-b border-[#242728] pb-4 text-xs font-medium">
        <span className={`px-3 py-1 rounded ${step === 1 ? "bg-white text-black font-bold" : "bg-[#121212] text-gray-400"}`}>
          1. Problem & Metric
        </span>
        <span className={`px-3 py-1 rounded ${step === 2 ? "bg-white text-black font-bold" : "bg-[#121212] text-gray-400"}`}>
          2. Budget & Timeline
        </span>
        <span className={`px-3 py-1 rounded ${step === 3 ? "bg-white text-black font-bold" : "bg-[#121212] text-gray-400"}`}>
          3. Sensitivity & IP
        </span>
        <span className={`px-3 py-1 rounded ${step === 4 ? "bg-white text-black font-bold" : "bg-[#121212] text-gray-400"}`}>
          4. Review & Publish
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form area */}
        <div className="md:col-span-2 p-6 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#cdcdcd] mb-1 font-medium">Challenge Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pune Urban Junction Adaptive Traffic Signal Control"
                  className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cdcdcd] mb-1 font-medium">Operational Problem Description</label>
                <textarea
                  rows={4}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe the operational bottleneck without assuming a specific hardware solution..."
                  className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cdcdcd] mb-1 font-medium">Target Success Outcome Metric</label>
                <textarea
                  rows={3}
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  placeholder="e.g. Achieve 25% peak-hour traffic throughput increase without physical road widening."
                  className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#cdcdcd] mb-1 font-medium">Pilot Budget Ceiling (₹ INR)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none"
                />
                <p className="text-[11px] text-[#6a6b6c] mt-1">Sum of milestone payments cannot exceed this ceiling.</p>
              </div>

              <div>
                <label className="block text-[#cdcdcd] mb-1 font-medium">Pilot Duration (Days)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[#cdcdcd] mb-1 font-medium">Data & IP Sensitivity Tier</label>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none"
                >
                  <option value="low">Low (Public data, general municipal optimization)</option>
                  <option value="medium">Medium (Operational telemetry data)</option>
                  <option value="high">High (Citizen health records, police forensics)</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Charter Summary Confirmation</h3>
              <div className="p-3 bg-[#121212] rounded space-y-1 text-[#cdcdcd]">
                <p><strong className="text-white">Title:</strong> {title || "Pune Urban Junction Traffic Control"}</p>
                <p><strong className="text-white">Budget Ceiling:</strong> ₹{Number(budget).toLocaleString()}</p>
                <p><strong className="text-white">Duration:</strong> {duration} Days</p>
                <p><strong className="text-white">Sensitivity:</strong> {sensitivity.toUpperCase()}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-[#242728]">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-1.5 bg-[#101111] text-white border border-[#242728] rounded hover:bg-[#242728] disabled:opacity-50"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-1.5 bg-white text-black font-semibold rounded hover:bg-gray-200"
              >
                Continue
              </button>
            ) : (
              <a
                href="/dashboard/department"
                className="px-4 py-1.5 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 inline-block"
              >
                Publish Charter & Run AI Match
              </a>
            )}
          </div>
        </div>

        {/* Live Groq AI Feedback Sidebar */}
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-lg space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#242728] pb-2">
            <h3 className="font-semibold text-white">Groq AI Quality Checker</h3>
            <span className="text-[10px] text-red-400 font-mono">groq/compound</span>
          </div>

          <button
            onClick={handleAiCheck}
            disabled={loadingAi}
            className="w-full py-1.5 bg-[#121212] hover:bg-[#242728] border border-[#242728] text-white rounded font-medium"
          >
            {loadingAi ? "Evaluating with Groq..." : "Evaluate Measurability"}
          </button>

          {aiScore !== null && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[#9c9c9d]">Outcome Quality Score:</span>
                <span className="font-bold text-emerald-400 text-sm">{aiScore}/100</span>
              </div>
              <p className="text-[#cdcdcd] bg-[#121212] p-2.5 rounded border border-[#242728]">
                {aiFeedback}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
