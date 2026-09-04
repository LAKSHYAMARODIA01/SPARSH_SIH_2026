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
    const {
      application_id,
      technical_fit_score,    // Weight: 40%
      feasibility_score,      // Weight: 30%
      cost_realism_score,     // Weight: 20%
      team_capability_score,  // Weight: 10%
      notes,
    } = body;

    // 1. Calculate 4-part weighted total score
    const totalScore = Number(
      (
        (technical_fit_score * 0.4) +
        (feasibility_score * 0.3) +
        (cost_realism_score * 0.2) +
        (team_capability_score * 0.1)
      ).toFixed(2)
    );

    const criteriaBreakdown = {
      technical_fit: technical_fit_score,
      feasibility: feasibility_score,
      cost_realism: cost_realism_score,
      team_capability: team_capability_score,
      formula: "(0.4 * tech) + (0.3 * feas) + (0.2 * cost) + (0.1 * team)",
    };

    // 2. Insert evaluation record
    const { data: evaluation, error } = await supabase
      .from("demo_evaluations")
      .insert({
        application_id,
        evaluator_id: user?.id || null,
        score: totalScore,
        notes,
        criteria_breakdown: criteriaBreakdown,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 3. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "SUBMIT_JURY_EVALUATION",
      entityName: "demo_evaluations",
      entityId: evaluation.id,
      payload: { application_id, totalScore },
    });

    return NextResponse.json({ evaluation, score: totalScore }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
