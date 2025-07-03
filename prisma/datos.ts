import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando el sembrado de datos de edificios...`);

  const csvFilePath = path.join(process.cwd(), 'prisma', 'vendetta - edificios.csv');
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
        if (!row.id_edificio || isNaN(parseInt(row.id_edificio, 10))) continue;

        const buildingData = {
          id_edificio: parseInt(row.id_edificio, 10),
          nombre: row.nombre || '',
          descripcion: row.descripcion || '',
          costo_base: {},
          c_armas: parseInt(row.c_armas, 10),
          c_municion: parseInt(row.c_municion, 10),
          c_alcohol: parseInt(row.c_alcohol, 10),
          c_dolares: parseInt(row.c_dolares, 10),
          fac_costo: parseFloat(row.fac_costo),
          t_horas: row.t_horas,
          t_minutos: row.t_minutos,
          t_segundos: row.t_segundos,
          fac_dura: parseFloat(row.fac_dura),
          imagen_url: row.imagen_url,
        };

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
