"use client";

import React from "react";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col font-sans">
      <Navbar
        portalName="MSInS State Admin Command"
        badgeColor="bg-purple-500"
        navLinks={[
          { label: "Analytics Overview", href: "/dashboard/admin" },
          { label: "State Jury Directory", href: "/dashboard/admin/directory" },
          { label: "Global Escrow Ledger", href: "/dashboard/admin/escrow" },
          { label: "State Audit Logs", href: "/dashboard/admin/audit" },
        ]}
      />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
