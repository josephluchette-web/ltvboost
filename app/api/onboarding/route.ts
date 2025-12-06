import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateRecommendations } from '@/lib/recommendations'
import { z } from 'zod'

const onboardingSchema = z.object({
  aov: z.number().positive('AOV must be positive'),
  monthlyRevenue: z.number().positive('Monthly revenue must be positive'),
  repeatRate: z.number().min(0).max(100, 'Repeat rate must be between 0 and 100'),
  niche: z.string().min(1, 'Niche is required'),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = onboardingSchema.parse(body)

    // Save store metrics
    const storeMetrics = await prisma.storeMetrics.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      },
    })

    // Generate recommendations
    const recommendations = generateRecommendations(validatedData)

    // Save suggestions to database
    await prisma.suggestion.createMany({
      data: recommendations.map((rec) => ({
        userId: session.user.id,
        storeMetricsId: storeMetrics.id,
        type: rec.type,
        priority: rec.priority,
        title: rec.title,
        description: rec.description,
        estimatedImpact: rec.estimatedImpact,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to save metrics' },
      { status: 500 }
    )
  }
}
