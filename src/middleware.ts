import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin-session.constants"

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin/dashboard") && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard", "/admin/dashboard/:path*", "/admin/login"],
}
