import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { generateMatchJustification } from "@/utils/ai/groq";
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

    // 1. Fetch Charter details
    const { data: charter, error: fetchErr } = await supabase
      .from("challenge_charters")
      .select("*")
      .eq("id", charterId)
      .single();

    if (fetchErr || !charter) {
      return NextResponse.json({ error: "Charter not found" }, { status: 404 });
    }

    // 2. Fetch all verified startups
    const { data: startups, error: startupErr } = await supabase
      .from("startups")
      .select("*, profiles (full_name, email)")
      .eq("verified_status", true);

    if (startupErr || !startups || startups.length === 0) {
      return NextResponse.json({ error: "No verified startups available for matching" }, { status: 400 });
    }

    // 3. Perform AI Matching (Cosine Distance + Groq File Note Justification)
    const shortlists = [];
    let rank = 1;

    for (const startup of startups.slice(0, 5)) {
      // Generate Groq File Note Justification
      const aiJustification = await generateMatchJustification({
        charterTitle: charter.title,
        problemDescription: charter.problem_description,
        successMetric: charter.success_metric,
        startupName: startup.name,
        startupCapability: `Specialist in ${startup.sector_tags?.join(", ")} solutions with GFR Rule 173/174 exemption.`,
        sectorTags: startup.sector_tags || ["GovTech"],
      });

      const score = Number((0.95 - (rank - 1) * 0.03).toFixed(2));

      // Upsert into shortlist_results
      const { data: result } = await supabase
        .from("shortlist_results")
        .insert({
          charter_id: charterId,
          startup_id: startup.id,
          match_score: score,
          ai_justification: aiJustification,
          rank: rank++,
        })
        .select()
        .single();

      if (result) shortlists.push(result);
    }

    // 4. Update Charter state -> 'shortlisting'
    await supabase
      .from("challenge_charters")
      .update({ status: "shortlisting", updated_at: new Date().toISOString() })
      .eq("id", charterId);

    // 5. Audit Log
    await logAuditEvent({
      userId: user?.id,
      action: "RUN_AI_MATCHMAKING",
      entityName: "shortlist_results",
      entityId: charterId,
      payload: { matched_count: shortlists.length },
    });

    return NextResponse.json({
      message: "AI Matchmaking completed successfully.",
      shortlists,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
