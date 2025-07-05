import 'server-only';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

// Define the payload for the user query, ensuring all relations are included.
// We use 'satisfies' to check the type without widening it, which is crucial for Prisma.UserGetPayload.
const userWithRelationsPayload = {
  include: {
    familia: {
      include: {
        miembros: {
          orderBy: {
            roleInFamily: 'asc',
          },
        },
      },
    },
    perfil: {
      include: {
        trainings: true,
        recruitments: true,
        securities: true,
      },
    },
    propiedades: true,
    recursos: true,
  },
} satisfies Prisma.UserArgs;

// Derive the full user type from the payload. This includes the password hash.
type FullUserPayload = Prisma.UserGetPayload<typeof userWithRelationsPayload>;

// The secure, final user type that is exposed by helpers, explicitly omitting the password hash.
export type AuthenticatedUser = Omit<FullUserPayload, 'pass'>;

export interface SessionPayload {
  userId: number;
  expires?: Date;
}

/**
 * @description Fetches the current user from the database based on the session.
 * This function returns the full user object, including the password hash.
 * It is intended for internal use within the auth library.
 * @returns The full user object or null if not found/authenticated.
 */
const getCurrentUserWithPassword = async (): Promise<FullUserPayload | null> => {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id_usuario: session.userId },
    ...userWithRelationsPayload,
  });

  return user;
};

/**
 * @description A helper function to protect server-side rendered pages.
 * It checks for a valid session, redirects if not found, and returns the
 * user object WITHOUT the password hash.
 * @returns The authenticated user object, safe to use in pages.
 */
export async function protectPage(): Promise<AuthenticatedUser> {
    const user = await getCurrentUserWithPassword();
    if (!user) {
        redirect('/login');
    }
    const { pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * @description A helper function to protect Server Actions.
 * It checks for a valid session, throws an error if not found, and returns the
 * user object WITHOUT the password hash.
 * @returns The authenticated user object, safe to use in actions.
 */
export async function protectAction(): Promise<AuthenticatedUser> {
    const user = await getCurrentUserWithPassword();
    if (!user) {
        throw new Error('No autorizado: El usuario debe iniciar sesión.');
    }
    const { pass, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
