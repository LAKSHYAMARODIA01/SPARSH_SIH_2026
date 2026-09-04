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
    const { charter_id, startup_id, milestones, contract_url, ip_clause_type } = body;

    // 1. Fetch Charter to verify budget ceiling
    const { data: charter, error: charterErr } = await supabase
      .from("challenge_charters")
      .select("*")
      .eq("id", charter_id)
      .single();

    if (charterErr || !charter) {
      return NextResponse.json({ error: "Charter not found." }, { status: 404 });
    }

    // 2. Validate milestone amounts sum to budget ceiling
    const milestoneTotal = milestones.reduce((sum: number, m: any) => sum + Number(m.amount), 0);
    if (milestoneTotal > Number(charter.budget_ceiling)) {
      return NextResponse.json(
        { error: `Milestone sum (₹${milestoneTotal}) exceeds budget ceiling (₹${charter.budget_ceiling}).` },
        { status: 400 }
      );
    }

    // 3. Create Pilot record
    const { data: pilot, error: pilotErr } = await supabase
      .from("pilots")
      .insert({
        charter_id,
        startup_id,
        contract_url,
        ip_clause_type: ip_clause_type || "Standard IP Sharing",
        start_date: new Date().toISOString().split("T")[0],
        status: "active",
      })
      .select()
      .single();

    if (pilotErr) {
      return NextResponse.json({ error: pilotErr.message }, { status: 400 });
    }

    // 4. Insert Milestones & Reserve Escrow Entries
    const insertedMilestones = [];
    for (const m of milestones) {
      const { data: milestone } = await supabase
        .from("milestones")
        .insert({
          pilot_id: pilot.id,
          title: m.title,
          description: m.description,
          due_date: m.due_date,
          amount: m.amount,
          status: "pending",
        })
        .select()
        .single();

      if (milestone) {
        insertedMilestones.push(milestone);

        // Reserve Escrow Ledger Entry
        await supabase.from("escrow_ledger_entries").insert({
          pilot_id: pilot.id,
          milestone_id: milestone.id,
          amount: m.amount,
          type: "reserved",
        });
      }
    }

    // 5. Update Charter status -> 'piloting'
    await supabase
      .from("challenge_charters")
      .update({ status: "piloting", updated_at: new Date().toISOString() })
      .eq("id", charter_id);

    // 6. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "CREATE_PILOT_WITH_ESCROW",
      entityName: "pilots",
      entityId: pilot.id,
      payload: { milestone_count: insertedMilestones.length, total_reserved: milestoneTotal },
    });

    return NextResponse.json({ pilot, milestones: insertedMilestones }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
