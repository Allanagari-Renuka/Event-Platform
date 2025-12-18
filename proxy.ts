import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

const protectedRoutes = ["/profile", "/events/create"]
const authRoutes = ["/sign-in", "/sign-up"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("session")?.value

  let isAuthenticated = false

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/events/create", "/sign-in", "/sign-up"],
}
