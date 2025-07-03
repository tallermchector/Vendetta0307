import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/register', '/forgot-password', '/register/create-property', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 2. Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/register/create-property');
  
  // 3. Decrypt the session from the cookie
  const cookie = request.cookies.get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // 4. Redirect logic
  // 4.1. If the user is not authenticated and the route is protected, redirect to the login page
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 4.2. If the user is authenticated and trying to access a public route (like login), redirect to the dashboard
  if (
    session?.userId &&
    (path === '/login' || path === '/register' || path === '/forgot-password')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
