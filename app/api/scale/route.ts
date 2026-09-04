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
    const { pilot_id, decision, rationale } = body;

    // 1. Fetch Pilot & Startup details
    const { data: pilot, error: fetchErr } = await supabase
      .from("pilots")
      .select("*, startups(name, dpiit_number), challenge_charters(title, department_id)")
      .eq("id", pilot_id)
      .single();

    if (fetchErr || !pilot) {
      return NextResponse.json({ error: "Pilot record not found." }, { status: 404 });
    }

    // 2. Generate structured GeM Startup Runway Listing Reference Draft
    const gemListingRef = `GEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Record Scale Decision
    const { data: scaleDecision, error: scaleErr } = await supabase
      .from("scale_decisions")
      .insert({
        pilot_id,
        decision,
        rationale,
        gem_listing_ref: gemListingRef,
      })
      .select()
      .single();

    if (scaleErr) {
      return NextResponse.json({ error: scaleErr.message }, { status: 400 });
    }

    // 4. Update Charter state -> 'scaled' or 'closed'
    const newCharterStatus = decision === "reject" ? "closed" : "scaled";
    if (pilot.charter_id) {
      await supabase
        .from("challenge_charters")
        .update({ status: newCharterStatus, updated_at: new Date().toISOString() })
        .eq("id", pilot.charter_id);
    }

    // 5. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "EXECUTE_SCALE_DECISION",
      entityName: "scale_decisions",
      entityId: scaleDecision.id,
      payload: { decision, gemListingRef },
    });

    return NextResponse.json({
      scaleDecision,
      gemDraft: {
        gem_listing_ref: gemListingRef,
        vendor_name: pilot.startups?.name,
        dpiit_number: pilot.startups?.dpiit_number,
        challenge_title: pilot.challenge_charters?.title,
        status: "APPROVED_FOR_DIRECT_PROCUREMENT",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
