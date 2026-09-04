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
    const { pilot_id, outcome, report_url, metrics } = body;

    // 1. Insert Validation Report
    const { data: report, error } = await supabase
      .from("validation_reports")
      .insert({
        pilot_id,
        validator_id: user?.id || null,
        outcome,
        report_url,
        metrics: metrics || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. Fetch Pilot to update associated charter state -> 'validating'
    const { data: pilot } = await supabase
      .from("pilots")
      .select("charter_id")
      .eq("id", pilot_id)
      .single();

    if (pilot?.charter_id) {
      await supabase
        .from("challenge_charters")
        .update({ status: "validating", updated_at: new Date().toISOString() })
        .eq("id", pilot.charter_id);
    }

    // 3. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "SUBMIT_VALIDATION_REPORT",
      entityName: "validation_reports",
      entityId: report.id,
      payload: { pilot_id, outcome },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
