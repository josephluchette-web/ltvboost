'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-react'
import { SuggestionType, SuggestionPriority } from '@prisma/client'
import { useState } from 'react'

interface Suggestion {
  id: string
  type: SuggestionType
  priority: SuggestionPriority
  title: string
  description: string
  estimatedImpact: string | null
  implemented: boolean
}

interface SuggestionsListProps {
  suggestions: Suggestion[]
}

const priorityColors = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-blue-500',
}

const typeLabels = {
  SUBSCRIPTION: 'Subscription',
  BUNDLE: 'Bundle',
  UPSELL: 'Upsell',
  CROSS_SELL: 'Cross-sell',
  LOYALTY: 'Loyalty',
  RETENTION: 'Retention',
}

export function SuggestionsList({ suggestions: initialSuggestions }: SuggestionsListProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions)

  async function toggleImplemented(id: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/suggestions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, implemented: !currentStatus }),
      })

      if (res.ok) {
        setSuggestions(suggestions.map(s => 
          s.id === id ? { ...s, implemented: !currentStatus } : s
        ))
      }
    } catch (error) {
      console.error('Failed to toggle suggestion:', error)
    }
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No recommendations yet. Update your store metrics to get personalized suggestions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className={suggestion.implemented ? 'opacity-60' : ''}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{typeLabels[suggestion.type]}</Badge>
                  <div className={`h-2 w-2 rounded-full ${priorityColors[suggestion.priority]}`} />
                  <span className="text-xs text-muted-foreground uppercase">
                    {suggestion.priority}
                  </span>
                  {suggestion.estimatedImpact && (
                    <Badge variant="secondary" className="ml-auto">
                      {suggestion.estimatedImpact}
                    </Badge>
                  )}
                </div>
                <CardTitle className="flex items-center gap-2">
                  {suggestion.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base mb-4">
              {suggestion.description}
            </CardDescription>
            <Button
              variant={suggestion.implemented ? 'outline' : 'default'}
              size="sm"
              onClick={() => toggleImplemented(suggestion.id, suggestion.implemented)}
            >
              {suggestion.implemented ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Implemented
                </>
              ) : (
                <>
                  <Circle className="mr-2 h-4 w-4" />
                  Mark as Implemented
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
