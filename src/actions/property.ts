'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';

const createPropertySchema = z.object({
  userId: z.coerce.number().int().positive(),
  name: z.string().min(1, { message: 'El nombre de la propiedad es requerido.' }),
  coordX: z.coerce.number().int().min(1).max(50),
  coordY: z.coerce.number().int().min(1).max(50),
  coordZ: z.coerce.number().int().min(1).max(255),
});

export async function createInitialProperty(values: z.infer<typeof createPropertySchema>) {
  const validatedFields = createPropertySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Datos inválidos.' };
  }
  
  const { userId, name, coordX, coordY, coordZ } = validatedFields.data;

  // Comprobar si el usuario existe
  const user = await prisma.user.findUnique({
      where: { id_usuario: userId }
  });

  if (!user) {
      return { error: 'Usuario no encontrado.' };
  }
  
  // Comprobar si el usuario ya tiene una propiedad
  const existingPropertyForUser = await prisma.propiedad.findFirst({
      where: { id_usuario: userId }
  });

  if (existingPropertyForUser) {
      return { error: 'Este usuario ya tiene una propiedad.' };
  }

  // Comprobar si las coordenadas ya están ocupadas
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

  // Crear la propiedad
  try {
    await prisma.propiedad.create({
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
    });

    return { success: '¡Propiedad creada con éxito! Ahora puedes iniciar sesión.' };
  } catch (error) {
    console.error("Error al crear la propiedad:", error);
    return { error: 'No se pudo crear la propiedad. Inténtalo de nuevo.' };
  }
}
