import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Auth is disabled for now - bypass all checks
  const session = null

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/artist-dashboard", "/admin"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Admin-only routes
  const adminRoutes = ["/admin"]

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Auth routes (redirect to dashboard if already logged in)
  const authRoutes = ["/auth/login", "/auth/register", "/auth/reset-password"]

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname === route)

  // If the user is on an auth route and is already logged in, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Temporarily disable auth checks
  // if (isProtectedRoute && !session) {
  //   return NextResponse.redirect(new URL("/auth/login", req.url))
  // }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/artist-dashboard/:path*", "/admin/:path*", "/auth/:path*"],
}
