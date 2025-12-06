import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SubscriptionPortalButton } from '@/components/dashboard/subscription-portal-button'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and subscription
          </p>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your billing and subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {user.subscription.plan}
                    </p>
                  </div>
                  <Badge
                    variant={
                      user.subscription.status === 'ACTIVE'
                        ? 'default'
                        : user.subscription.status === 'PAST_DUE'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {user.subscription.status}
                  </Badge>
                </div>
                {user.subscription.currentPeriodEnd && (
                  <div>
                    <p className="text-sm font-medium">Current period ends</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <SubscriptionPortalButton />
              </>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  You don&apos;t have an active subscription.
                </p>
                <Button>Subscribe Now</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
