import 'server-only';
import { cache } from 'react';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export interface SessionPayload {
  userId: number;
  expires?: Date;
}

// @BestPractice: Use `cache` to memoize the user retrieval function.
// This prevents multiple database queries for the same user in a single request lifecycle.
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id_usuario: session.userId },
    // @BestPractice: Include related data needed for the authenticated layout
    // in a single query to avoid waterfalls.
    include: {
      familia: true,
      perfil: true,
      propiedades: true,
      recursos: true,
    },
  });

  if (!user) {
    return null;
  }

  // @Security: Crucially, never send the password hash to the client.
  const { pass, ...userWithoutPassword } = user;
  return userWithoutPassword;
});

/**
 * @description A helper function to protect server-side rendered pages.
 * It checks for a valid session and redirects to '/login' if not found.
 * @returns The user object if the session is valid.
 */
export async function protectPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}

/**
 * @description A helper function to protect Server Actions.
 * It checks for a valid session and throws an error if not found.
 * This is essential for preventing unauthorized mutations.
 * @returns The user object if the session is valid.
 */
export async function protectAction() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('No autorizado: El usuario debe iniciar sesión.');
    }
    return user;
}
