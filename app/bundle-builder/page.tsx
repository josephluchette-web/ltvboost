// ltvboost/app/bundle-builder/page.tsx
'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

type BundleTier = {
  name: string
  quantity: number
  discountPercent: number
}

export default function BundleBuilderPage() {
  const [basePrice, setBasePrice] = useState(39.99)
  const [cogsPerUnit, setCogsPerUnit] = useState(10)
  const [tiers, setTiers] = useState<BundleTier[]>([
    { name: 'Buy 2', quantity: 2, discountPercent: 10 },
    { name: 'Buy 3', quantity: 3, discountPercent: 15 },
  ])

  const handleTierChange = (index: number, field: keyof BundleTier, value: string) => {
    const updated = [...tiers]
    if (field === 'quantity' || field === 'discountPercent') {
      updated[index][field] = Number(value) || 0
    } else {
      updated[index][field] = value as any
    }
    setTiers(updated)
  }

  const addTier = () => {
    setTiers([
      ...tiers,
      { name: `Bundle ${tiers.length + 1}`, quantity: 2, discountPercent: 10 },
    ])
  }

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <Package className="h-7 w-7" />
          <span>Bundle Builder</span>
        </h1>
        <p className="text-muted-foreground">
          Plan bundles that boost AOV while keeping your margins healthy. Use this to decide which offers
          to feature on your product page and in your ads.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
          {/* Inputs / configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Base Offer & Bundle Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Selling Price (1 unit)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your current selling price for a single unit.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cogsPerUnit">COGS per Unit</Label>
                  <Input
                    id="cogsPerUnit"
                    type="number"
                    value={cogsPerUnit}
                    onChange={(e) => setCogsPerUnit(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    All-in cost per unit (product, shipping, fees).
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-semibold">Bundle Tiers</p>
                <Button variant="outline" size="sm" onClick={addTier}>
                  + Add Tier
                </Button>
              </div>

              <div className="space-y-3">
                {tiers.map((tier, index) => {
                  const totalPriceBeforeDiscount = basePrice * tier.quantity
                  const discount = totalPriceBeforeDiscount * (tier.discountPercent / 100)
                  const finalPrice = totalPriceBeforeDiscount - discount
                  const totalCogs = cogsPerUnit * tier.quantity
                  const profit = finalPrice - totalCogs
                  const margin = finalPrice > 0 ? Math.round((profit / finalPrice) * 100) : 0

                  return (
                    <Card key={index} className="border-muted bg-muted/40">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <Input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                            className="text-sm font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => removeTier(index)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="space-y-1">
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              value={tier.quantity}
                              onChange={(e) =>
                                handleTierChange(index, 'quantity', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Discount %</Label>
                            <Input
                              type="number"
                              value={tier.discountPercent}
                              onChange={(e) =>
                                handleTierChange(index, 'discountPercent', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1 text-xs">
                            <p>
                              Bundle price:{' '}
                              <span className="font-semibold">
                                ${finalPrice.toFixed(2)}
                              </span>
                            </p>
                            <p>
                              Profit:{' '}
                              <span
                                className={
                                  profit >= 0
                                    ? 'font-semibold text-emerald-600'
                                    : 'font-semibold text-red-600'
                                }
                              >
                                ${profit.toFixed(2)}
                              </span>
                            </p>
                            <p>Margin: {margin}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Summary / “copy into your funnel” side */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Use this summary when structuring your product page and ad offers. Lead with
                the bundle that has the best combo of AOV and margin.
              </p>

              <div className="space-y-3">
                {tiers.map((tier, index) => {
                  const totalPriceBeforeDiscount = basePrice * tier.quantity
                  const discount = totalPriceBeforeDiscount * (tier.discountPercent / 100)
                  const finalPrice = totalPriceBeforeDiscount - discount
                  const totalCogs = cogsPerUnit * tier.quantity
                  const profit = finalPrice - totalCogs
                  const margin = finalPrice > 0 ? Math.round((profit / finalPrice) * 100) : 0

                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-muted bg-muted/30 p-3 space-y-1"
                    >
                      <p className="font-semibold">
                        {tier.name} ({tier.quantity} units)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tier.discountPercent}% discount • COGS ${totalCogs.toFixed(2)}
                      </p>
                      <p className="text-xs">
                        Customer pays:{' '}
                        <span className="font-semibold">
                          ${finalPrice.toFixed(2)}
                        </span>{' '}
                        • Profit:{' '}
                        <span
                          className={
                            profit >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-red-600'
                          }
                        >
                          ${profit.toFixed(2)}
                        </span>{' '}
                        ({margin}% margin)
                      </p>
                    </div>
                  )
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                Tip: Your “hero” bundle is usually a 2–3 unit option with strong perceived discount but
                healthy margin. Use it as the default selection in your PDP.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
