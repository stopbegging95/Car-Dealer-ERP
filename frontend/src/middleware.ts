import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token and user role from cookies
  const authToken =
    request.cookies.get("cardeals_auth_token")?.value ||
    request.cookies.get("token")?.value;
  const userRole = request.cookies.get("cardeals_user_role")?.value;

  // Protected route categories
  const isErpRoute = pathname.startsWith("/erp");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountingRoute = pathname.startsWith("/accounting");
  const isPortalRoute = pathname.startsWith("/portal");

  // Allow exempt public auth pages under erp if any (e.g. /erp/login)
  if (pathname === "/erp/login") {
    return NextResponse.next();
  }

  // 1. STRICT ACCESS CONTROL: If no auth token is present, block access immediately
  if (!authToken) {
    if (isPortalRoute) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute || isErpRoute || isAccountingRoute) {
      const dashboardLoginUrl = new URL("/auth/dashboard-login", request.url);
      dashboardLoginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(dashboardLoginUrl);
    }
  }

  // 2. ROLE PRIVILEGE SEPARATION: Customer accounts cannot access staff ERP / Admin HQ
  if (userRole === "customer" && (isErpRoute || isAdminRoute || isAccountingRoute)) {
    const portalUrl = new URL("/portal", request.url);
    return NextResponse.redirect(portalUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/erp/:path*",
    "/admin/:path*",
    "/portal/:path*",
    "/accounting/:path*",
  ],
};

