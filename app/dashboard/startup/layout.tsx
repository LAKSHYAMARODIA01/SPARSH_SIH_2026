"use client";

import React from "react";
import Navbar from "@/components/Navbar";

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col font-sans">
      <Navbar
        portalName="Startup Founder Workspace"
        badgeColor="bg-emerald-500"
        navLinks={[
          { label: "My Workspace", href: "/dashboard/startup" },
          { label: "Discover Challenges", href: "/dashboard/startup/discover" },
          { label: "Pilot Evidence", href: "/dashboard/startup/workspace" },
          { label: "Escrow Tracker", href: "/dashboard/startup/escrow" },
        ]}
      />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
