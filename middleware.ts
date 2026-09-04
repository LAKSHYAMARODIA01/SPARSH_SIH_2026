import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

// Role-to-Dashboard route mapping
const ROLE_DASHBOARDS: Record<string, string> = {
  department_officer: "/dashboard/department",
  startup_founder: "/dashboard/startup",
  msins_admin: "/dashboard/admin",
  evaluator: "/dashboard/evaluator",
  validator: "/dashboard/validator",
};

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Protect all /dashboard routes
  if (path.startsWith("/dashboard")) {
    // 1. Unauthenticated users -> Redirect to login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }

    // 2. Extract User Role from App Metadata or User Metadata
    const role =
      (user.app_metadata?.role as string) ||
      (user.user_metadata?.role as string) ||
      "startup_founder";

    const allowedDashboardPrefix = ROLE_DASHBOARDS[role] || "/dashboard/startup";

    // 3. Enforce Strict Role Isolation: Block access if navigating to another role's dashboard
    if (!path.startsWith(allowedDashboardPrefix)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = allowedDashboardPrefix;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated user away from login/signup to their assigned dashboard
  if (user && (path === "/login" || path === "/signup")) {
    const role =
      (user.app_metadata?.role as string) ||
      (user.user_metadata?.role as string) ||
      "startup_founder";

    const targetDashboard = ROLE_DASHBOARDS[role] || "/dashboard/startup";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = targetDashboard;
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
