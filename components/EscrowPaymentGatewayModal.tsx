"use client";

import React, { useState, useEffect } from "react";

interface EscrowPaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneTitle?: string;
  vendorName?: string;
  amount?: string;
  departmentName?: string;
  onSuccess?: () => void;
}

export default function EscrowPaymentGatewayModal({
  isOpen,
  onClose,
  milestoneTitle = "Milestone 2: Real-time Telemetry & 20% Flow Increase",
  vendorName = "Cognitive Signals India Pvt Ltd",
  amount = "₹10,00,000",
  departmentName = "Department of Transport & Road Safety",
  onSuccess,
}: EscrowPaymentGatewayModalProps) {
  const [stage, setStage] = useState<"confirm" | "processing" | "success">("confirm");
  const [progressStep, setProgressStep] = useState(0);

  const steps = [
    "Handshake with State Treasury Direct Disbursement Gateway...",
    "Verifying Independent Validator Digital Certificate Signatures...",
    "Releasing Escrow Reserved Balance via RBI RTGS Direct API...",
    "Writing Transaction Entry to State Auditor Ledger...",
  ];

  useEffect(() => {
    if (!isOpen) {
      setStage("confirm");
      setProgressStep(0);
    }
  }, [isOpen]);

  const handleStartPayment = () => {
    setStage("processing");
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setStage("success");
            if (onSuccess) onSuccess();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0b0c0e] border border-[#242728] rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 bg-[#101216] border-b border-[#242728] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              SPARSH State Treasury Escrow Gateway
            </h3>
          </div>
          {stage !== "processing" && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-base transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* CONFIRMATION STAGE */}
        {stage === "confirm" && (
          <div className="p-6 space-y-5 text-xs text-[#cdcdcd]">
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-1 text-center">
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Total Escrow Fund Disbursement
              </span>
              <span className="text-3xl font-black text-white tracking-tight">{amount}</span>
            </div>

            <div className="space-y-3 bg-[#111317] p-4 border border-[#242728] rounded-xl">
              <div className="flex justify-between border-b border-[#242728] pb-2">
                <span className="text-[#9c9c9d]">Origin Department</span>
                <span className="font-semibold text-white">{departmentName}</span>
              </div>
              <div className="flex justify-between border-b border-[#242728] pb-2">
                <span className="text-[#9c9c9d]">Beneficiary Startup</span>
                <span className="font-semibold text-emerald-400">{vendorName}</span>
              </div>
              <div className="flex justify-between border-b border-[#242728] pb-2">
                <span className="text-[#9c9c9d]">Verified Milestone</span>
                <span className="font-medium text-white truncate max-w-[200px]">{milestoneTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9c9c9d]">Escrow Account Ref</span>
                <span className="font-mono text-gray-300">#ESCROW-MH-2026-9901</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#13151a] border border-[#242728] rounded-xl text-[11px] text-[#9c9c9d]">
              <span className="text-amber-400 font-mono font-bold text-xs">[SEC]</span>
              <span>Protected by State Financial Security Protocol & Independent Validator Signature.</span>
            </div>

            <button
              onClick={handleStartPayment}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              Release Escrow Funds Now
            </button>
          </div>
        )}

        {/* PROCESSING STAGE (HIGH TECH ANIMATION) */}
        {stage === "processing" && (
          <div className="p-8 text-center space-y-6">
            {/* Animated Spinner */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold animate-pulse">
                ESC
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white tracking-tight">Processing Escrow Disbursement</h4>
              <p className="text-xs text-[#9c9c9d]">Communicating with State Financial Treasury Server...</p>
            </div>

            {/* Step Progress Tracker */}
            <div className="space-y-2 text-left max-w-sm mx-auto">
              {steps.map((stepText, idx) => {
                const isCompleted = idx < progressStep;
                const isCurrent = idx === progressStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                        : isCurrent
                        ? "bg-[#161922] border-emerald-500 text-white font-medium scale-[1.02]"
                        : "bg-[#0f1013] border-[#242728] text-gray-600"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                      {isCompleted ? "✓" : isCurrent ? "..." : "○"}
                    </span>
                    <span className="truncate">{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUCCESS STAGE (ANIMATED CHECKMARK & RECEIPT) */}
        {stage === "success" && (
          <div className="p-8 text-center space-y-6 animate-scale-up">
            {/* Animated Checkmark Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-4xl shadow-xl shadow-emerald-500/20">
              ✓
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white tracking-tight">Escrow Released Successfully!</h4>
              <p className="text-xs text-emerald-400 font-medium">Funds transferred to {vendorName}</p>
            </div>

            {/* Transaction Receipt Card */}
            <div className="bg-[#101217] p-4 border border-[#242728] rounded-xl space-y-2 text-xs text-left">
              <div className="flex justify-between border-b border-[#242728] pb-1.5">
                <span className="text-[#9c9c9d]">Transaction Hash</span>
                <span className="font-mono text-emerald-400 font-bold">#TXN-ESCROW-2026-{Math.floor(10000 + Math.random() * 90000)}</span>
              </div>
              <div className="flex justify-between border-b border-[#242728] pb-1.5">
                <span className="text-[#9c9c9d]">Disbursed Amount</span>
                <span className="font-bold text-white">{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9c9c9d]">Ledger Timestamp</span>
                <span className="font-mono text-gray-300">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert("Downloading Official State Escrow Ledger Receipt PDF...")}
                className="flex-1 py-2.5 bg-[#16181d] hover:bg-[#22252c] text-gray-300 border border-[#242728] font-semibold text-xs rounded-xl transition"
              >
                Download Receipt
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg"
              >
                Close Gateway
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
