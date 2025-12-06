// ltvboost/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, Zap, Target, DollarSign } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LTVBoost</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-200 hover:bg-slate-900 hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex-1 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl space-y-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Built for beginner Shopify merchants who are tired of guessing.
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Test, scale, and optimize — with{' '}
              <span className="text-blue-500">LTVBoost</span> by your side.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Stop guessing your profit and ROAS. LTVBoost shows you exactly what to scale, what to kill,
              and how far you can go. Early access pricing:{' '}
              <span className="font-semibold">$14.99/month.</span>
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full gap-2 bg-blue-600 text-sm font-semibold hover:bg-blue-700 sm:w-auto"
              >
                Start Free Trial – $14.99/month
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-slate-700 bg-transparent text-sm text-slate-200 hover:bg-slate-900 sm:w-auto"
              >
                View Demo
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            No contracts, cancel anytime. Start with your real numbers and see if you&apos;re actually profitable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-20 max-w-7xl">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              FEATURES
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Everything you need to stop guessing with your ads.
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Plug in your store metrics, creatives, and offers. LTVBoost turns it into clear calls:
              scale, hold, or kill.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            <Card className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition">
              <CardHeader>
                <DollarSign className="mb-2 h-10 w-10 text-blue-500" />
                <CardTitle className="text-slate-100">Profit &amp; P&amp;L Dashboard</CardTitle>
                <CardDescription className="text-slate-400">
                  See your true net profit after COGS, ad spend, and OpEx so you know what&apos;s actually left over.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition">
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-blue-500" />
                <CardTitle className="text-slate-100">Ads Scalability Calculator</CardTitle>
                <CardDescription className="text-slate-400">
                  Know when to safely scale, when to hold, and when to kill a campaign based on ROAS and profit.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition">
              <CardHeader>
                <Target className="mb-2 h-10 w-10 text-blue-500" />
                <CardTitle className="text-slate-100">Creative Testing Dashboard</CardTitle>
                <CardDescription className="text-slate-400">
                  Track ROAS, CTR, and profit per creative so you can double down on what actually works.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition">
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-blue-500" />
                <CardTitle className="text-slate-100">Retention &amp; LTV Optimizer</CardTitle>
                <CardDescription className="text-slate-400">
                  Get simple recommendations to boost repeat orders and stretch every customer further.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition">
              <CardHeader>
                <DollarSign className="mb-2 h-10 w-10 text-blue-500" />
                <CardTitle className="text-slate-100">Maximize Revenue</CardTitle>
                <CardDescription className="text-slate-400">
                  Model AOV and LTV impact without spreadsheets, so you can build offers that print.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              REVIEWS
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Built for real operators, not vanity screenshots.
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Early users are using LTVBoost to understand their numbers, fix losing ads, and scale
              with confidence.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="flex h-full flex-col border-slate-700 bg-slate-800/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-100">
                  “I finally know what to scale.”
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Alex R. • Beginner dropshipper
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-slate-200">
                I used to just push budget to whatever &quot;felt&quot; like it was working. Now I
                plug the numbers into LTVBoost and it gives me a clear call. No more guessing.
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col border-slate-700 bg-slate-800/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-100">
                  “Showed me which offer carried my store.”
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Maya L. • Skincare brand owner
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-slate-200">
                The P&amp;L and bundle view made it obvious which bundle was printing and which one
                was dragging everything down. I rebuilt my PDP around the winning offer.
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col border-slate-700 bg-slate-800/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-100">
                  “It&apos;s like a mini media buyer in my pocket.”
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Chris D. • Shopify store owner
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-slate-200">
                I check LTVBoost before touching budgets now. It&apos;s way easier than piecing
                together numbers from five different dashboards.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to scale profitably?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm text-slate-300">
            Join Shopify merchants using LTVBoost to maximize profit and scale with confidence.
            Lock in early access pricing at <span className="font-semibold">$14.99/month</span>.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
              Get Started Now – $14.99/month
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; 2024 LTVBoost. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
