import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando el sembrado de datos de edificios...`);

  const csvFilePath = path.join(process.cwd(), 'public', 'vendetta - edificios.csv');
  if (!fs.existsSync(csvFilePath)) {
    console.error(`Error: El archivo ${csvFilePath} no fue encontrado.`);
    return;
  }

  const csvFileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  const parsed = Papa.parse(csvFileContent, {
    header: true,
    skipEmptyLines: true,
  });

  for (const row of parsed.data as any[]) {
    try {
        const buildingData = {
          id_edificio: parseInt(row.id_edificio, 10),
          nombre: row.nombre,
          descripcion: row.descripcion,
          costo_base: JSON.parse(row.costo_base),
          factor_costo: parseFloat(row.factor_costo),
        };

        if (isNaN(buildingData.id_edificio)) continue;

        await prisma.building.upsert({
          where: { id_edificio: buildingData.id_edificio },
          update: buildingData,
          create: buildingData,
        });
        console.log(`Edificio '${buildingData.nombre}' creado/actualizado.`);

    } catch(error) {
        console.error(`Error procesando la fila: ${JSON.stringify(row)}`, error);
    }
  }

  console.log(`Sembrado de edificios completado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
