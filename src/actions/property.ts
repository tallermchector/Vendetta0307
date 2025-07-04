'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { redirect } from 'next/navigation';

// @BestPractice: Use .pipe() for complex validation, first ensuring the value is a
// string, then coercing to a number for range checks.
const createPropertySchema = z.object({
  name: z.string().trim().min(1, { message: 'El nombre de la propiedad es requerido.' }),
  coordX: z.string().min(1, { message: "La coordenada X es requerida."}).pipe(
    z.coerce.number({invalid_type_error: "Debe ser un número"})
    .int()
    .min(1, { message: "Rango: 1-50" })
    .max(50, { message: "Rango: 1-50" })
  ),
  coordY: z.string().min(1, { message: "La coordenada Y es requerida."}).pipe(
    z.coerce.number({invalid_type_error: "Debe ser un número"})
    .int()
    .min(1, { message: "Rango: 1-50" })
    .max(50, { message: "Rango: 1-50" })
  ),
  coordZ: z.string().min(1, { message: "El Sector Z es requerido."}).pipe(
    z.coerce.number({invalid_type_error: "Debe ser un número"})
    .int()
    .min(1, { message: "Rango: 1-255" })
    .max(255, { message: "Rango: 1-255" })
  ),
});

// @Fix: The function argument should be typed with z.input<> to represent the raw
// data before parsing, not z.infer<> which is the output type.
export async function createInitialProperty(values: z.input<typeof createPropertySchema>) {
  // @Security: Protect this action by ensuring a user is authenticated.
  // This is crucial because this action performs database writes.
  const user = await protectAction();
  const userId = user.id_usuario;
  
  const validatedFields = createPropertySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Datos inválidos.' };
  }
  
  const { name, coordX, coordY, coordZ } = validatedFields.data;
  
  const existingProfile = await prisma.playerProfile.findUnique({
      where: { id_usuario: userId }
  });

  if (existingProfile) {
      return { error: 'Este usuario ya tiene una propiedad.' };
  }

  // @Security: Check for coordinate collision to prevent multiple properties in the same location.
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
  
  const allTrainings = await prisma.training.findMany({
    select: { id_training: true },
  });

  try {
    // @BestPractice: Use an interactive transaction to ensure all related records 
    // (profile, trainings, property, resources) are created atomically.
    await prisma.$transaction(async (tx) => {
      const newProfile = await tx.playerProfile.create({
        data: {
          id_usuario: userId,
          puntos_edificios: 0,
          puntos_entrenamiento: 0,
          puntos_tropas: 0,
          ranking_global: 0,
          lealtad: 100,
        }
      });
      
      // @New: Initialize all trainings for the new player at level 0.
      if (allTrainings.length > 0) {
        await tx.playerTraining.createMany({
            data: allTrainings.map(training => ({
                id_perfil: newProfile.id_perfil,
                id_training: training.id_training,
                level: 0,
            }))
        });
      }

      await tx.propiedad.create({
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
      
      await tx.playerResources.create({
        data: {
          id_usuario: userId,
          armas: 500,
          municion: 500,
          alcohol: 0,
          dolares: 0,
        }
      });
    });
  } catch (error) {
    console.error("Error al crear la propiedad y el perfil:", error);
    return { error: 'No se pudo crear la propiedad. Inténtalo de nuevo.' };
  }
  
  // @BestPractice: Redirect must be called outside of a try/catch block.
  // This ensures Next.js can properly handle the navigation.
  redirect('/dashboard');
}
