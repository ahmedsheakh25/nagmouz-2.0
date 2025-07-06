import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for static files and API routes
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname === '/favicon.ico' ||
      request.nextUrl.pathname.includes('.') // Skip files with extensions
    ) {
      return NextResponse.next();
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const isAuth = !!session;
    const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return res;
    }

    if (!isAuth) {
      let from = request.nextUrl.pathname;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, request.url),
      );
    }

    return res;
  } catch (error) {
    // If there's an error, allow the request to continue
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js files)
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * Also exclude all files with extensions
     */
    "/((?!api|_next|static|favicon\\.ico|public|\\.).)*",
  ],
};
