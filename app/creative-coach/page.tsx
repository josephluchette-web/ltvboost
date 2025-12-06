'use client'

import React, { useState, FormEvent } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'

export default function CreativeCoachPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [product, setProduct] = useState('')
  const [objective, setObjective] = useState('')
  const [platform, setPlatform] = useState('Facebook / Instagram')
  const [metrics, setMetrics] = useState('')
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setAnalysis(null)

    try {
      const res = await fetch('/api/creative-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, objective, platform, metrics }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to analyze creative.')
      }

      const data = await res.json()
      setAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span>AI Creative Coach</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              Upload a creative, add your metrics, and get feedback on whether it&apos;s safe
              to scale — plus what to fix in the hook, angle, and structure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-6">
          {/* Left: Form */}
          <Card>
            <CardHeader>
              <CardTitle>Creative details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Creative file */}
                <div className="space-y-2">
                  <Label htmlFor="creative">Creative file</Label>
                  <Input
                    id="creative"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a frame (image) or a short video of your ad creative.
                    For now, the AI uses the text fields below (product, objective, metrics)
                    for feedback — media analysis is coming next.
                  </p>
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Preview</p>
                      <img
                        src={imagePreview}
                        alt="Creative preview"
                        className="max-h-64 rounded-md border bg-muted object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Product */}
                <div className="space-y-2">
                  <Label htmlFor="product">Product / offer</Label>
                  <Input
                    id="product"
                    placeholder="Example: Under-eye serum for tired moms"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  />
                </div>

                {/* Objective */}
                <div className="space-y-2">
                  <Label htmlFor="objective">Campaign objective</Label>
                  <Input
                    id="objective"
                    placeholder="Example: Cold traffic purchases at breakeven ROAS 1.5+"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                  />
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    placeholder="Facebook / Instagram / TikTok"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  />
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <Label htmlFor="metrics">Performance metrics</Label>
                  <textarea
                    id="metrics"
                    rows={5}
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Include spend, impressions, CTR / thumbstop, CPM, CPA, and ROAS where possible.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing creative...
                    </>
                  ) : (
                    <>
                      Analyze with AI
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right: Analysis */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!analysis && !isLoading && !error && (
                <p className="text-muted-foreground">
                  Once you submit a creative, you&apos;ll see a breakdown here:
                  hook strength, angle clarity, structure, offer congruence, and whether
                  it&apos;s safe to scale or should be killed / reworked.
                </p>
              )}

              {analysis && (
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Decision:</span>{' '}
                    {analysis.decision}
                  </p>
                  <p>
                    <span className="font-semibold">Confidence:</span>{' '}
                    {analysis.confidence}/100
                  </p>
                  {analysis.summary && (
                    <p>
                      <span className="font-semibold">Summary:</span>{' '}
                      {analysis.summary}
                    </p>
                  )}
                  {/* You can render more fields from analysis here later */}
                </div>
              )}

              {isLoading && (
                <p className="text-muted-foreground">Generating feedback...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

