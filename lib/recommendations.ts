import { SuggestionType, SuggestionPriority } from '@prisma/client'

export interface StoreMetricsInput {
  aov: number
  monthlyRevenue: number
  repeatRate: number
  niche: string
}

export interface Recommendation {
  type: SuggestionType
  priority: SuggestionPriority
  title: string
  description: string
  estimatedImpact: string
}

export function generateRecommendations(metrics: StoreMetricsInput): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { aov, monthlyRevenue, repeatRate, niche } = metrics

  // Rule 1: Low AOV + Low Repeat Rate → Subscription + Bundle
  if (aov < 40 && repeatRate < 20) {
    recommendations.push({
      type: 'SUBSCRIPTION',
      priority: 'HIGH',
      title: 'Launch a Subscribe & Save Program',
      description: `With an AOV of $${aov.toFixed(2)} and only ${repeatRate.toFixed(1)}% repeat customers, implementing a subscription model with 15-20% discount can dramatically increase LTV. Start with your top 3 products and offer monthly delivery options.`,
      estimatedImpact: '+25-40% LTV',
    })

    recommendations.push({
      type: 'BUNDLE',
      priority: 'HIGH',
      title: 'Create Product Bundles to Increase AOV',
      description: `Bundle complementary products together at a 10-15% discount. This increases your average order value while providing perceived value to customers. Target bundles that push AOV above $50.`,
      estimatedImpact: '+$15-25 AOV',
    })
  }

  // Rule 2: Medium AOV + Low Repeat Rate → Loyalty & Retention
  if (aov >= 40 && aov < 70 && repeatRate < 25) {
    recommendations.push({
      type: 'LOYALTY',
      priority: 'HIGH',
      title: 'Implement a Points-Based Loyalty Program',
      description: `Your customers are spending decent amounts but not returning. Launch a loyalty program offering 1 point per $1 spent, with rewards at 100, 250, and 500 points. This incentivizes repeat purchases.`,
      estimatedImpact: '+15-20% repeat rate',
    })

    recommendations.push({
      type: 'RETENTION',
      priority: 'MEDIUM',
      title: 'Set Up Win-Back Email Campaigns',
      description: `Create automated email sequences for customers who haven't purchased in 30, 60, and 90 days. Offer exclusive discounts (10-15%) to bring them back.`,
      estimatedImpact: '+10-15% LTV',
    })
  }

  // Rule 3: High AOV → Upsells & Cross-sells
  if (aov >= 70) {
    recommendations.push({
      type: 'UPSELL',
      priority: 'CRITICAL',
      title: 'Add Post-Purchase One-Click Upsells',
      description: `With a high AOV of $${aov.toFixed(2)}, your customers are willing to spend. Implement post-purchase upsells offering complementary products at 20-30% off immediately after checkout. This can add $15-30 per order.`,
      estimatedImpact: '+$20-35 AOV',
    })

    recommendations.push({
      type: 'CROSS_SELL',
      priority: 'HIGH',
      title: 'Optimize Product Page Cross-Sells',
      description: `Add "Frequently Bought Together" sections on your product pages. Use AI to recommend complementary products that increase cart value by 20-40%.`,
      estimatedImpact: '+$25-40 AOV',
    })
  }

  // Rule 4: Good Repeat Rate → Optimize existing customers
  if (repeatRate >= 25) {
    recommendations.push({
      type: 'LOYALTY',
      priority: 'MEDIUM',
      title: 'Launch VIP Tier for Top Customers',
      description: `With ${repeatRate.toFixed(1)}% repeat customers, create a VIP program for customers who've made 3+ purchases. Offer exclusive perks, early access, and special discounts to increase retention.`,
      estimatedImpact: '+10-15% LTV',
    })

    recommendations.push({
      type: 'UPSELL',
      priority: 'MEDIUM',
      title: 'Create Exclusive Bundles for Repeat Customers',
      description: `Your repeat customers trust you. Offer them exclusive premium bundles or limited edition products at a slight premium to maximize revenue from your best customers.`,
      estimatedImpact: '+$10-20 AOV',
    })
  }

  // Rule 5: Low Revenue → Focus on quick wins
  if (monthlyRevenue < 10000) {
    recommendations.push({
      type: 'BUNDLE',
      priority: 'CRITICAL',
      title: 'Quick Win: BOGO on Best-Selling Product',
      description: `Test a Buy One Get One 50% Off promotion on your top seller for 7 days. This low-risk strategy can quickly increase AOV and introduce customers to multiple products.`,
      estimatedImpact: '+30-50% revenue',
    })
  }

  // Rule 6: Niche-specific recommendations
  if (niche.toLowerCase().includes('beauty') || niche.toLowerCase().includes('cosmetic')) {
    recommendations.push({
      type: 'SUBSCRIPTION',
      priority: 'HIGH',
      title: 'Beauty Box Subscription Model',
      description: `Beauty products are perfect for subscriptions. Create a monthly beauty box with 3-5 sample or full-size products. Price it at $25-35/month for predictable recurring revenue.`,
      estimatedImpact: '+50-80% LTV',
    })
  }

  if (niche.toLowerCase().includes('food') || niche.toLowerCase().includes('supplement')) {
    recommendations.push({
      type: 'SUBSCRIPTION',
      priority: 'CRITICAL',
      title: 'Auto-Replenishment Program',
      description: `Consumable products are ideal for auto-replenishment. Offer customers the option to receive products every 30, 60, or 90 days at a 15% discount.`,
      estimatedImpact: '+60-100% LTV',
    })
  }

  if (niche.toLowerCase().includes('fashion') || niche.toLowerCase().includes('apparel')) {
    recommendations.push({
      type: 'CROSS_SELL',
      priority: 'HIGH',
      title: 'Complete-the-Look Recommendations',
      description: `Add "Complete the Look" sections showing full outfit combinations. This increases units per transaction and AOV significantly in fashion.`,
      estimatedImpact: '+$30-50 AOV',
    })
  }

  // Always add at least one retention play
  if (recommendations.length < 3) {
    recommendations.push({
      type: 'RETENTION',
      priority: 'MEDIUM',
      title: 'Launch Post-Purchase Email Sequence',
      description: `Create a 5-email sequence over 30 days: Thank you → Product tips → Review request → Related products → Exclusive offer. This nurtures customers and drives repeat purchases.`,
      estimatedImpact: '+8-12% repeat rate',
    })
  }

  return recommendations
}
