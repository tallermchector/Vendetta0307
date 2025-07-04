'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Esquema para validar los datos de entrada del formulario de reclutamiento.
const recruitUnitSchema = z.object({
  id_recruitment: z.number().int().positive(),
  quantity: z.number().int().positive({ message: 'La cantidad debe ser mayor que cero.' }),
});

/**
 * Server Action para reclutar unidades.
 * @param values Objeto con id_recruitment y quantity.
 * @returns Un objeto de éxito o error.
 */
export async function recruitUnit(
  values: z.infer<typeof recruitUnitSchema>
): Promise<{ success?: string; error?: string }> {
  // 1. Proteger la acción y obtener los datos del usuario autenticado.
  const user = await protectAction();
  if (!user.perfil) {
    return { error: 'El perfil del jugador no fue encontrado.' };
  }
  const userResources = user.recursos;
  if (!userResources) {
      return { error: 'Recursos del jugador no encontrados.' };
  }

  // 2. Validar los datos de entrada con Zod.
  const validatedFields = recruitUnitSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Datos de entrada inválidos.' };
  }
  const { id_recruitment, quantity } = validatedFields.data;

  // 3. Obtener los detalles de la unidad a reclutar.
  const unitToRecruit = await prisma.recruitment.findUnique({
    where: { id_recruitment },
  });

  if (!unitToRecruit) {
    return { error: 'La unidad especificada no existe.' };
  }

  // 4. Calcular el costo total usando BigInt para evitar desbordamientos.
  const totalCost = {
    armas: BigInt(unitToRecruit.c_armas) * BigInt(quantity),
    municion: BigInt(unitToRecruit.c_municion) * BigInt(quantity),
    alcohol: BigInt(unitToRecruit.c_alcohol) * BigInt(quantity),
    dolares: BigInt(unitToRecruit.c_dolares) * BigInt(quantity),
  };

  // 5. Verificar si el jugador tiene suficientes recursos.
  if (userResources.armas < totalCost.armas) {
    return { error: 'No tienes suficientes armas.' };
  }
  if (userResources.municion < totalCost.municion) {
    return { error: 'No tienes suficiente munición.' };
  }
  if (userResources.alcohol < totalCost.alcohol) {
    return { error: 'No tienes suficiente alcohol.' };
  }
  if (userResources.dolares < totalCost.dolares) {
    return { error: 'No tienes suficientes dólares.' };
  }

  // 6. Ejecutar la actualización de la base de datos en una transacción atómica.
  try {
    await prisma.$transaction(async (tx) => {
      // Restar los recursos del jugador.
      await tx.playerResources.update({
        where: { id_usuario: user.id_usuario },
        data: {
          armas: { decrement: totalCost.armas },
          municion: { decrement: totalCost.municion },
          alcohol: { decrement: totalCost.alcohol },
          dolares: { decrement: totalCost.dolares },
        },
      });

      // Añadir o actualizar la cantidad de unidades del jugador.
      await tx.playerRecruitment.upsert({
        where: {
          id_perfil_id_recruitment: {
            id_perfil: user.perfil!.id_perfil,
            id_recruitment: id_recruitment,
          }
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          id_perfil: user.perfil!.id_perfil,
          id_recruitment: id_recruitment,
          quantity: quantity,
        },
      });
    });
  } catch (error) {
    console.error('Error durante la transacción de reclutamiento:', error);
    return { error: 'Ocurrió un error al procesar el reclutamiento. Inténtalo de nuevo.' };
  }

  // 7. Revalidar la ruta para que la UI se actualice y devolver éxito.
  revalidatePath('/dashboard/recruitment');
  return { success: `${quantity} ${unitToRecruit.nombre}(s) reclutado(s) exitosamente.` };
}
