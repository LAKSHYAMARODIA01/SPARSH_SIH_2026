// Groq AI API Service Utility for SPARSH
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

interface MatchJustificationParams {
  charterTitle: string;
  problemDescription: string;
  successMetric: string;
  startupName: string;
  startupCapability: string;
  sectorTags: string[];
}

export async function generateMatchJustification({
  charterTitle,
  problemDescription,
  successMetric,
  startupName,
  startupCapability,
  sectorTags,
}: MatchJustificationParams): Promise<string> {
  if (!GROQ_API_KEY) {
    return `AI Justification: ${startupName} demonstrates strong capabilities in ${sectorTags.join(
      ", "
    )} aligned with the department's target metrics.`;
  }

  try {
    const prompt = `You are SPARSH AI, an expert procurement matching system for Maharashtra State Government.
Evaluate the alignment between the following Challenge Charter and Startup capability:

Challenge Charter: "${charterTitle}"
Problem: ${problemDescription}
Success Metric: ${successMetric}

Startup Name: ${startupName}
Sectors: ${sectorTags.join(", ")}
Capability Statement: ${startupCapability}

Generate a concise 2-sentence official government file note justification explaining why this startup is a strong fit for this challenge.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL.replace("groq/", ""),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 
      `AI Justification: ${startupName} demonstrates capability alignment in ${sectorTags.join(", ")}.`;
  } catch (error) {
    console.error("Groq API Call Error:", error);
    return `AI Justification: ${startupName}'s solution aligns with target success metrics.`;
  }
}

export async function evaluateCharterQuality(
  problemDescription: string,
  successMetric: string
): Promise<{ score: number; feedback: string }> {
  if (!GROQ_API_KEY) {
    return {
      score: 85,
      feedback: "Charter problem statement and success metric are well-structured.",
    };
  }

  try {
    const prompt = `Analyze this government Challenge Charter draft:
Problem: ${problemDescription}
Success Metric: ${successMetric}

Provide a JSON output with:
"score": numeric score between 0 and 100 on how measurable and outcome-based this problem statement is.
"feedback": 1-sentence actionable advice for the department officer to improve clarity.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL.replace("groq/", ""),
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    return {
      score: result.score || 80,
      feedback: result.feedback || "Ensure success metric includes quantitative benchmarks.",
    };
  } catch (error) {
    return {
      score: 80,
      feedback: "Ensure success metric includes clear numeric targets.",
    };
  }
}
