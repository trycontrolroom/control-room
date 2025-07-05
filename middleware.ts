import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

function getWorkspaceRole(req: any): { workspaceId: string | null, workspaceRole: string | null } {
  const cookies = req.cookies
  const workspaceId = cookies.get('workspace-id')?.value || null
  const workspaceRole = cookies.get('workspace-role')?.value || null
  return { workspaceId, workspaceRole }
}

function hasWorkspaceRole(req: any, requiredRoles: string[]): boolean {
  const { workspaceRole } = getWorkspaceRole(req)
  if (!workspaceRole) return false
  return requiredRoles.includes(workspaceRole)
}

function checkAPIPermissions(pathname: string, method: string, token: any, req: any): boolean {
  const { workspaceRole } = getWorkspaceRole(req)
  
  if (pathname.startsWith('/api/admin/')) {
    return token?.role === 'ADMIN'
  }
  
  if (pathname.startsWith('/api/users/invite') || pathname.startsWith('/api/workspaces/invite')) {
    return workspaceRole === 'ADMIN'
  }
  
  if (pathname.startsWith('/api/agents/') && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    return workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER'
  }
  
  if (pathname.startsWith('/api/policies/') && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    return workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER'
  }
  
  if (pathname.startsWith('/api/custom-metrics/') && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    return workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER'
  }
  
  if (pathname.startsWith('/api/marketplace/') && method === 'POST') {
    return token?.role === 'SELLER' && (workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER')
  }
  
  if (method === 'GET') {
    return !!workspaceRole // Any workspace role can read
  }
  
  return workspaceRole === 'ADMIN' || workspaceRole === 'MANAGER'
}

export default withAuth(
  async function middleware(req) {
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
    const isDeveloperPage = req.nextUrl.pathname.startsWith('/developer')
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')
    const isMarketplaceActionPage = req.nextUrl.pathname.startsWith('/marketplace') && !isMarketplaceBrowsePage
    const isCreateWorkspacePage = req.nextUrl.pathname === '/dashboard/create-workspace'

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

    if (isAuth && isDashboardPage && !isCreateWorkspacePage && !req.nextUrl.pathname.startsWith('/api/')) {
      const { workspaceId } = getWorkspaceRole(req)
      
      if (!workspaceId) {
        return NextResponse.redirect(new URL('/dashboard/create-workspace', req.url))
      }
    }
    
    if (req.nextUrl.pathname.startsWith('/api/') && isAuth) {
      const hasPermission = checkAPIPermissions(req.nextUrl.pathname, req.method, token, req)
      
      if (!hasPermission) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    if (isAdminPage && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isDeveloperPage && token?.email !== 'admin@control-room.ai') {
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
    '/developer/:path*',
    '/marketplace/:path*',
    '/api/:path*',
    '/login',
    '/signup',
    '/checkout/:path*'
  ]
}
