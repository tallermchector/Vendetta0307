'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const upgradeTrainingSchema = z.object({
  id_training: z.number().int().positive(),
});

/**
 * Server Action to handle the logic of upgrading a training skill.
 * @param values Object containing the training ID.
 * @returns A success or error object.
 */
export async function upgradeTraining(
  values: z.infer<typeof upgradeTrainingSchema>
): Promise<{ success?: string; error?: string }> {
  // 1. Authenticate user and check for required data.
  const user = await protectAction();
  if (!user.perfil || !user.recursos) {
    return { error: 'Datos del jugador incompletos.' };
  }

  // 2. Validate input.
  const validatedFields = upgradeTrainingSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'ID de entrenamiento inválido.' };
  }
  const { id_training } = validatedFields.data;

  // 3. Fetch training details from catalog.
  const training = await prisma.training.findUnique({ where: { id_training } });
  if (!training) {
    return { error: 'Entrenamiento no encontrado.' };
  }

  // 4. Get player's current level for this training.
  const playerTraining = await prisma.playerTraining.findUnique({
    where: {
      id_perfil_id_training: {
        id_perfil: user.perfil.id_perfil,
        id_training: id_training,
      },
    },
  });

  const currentLevel = playerTraining?.level ?? 0;
  
  // 5. Calculate costs for the next level.
  const costFactor = Math.pow(training.fac_costo, currentLevel);
  const cost = {
    armas: BigInt(Math.floor(training.c_armas * costFactor)),
    municion: BigInt(Math.floor(training.c_municion * costFactor)),
    alcohol: BigInt(Math.floor(training.c_alcohol * costFactor)),
    dolares: BigInt(Math.floor(training.c_dolares * costFactor)),
  };

  // 6. Check for sufficient resources.
  if (
    user.recursos.armas < cost.armas ||
    user.recursos.municion < cost.municion ||
    user.recursos.alcohol < cost.alcohol ||
    user.recursos.dolares < cost.dolares
  ) {
    return { error: 'Recursos insuficientes para esta mejora.' };
  }

  // 7. Calculate points for the upgrade.
  const totalResourceCost = cost.armas + cost.municion + cost.alcohol + cost.dolares;
  const pointsToAdd = totalResourceCost > 0 ? totalResourceCost / 1000n : 0n;

  // 8. Perform the upgrade in a transaction.
  try {
    await prisma.$transaction(async (tx) => {
      // Decrement resources.
      await tx.playerResources.update({
        where: { id_usuario: user.id_usuario },
        data: {
          armas: { decrement: cost.armas },
          municion: { decrement: cost.municion },
          alcohol: { decrement: cost.alcohol },
          dolares: { decrement: cost.dolares },
        },
      });

      // Increment training level using upsert for robustness.
      await tx.playerTraining.upsert({
        where: {
          id_perfil_id_training: {
            id_perfil: user.perfil!.id_perfil,
            id_training: id_training,
          },
        },
        update: { level: { increment: 1 } },
        create: {
          id_perfil: user.perfil!.id_perfil,
          id_training: id_training,
          level: 1,
        },
      });

      // Increment training points.
      if (pointsToAdd > 0) {
        await tx.playerProfile.update({
          where: { id_perfil: user.perfil!.id_perfil },
          data: { puntos_entrenamiento: { increment: Number(pointsToAdd) } },
        });
      }
    });
  } catch (error) {
    console.error('Error al mejorar entrenamiento:', error);
    return { error: 'Ocurrió un error al mejorar el entrenamiento.' };
  }

  // 9. Revalidate paths and return success.
  revalidatePath('/dashboard/training');
  revalidatePath('/dashboard');
  return { success: `¡'${training.nombre}' mejorado al nivel ${currentLevel + 1}!` };
}
