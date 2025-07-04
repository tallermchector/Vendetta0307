
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

// Helper to parse numbers that might contain thousand separators.
function parseInteger(value: string | undefined): number {
    if (!value) return 0;
    // Remove dots or commas used as thousand separators, then parse.
    const cleanValue = value.replace(/[.,]/g, '');
    const number = parseInt(cleanValue, 10);
    return isNaN(number) ? 0 : number;
}

// Helper for float values that might use a comma as a decimal separator
function parseFloatValue(value: string | undefined): number {
    if (!value) return 0;
    const cleanValue = value.replace('.', '').replace(',', '.');
    const number = parseFloat(cleanValue);
    return isNaN(number) ? 0 : number;
}


async function main() {
  console.log(`Iniciando el sembrado de datos de reclutamiento desde CSV...`);

  const csvFilePath = path.join(process.cwd(), 'prisma', 'vendetta - recruitment.csv');
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

  // CSV Headers: id_recruitment,nombre,descripcion,cArmas,cMunicion,cAlcohol,cDolar,velocidad,tHoras,tMinutos,tSegundos,facDura,puntosxnivel,imagenurl,ATA,DEF,CAR,VEL,PUNT
  for (const row of parsed.data as any[]) {
    try {
        if (!row.id_recruitment || isNaN(parseInt(row.id_recruitment, 10))) continue;

        const recruitmentData = {
          id_recruitment: parseInt(row.id_recruitment, 10),
          nombre: row.nombre || '',
          descripcion: row.descripcion || '',
          c_armas: parseInteger(row.cArmas),
          c_municion: parseInteger(row.cMunicion),
          c_alcohol: parseInteger(row.cAlcohol),
          c_dolares: parseInteger(row.cDolar),
          velocidad: parseInteger(row.velocidad),
          t_horas: row.tHoras || '0',
          t_minutos: row.tMinutos || '0',
          t_segundos: row.tSegundos || '0',
          fac_dura: parseFloatValue(row.facDura),
          puntos_por_nivel: parseInteger(row.puntosxnivel),
          imagen_url: row.imagenurl || '',
          ata: parseInteger(row.ATA),
          def: parseInteger(row.DEF),
          car: parseInteger(row.CAR),
          vel: parseInteger(row.VEL),
          punt: parseInteger(row.PUNT),
        };

        await prisma.recruitment.upsert({
          where: { id_recruitment: recruitmentData.id_recruitment },
          update: recruitmentData,
          create: recruitmentData,
        });
        console.log(`Unidad de reclutamiento '${recruitmentData.nombre}' (ID: ${recruitmentData.id_recruitment}) creada/actualizada.`);

    } catch(error) {
        console.error(`Error procesando la fila: ${JSON.stringify(row)}`, error);
    }
  }

  console.log(`Sembrado de reclutamiento completado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
