"use client";

import React from "react";
import Navbar from "@/components/Navbar";

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080a] text-[#f4f4f6] flex flex-col font-sans">
      <Navbar
        portalName="Department Officer Portal"
        badgeColor="bg-red-500"
        navLinks={[
          { label: "Kanban Pipeline", href: "/dashboard/department" },
          { label: "New Charter", href: "/dashboard/department/charters/new" },
          { label: "Pilot Queue", href: "/dashboard/department/pilots" },
          { label: "Scale Decisions", href: "/dashboard/department/scale" },
        ]}
      />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
