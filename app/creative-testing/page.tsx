// ltvboost/app/creative-testing/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, TrendingUp, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'

// --- Types and Helper Functions ---

interface CreativeData {
  id: number
  name: string
  spend: number
  impressions: number
  clicks: number
  purchases: number
  cogsPercentage: number // User input for profit calculation
}

interface CreativeResult extends CreativeData {
  ctr: number
  cpc: number
  roas: number
  profit: number
  breakevenROAS: number
  isProfitable: boolean
}

// Helper function to format currency
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// Helper function to calculate all metrics
const calculateCreativeMetrics = (data: CreativeData): CreativeResult => {
  const { spend, impressions, clicks, purchases, cogsPercentage } = data
  
  // Breakeven ROAS = 1 / Gross Margin %
  const grossMarginDecimal = 1 - (cogsPercentage / 100)
  const breakevenROAS = grossMarginDecimal > 0 ? 1 / grossMarginDecimal : Infinity

  // CTR (Click-Through Rate)
  // Formula: (Clicks / Impressions) * 100
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

  // CPC (Cost Per Click)
  // Formula: Spend / Clicks
  const cpc = clicks > 0 ? spend / clicks : 0

  // ROAS (Return on Ad Spend)
  // We need to assume an AOV for the revenue calculation. Let's use a placeholder of $50 AOV.
  const assumedAOV = 50 
  const revenue = purchases * assumedAOV
  // Formula: Revenue / Spend
  const roas = spend > 0 ? revenue / spend : 0

  // Profit = Revenue - Spend - COGS
  // COGS = Revenue * (COGS %)
  const cogs = revenue * (cogsPercentage / 100)
  const profit = revenue - spend - cogs
  
  // Check if ROAS meets or exceeds the Breakeven ROAS
  const isProfitable = roas >= breakevenROAS

  return {
    ...data,
    ctr: parseFloat(ctr.toFixed(2)),
    cpc: parseFloat(cpc.toFixed(2)),
    roas: parseFloat(roas.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    breakevenROAS: parseFloat(breakevenROAS.toFixed(2)),
    isProfitable,
  }
}

// --- Main Component ---

export default function CreativeTestingPage() {
  const [creatives, setCreatives] = useState<CreativeData[]>([
    { id: 1, name: 'Video Ad 1', spend: 100, impressions: 10000, clicks: 500, purchases: 5, cogsPercentage: 40 },
    { id: 2, name: 'Image Ad 2', spend: 150, impressions: 15000, clicks: 300, purchases: 2, cogsPercentage: 40 },
    { id: 3, name: 'UGC Ad 3', spend: 50, impressions: 8000, clicks: 600, purchases: 8, cogsPercentage: 40 },
  ])
  const [nextId, setNextId] = useState(4)

  // Calculate all metrics and sort the results
  const creativeResults = useMemo(() => {
    const results = creatives.map(calculateCreativeMetrics)
    return results.sort((a, b) => b.profit - a.profit) // Sort by profit descending
  }, [creatives])

  // Filter for top and kill creatives
  const topCreatives = useMemo(() => creativeResults.slice(0, 3), [creativeResults])
  const creativesToKill = useMemo(() => creativeResults.filter(c => !c.isProfitable), [creativeResults])

  const handleInputChange = (id: number, field: keyof CreativeData, value: string) => {
    setCreatives(prev =>
      prev.map(creative =>
        creative.id === id
          ? { ...creative, [field]: field === 'name' ? value : parseFloat(value) || 0 }
          : creative
      )
    )
  }

  const addCreative = () => {
    setCreatives(prev => [
      ...prev,
      { id: nextId, name: `New Creative ${nextId}`, spend: 0, impressions: 0, clicks: 0, purchases: 0, cogsPercentage: 40 },
    ])
    setNextId(prev => prev + 1)
  }

  const removeCreative = (id: number) => {
    setCreatives(prev => prev.filter(creative => creative.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <TrendingUp className="h-7 w-7" />
          <span>Creative Testing Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Manually enter your ad creative data to instantly calculate profitability (ROAS, Profit) and identify winners and losers.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-green-500 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Top Creatives (By Profit)</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-green-900">
                {topCreatives.map(c => (
                  <li key={c.id}>
                    {c.name} - Profit: {formatCurrency(c.profit)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-500 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Creatives to Kill (Unprofitable)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-red-900">
                {creativesToKill.length > 0 ? (
                  creativesToKill.map(c => (
                    <li key={c.id}>
                      {c.name} - ROAS: {c.roas} (Breakeven: {c.breakevenROAS})
                    </li>
                  ))
                ) : (
                  <li>All creatives are currently profitable!</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Data Entry Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Creative Data Entry</CardTitle>
            <Button onClick={addCreative} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Creative
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Spend ($)</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>COGS %</TableHead>
                    <TableHead>CTR (%)</TableHead>
                    <TableHead>CPC ($)</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead className="text-right">Profit ($)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creativeResults.map(creative => (
                    <TableRow key={creative.id} className={creative.isProfitable ? 'bg-green-50/50' : 'bg-red-50/50'}>
                      <TableCell className="font-medium">
                        <Input
                          value={creative.name}
                          onChange={(e) => handleInputChange(creative.id, 'name', e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={creative.spend}
                          onChange={(e) => handleInputChange(creative.id, 'spend', e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={creative.impressions}
                          onChange={(e) => handleInputChange(creative.id, 'impressions', e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={creative.clicks}
                          onChange={(e) => handleInputChange(creative.id, 'clicks', e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={creative.purchases}
                          onChange={(e) => handleInputChange(creative.id, 'purchases', e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={creative.cogsPercentage}
                          onChange={(e) => handleInputChange(creative.id, 'cogsPercentage', e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>{creative.ctr}%</TableCell>
                      <TableCell>{formatCurrency(creative.cpc)}</TableCell>
                      <TableCell className={creative.isProfitable ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {creative.roas}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${creative.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {formatCurrency(creative.profit)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeCreative(creative.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
