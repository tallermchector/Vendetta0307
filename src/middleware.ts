import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Por ahora, asumimos que una cookie llamada 'session_token' indica una sesión válida.
  const sessionCookie = request.cookies.get('session_token');

  if (!sessionCookie) {
    // Si no hay cookie de sesión, redirigimos al usuario a la página de login.
    // Mantenemos los search params por si el usuario intentaba acceder a una URL específica.
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl);
  }

  // Si la cookie existe, permitimos que la petición continúe.
  return NextResponse.next();
}

export const config = {
  // El matcher asegura que este middleware se ejecute solo en las rutas del dashboard.
  matcher: '/dashboard/:path*',
}
