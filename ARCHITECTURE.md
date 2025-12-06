# LTVBoost Architecture Documentation

## Overview

LTVBoost is a production-ready SaaS application built with Next.js 14 App Router, designed to help Shopify merchants optimize their customer lifetime value (LTV) through AI-powered recommendations.

## Architecture Principles

### 1. **Separation of Concerns**
- **Presentation Layer**: React components in `app/` and `components/`
- **Business Logic**: Utility functions in `lib/`
- **Data Layer**: Prisma ORM with PostgreSQL
- **External Services**: Stripe for payments, NextAuth for authentication

### 2. **Type Safety**
- Full TypeScript implementation
- Prisma-generated types for database models
- Zod schemas for runtime validation
- NextAuth type extensions

### 3. **Security First**
- Password hashing with bcryptjs
- Session-based authentication via NextAuth
- Webhook signature verification
- Protected API routes
- Middleware-based route protection

## Tech Stack Rationale

### Next.js 14 (App Router)
**Why**: 
- Server Components for better performance
- Built-in API routes
- File-based routing
- Excellent TypeScript support
- Vercel deployment optimization

**Trade-offs**:
- Learning curve for App Router
- Some libraries not yet compatible with RSC

### Prisma ORM
**Why**:
- Type-safe database queries
- Excellent TypeScript integration
- Migration management
- Database schema as code
- Great developer experience

**Trade-offs**:
- Slightly larger bundle size
- Learning curve for complex queries

### NextAuth.js
**Why**:
- Industry standard for Next.js auth
- Multiple provider support
- Session management
- CSRF protection
- Easy to extend

**Trade-offs**:
- Complex configuration for advanced use cases
- Limited customization of UI

### Stripe
**Why**:
- Industry-leading payment platform
- Excellent developer experience
- Comprehensive webhook system
- Built-in customer portal
- PCI compliance handled

**Trade-offs**:
- Transaction fees
- Vendor lock-in

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Browser - React Components + Client-Side Logic)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  API Routes  │  │  Middleware  │     │
│  │  (RSC/SSR)   │  │  (Handlers)  │  │  (Auth)      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Logic   │  │ Stripe Utils │  │ Recommender  │     │
│  │ (lib/auth)   │  │ (lib/stripe) │  │ Engine       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Prisma     │  │  PostgreSQL  │  │    Stripe    │     │
│  │   Client     │  │   Database   │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User Registration:
1. User submits form → /api/auth/register
2. Validate input with Zod
3. Hash password with bcryptjs
4. Create user in database via Prisma
5. Redirect to login

User Login:
1. User submits credentials → NextAuth
2. Verify password with bcrypt.compare()
3. Create JWT session
4. Set session cookie
5. Redirect to dashboard
```

### 2. Subscription Flow

```
Checkout:
1. User clicks "Subscribe" → /api/checkout
2. Create Stripe Checkout Session
3. Redirect to Stripe hosted page
4. User completes payment
5. Stripe sends webhook → /api/webhooks/stripe
6. Verify webhook signature
7. Update subscription in database
8. User gains access to dashboard

Subscription Management:
1. User clicks "Manage Subscription" → /api/subscription/portal
2. Create Stripe Customer Portal session
3. Redirect to Stripe portal
4. User updates subscription
5. Webhook updates database
```

### 3. Recommendation Flow

```
Onboarding:
1. User enters store metrics → /api/onboarding
2. Validate with Zod schema
3. Save to StoreMetrics table
4. Generate recommendations via recommendation engine
5. Save suggestions to Suggestion table
6. Redirect to dashboard

Dashboard:
1. Server Component fetches data
2. Query StoreMetrics + Suggestions
3. Calculate derived metrics (LTV, MER)
4. Render metrics cards + suggestion list
5. User marks suggestions as implemented
6. Update via /api/suggestions/toggle
```

## Database Schema Design

### User Model
- Central entity for authentication
- One-to-one with Subscription
- One-to-many with StoreMetrics and Suggestions

### Subscription Model
- Stores Stripe customer and subscription IDs
- Enum for status (ACTIVE, CANCELED, etc.)
- Tracks billing periods

### StoreMetrics Model
- Captures store performance data
- Linked to user and suggestions
- Supports multiple snapshots over time

### Suggestion Model
- AI-generated recommendations
- Categorized by type and priority
- Tracks implementation status

## Component Architecture

### Layout Components
- **DashboardLayout**: Sidebar navigation, user menu
- **Providers**: Wraps app with SessionProvider

### Feature Components
- **MetricsCards**: Display KPIs (AOV, LTV, etc.)
- **SuggestionsList**: Render recommendations
- **SubscriptionPortalButton**: Stripe portal access

### UI Components (shadcn/ui)
- Composable, accessible primitives
- Radix UI under the hood
- Customizable with Tailwind

## API Design

### RESTful Conventions
- `POST` for creating/updating resources
- `GET` for fetching (via Server Components)
- Consistent error responses

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}
```

### Authentication
- All protected routes check session via `getServerSession()`
- Return 401 if unauthorized

## Recommendation Engine

### Algorithm

The recommendation engine uses a **rule-based system** that analyzes store metrics:

```typescript
Input: { aov, monthlyRevenue, repeatRate, niche }

Rules:
1. IF aov < $40 AND repeatRate < 20%
   THEN suggest: Subscription + Bundle

2. IF aov >= $40 AND aov < $70 AND repeatRate < 25%
   THEN suggest: Loyalty Program + Retention

3. IF aov >= $70
   THEN suggest: Upsells + Cross-sells

4. IF repeatRate >= 25%
   THEN suggest: VIP Program

5. IF monthlyRevenue < $10,000
   THEN suggest: Quick wins (BOGO)

6. Niche-specific rules:
   - Beauty → Subscription box
   - Food/Supplements → Auto-replenishment
   - Fashion → Complete-the-look
```

### Future Enhancements
- Machine learning model trained on successful implementations
- A/B testing framework
- Personalization based on industry benchmarks

## Security Considerations

### Authentication
- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ Session tokens stored in HTTP-only cookies
- ✅ CSRF protection via NextAuth

### Authorization
- ✅ Middleware checks authentication
- ✅ API routes verify user ownership
- ✅ Server Components fetch user-specific data

### Data Protection
- ✅ Environment variables for secrets
- ✅ Prisma prevents SQL injection
- ✅ Input validation with Zod

### Stripe Security
- ✅ Webhook signature verification
- ✅ Secret keys never exposed to client
- ✅ Customer portal for sensitive operations

## Performance Optimization

### Server Components
- Default to RSC for better performance
- Only use 'use client' when necessary

### Database Queries
- Include only necessary relations
- Use indexes on frequently queried fields
- Limit results when appropriate

### Caching Strategy
- Next.js automatic caching for static pages
- Revalidate data on mutations
- Consider Redis for session storage at scale

## Deployment Architecture

### Vercel (Recommended)
```
┌─────────────────────────────────────────┐
│           Vercel Edge Network            │
│  (Global CDN + Edge Functions)          │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Next.js Application              │
│  (Serverless Functions)                  │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  PostgreSQL  │      │    Stripe    │
│  (External)  │      │     API      │
└──────────────┘      └──────────────┘
```

### Docker
```
┌─────────────────────────────────────────┐
│         Load Balancer (Nginx)            │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  Container 1 │      │  Container 2 │
│  (Next.js)   │      │  (Next.js)   │
└──────────────┘      └──────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  PostgreSQL  │      │    Stripe    │
│  (Container) │      │     API      │
└──────────────┘      └──────────────┘
```

## Monitoring & Observability

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics or Plausible
- **Logging**: Pino or Winston
- **APM**: New Relic or Datadog

### Key Metrics to Track
- User registration rate
- Subscription conversion rate
- Recommendation implementation rate
- API response times
- Error rates

## Scalability Considerations

### Current Limitations
- Single database instance
- No caching layer
- Synchronous recommendation generation

### Scaling Path
1. **Phase 1** (0-1K users): Current architecture
2. **Phase 2** (1K-10K users):
   - Add Redis for session storage
   - Implement database read replicas
   - Add CDN for static assets
3. **Phase 3** (10K+ users):
   - Microservices for recommendation engine
   - Message queue for async processing
   - Horizontal scaling with load balancer

## Testing Strategy

### Unit Tests
- Test utility functions (utils.ts, recommendations.ts)
- Test API route handlers

### Integration Tests
- Test authentication flow
- Test subscription flow
- Test webhook handlers

### E2E Tests
- Test user registration → onboarding → dashboard
- Test subscription purchase flow

### Recommended Tools
- **Unit**: Jest + React Testing Library
- **Integration**: Supertest
- **E2E**: Playwright or Cypress

## Future Roadmap

### Phase 1: Shopify Integration
- OAuth authentication
- Embedded app
- Real-time data sync

### Phase 2: Advanced Analytics
- Cohort analysis
- Revenue forecasting
- Churn prediction

### Phase 3: AI Enhancement
- Machine learning recommendations
- Natural language insights
- Automated A/B testing

### Phase 4: Multi-Platform
- WooCommerce support
- BigCommerce support
- Custom API integrations

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow Next.js conventions
- Use Prettier for formatting
- Write meaningful commit messages

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit PR with description
5. Address review feedback

## Conclusion

LTVBoost is designed as a **scalable, maintainable, and secure** SaaS starter. The architecture balances **simplicity for MVP** with **extensibility for growth**. Key decisions prioritize **developer experience**, **type safety**, and **production readiness**.
