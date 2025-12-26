import { createServerClient, CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle root path redirect
  if (pathname === "/") {
    let res = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.redirect(new URL("/app/home", req.url));
  }

  let res = NextResponse.next();

  // Create a Supabase client within the middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated and trying to access /app, redirect to login
  if (!user && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If user is authenticated and trying to access /auth, redirect to home
  if (user && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/app/home", req.url));
  }

  return res;
}

// Configuration for which paths the middleware should apply to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
