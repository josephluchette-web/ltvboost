'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function SubscriptionPortalButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/subscription/portal', {
        method: 'POST',
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to open portal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} variant="outline">
      {isLoading ? 'Loading...' : 'Manage Subscription'}
    </Button>
  )
}
