import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function calculateLTV(aov: number, repeatRate: number): number {
  // Simple LTV calculation: AOV * (1 / (1 - repeat_rate))
  // This assumes repeat rate is a decimal (e.g., 0.20 for 20%)
  const repeatRateDecimal = repeatRate / 100
  if (repeatRateDecimal >= 1) return aov * 10 // Cap at 10x for safety
  return aov / (1 - repeatRateDecimal)
}

export function calculateMER(revenue: number, adSpend: number): number {
  // MER = Revenue / Ad Spend
  if (adSpend === 0) return 0
  return revenue / adSpend
}

export function getTargetMER(aov: number, repeatRate: number): number {
  // Target MER should be at least 3-4x for healthy business
  // Adjust based on LTV
  const ltv = calculateLTV(aov, repeatRate)
  const cac = ltv * 0.3 // Aim for CAC to be 30% of LTV
  return cac > 0 ? aov / cac : 3
}
