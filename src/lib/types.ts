import type { Prisma, User } from '@prisma/client';

// 1. Argumentos de consulta para obtener un usuario con TODAS sus relaciones.
export const userQueryArgs = {
  include: {
    perfil: {
      include: {
        recruitments: true, // Incluir estas relaciones anidadas
        securities: true,
        trainings: true,
      },
    },
    recursos: true,
    propiedades: true,
    familia: true,
  },
};

// 2. El tipo AUTORITATIVO para un usuario autenticado y completo.
export type FullAuthenticatedUser = Prisma.UserGetPayload<typeof userQueryArgs>;

// 3. El tipo para un jugador en el ranking. DEBE incluir las relaciones.
export type RankedPlayer = User & {
  perfil: Prisma.PlayerProfileGetPayload<{}> | null;
  familia: Prisma.FamilyGetPayload<{}> | null;
  _count: Prisma.UserCountOutputType;
  totalPoints: number; // Usar number para cálculos en JS
  rank: number;
};
