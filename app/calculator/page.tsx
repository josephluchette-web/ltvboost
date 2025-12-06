// ltvboost/app/calculator/page.tsx
'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BarChart3 } from 'lucide-react'

type RecommendationLevel = 'scale' | 'cautious' | 'kill'

type Recommendation = {
  level: RecommendationLevel
  title: string
  description: string
  score: number
}

export default function AdsCalculatorPage() {
  const [spend, setSpend] = useState(200)
  const [revenue, setRevenue] = useState(1200)
  const [targetRoas, setTargetRoas] = useState(3)
  const [breakEvenRoas, setBreakEvenRoas] = useState(1.5)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentRoas = spend > 0 ? revenue / spend : 0

  const handleCalculate = () => {
    setError(null)

    if (spend <= 0 || revenue <= 0 || targetRoas <= 0 || breakEvenRoas <= 0) {
      setRecommendation(null)
      setError('Please enter valid numbers for spend, revenue, target ROAS, and break-even ROAS.')
      return
    }

    let level: RecommendationLevel = 'cautious'
    let title = 'Hold & monitor'
    let description =
      'Your ROAS is okay but not amazing. Make smaller budget moves and monitor performance closely.'
    let score = 50

    if (currentRoas < breakEvenRoas) {
      level = 'kill'
      title = 'Kill or fix immediately'
      description =
        'This campaign is below break-even. Pause it or fix the offer/creative before spending more.'
      score = 10
    } else if (currentRoas >= targetRoas) {
      level = 'scale'
      title = 'SCALE AGGRESSIVELY'
      description =
        'Your ROAS is strong and above target. Increase budget in 20–30% steps while watching performance.'
      score = 95
    }

    setRecommendation({ level, title, description, score })
  }

  const getRecommendationClasses = () => {
    if (!recommendation) return 'bg-slate-50 border-slate-200'
    if (recommendation.level === 'scale') return 'bg-emerald-50 border-emerald-200'
    if (recommendation.level === 'kill') return 'bg-red-50 border-red-200'
    return 'bg-amber-50 border-amber-200'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <BarChart3 className="h-7 w-7" />
          <span>Ads Scalability Calculator</span>
        </h1>
        <p className="text-muted-foreground">
          Know exactly when to scale, hold, or kill a campaign based on ROAS targets and real profitability.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Check your inputs</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8">
          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Inputs (Last 3–7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spend">Ad Spend ($)</Label>
                <Input
                  id="spend"
                  type="number"
                  value={spend}
                  onChange={(e) => setSpend(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Total spent on the campaign or ad set you&apos;re analyzing.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue from Ads ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Revenue directly attributed to this spend in the same time period.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRoas">Target ROAS</Label>
                  <Input
                    id="targetRoas"
                    type="number"
                    step="0.1"
                    value={targetRoas}
                    onChange={(e) => setTargetRoas(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your ideal ROAS for healthy profit (e.g. 3.0x).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakEvenRoas">Break-even ROAS</Label>
                  <Input
                    id="breakEvenRoas"
                    type="number"
                    step="0.1"
                    value={breakEvenRoas}
                    onChange={(e) => setBreakEvenRoas(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum ROAS where you&apos;re not losing money after COGS & fees.
                  </p>
                </div>
              </div>

              <Button className="w-full" onClick={handleCalculate}>
                Calculate Scalability
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <div className="space-y-4">
            <Card className={getRecommendationClasses()}>
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-semibold">
                  {recommendation ? recommendation.title : 'Enter your data and click calculate.'}
                </p>
                <p className="text-sm">
                  {recommendation
                    ? recommendation.description
                    : 'Once you calculate, you’ll get a clear call on whether to scale, hold, or kill the campaign.'}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p>
                    <span className="font-semibold">Current ROAS:</span> {currentRoas.toFixed(2)}x
                  </p>
                  <p>
                    <span className="font-semibold">Target ROAS:</span> {targetRoas.toFixed(2)}x
                  </p>
                  <p>
                    <span className="font-semibold">Break-even ROAS:</span> {breakEvenRoas.toFixed(2)}x
                  </p>
                  {recommendation && (
                    <p className="mt-1">
                      <span className="font-semibold">Scalability Score:</span> {recommendation.score}/100
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scaling Scenarios</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Increase budget by 10%', factor: 1.1 },
                  { label: 'Increase budget by 20%', factor: 1.2 },
                  { label: 'Increase budget by 30%', factor: 1.3 },
                ].map((scenario, idx) => {
                  const newSpend = spend * scenario.factor
                  const projectedRevenue = currentRoas * newSpend

                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-muted bg-muted/40 p-3 space-y-1"
                    >
                      <p className="font-semibold">{scenario.label}</p>
                      <p className="text-xs text-muted-foreground">
                        New spend: ${newSpend.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Projected revenue: ${projectedRevenue.toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
