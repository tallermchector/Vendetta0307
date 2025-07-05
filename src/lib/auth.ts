import 'server-only';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { type FullAuthenticatedUser, userQueryArgs } from '@/lib/types';

/**
 * The secure user type that is exposed by helpers, explicitly omitting the password hash.
 * This is the type that should be used in page components and actions.
 */
export type AuthenticatedUser = Omit<FullAuthenticatedUser, 'pass'>;

export interface SessionPayload {
  userId: number;
  expires?: Date;
}

/**
 * Internal function that retrieves the full user object from the DB based on the session.
 * It redirects to '/login' if the session or user is not found.
 * This function returns the full user object, including the password hash, and is
 * intended for internal use within this module only.
 * @returns The full user object with all relations.
 */
async function getAndProtectUser(): Promise<FullAuthenticatedUser> {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id_usuario: session.userId },
    ...userQueryArgs, // Use the centralized query arguments
  });

  if (!user) {
    redirect('/login');
  }

  return user;
}


/**
 * @description A helper function to protect server-side rendered pages.
 * It checks for a valid session, redirects if not found, and returns the
 * user object WITHOUT the password hash.
 * @returns The authenticated user object, safe to use in pages.
 */
export async function protectPage(): Promise<AuthenticatedUser> {
    const user = await getAndProtectUser();
    const { pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * @description A helper function to protect Server Actions.
 * It checks for a valid session, redirects if not found, and returns the
 * user object WITHOUT the password hash.
 * @returns The authenticated user object, safe to use in actions.
 */
export async function protectAction(): Promise<AuthenticatedUser> {
    const user = await getAndProtectUser();
    const { pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
