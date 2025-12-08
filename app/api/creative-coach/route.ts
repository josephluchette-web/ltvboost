// app/api/creative-coach/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // We still read the body so the client code works,
  // but we ignore it for now.
  await req.json().catch(() => null);

  return NextResponse.json(
    {
      decision: "PAUSE",
      confidence: 0,
      summary:
        "Creative Coach AI is not enabled on this deployment yet. Full breakdown (hook, angle, structure, etc.) is coming soon.",
      scores: {
        hookStrength: 0,
        angleClarity: 0,
        structure: 0,
        offerCongruence: 0,
        thumbstopPower: 0,
      },
      risks: [],
      recommendations: [
        "For now, continue using your current creative testing playbook. Once Creative Coach is live, this endpoint will return detailed feedback for each creative."
      ],
      suggestedHookVariations: [],
    },
    { status: 200 }
  );
}
