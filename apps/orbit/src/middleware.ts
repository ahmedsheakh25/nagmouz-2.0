import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ['/login', '/register', '/auth/callback'];
const STATIC_ASSETS = ['/icons/', '/images/', '/_next/', '/favicon.ico', '/manifest.json'];

export async function middleware(req: NextRequest) {
  try {
    // Check if the request is for static assets
    if (STATIC_ASSETS.some(path => req.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();

    // Allow access to public paths
    if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
      if (session) {
        // If logged in, redirect to dashboard from public paths
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return res;
    }

    // Protected routes - redirect to login if no session
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow request to continue but don't modify response
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
