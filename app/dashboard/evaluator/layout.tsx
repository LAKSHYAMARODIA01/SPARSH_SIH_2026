"use client";

import React from "react";
import Navbar from "@/components/Navbar";

export default function EvaluatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col font-sans">
      <Navbar
        portalName="Jury Evaluator Portal"
        badgeColor="bg-blue-500"
        navLinks={[
          { label: "Evaluation Console", href: "/dashboard/evaluator" },
          { label: "Submitted Decks", href: "#" },
        ]}
      />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
