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
  console.log(`Iniciando el sembrado de datos de entrenamientos desde CSV...`);

  const csvFilePath = path.join(process.cwd(), 'prisma', 'vendetta - training.csv');
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
        if (!row.id_training || isNaN(parseInt(row.id_training, 10))) continue;

        const trainingData = {
          id_training: parseInt(row.id_training, 10),
          nombre: row.nombre || '',
          descripcion: row.descripcion || '',
          costo_base: {}, // Assign empty object
          c_armas: parseInteger(row.c_armas),
          c_municion: parseInteger(row.c_municion),
          c_alcohol: parseInteger(row.c_alcohol),
          c_dolares: parseInteger(row.c_dolares),
          fac_costo: parseFloat(row.fac_costo),
          t_horas: row.t_horas || '0',
          t_minutos: row.t_minutos || '0',
          t_segundos: row.t_segundos || '0',
          fac_dura: parseFloat(row.fac_dura),
          imagen_url: row.imagen_url || '',
        };

        await prisma.training.upsert({
          where: { id_training: trainingData.id_training },
          update: trainingData,
          create: trainingData,
        });
        console.log(`Entrenamiento '${trainingData.nombre}' (ID: ${trainingData.id_training}) creado/actualizado.`);

    } catch(error) {
        console.error(`Error procesando la fila: ${JSON.stringify(row)}`, error);
    }
  }

  console.log(`Sembrado de entrenamientos completado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
