// app/api/creative-coach/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type CreativeAnalysis = {
  decision: 'SCALE' | 'CAUTIOUS_SCALE' | 'PAUSE' | 'KILL'
  confidence: number // 0–100
  summary: string
  scores: {
    hookStrength: number // 1–10
    angleClarity: number // 1–10
    structure: number // 1–10
    offerCongruence: number // 1–10
    thumbstopPower: number // 1–10
  }
  risks: string[]
  recommendations: string[]
  suggestedHookVariations: string[]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { product, objective, platform, metrics } = body as {
      product?: string
      objective?: string
      platform?: string
      metrics?: string
    }

    if (!product || !objective || !platform || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    const prompt = `
You are a world-class direct response creative strategist for paid social (Meta, TikTok, YouTube).

You are analyzing a single ad creative for a Shopify / DTC brand.

Return **ONLY valid JSON**, no prose, matching this TypeScript type:

type CreativeAnalysis = {
  decision: 'SCALE' | 'CAUTIOUS_SCALE' | 'PAUSE' | 'KILL'
  confidence: number // 0–100
  summary: string
  scores: {
    hookStrength: number // 1–10
    angleClarity: number // 1–10
    structure: number // 1–10
    offerCongruence: number // 1–10
    thumbstopPower: number // 1–10
  }
  risks: string[]
  recommendations: string[]
  suggestedHookVariations: string[]
}

Context:
- Product / offer: ${product}
- Campaign objective: ${objective}
- Platform: ${platform}
- Performance metrics (raw text from media buyer):
${metrics}

Interpret the metrics like a senior media buyer:
- If ROAS is above target and CTR / thumbstop are strong → lean toward SCALE.
- If ROAS is close to breakeven but signals are promising → CAUTIOUS_SCALE with clear conditions.
- If results are weak but not terrible → PAUSE and rework.
- If metrics are very bad → KILL and explain why.

When giving recommendations, be *specific*:
- Call out hook issues, angle issues, structure issues, and offer congruence.
- Each recommendation should be something the creator can act on today.

For suggestedHookVariations:
- Return 3–5 punchy hook lines tailored to this product & objective.
- Make them feel like real Meta/TikTok hooks, not robotic.

Again: respond with **ONLY** a JSON object that matches CreativeAnalysis.
    `.trim()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4o' if you want heavier
      messages: [
        {
          role: 'system',
          content: 'You are an expert DTC ad creative strategist.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const raw = completion.choices[0]?.message?.content?.trim() || '{}'

    let analysis: CreativeAnalysis | null = null
    try {
      analysis = JSON.parse(raw) as CreativeAnalysis
    } catch (err) {
      // If the model returns extra text, try to salvage the JSON section
      const match = raw.match(/\{[\s\S]*\}$/)
      if (match) {
        analysis = JSON.parse(match[0]) as CreativeAnalysis
      }
    }

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to parse AI response.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Creative Coach API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong analyzing the creative.' },
      { status: 500 }
    )
  }
}
