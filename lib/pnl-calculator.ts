// ltvboost/lib/pnl-calculator.ts
import { getShopifyClient } from './shopify'

/**
 * Interface for the inputs required by the P&L Calculator.
 * These are the user-defined cost inputs.
 */
export interface PNLInputs {
  // User input: e.g., 50 for 50%
  grossMarginPercentage: number 
  // User input: e.g., 5000
  monthlyAdSpend: number 
  // User input: e.g., 1000 (SaaS, Rent, Salaries, etc.)
  monthlyOperatingExpenses: number 
  // Revenue is passed from the API route after fetching the latest StoreMetrics
  monthlyRevenue: number 
}

/**
 * Interface for the calculated results of the P&L Dashboard.
 */
export interface PNLResult {
  monthlyRevenue: number
  cogs: number
  grossProfit: number
  adSpend: number
  operatingExpenses: number
  netProfit: number
  grossMarginPercentage: number
  netProfitMargin: number
}

/**
 * Calculates the Profit & Loss based on revenue and user-defined cost inputs.
 *
 * NOTE: This function no longer fetches revenue from Shopify directly.
 * The API route (app/api/pnl/route.ts) is responsible for fetching the latest
 * monthlyRevenue from the database and passing it to this function.
 *
 * @param inputs - The revenue and user-defined cost inputs.
 * @returns The calculated P&L result.
 */
export function calculatePNL(inputs: PNLInputs): PNLResult {
  const { monthlyRevenue, grossMarginPercentage, monthlyAdSpend, monthlyOperatingExpenses } = inputs

  // 1. Calculate COGS (Cost of Goods Sold)
  // COGS = Revenue * (1 - Gross Margin %)
  const grossMarginDecimal = grossMarginPercentage / 100
  const cogsPercentage = 1 - grossMarginDecimal
  const cogs = monthlyRevenue * cogsPercentage

  // 2. Calculate Gross Profit
  // Gross Profit = Revenue - COGS
  const grossProfit = monthlyRevenue - cogs

  // 3. Calculate Net Profit
  // Net Profit = Gross Profit - Ad Spend - Operating Expenses
  const netProfit = grossProfit - monthlyAdSpend - monthlyOperatingExpenses

  // 4. Calculate Margins
  const netProfitMargin = (netProfit / monthlyRevenue) * 100

  return {
    monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
    cogs: parseFloat(cogs.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    adSpend: parseFloat(monthlyAdSpend.toFixed(2)),
    operatingExpenses: parseFloat(monthlyOperatingExpenses.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    grossMarginPercentage: grossMarginPercentage,
    netProfitMargin: parseFloat(netProfitMargin.toFixed(2)),
  }
}
