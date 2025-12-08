'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const registered = searchParams.get('registered');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') ?? '') as string;
    const password = (formData.get('password') ?? '') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError(result?.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md p-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Welcome back to LTVBoost
            </CardTitle>
            <CardDescription className="text-slate-400">
              Log in to access your dashboard and growth tools.
            </CardDescription>
            {registered && (
              <p className="text-xs text-emerald-400">
                Account created. You can log in now.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded px-2 py-1">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>

            <p className="mt-4 text-xs text-slate-400 text-center">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
