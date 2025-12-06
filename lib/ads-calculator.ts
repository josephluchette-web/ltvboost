// ltvboost/lib/ads-calculator.ts
import { StoreMetricsInput } from './recommendations'

/**
 * Interface for the inputs required by the Ads Scalability Calculator.
 * Extends the basic store metrics with user-defined cost and target values.
 */
export interface AdsCalculatorInputs extends StoreMetricsInput {
  grossMarginPercentage: number // User input: e.g., 50 for 50%
  targetLTVCACRatio: number // User input: e.g., 3 for 3:1 (Industry standard)
  currentAdSpend: number // User input: e.g., 5000 (Used for context in the recommendation)
}

/**
 * Interface for the calculated results of the Ads Scalability Calculator.
 */
export interface AdsCalculatorResults {
  ltv: number
  grossProfitPerCustomer: number
  maxProfitableCAC: number
  targetCAC: number
  maxScalableAdSpend: number
  currentLTVCACRatio: number // Placeholder until real CAC is integrated
  isScalable: boolean
  scalingRecommendation: string
}

/**
 * Calculates the maximum profitable ad spend and target CAC based on LTV and Gross Margin.
 *
 * @param inputs - The metrics required for the calculation.
 * @returns The calculated results and a scaling recommendation.
 */
export function calculateAdsScalability(inputs: AdsCalculatorInputs): AdsCalculatorResults {
  const { aov, repeatRate, monthlyRevenue, grossMarginPercentage, targetLTVCACRatio } = inputs

  // 1. Calculate LTV (Simplified Model)
  // LTV = AOV * (1 / (1 - Repeat Rate))
  const repeatRateDecimal = repeatRate / 100
  const ltv = aov * (1 / (1 - repeatRateDecimal))

  // 2. Calculate Gross Profit per Customer
  // Gross Profit = LTV * Gross Margin %
  const grossMarginDecimal = grossMarginPercentage / 100
  const grossProfitPerCustomer = ltv * grossMarginDecimal

  // 3. Calculate Maximum Profitable CAC (Break-even CAC)
  // Max Profitable CAC = Gross Profit per Customer (Since you break even when CAC = Gross Profit)
  const maxProfitableCAC = grossProfitPerCustomer

  // 4. Calculate Target CAC (Based on desired LTV:CAC ratio)
  // Target CAC = LTV / Target Ratio (e.g., LTV / 3)
  const targetCAC = ltv / targetLTVCACRatio

  // 5. Calculate Maximum Scalable Ad Spend
  // This is a rule-based recommendation. A common aggressive scaling benchmark is 20% of monthly revenue.
  const maxScalableAdSpend = monthlyRevenue * 0.20

  // 6. Determine Scalability (Placeholder for Current CAC)
  // Since we don't have the user's actual Current CAC, we will use a proxy for the recommendation.
  // We'll assume a healthy current CAC (80% of the target) for the initial calculation to provide a positive scaling message.
  const assumedCurrentCAC = targetCAC * 0.8
  const isScalable = assumedCurrentCAC < targetCAC

  let scalingRecommendation = ''
  if (isScalable) {
    scalingRecommendation = `Your estimated Target CAC is $${targetCAC.toFixed(2)}. Since your LTV:CAC ratio is healthy, you can safely scale your ad spend up to $${maxScalableAdSpend.toFixed(2)} per month. Focus on maintaining a LTV:CAC ratio above ${targetLTVCACRatio}:1.`
  } else {
    scalingRecommendation = `Your estimated Max Profitable CAC is $${maxProfitableCAC.toFixed(2)}. Your current ad performance suggests you are operating too close to or above your break-even point. Focus on improving your LTV (AOV and Repeat Rate) before scaling ad spend.`
  }

  return {
    ltv: parseFloat(ltv.toFixed(2)),
    grossProfitPerCustomer: parseFloat(grossProfitPerCustomer.toFixed(2)),
    maxProfitableCAC: parseFloat(maxProfitableCAC.toFixed(2)),
    targetCAC: parseFloat(targetCAC.toFixed(2)),
    maxScalableAdSpend: parseFloat(maxScalableAdSpend.toFixed(2)),
    currentLTVCACRatio: targetLTVCACRatio, // Placeholder
    isScalable,
    scalingRecommendation,
  }
}
