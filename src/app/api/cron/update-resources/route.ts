import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateProductionRates, type ProductionRates } from '@/lib/production';

/**
 * @fileOverview API route for a cron job to update player resources.
 * This endpoint should be called periodically by a trusted scheduler via a POST request.
 *
 * It iterates through all active players, calculates their resource
 * production since the last update, and applies it to their account.
 */

export async function POST(request: Request) {
  // 1. Security: Protect the endpoint with a secret key.
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Fetch all users who have resources and properties.
    const users = await prisma.user.findMany({
      where: {
        recursos: { isNot: null },
        propiedades: { some: {} },
      },
      include: {
        recursos: true,
        propiedades: true,
      },
    });

    const now = new Date();
    const updatePromises = [];

    // 3. Iterate over each user to calculate and update resources.
    for (const user of users) {
      if (!user.recursos || user.propiedades.length === 0) {
        continue;
      }

      // Calculate time difference in hours since last update.
      const lastUpdate = new Date(user.recursos.ultima_actualizacion);
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      // Skip if not enough time has passed to avoid unnecessary writes.
      if (diffHours <= 0) {
        continue;
      }

      // Calculate total production from all properties.
      const totalProduction: ProductionRates = { armas: 0, municion: 0, alcohol: 0, dolares: 0 };
      for (const prop of user.propiedades) {
          const rates = calculateProductionRates(prop);
          totalProduction.armas += rates.armas;
          totalProduction.municion += rates.municion;
          totalProduction.alcohol += rates.alcohol;
          totalProduction.dolares += rates.dolares;
      }

      // Calculate resources generated in the elapsed time.
      const resourcesToAdd = {
        armas: Math.floor(totalProduction.armas * diffHours),
        municion: Math.floor(totalProduction.municion * diffHours),
        alcohol: Math.floor(totalProduction.alcohol * diffHours),
        dolares: Math.floor(totalProduction.dolares * diffHours),
      };

      // Create an update promise for the user's resources.
      const updatePromise = prisma.playerResources.update({
        where: { id_usuario: user.id_usuario },
        data: {
          armas: { increment: resourcesToAdd.armas },
          municion: { increment: resourcesToAdd.municion },
          alcohol: { increment: resourcesToAdd.alcohol },
          dolares: { increment: resourcesToAdd.dolares },
          ultima_actualizacion: now,
        },
      });
      updatePromises.push(updatePromise);
    }
    
    // 4. Execute all updates in a single transaction.
    if (updatePromises.length > 0) {
        await prisma.$transaction(updatePromises);
    }

    return NextResponse.json({
      message: `Recursos actualizados para ${updatePromises.length} jugadores.`,
    });

  } catch (error) {
    console.error('Cron job para actualizar recursos falló:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
