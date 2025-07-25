// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { trackReferral } from "@/lib/referral-tracking"

function checkAPIPermissions(pathname: string, method: string, workspaceRole: string | null, globalRole: string | null) {
  // allow creating & switching workspaces always
  if ((pathname === "/api/workspaces/create" || pathname === "/api/workspaces/switch") && method === "POST") {
    return true
  }

  // admin-only APIs
  if (pathname.startsWith("/api/admin/")) {
    return globalRole === "ADMIN"
  }

  // invitations, agents, policies, etc...
  // (these can stay as you had them)
  // ...

  // read-only GET anywhere once you have any workspace
  if (method === "GET") {
    return !!workspaceRole
  }

  // default to admin/manager for mutating calls
  return workspaceRole === "ADMIN" || workspaceRole === "MANAGER"
}

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const cookieWsId   = req.cookies.get("workspace-id")?.value ?? null
    const cookieWsRole = req.cookies.get("workspace-role")?.value ?? null

    const globalRole     = token?.role || null
    const jwtWsRole      = token?.workspaceRole as string | null
    const effectiveRole  = cookieWsRole ?? jwtWsRole
    const effectiveWsId  = cookieWsId   ?? (token?.workspaceId as string | null)

    const url    = req.nextUrl
    const path   = url.pathname
    const method = req.method

    const isAuthPage        = path.startsWith("/login") || path.startsWith("/signup")
    const isPublicPage      = ["/", "/pricing", "/privacy", "/terms", "/contact", "/intel", "/affiliate"].includes(path)
    const isMarketplaceRead = path === "/marketplace" && method === "GET"
    const isDashboardPage   = path.startsWith("/dashboard")
    const isCreatePage      = path === "/dashboard/create-workspace"
    const isAdminPage       = path.startsWith("/admin")
    const isDeveloperPage   = path.startsWith("/developer")
    const isApi             = path.startsWith("/api/")

    let response = NextResponse.next()
    if ((path === "/signup" || path === "/") && url.searchParams.get('ref')) {
      try {
        response = await trackReferral(req, response)
      } catch (error) {
        console.error('Referral tracking error:', error)
      }
    }

    // Unauthenticated → redirect to login
    if (!token && !isAuthPage && !isPublicPage && !isMarketplaceRead) {
      const dest = `/login?from=${encodeURIComponent(url.pathname + url.search)}`
      return NextResponse.redirect(new URL(dest, req.url))
    }

    // Logged-in visiting `/login` or `/signup` → go dashboard
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // After login, force-create-workspace if none yet
    if (token && isDashboardPage && !isCreatePage && !isApi) {
      if (!effectiveWsId) {
        return NextResponse.redirect(new URL("/dashboard/create-workspace", req.url))
      }
    }

    // API permission checks
    if (isApi) {
      const allowed = checkAPIPermissions(path, method, effectiveRole, globalRole)
      if (!allowed) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    // Protect /admin (non-API)
    if (isAdminPage) {
      if (effectiveRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Protect /developer (non-API)
    if (isDeveloperPage) {
      if (token?.email !== "admin@control-room.ai") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // everything else is allowed
    return response
  },
  {
    callbacks: {
      // we manage auth above
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/developer/:path*",
    "/marketplace/:path*",
    "/api/:path*",
    "/login",
    "/signup",
    "/checkout/:path*",
  ],
}
