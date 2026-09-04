import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const ROLE_DASHBOARDS: Record<string, string> = {
  department_officer: "/dashboard/department",
  startup_founder: "/dashboard/startup",
  msins_admin: "/dashboard/admin",
  evaluator: "/dashboard/evaluator",
  validator: "/dashboard/validator",
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Determine host dynamically (support Vercel x-forwarded-host)
      const forwardedHost = request.headers.get("x-forwarded-host");
      const host = forwardedHost ? `https://${forwardedHost}` : origin;

      // Determine target destination
      let targetPath = next;
      if (!targetPath) {
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

        targetPath = ROLE_DASHBOARDS[role] || "/dashboard/startup";
      }

      return NextResponse.redirect(`${host}${targetPath}`);
    }
  }

  // Return user to login with error message if verification failed
  return NextResponse.redirect(`${origin}/login?error=Could%20not%20verify%20email%20confirmation`);
}
