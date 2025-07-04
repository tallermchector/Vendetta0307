import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la exportación de datos...');

  try {
    const allData = {
        users: await prisma.user.findMany(),
        families: await prisma.family.findMany(),
        playerProfiles: await prisma.playerProfile.findMany(),
        playerResources: await prisma.playerResources.findMany(),
        properties: await prisma.propiedad.findMany(),
        buildings: await prisma.building.findMany(),
        trainings: await prisma.training.findMany(),
    };
    
    // JSON.stringify no soporta BigInt, así que lo convertimos a string.
    const jsonString = JSON.stringify(allData, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
    }, 2); // El '2' es para formatear el JSON con indentación.

    const outputPath = path.join(process.cwd(), 'prisma', 'database_export.json');
    fs.writeFileSync(outputPath, jsonString, 'utf-8');

    console.log(`Datos exportados exitosamente a ${outputPath}`);

  } catch (error) {
    console.error('Error durante la exportación de datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Desconectado de la base de datos.');
  }
}

main();
