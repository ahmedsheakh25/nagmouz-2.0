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

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session && isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
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
