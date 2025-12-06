// ltvboost/app/pnl/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, BarChart3, DollarSign, Minus, Plus } from 'lucide-react'
import { PNLResult } from '@/lib/pnl-calculator'

// Helper function to format currency
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

export default function PNLPage() {
  const { data: session } = useSession()
  const [pnlResult, setPnlResult] = useState<PNLResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Default inputs for the P&L calculation
  const [inputs, setInputs] = useState({
    grossMarginPercentage: 50,
    monthlyAdSpend: 5000,
    monthlyOperatingExpenses: 1000,
  })

  // Function to fetch P&L data from the API
  const fetchPNL = async () => {
    if (!session?.user.id) return

    if (!session.user.shopifyShopDomain) {
      setError('Please connect your Shopify store to calculate your Profit & Loss.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/pnl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to calculate P&L.')
      }

      const data = await res.json()
      setPnlResult(data.pnl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch PNL on initial load and whenever inputs change
  useEffect(() => {
    fetchPNL()
  }, [session?.user.id, session?.user.shopifyShopDomain, inputs]) // Recalculate on input change

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }))
  }

  // Helper to determine card color based on profit
  const getCardColor = (value: number) => {
    if (value > 0) return 'bg-green-600 text-white'
    if (value < 0) return 'bg-red-600 text-white'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <BarChart3 className="h-7 w-7" />
          <span>Profit & Loss (P&L) Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          See your true net profit. Revenue is pulled from Shopify; update your cost inputs below for an accurate calculation.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Cost Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grossMarginPercentage">Estimated Gross Margin (%)</Label>
                <Input
                  id="grossMarginPercentage"
                  name="grossMarginPercentage"
                  type="number"
                  step="1"
                  value={inputs.grossMarginPercentage}
                  onChange={handleInputChange}
                  className="pr-7"
                />
                <p className="text-xs text-muted-foreground">
                  Your profit after Cost of Goods Sold (COGS).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyAdSpend">Monthly Ad Spend ($)</Label>
                <Input
                  id="monthlyAdSpend"
                  name="monthlyAdSpend"
                  type="number"
                  step="1"
                  value={inputs.monthlyAdSpend}
                  onChange={handleInputChange}
                  className="pl-7"
                />
                <p className="text-xs text-muted-foreground">
                  Total spent on all advertising platforms.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyOperatingExpenses">Monthly Operating Expenses ($)</Label>
                <Input
                  id="monthlyOperatingExpenses"
                  name="monthlyOperatingExpenses"
                  type="number"
                  step="1"
                  value={inputs.monthlyOperatingExpenses}
                  onChange={handleInputChange}
                  className="pl-7"
                />
                <p className="text-xs text-muted-foreground">
                  SaaS, salaries, rent, etc.
                </p>
              </div>
              
              {/* Recalculate button is no longer needed as it recalculates on input change */}
              <Alert className="mt-4">
                <AlertTitle>Auto-Recalculation</AlertTitle>
                <AlertDescription>
                  The P&L automatically updates as you change the cost inputs.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* P&L Results */}
          {pnlResult && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Financial Summary (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Revenue and Gross Profit */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(pnlResult.monthlyRevenue)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                      <Plus className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(pnlResult.grossProfit)}</div>
                      <p className="text-xs text-muted-foreground">Margin: {pnlResult.grossMarginPercentage}%</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">COGS</CardTitle>
                      <Minus className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{formatCurrency(pnlResult.cogs)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Ad Spend</CardTitle>
                      <Minus className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{formatCurrency(pnlResult.adSpend)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">OpEx</CardTitle>
                      <Minus className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">{formatCurrency(pnlResult.operatingExpenses)}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Net Profit */}
                <Card className={`mt-6 ${getCardColor(pnlResult.netProfit)}`}>
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-xl font-semibold">Net Profit</p>
                      <p className="text-sm">Net Profit Margin: {pnlResult.netProfitMargin.toFixed(2)}%</p>
                    </div>
                    <p className="text-4xl font-extrabold">{formatCurrency(pnlResult.netProfit)}</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
