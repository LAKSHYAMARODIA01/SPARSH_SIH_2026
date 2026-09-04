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

export default function SignupPage() {
  const [role, setRole] = useState("startup_founder");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const redirectOrigin =
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-sih-2026.vercel.app";

      const targetDashboard = ROLE_DASHBOARDS[role] || "/dashboard/startup";

      // 1. Supabase Auth Sign Up with current host email confirmation redirect
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${redirectOrigin}/auth/callback?next=${encodeURIComponent(targetDashboard)}`,
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // 2. Insert or Upsert into public.profiles
        await supabase.from("profiles").upsert({
          id: data.user.id,
          role,
          full_name: fullName,
          email,
          verified: true,
        });

        // 3. Redirect to role dashboard
        const targetDashboard = ROLE_DASHBOARDS[role] || "/dashboard/startup";
        router.push(targetDashboard);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-[#0d0d0d] border border-[#242728] rounded-xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <h1 className="text-2xl font-bold tracking-tight">Create SPARSH Account</h1>
          </div>
          <p className="text-xs text-[#9c9c9d]">
            Register as a Department Officer, Startup Founder, Evaluator, or Validator.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 rounded text-red-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#cdcdcd] mb-1 font-medium">Select Your Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none focus:border-white"
            >
              <option value="startup_founder">Startup Founder (@sparsh.in)</option>
              <option value="department_officer">Department Officer (@sparsh-gov.in)</option>
              <option value="evaluator">Jury Evaluator (@sparsh.in)</option>
              <option value="validator">Independent Validator (@sparsh.in)</option>
              <option value="msins_admin">MSInS State Admin (@sparsh.in)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#cdcdcd] mb-1 font-medium">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Rajesh Kulkarni"
              className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[#cdcdcd] mb-1 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "department_officer" ? "health.dept@sparsh-gov.in" : "founder@startup.sparsh.in"}
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
              className="w-full px-3 py-2 bg-[#101111] border border-[#242728] rounded text-white focus:outline-none focus:border-[#242728]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div className="text-center text-xs text-[#6a6b6c]">
          Already have an account?{" "}
          <a href="/login" className="text-white hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
