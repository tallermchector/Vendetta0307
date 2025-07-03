import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

// Helper to parse numbers that might contain thousand separators.
function parseInteger(value: string | undefined): number {
    if (!value) return 0;
    // Remove dots used as thousand separators, then parse.
    const cleanValue = value.replace(/\./g, '');
    const number = parseInt(cleanValue, 10);
    return isNaN(number) ? 0 : number;
}

async function main() {
  console.log(`Iniciando el sembrado de datos de edificios desde CSV...`);

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

  if (parsed.errors.length > 0) {
      console.error("Errores al parsear el CSV:", parsed.errors);
      return;
  }

  for (const row of parsed.data as any[]) {
    try {
        if (!row.id_edificio || isNaN(parseInt(row.id_edificio, 10))) continue;

        const buildingData = {
          id_edificio: parseInt(row.id_edificio, 10),
          nombre: row.nombre || '',
          descripcion: row.descripcion || '',
          costo_base: {}, // Asignar un objeto vacío
          c_armas: parseInteger(row.cArmas),
          c_municion: parseInteger(row.cMunicion),
          c_alcohol: parseInteger(row.cAlcohol),
          c_dolares: parseInteger(row.cDolar),
          fac_costo: parseFloat(row.facCosto),
          t_horas: row.tHoras || '0',
          t_minutos: row.tMinutos || '0',
          t_segundos: row.tSegundos || '0',
          fac_dura: parseFloat(row.facDura),
          imagen_url: row.imagenurl || '',
        };

        await prisma.building.upsert({
          where: { id_edificio: buildingData.id_edificio },
          update: buildingData,
          create: buildingData,
        });
        console.log(`Edificio '${buildingData.nombre}' (ID: ${buildingData.id_edificio}) creado/actualizado.`);

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
