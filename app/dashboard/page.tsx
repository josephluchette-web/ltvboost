import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { SuggestionsList } from '@/components/dashboard/suggestions-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  const storeMetrics = await prisma.storeMetrics.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  if (!storeMetrics) {
    redirect('/onboarding')
  }

  // Get suggestions
  const suggestions = await prisma.suggestion.findMany({
    where: { 
      userId: session.user.id,
      storeMetricsId: storeMetrics.id,
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Your LTV optimization recommendations
            </p>
          </div>
          <Link href="/onboarding">
            <Button variant="outline">Update Metrics</Button>
          </Link>
        </div>

        <MetricsCards metrics={storeMetrics} />
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended LTV Plays</h2>
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>
    </DashboardLayout>
  )
}
