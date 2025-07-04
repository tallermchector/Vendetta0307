
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
          costo_base: {}, // Asignar un objeto vacío como se solicitó
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
