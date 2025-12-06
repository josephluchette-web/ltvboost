import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercentage, calculateLTV, getTargetMER } from '@/lib/utils'
import { DollarSign, TrendingUp, Repeat, Target } from 'lucide-react'

interface MetricsCardsProps {
  metrics: {
    aov: number
    monthlyRevenue: number
    repeatRate: number
    niche: string
  }
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const ltv = calculateLTV(metrics.aov, metrics.repeatRate)
  const targetMER = getTargetMER(metrics.aov, metrics.repeatRate)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.aov)}</div>
          <p className="text-xs text-muted-foreground">
            Per transaction
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estimated LTV</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(ltv)}</div>
          <p className="text-xs text-muted-foreground">
            Customer lifetime value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
          <Repeat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(metrics.repeatRate)}</div>
          <p className="text-xs text-muted-foreground">
            Of customers return
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Target MER</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{targetMER.toFixed(1)}x</div>
          <p className="text-xs text-muted-foreground">
            Marketing efficiency ratio
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
