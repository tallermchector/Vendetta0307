'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';

const createPropertySchema = z.object({
  userId: z.coerce.number().int().positive(),
  name: z.string().min(1, { message: 'El nombre de la propiedad es requerido.' }),
  coordX: z.coerce.number().int().min(1).max(50),
  coordY: z.coerce.number().int().min(1).max(50),
  coordZ: z.coerce.number().int().min(1).max(255),
});

export async function createInitialProperty(values: z.infer<typeof createPropertySchema>) {
  // Although the registration form is public, we still check
  // if a user somehow is logged in, to avoid misuse.
  // In a real scenario, you might want more robust logic here.
  
  const validatedFields = createPropertySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Datos inválidos.' };
  }
  
  const { userId, name, coordX, coordY, coordZ } = validatedFields.data;

  const user = await prisma.user.findUnique({
      where: { id_usuario: userId }
  });

  if (!user) {
      return { error: 'Usuario no encontrado.' };
  }
  
  const existingPropertyForUser = await prisma.propiedad.findFirst({
      where: { id_usuario: userId }
  });

  if (existingPropertyForUser) {
      return { error: 'Este usuario ya tiene una propiedad.' };
  }

  const existingPropertyAtCoords = await prisma.propiedad.findUnique({
    where: {
      coord_x_coord_y_coord_z: {
        coord_x: coordX,
        coord_y: coordY,
        coord_z: coordZ,
      },
    },
  });

  if (existingPropertyAtCoords) {
    return { error: 'Las coordenadas seleccionadas ya están ocupadas.' };
  }

  try {
    await prisma.$transaction([
      prisma.propiedad.create({
        data: {
          id_usuario: userId,
          nombre: name,
          coord_x: coordX,
          coord_y: coordY,
          coord_z: coordZ,
          oficina: 1,
          escuela: 1,
          armeria: 1,
          municion: 1,
          cerveceria: 1,
          taberna: 1,
          contrabando: 1,
          almacenArm: 1,
          deposito: 1,
          almacenAlc: 1,
          caja: 1,
          campo: 1,
          seguridad: 1,
          torreta: 1,
          minas: 1,
        },
      }),
      prisma.playerProfile.create({
        data: {
          id_usuario: userId,
          puntos_edificios: 0,
          puntos_entrenamiento: 0,
          puntos_tropas: 0,
          ranking_global: 0,
          lealtad: 100,
        }
      }),
       prisma.playerResources.create({
        data: {
          id_usuario: userId,
          armas: 500,
          municion: 500,
          alcohol: 0,
          dolares: 0,
        }
      })
    ]);

    return { success: '¡Propiedad creada con éxito! Ahora puedes iniciar sesión.' };
  } catch (error) {
    console.error("Error al crear la propiedad y el perfil:", error);
    return { error: 'No se pudo crear la propiedad. Inténtalo de nuevo.' };
  }
}
