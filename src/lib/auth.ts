import 'server-only';
import { cache } from 'react';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export interface SessionPayload {
  userId: number;
  expires?: Date;
}

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id_usuario: session.userId },
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

  // Do not send the password hash to the client
  const { pass, ...userWithoutPassword } = user;
  return userWithoutPassword;
});

export async function protectPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}

export async function protectAction() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('No autorizado: El usuario debe iniciar sesión.');
    }
    return user;
}
