import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { logAuditEvent } from "@/utils/services/audit";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { charter_id, pitch_deck_url, capability_statement } = body;

    // 1. Fetch startup profile for logged in user
    const { data: startup, error: startupErr } = await supabase
      .from("startups")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (startupErr || !startup) {
      return NextResponse.json({ error: "Startup profile not found for user." }, { status: 404 });
    }

    // 2. Build eligibility snapshot with GFR Rule 173/174 exemption
    const eligibilitySnapshot = {
      dpiit_number: startup.dpiit_number,
      udyam_number: startup.udyam_number,
      gstin: startup.gstin,
      gfr_relaxation_status: "RULE_173_174_EXEMPT",
      capability_statement,
      timestamp: new Date().toISOString(),
    };

    // 3. Insert Application
    const { data: application, error: appErr } = await supabase
      .from("applications")
      .insert({
        charter_id,
        startup_id: startup.id,
        pitch_deck_url,
        eligibility_snapshot: eligibilitySnapshot,
        status: "applied",
      })
      .select()
      .single();

    if (appErr) {
      return NextResponse.json({ error: appErr.message }, { status: 400 });
    }

    // 4. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "SUBMIT_APPLICATION",
      entityName: "applications",
      entityId: application.id,
      payload: { charter_id, startup_name: startup.name },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
