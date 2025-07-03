import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_token');
  const { pathname } = request.nextUrl;
 
  const isAuthenticated = !!sessionCookie;
 
  // Define las rutas que son parte del flujo de autenticación (públicas para no autenticados)
  const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/register/create-property'
  ];
  
  // Define las rutas que deben ser protegidas
  const protectedRoutes = [
    '/dashboard'
  ];
 
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Si el usuario está autenticado y intenta acceder a una ruta de autenticación, redirigir al dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si el usuario NO está autenticado y trata de acceder a una ruta protegida, redirigir a login
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  return NextResponse.next();
}
 
// Configuración del matcher para aplicar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the homepage is public)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|/$).*)',
  ],
}
