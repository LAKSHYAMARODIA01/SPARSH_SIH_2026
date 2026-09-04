import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { logAuditEvent } from "@/utils/services/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: milestoneId } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { file_urls, notes } = body;

    // 1. Insert Milestone Evidence Record
    const { data: evidence, error: evErr } = await supabase
      .from("milestone_evidence")
      .insert({
        milestone_id: milestoneId,
        submitted_by: user?.id || null,
        file_urls: file_urls || [],
        notes,
      })
      .select()
      .single();

    if (evErr) {
      return NextResponse.json({ error: evErr.message }, { status: 400 });
    }

    // 2. Transition Milestone status -> 'evidence_submitted'
    const { data: updatedMilestone } = await supabase
      .from("milestones")
      .update({ status: "evidence_submitted", updated_at: new Date().toISOString() })
      .eq("id", milestoneId)
      .select()
      .single();

    // 3. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "SUBMIT_MILESTONE_EVIDENCE",
      entityName: "milestone_evidence",
      entityId: evidence.id,
      payload: { milestoneId },
    });

    return NextResponse.json({ evidence, milestone: updatedMilestone });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
