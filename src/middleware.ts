import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // @BestPractice: Define which routes are public and which are protected.
  // Route groups like (authenticated) are ignored in middleware paths.
  const isProtectedRoute = path.startsWith('/dashboard');
  const isPublicRoute = 
    path === '/login' ||
    path === '/register' ||
    path.startsWith('/register/create-property') ||
    path === '/forgot-password' ||
    path === '/';

  // @Security: Read the session from the incoming request's cookies.
  // In middleware, we can't use the `cookies()` function from `next/headers`
  // as it's a dynamic function not available in this edge runtime context.
  const session = await getSession();

  // Redirect logic
  if (isProtectedRoute && !session?.userId) {
    // @Security: If user is not authenticated and tries to access a protected route,
    // redirect them to the login page.
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (session?.userId && (path === '/login' || path === '/register')) {
     // @Security: If an authenticated user tries to access login/register,
     // redirect them to the dashboard.
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

// @BestPractice: The matcher configures which paths the middleware runs on.
// This regex excludes static files and API routes, improving performance.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
