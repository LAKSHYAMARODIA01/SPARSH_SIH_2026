import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { logAuditEvent } from "@/utils/services/audit";
import { evaluateCharterQuality } from "@/utils/ai/groq";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("department_id");
    const status = searchParams.get("status");

    let query = supabase.from("challenge_charters").select(`
      *,
      departments (name, ministry)
    `);

    if (departmentId) {
      query = query.eq("department_id", departmentId);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data: charters, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ charters });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const {
      department_id,
      title,
      problem_description,
      success_metric,
      budget_ceiling,
      pilot_duration_days,
      data_ip_sensitivity,
    } = body;

    // 1. Validation
    if (!title || !problem_description || !success_metric || !budget_ceiling) {
      return NextResponse.json(
        { error: "Missing required charter fields" },
        { status: 400 }
      );
    }

    // 2. Groq AI Quality Evaluation Check
    const aiQuality = await evaluateCharterQuality(problem_description, success_metric);
    if (aiQuality.score < 50) {
      return NextResponse.json(
        {
          error: "Charter quality score below measurability threshold.",
          ai_feedback: aiQuality.feedback,
        },
        { status: 422 }
      );
    }

    // 3. Database Insertion
    const { data: charter, error } = await supabase
      .from("challenge_charters")
      .insert({
        department_id,
        created_by: user?.id || null,
        title,
        problem_description,
        success_metric,
        budget_ceiling,
        pilot_duration_days: pilot_duration_days || 90,
        data_ip_sensitivity: data_ip_sensitivity || "medium",
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 4. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "CREATE_CHARTER",
      entityName: "challenge_charters",
      entityId: charter.id,
      payload: { title, budget_ceiling },
    });

    return NextResponse.json({ charter, ai_quality: aiQuality }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
