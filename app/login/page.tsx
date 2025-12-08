'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const registered = searchParams.get('registered')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password.')
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Something went wrong.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md mt-14">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {registered && (
          <p className="text-green-500 mb-3">Your account was created! You can now log in.</p>
        )}

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </div>

          <div>
            <Label>Password</Label>
            <Input name="password" type="password" required />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}
