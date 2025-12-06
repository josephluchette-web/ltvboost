import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Allow access to auth pages
    if (path.startsWith('/login') || path.startsWith('/register')) {
      return NextResponse.next()
    }

    // Require authentication for protected routes
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Check subscription status for dashboard access
    if (path.startsWith('/dashboard') || path.startsWith('/settings')) {
      // Allow access to onboarding even without subscription
      if (path === '/dashboard/onboarding') {
        return NextResponse.next()
      }

      // Redirect to pricing if no active subscription
      // This will be checked more thoroughly in the page component
      // Middleware just does basic routing
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Public routes
        if (path === '/' || path.startsWith('/api/webhooks')) {
          return true
        }

        // Auth routes - allow if not authenticated
        if (path.startsWith('/login') || path.startsWith('/register')) {
          return true
        }

        // Protected routes - require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
