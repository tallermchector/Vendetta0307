import type { Prisma } from '@prisma/client';

/**
 * Define un objeto de configuración para la consulta de Prisma.
 * Esto asegura que siempre pidamos las mismas relaciones en todas partes.
 */
export const userQueryArgs = {
  include: {
    perfil: true,
    recursos: true,
    propiedades: true,
    familia: true,
  },
};

/**
 * Este es el tipo principal para el usuario autenticado en toda la aplicación.
 * Prisma.UserGetPayload genera un tipo preciso basado en la consulta.
 * Incluye el usuario y todas sus relaciones principales.
 */
export type FullAuthenticatedUser = Prisma.UserGetPayload<typeof userQueryArgs>;
