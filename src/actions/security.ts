'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Schema to validate the input data from the security purchase form.
const purchaseSecuritySchema = z.object({
  id_security: z.number().int().positive(),
  quantity: z.number().int().positive({ message: 'La cantidad debe ser mayor que cero.' }),
});

/**
 * Server Action to purchase security units.
 * @param values Object with id_security and quantity.
 * @returns A success or error object.
 */
export async function purchaseSecurity(
  values: z.infer<typeof purchaseSecuritySchema>
): Promise<{ success?: string; error?: string }> {
  // 1. Protect the action and get the authenticated user's data.
  const user = await protectAction();
  if (!user.perfil) {
    return { error: 'El perfil del jugador no fue encontrado.' };
  }
  const userResources = user.recursos;
  if (!userResources) {
      return { error: 'Recursos del jugador no encontrados.' };
  }

  // 2. Validate the input data with Zod.
  const validatedFields = purchaseSecuritySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Datos de entrada inválidos.' };
  }
  const { id_security, quantity } = validatedFields.data;

  // 3. Get the details of the security unit to purchase.
  const unitToPurchase = await prisma.security.findUnique({
    where: { id_security },
  });

  if (!unitToPurchase) {
    return { error: 'La unidad de seguridad especificada no existe.' };
  }

  // 4. Calculate the total cost using BigInt to prevent overflows.
  const totalCost = {
    armas: BigInt(unitToPurchase.c_armas) * BigInt(quantity),
    municion: BigInt(unitToPurchase.c_municion) * BigInt(quantity),
    alcohol: BigInt(unitToPurchase.c_alcohol) * BigInt(quantity),
    dolares: BigInt(unitToPurchase.c_dolares) * BigInt(quantity),
  };

  // 5. Check if the player has enough resources.
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

  // @New: Calculate points to add. Security units contribute to 'puntos_tropas'.
  const pointsToAdd = BigInt(unitToPurchase.puntos_por_nivel) * BigInt(quantity);

  // 6. Execute the database update in an atomic transaction.
  try {
    await prisma.$transaction(async (tx) => {
      // Subtract resources from the player.
      await tx.playerResources.update({
        where: { id_usuario: user.id_usuario },
        data: {
          armas: { decrement: totalCost.armas },
          municion: { decrement: totalCost.municion },
          alcohol: { decrement: totalCost.alcohol },
          dolares: { decrement: totalCost.dolares },
        },
      });

      // Add or update the quantity of the player's security units.
      await tx.playerSecurity.upsert({
        where: {
          id_perfil_id_security: {
            id_perfil: user.perfil!.id_perfil,
            id_security: id_security,
          }
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          id_perfil: user.perfil!.id_perfil,
          id_security: id_security,
          quantity: quantity,
        },
      });

      // @New: Update player's troop points.
      if (pointsToAdd > 0) {
        await tx.playerProfile.update({
            where: { id_perfil: user.perfil!.id_perfil },
            data: { puntos_tropas: { increment: pointsToAdd } },
        });
      }
    });
  } catch (error) {
    console.error('Error durante la transacción de compra de seguridad:', error);
    return { error: 'Ocurrió un error al procesar la compra. Inténtalo de nuevo.' };
  }

  // 7. Revalidate the path so the UI updates and return success.
  revalidatePath('/dashboard/security');
  revalidatePath('/dashboard');
  return { success: `${quantity} ${unitToPurchase.nombre}(s) adquirido(s) exitosamente.` };
}
