import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/callback"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get JWT token from cookie
  const token = req.cookies.get("auth-token")?.value;
  const isAuthenticated = !!token;

  // Check if current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Handle root path redirect
  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.redirect(new URL("/app/home", req.url));
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If user is authenticated and trying to access auth pages (except callback), redirect to home
  if (
    isAuthenticated &&
    pathname.startsWith("/auth") &&
    pathname !== "/auth/callback"
  ) {
    return NextResponse.redirect(new URL("/app/home", req.url));
  }

  return NextResponse.next();
}

// Configuration for which paths the middleware should apply to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
