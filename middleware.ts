import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')
    const isPublicPage = req.nextUrl.pathname === '/' || 
                        req.nextUrl.pathname === '/pricing' || 
                        req.nextUrl.pathname === '/privacy' || 
                        req.nextUrl.pathname === '/terms' || 
                        req.nextUrl.pathname === '/contact' || 
                        req.nextUrl.pathname === '/intel'
    const isMarketplaceBrowsePage = req.nextUrl.pathname === '/marketplace' && req.method === 'GET'
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')
    const isMarketplaceActionPage = req.nextUrl.pathname.startsWith('/marketplace') && !isMarketplaceBrowsePage

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return null
    }

    if (isPublicPage || isMarketplaceBrowsePage) {
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
    }

    if (isAdminPage && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isDashboardPage || isMarketplaceActionPage) {
      return null
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Let the middleware function handle the logic
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/marketplace/:path*',
    '/login',
    '/signup',
    '/checkout/:path*'
  ]
}
