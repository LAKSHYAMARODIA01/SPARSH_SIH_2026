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

    // 1. Fetch Milestone
    const { data: milestone, error: fetchErr } = await supabase
      .from("milestones")
      .select("*")
      .eq("id", milestoneId)
      .single();

    if (fetchErr || !milestone) {
      return NextResponse.json({ error: "Milestone not found." }, { status: 404 });
    }

    // State machine guard: Milestone must be in 'evidence_submitted'
    if (milestone.status !== "evidence_submitted") {
      return NextResponse.json(
        { error: `Cannot verify milestone in '${milestone.status}' state.` },
        { status: 400 }
      );
    }

    // 2. Transition Milestone status -> 'paid'
    const { data: updatedMilestone } = await supabase
      .from("milestones")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", milestoneId)
      .select()
      .single();

    // 3. Create Escrow Ledger Release Entry
    const { data: escrowLedger } = await supabase
      .from("escrow_ledger_entries")
      .insert({
        pilot_id: milestone.pilot_id,
        milestone_id: milestoneId,
        amount: milestone.amount,
        type: "released",
      })
      .select()
      .single();

    // 4. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "VERIFY_AND_RELEASE_ESCROW",
      entityName: "escrow_ledger_entries",
      entityId: escrowLedger?.id || milestoneId,
      payload: { milestoneId, amount_released: milestone.amount },
    });

    return NextResponse.json({
      message: "Milestone verified and escrow funds released successfully.",
      milestone: updatedMilestone,
      escrow: escrowLedger,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
