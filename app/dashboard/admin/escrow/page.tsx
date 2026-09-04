"use client";

import React, { useState } from "react";
import EscrowPaymentGatewayModal from "@/components/EscrowPaymentGatewayModal";
import StartupProfileModal from "@/components/StartupProfileModal";
import { getStartupByEmailOrName, StartupData } from "@/data/mockData";

export default function AdminEscrowPage() {
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<{
    milestoneTitle: string;
    vendorName: string;
    amount: string;
    departmentName: string;
  } | null>(null);

  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [txns, setTxns] = useState([
    {
      id: "e1111111-1111-4111-a111-111111111101",
      department: "Transport & Road Safety",
      pilot: "Pune Adaptive Signal Control",
      vendor: "Cognitive Signals India Pvt Ltd",
      vendorEmail: "founder@cognitive.sparsh.in",
      milestone: "Milestone 1: Camera Edge Calibration",
      amount: "₹10,00,000",
      status: "RELEASED",
    },
    {
      id: "e1111111-1111-4111-a111-111111111102",
      department: "Transport & Road Safety",
      pilot: "Pune Adaptive Signal Control",
      vendor: "Cognitive Signals India Pvt Ltd",
      vendorEmail: "founder@cognitive.sparsh.in",
      milestone: "Milestone 2: Real-time Telemetry & 20% Flow Increase",
      amount: "₹10,00,000",
      status: "RESERVED",
    },
    {
      id: "e1111111-1111-4111-a111-111111111103",
      department: "Public Health & Family Welfare",
      pilot: "Gadchiroli AI Tele-Diagnostics",
      vendor: "HealthPulse Technologies",
      vendorEmail: "founder@healthpulse.sparsh.in",
      milestone: "Milestone 1: Prototype PHC Calibration",
      amount: "₹15,00,000",
      status: "RESERVED",
    },
  ]);

  const handleOpenGateway = (txn: typeof txns[0]) => {
    setSelectedTxn({
      milestoneTitle: txn.milestone,
      vendorName: txn.vendor,
      amount: txn.amount,
      departmentName: txn.department,
    });
    setIsGatewayOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedTxn) {
      setTxns((prev) =>
        prev.map((t) =>
          t.milestone === selectedTxn.milestoneTitle ? { ...t, status: "RELEASED" } : t
        )
      );
    }
  };

  const handleOpenProfile = (email: string) => {
    setSelectedStartup(getStartupByEmailOrName(email));
    setIsProfileOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Global State Escrow Ledger Oversight
          </h1>
          <p className="text-sm text-[#9c9c9d]">
            Statewide real-time audit of all committed, reserved, and released milestone pilot funds.
          </p>
        </div>
        <button
          onClick={() =>
            handleOpenGateway({
              id: "new-txn",
              department: "Department of Urban Development",
              pilot: "Dust & Air Quality Compliance",
              vendor: "EcoPure Environmental Systems",
              vendorEmail: "founder@ecopure.sparsh.in",
              milestone: "Milestone 1: IoT Sensor Network Calibration",
              amount: "₹12,00,000",
              status: "RESERVED",
            })
          }
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
        >
          Open Escrow Payment Gateway
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl">
          <span className="text-xs text-[#9c9c9d]">Total State Escrow Committed</span>
          <p className="text-2xl font-bold text-white mt-1">₹1,85,00,000</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl">
          <span className="text-xs text-[#9c9c9d]">Total Escrow Released</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹75,00,000</p>
        </div>
        <div className="p-4 bg-[#0d0d0d] border border-[#242728] rounded-xl">
          <span className="text-xs text-[#9c9c9d]">Total Escrow Currently Reserved</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">₹1,10,00,000</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="p-6 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#242728] pb-3">
          <h2 className="text-lg font-semibold text-white">Cross-Department Ledger Transactions</h2>
          <span className="text-[#9c9c9d] font-mono text-[11px]">Real-Time RBI RTGS API Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#cdcdcd]">
            <thead className="bg-[#121212] text-white border-b border-[#242728]">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3">Milestone Title</th>
                <th className="p-3">Startup Vendor</th>
                <th className="p-3">Disbursement</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242728]">
              {txns.map((t, idx) => (
                <tr key={idx} className="hover:bg-[#111317] transition">
                  <td className="p-3 font-medium text-white">{t.department}</td>
                  <td className="p-3 text-gray-300">{t.milestone}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenProfile(t.vendorEmail)}
                      className="text-emerald-400 font-semibold hover:underline text-left"
                    >
                      {t.vendor}
                    </button>
                  </td>
                  <td className="p-3 font-bold text-white">{t.amount}</td>
                  <td className="p-3">
                    {t.status === "RELEASED" ? (
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold text-[11px]">
                        ✓ RELEASED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded font-semibold text-[11px]">
                        ⏳ RESERVED
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenGateway(t)}
                      className="px-3 py-1.5 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] rounded-lg font-medium transition"
                    >
                      {t.status === "RELEASED" ? "View Receipt" : "Release Funds Gateway"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Gateway Modal */}
      <EscrowPaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        milestoneTitle={selectedTxn?.milestoneTitle}
        vendorName={selectedTxn?.vendorName}
        amount={selectedTxn?.amount}
        departmentName={selectedTxn?.departmentName}
        onSuccess={handlePaymentSuccess}
      />

      {/* Startup Profile Modal */}
      <StartupProfileModal
        startup={selectedStartup}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
