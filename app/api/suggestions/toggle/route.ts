import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const toggleSchema = z.object({
  id: z.string(),
  implemented: z.boolean(),
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
    const { id, implemented } = toggleSchema.parse(body)

    // Verify the suggestion belongs to the user
    const suggestion = await prisma.suggestion.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      )
    }

    // Update the suggestion
    await prisma.suggestion.update({
      where: { id },
      data: {
        implemented,
        implementedAt: implemented ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toggle suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to update suggestion' },
      { status: 500 }
    )
  }
}
