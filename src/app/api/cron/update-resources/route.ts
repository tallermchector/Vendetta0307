import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateProductionRates, type ProductionRates } from '@/lib/production'; // Asegúrate de que este import sea correcto.

export async function POST(request: Request) {
  // 1. Seguridad: Proteger el endpoint.
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Obtener todos los usuarios que necesitan actualización.
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

    if (users.length === 0) {
        return NextResponse.json({ message: "No hay jugadores que necesiten actualización." });
    }

    const now = new Date();
    const updatePromises = [];

    // 3. Iterar y calcular los recursos generados para cada usuario.
    for (const user of users) {
      if (!user.recursos || user.propiedades.length === 0) continue;

      const lastUpdate = new Date(user.recursos.ultima_actualizacion);
      const diffSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
      
      if (diffSeconds <= 0) continue;

      const totalProduction: ProductionRates = { armas: 0, municion: 0, alcohol: 0, dolares: 0 };
      for (const prop of user.propiedades) {
          const rates = calculateProductionRates(prop);
          totalProduction.armas += rates.armas;
          totalProduction.municion += rates.municion;
          totalProduction.alcohol += rates.alcohol;
          totalProduction.dolares += rates.dolares;
      }

      const resourcesToAdd = {
        armas:    (BigInt(totalProduction.armas)    * BigInt(diffSeconds)) / 3600n,
        municion: (BigInt(totalProduction.municion) * BigInt(diffSeconds)) / 3600n,
        alcohol:  (BigInt(totalProduction.alcohol)  * BigInt(diffSeconds)) / 3600n,
        dolares:  (BigInt(totalProduction.dolares)  * BigInt(diffSeconds)) / 3600n,
      };

      const updatePromise = prisma.playerResources.update({
        where: { id_usuario: user.id_usuario },
        data: {
          armas:    { increment: resourcesToAdd.armas },
          municion: { increment: resourcesToAdd.municion },
          alcohol:  { increment: resourcesToAdd.alcohol },
          dolares:  { increment: resourcesToAdd.dolares },
          ultima_actualizacion: now,
        },
      });
      updatePromises.push(updatePromise);
    }
    
    // 4. Ejecutar todas las actualizaciones.
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
