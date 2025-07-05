import 'server-only';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

// @BestPractice: Define a reusable payload for getting the user with all their relations.
// This ensures consistency across different parts of the application.
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
};

// @BestPractice: Create an explicit TypeScript type from the Prisma payload.
// This helps with type safety and autocompletion in other parts of the app.
export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelationsPayload>;

// @BestPractice: The final, secure user type that is exposed by authentication helpers.
// It explicitly omits the password hash.
export type AuthenticatedUser = Omit<UserWithRelations, 'pass'>;


export interface SessionPayload {
  userId: number;
  expires?: Date;
}

export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }
  
  // Use the defined payload for the query.
  const user = await prisma.user.findUnique({
    where: { id_usuario: session.userId },
    ...userWithRelationsPayload,
  });

  if (!user) {
    return null;
  }

  // @Security: Crucially, never send the password hash to the client.
  const { pass, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * @description A helper function to protect server-side rendered pages.
 * It checks for a valid session and redirects to '/login' if not found.
 * @returns The user object if the session is valid.
 */
export async function protectPage(): Promise<AuthenticatedUser> {
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
export async function protectAction(): Promise<AuthenticatedUser> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('No autorizado: El usuario debe iniciar sesión.');
    }
    return user;
}
