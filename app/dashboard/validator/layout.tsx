"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col font-sans">
      <Navbar
        portalName="Independent Validator Console"
        badgeColor="bg-cyan-500"
        navLinks={[
          { label: "Validation Review Queue", href: "/dashboard/validator" },
        ]}
      />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
