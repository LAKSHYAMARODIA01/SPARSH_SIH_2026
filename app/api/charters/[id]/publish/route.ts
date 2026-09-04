import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { logAuditEvent } from "@/utils/services/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: charterId } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Fetch current charter state
    const { data: charter, error: fetchErr } = await supabase
      .from("challenge_charters")
      .select("*")
      .eq("id", charterId)
      .single();

    if (fetchErr || !charter) {
      return NextResponse.json({ error: "Charter not found" }, { status: 404 });
    }

    // State machine guard: Can only publish from 'draft'
    if (charter.status !== "draft") {
      return NextResponse.json(
        { error: `Cannot publish charter in '${charter.status}' state.` },
        { status: 400 }
      );
    }

    // 2. Transition state machine -> 'published'
    const { data: updatedCharter, error: updateErr } = await supabase
      .from("challenge_charters")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", charterId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    // 3. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "PUBLISH_CHARTER",
      entityName: "challenge_charters",
      entityId: charterId,
      payload: { previous_status: "draft", new_status: "published" },
    });

    return NextResponse.json({
      message: "Challenge charter published successfully.",
      charter: updatedCharter,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
