"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ROLE_DASHBOARDS: Record<string, string> = {
  department_officer: "/dashboard/department",
  startup_founder: "/dashboard/startup",
  msins_admin: "/dashboard/admin",
  evaluator: "/dashboard/evaluator",
  validator: "/dashboard/validator",
};

const ROLE_LABELS: Record<string, string> = {
  department_officer: "Dept Officer",
  startup_founder: "Startup Founder",
  msins_admin: "MSInS Admin",
  evaluator: "Jury Evaluator",
  validator: "Independent Validator",
};

interface NavbarProps {
  portalName?: string;
  badgeColor?: string;
  navLinks?: { label: string; href: string }[];
}

export default function Navbar({ portalName, badgeColor = "bg-red-500", navLinks }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);
        // Fetch role from profiles or metadata
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        const role =
          profile?.role ||
          (currentUser.app_metadata?.role as string) ||
          (currentUser.user_metadata?.role as string) ||
          "startup_founder";

        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    }

    checkAuth();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    router.push("/");
    router.refresh();
  };

  const targetDashboard = userRole ? ROLE_DASHBOARDS[userRole] || "/dashboard/startup" : "/login";

  return (
    <header className="h-[56px] border-b border-[#242728] bg-[#07080a] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand Emblem */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className={`w-3 h-3 rounded-full ${badgeColor} inline-block group-hover:scale-110 transition-transform`} />
          <span className="font-extrabold text-lg tracking-tight text-white font-mono">
            SPARSH
          </span>
        </a>
        <span className="text-xs text-[#9c9c9d] border-l border-[#242728] pl-3 hidden md:inline-block font-medium">
          {portalName || "Govt. of Maharashtra — MSInS Procurement Hub"}
        </span>
      </div>

      {/* Nav Links & Action Cluster */}
      <nav className="flex items-center gap-5 text-xs text-[#cdcdcd] font-medium">
        {navLinks ? (
          navLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="hover:text-white transition">
              {link.label}
            </a>
          ))
        ) : (
          <>
            <a href="/#pipeline" className="hover:text-white transition hidden md:inline-block">
              6-Stage Pipeline
            </a>
            <a href="/#registry" className="hover:text-white transition hidden md:inline-block">
              Success Registry
            </a>
            <a href="/dashboard/startup/discover" className="hover:text-white transition hidden sm:inline-block">
              Open Charters
            </a>
          </>
        )}

        {/* User Auth State & Actions */}
        {!loading && user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-[#242728]">
            <span className="px-2.5 py-1 bg-[#101114] border border-[#242728] rounded-md text-emerald-400 font-semibold text-[11px]">
              {userRole ? ROLE_LABELS[userRole] || userRole : "Authenticated User"}
            </span>

            <a
              href={targetDashboard}
              className="px-3.5 py-1.5 bg-[#16181d] hover:bg-[#22252c] text-white border border-[#242728] font-semibold rounded-md transition"
            >
              Dashboard →
            </a>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/80 font-semibold rounded-md transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/login" className="hover:text-white transition">
              Sign In
            </a>
            <a
              href="/login"
              className="px-4 py-1.5 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition shadow-md"
            >
              Access Portal
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
