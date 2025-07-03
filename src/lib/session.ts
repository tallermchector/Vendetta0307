import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/lib/auth';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  // @Security: Use a strong algorithm like HS256 for signing the JWT.
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // @Security: Gracefully handle token verification errors (e.g., expired, invalid signature).
    console.log('Failed to verify session token:', error);
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ ...payload, expires });

  // @Security: Set cookies with HttpOnly, Secure (in prod), SameSite, and Path attributes.
  // This is a dynamic function and must be used inside a Server Action or Route Handler.
  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  // @BestPractice: `cookies().get()` is a dynamic function.
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) return null;

  const session = await decrypt(sessionCookie);
  
  // @BestPractice: This function is read-only. It validates the existing cookie
  // but does not refresh it. Refreshing on every request is not allowed in
  // Server Components and can cause errors in some hosting environments.
  return session;
}

export async function deleteSession() {
  // @Security: To log out, invalidate the cookie by setting an expiry date in the past.
  cookies().set('session', '', { expires: new Date(0), path: '/' });
}
