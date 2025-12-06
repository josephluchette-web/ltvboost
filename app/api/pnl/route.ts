// ltvboost/app/api/pnl/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { calculatePNL } from '@/lib/pnl-calculator'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Define the expected input schema for the P&L calculation
const pnlSchema = z.object({
  grossMarginPercentage: z.number().min(0).max(100),
  monthlyAdSpend: z.number().min(0),
  monthlyOperatingExpenses: z.number().min(0),
})

/**
 * API route to calculate the Profit & Loss (P&L) for the user's store.
 * It fetches the latest revenue from the database and combines it with user-provided cost inputs.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure the user is connected to Shopify to have metrics
  if (!session.user.shopifyShopDomain) {
    return NextResponse.json({ error: 'Shopify not connected. Please connect your store to view P&L.' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const validatedData = pnlSchema.parse(body)

    // 1. Fetch the latest monthly revenue from the database
    const latestMetrics = await prisma.storeMetrics.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!latestMetrics) {
      return NextResponse.json({ error: 'No store metrics found. Please complete onboarding or refresh your Shopify data.' }, { status: 404 })
    }

    // 2. Combine user inputs with the fetched revenue
    const pnlInputs = {
      ...validatedData,
      monthlyRevenue: latestMetrics.monthlyRevenue,
    }

    // 3. Calculate P&L
    const pnlResult = calculatePNL(pnlInputs)

    return NextResponse.json({ pnl: pnlResult, message: 'P&L calculated successfully' })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('PNL Calculation Error:', error)
    return NextResponse.json({ error: 'Failed to calculate P&L' }, { status: 500 })
  }
}
