import { NextResponse } from "next/server";
import { evaluateCharterQuality } from "@/utils/ai/groq";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problem_description, success_metric } = body;

    if (!problem_description || !success_metric) {
      return NextResponse.json(
        { error: "Problem description and success metric are required." },
        { status: 400 }
      );
    }

    const evaluation = await evaluateCharterQuality(problem_description, success_metric);
    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
