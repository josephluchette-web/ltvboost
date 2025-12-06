# LTVBoost - SaaS Starter for Shopify Merchants

A production-ready SaaS application to help Shopify merchants increase customer lifetime value (LTV) and marketing efficiency ratio (MER) through AI-powered recommendations.

## Features

- 🔐 **Authentication**: Email/password authentication with NextAuth
- 💳 **Stripe Integration**: Subscription billing with webhook support
- 📊 **Analytics Dashboard**: View key metrics (AOV, LTV, repeat rate)
- 🤖 **AI Recommendations**: Smart LTV optimization suggestions based on store data
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 🔒 **Protected Routes**: Middleware-based authentication and subscription checks
- 📱 **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Stripe account
- OpenSSL (for generating secrets)

## Getting Started

### 1. Clone and Install

```bash
cd ltvboost
pnpm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ltvboost?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="LTVBoost"
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 3. Database Setup

Run Prisma migrations:

```bash
pnpm db:push
# or for production
pnpm db:migrate
```

View your database:

```bash
pnpm db:studio
```

### 4. Stripe Setup

#### Create Products and Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create three products:
   - **Starter**: $29/month
   - **Pro**: $79/month
   - **Enterprise**: $199/month
4. Copy the Price IDs and add them to your `.env` file

#### Set Up Webhooks

For local development:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
pnpm stripe:listen
```

Copy the webhook signing secret (starts with `whsec_`) to your `.env` as `STRIPE_WEBHOOK_SECRET`.

For production, add your production URL in Stripe Dashboard:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ltvboost/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── webhooks/stripe/route.ts
│   │   ├── checkout/route.ts
│   │   ├── onboarding/route.ts
│   │   └── suggestions/toggle/route.ts
│   ├── dashboard/page.tsx
│   ├── onboarding/page.tsx
│   ├── settings/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx (landing page)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── dashboard/
│   │   ├── dashboard-layout.tsx
│   │   ├── metrics-cards.tsx
│   │   ├── suggestions-list.tsx
│   │   └── subscription-portal-button.tsx
│   └── providers.tsx
├── lib/
│   ├── auth.ts (NextAuth config)
│   ├── prisma.ts (Prisma client)
│   ├── stripe.ts (Stripe utilities)
│   ├── recommendations.ts (LTV recommendation engine)
│   └── utils.ts (helper functions)
├── prisma/
│   └── schema.prisma
├── types/
│   └── next-auth.d.ts
├── middleware.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Key Features Explained

### Authentication Flow

1. User registers at `/register`
2. Password is hashed with bcrypt
3. User logs in at `/login`
4. NextAuth creates a session
5. Protected routes check authentication via middleware

### Subscription Flow

1. User completes onboarding
2. Redirected to dashboard (requires subscription)
3. User subscribes via Stripe Checkout
4. Webhook updates subscription status in database
5. User gains access to dashboard

### Recommendation Engine

The recommendation engine (`lib/recommendations.ts`) analyzes store metrics and generates personalized suggestions:

- **Low AOV + Low Repeat Rate** → Subscription + Bundle recommendations
- **Medium AOV + Low Repeat Rate** → Loyalty program + Retention campaigns
- **High AOV** → Upsells + Cross-sells
- **Niche-specific** → Tailored recommendations for Beauty, Food, Fashion, etc.

### Database Schema

- **User**: Authentication and profile
- **Subscription**: Stripe subscription data
- **StoreMetrics**: Store performance data
- **Suggestion**: AI-generated recommendations

## API Routes

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Billing
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/subscription/portal` - Access customer portal
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Data
- `POST /api/onboarding` - Save store metrics and generate recommendations
- `POST /api/suggestions/toggle` - Mark suggestion as implemented

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Docker

```bash
# Build
docker build -t ltvboost .

# Run
docker run -p 3000:3000 --env-file .env ltvboost
```

## Environment Variables Checklist

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your app URL
- [ ] `NEXTAUTH_SECRET` - Random secret (use `openssl rand -base64 32`)
- [ ] `STRIPE_SECRET_KEY` - From Stripe Dashboard
- [ ] `STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` - From Stripe CLI or Dashboard
- [ ] `STRIPE_STARTER_PRICE_ID` - Starter plan price ID
- [ ] `STRIPE_PRO_PRICE_ID` - Pro plan price ID (optional)
- [ ] `STRIPE_ENTERPRISE_PRICE_ID` - Enterprise plan price ID (optional)
- [ ] `NEXT_PUBLIC_APP_URL` - Your app URL
- [ ] `NEXT_PUBLIC_APP_NAME` - Your app name

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema changes (dev)
pnpm db:migrate       # Create migration (prod)
pnpm db:studio        # Open Prisma Studio

# Stripe
pnpm stripe:listen    # Listen to webhooks locally
```

## Customization

### Adding More Plans

1. Create products in Stripe Dashboard
2. Add price IDs to `.env`
3. Update `lib/stripe.ts` PLANS object
4. Update Prisma schema if needed

### Modifying Recommendations

Edit `lib/recommendations.ts` to customize the recommendation logic based on your business rules.

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Use Tailwind utility classes

## Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ CSRF protection via NextAuth
- ✅ Webhook signature verification
- ✅ Environment variables for secrets
- ✅ Protected API routes with session checks
- ✅ SQL injection prevention via Prisma

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres

# Test connection
pnpm db:studio
```

### Stripe Webhook Issues

```bash
# Test webhook locally
stripe trigger checkout.session.completed

# Check webhook logs
stripe logs tail
```

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
pnpm install
pnpm build
```

## Next Steps

- [ ] Add Shopify OAuth integration
- [ ] Implement embedded app features
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add analytics tracking
- [ ] Implement A/B testing for recommendations

## Support

For issues and questions:
- Check the [documentation](https://nextjs.org/docs)
- Review [Prisma docs](https://www.prisma.io/docs)
- Read [Stripe docs](https://stripe.com/docs)

## License

MIT
