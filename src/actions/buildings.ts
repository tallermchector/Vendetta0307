'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { buildingFieldMap } from '@/lib/constants';

// Schema to validate the input for upgrading a building.
const upgradeBuildingSchema = z.object({
  id_edificio: z.number().int().positive(),
});

/**
 * Server Action to handle the logic of upgrading a building.
 * @param values Object containing the building ID.
 * @returns A success or error object.
 */
export async function upgradeBuilding(
  values: z.infer<typeof upgradeBuildingSchema>
): Promise<{ success?: string; error?: string }> {
  // 1. Authenticate the user and ensure all necessary data is available.
  const user = await protectAction();
  if (!user.perfil || !user.recursos || !user.propiedades?.[0]) {
    return { error: 'Datos del jugador incompletos. No se puede proceder con la mejora.' };
  }
  const property = user.propiedades[0];

  // 2. Validate the incoming building ID.
  const validatedFields = upgradeBuildingSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'El ID del edificio proporcionado es inválido.' };
  }
  const { id_edificio } = validatedFields.data;

  // 3. Fetch building details from the catalog.
  const building = await prisma.building.findUnique({ where: { id_edificio } });
  if (!building) {
    return { error: 'El edificio especificado no existe en el catálogo del juego.' };
  }

  // 4. Determine the specific field in the property model to update.
  const buildingKey = buildingFieldMap[building.nombre];
  if (!buildingKey) {
    return { error: 'La configuración para este tipo de edificio no fue encontrada.' };
  }

  // 5. Calculate the cost for the next level upgrade.
  const currentLevel = property[buildingKey] as number;
  const costFactor = Math.pow(building.fac_costo, currentLevel);
  const cost = {
    armas: BigInt(Math.floor(building.c_armas * costFactor)),
    municion: BigInt(Math.floor(building.c_municion * costFactor)),
    alcohol: BigInt(Math.floor(building.c_alcohol * costFactor)),
    dolares: BigInt(Math.floor(building.c_dolares * costFactor)),
  };

  // 6. Verify if the player has enough resources.
  if (
    user.recursos.armas < cost.armas ||
    user.recursos.municion < cost.municion ||
    user.recursos.alcohol < cost.alcohol ||
    user.recursos.dolares < cost.dolares
  ) {
    return { error: 'No tienes suficientes recursos para realizar esta mejora.' };
  }

  // 7. Calculate the points awarded for this upgrade.
  const totalResourceCost = cost.armas + cost.municion + cost.alcohol + cost.dolares;
  const pointsToAdd = totalResourceCost > 0 ? totalResourceCost / 1000n : 0n;

  // 8. Execute the upgrade within a database transaction for atomicity.
  try {
    await prisma.$transaction(async (tx) => {
      // Decrement player resources.
      await tx.playerResources.update({
        where: { id_usuario: user.id_usuario },
        data: {
          armas: { decrement: cost.armas },
          municion: { decrement: cost.municion },
          alcohol: { decrement: cost.alcohol },
          dolares: { decrement: cost.dolares },
        },
      });

      // Increment the building level.
      await tx.propiedad.update({
        where: { id_propiedad: property.id_propiedad },
        data: { [buildingKey]: { increment: 1 } },
      });

      // Increment player's building points.
      if (pointsToAdd > 0) {
        await tx.playerProfile.update({
          where: { id_perfil: user.perfil!.id_perfil },
          data: { puntos_edificios: { increment: pointsToAdd } },
        });
      }
    });
  } catch (error) {
    console.error('Error durante la transacción de mejora de edificio:', error);
    return { error: 'Ocurrió un error inesperado al procesar la mejora.' };
  }

  // 9. Revalidate paths to update the UI and return success.
  revalidatePath('/dashboard/rooms');
  revalidatePath('/dashboard');
  return { success: `¡'${building.nombre}' mejorado al nivel ${currentLevel + 1}!` };
}
