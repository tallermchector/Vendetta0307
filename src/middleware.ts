import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // @BestPractice: Define which routes are protected.
  // This helps centralize the routing logic. The create-property page is a
  // protected part of the registration flow.
  const isProtectedRoute = 
    path.startsWith('/dashboard') ||
    path.startsWith('/register/create-property');

  // @BestPractice: Define public routes that authenticated users should be
  // redirected away from (e.g., login, register).
  const isPublicAuthRoute = 
    path === '/login' ||
    path === '/register' ||
    path === '/forgot-password';

  // @Security: In middleware, read the cookie directly from the request object.
  // The `decrypt` function is safe to use here.
  const sessionCookie = request.cookies.get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  // Redirect logic
  if (isProtectedRoute && !session?.userId) {
    // @Security: If user is not authenticated and tries to access a protected route,
    // redirect them to the login page.
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (session?.userId && isPublicAuthRoute) {
     // @Security: If an authenticated user tries to access public auth pages like login/register,
     // redirect them to the dashboard. They should log out first.
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
