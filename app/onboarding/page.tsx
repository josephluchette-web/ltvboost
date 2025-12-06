'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      aov: parseFloat(formData.get('aov') as string),
      monthlyRevenue: parseFloat(formData.get('monthlyRevenue') as string),
      repeatRate: parseFloat(formData.get('repeatRate') as string),
      niche: formData.get('niche') as string,
    }

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save metrics')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Tell us about your store</CardTitle>
          <CardDescription>
            Help us understand your business so we can provide personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="aov">Average Order Value (AOV)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="aov"
                  name="aov"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="50.00"
                  className="pl-7"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                The average amount customers spend per order
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="monthlyRevenue"
                  name="monthlyRevenue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10000.00"
                  className="pl-7"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your approximate monthly revenue
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeatRate">Repeat Customer Rate</Label>
              <div className="relative">
                <Input
                  id="repeatRate"
                  name="repeatRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="20"
                  className="pr-7"
                  required
                  disabled={isLoading}
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of customers who make more than one purchase
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Store Niche</Label>
              <Input
                id="niche"
                name="niche"
                type="text"
                placeholder="e.g., Fashion, Beauty, Supplements, Home Goods"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                What type of products do you sell?
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
