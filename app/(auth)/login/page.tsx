"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ROLE_DASHBOARDS: Record<string, string> = {
  department_officer: "/dashboard/department",
  startup_founder: "/dashboard/startup",
  msins_admin: "/dashboard/admin",
  evaluator: "/dashboard/evaluator",
  validator: "/dashboard/validator",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Supabase Auth Sign-In
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // 2. Fetch User Profile to get assigned Role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const role =
          profile?.role ||
          (data.user.app_metadata?.role as string) ||
          (data.user.user_metadata?.role as string) ||
          "startup_founder";

        const targetDashboard = ROLE_DASHBOARDS[role] || "/dashboard/startup";
        router.push(targetDashboard);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Sparsh@2026");
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <h1 className="text-2xl font-bold tracking-tight">SPARSH Login</h1>
          </div>
          <p className="text-xs text-[#9c9c9d]">
            Sign in to access your role-specific SPARSH dashboard portal.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded text-red-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#cdcdcd] mb-1 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="health.dept@sparsh-gov.in"
              className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[#cdcdcd] mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Demo Account Quick-Fill Helper Buttons */}
        <div className="pt-4 border-t border-[#242728] space-y-2 text-xs">
          <span className="text-[#9c9c9d] font-mono text-[11px] block text-center">
            Quick-Fill Demo Accounts (Password: Sparsh@2026):
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => handleQuickFill("health.dept@sparsh-gov.in")}
              className="px-2 py-1 bg-[#101111] hover:bg-[#242728] border border-[#242728] text-gray-300 rounded text-left truncate"
            >
              Health Dept Officer
            </button>
            <button
              onClick={() => handleQuickFill("transport.dept@sparsh-gov.in")}
              className="px-2 py-1 bg-[#101111] hover:bg-[#242728] border border-[#242728] text-gray-300 rounded text-left truncate"
            >
              Transport Officer
            </button>
            <button
              onClick={() => handleQuickFill("founder@cognitive.sparsh.in")}
              className="px-2 py-1 bg-[#101111] hover:bg-[#242728] border border-[#242728] text-emerald-400 rounded text-left truncate"
            >
              Cognitive Startup
            </button>
            <button
              onClick={() => handleQuickFill("admin.chief@sparsh.in")}
              className="px-2 py-1 bg-[#101111] hover:bg-[#242728] border border-[#242728] text-purple-400 rounded text-left truncate"
            >
              MSInS Chief Admin
            </button>
            <button
              onClick={() => handleQuickFill("evaluator.deshmukh@sparsh.in")}
              className="px-2 py-1 bg-[#101111] hover:bg-[#242728] border border-[#242728] text-blue-400 rounded text-left truncate"
            >
              Jury Evaluator
            </button>
            <button
              onClick={() => handleQuickFill("validator.patil@sparsh.in")}
              className="px-2 py-1 bg-[#101111] hover:bg-[#242728] border border-[#242728] text-cyan-400 rounded text-left truncate"
            >
              Independent Validator
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#6a6b6c]">
          Don't have an account?{" "}
          <a href="/signup" className="text-white hover:underline">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
