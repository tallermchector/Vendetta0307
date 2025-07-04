
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

// Helper to parse potentially large integers into BigInt.
function parseBigInt(value: string | undefined): bigint {
    if (!value) return 0n;
    const cleanValue = value.replace(/[.,]/g, '');
    try {
        return BigInt(cleanValue);
    } catch (e) {
        console.warn(`Could not parse value as BigInt: "${value}", returning 0n.`);
        return 0n;
    }
}


async function main() {
  console.log(`Iniciando el sembrado de datos de seguridad desde CSV...`);

  const csvFilePath = path.join(process.cwd(), 'prisma', 'vendetta - security.csv');
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

  // CSV Headers: id_security,nombre,descripcion,cArmas,cMunicion,cAlcohol,cDolar,tHoras,tMinutos,tSegundos,facDura,puntosxnivel,imagenurl,ATA,DEF,CAR,VEL,PUNT
  for (const row of parsed.data as any[]) {
    try {
        if (!row.id_security || isNaN(parseInt(row.id_security, 10))) continue;

        const securityData = {
          id_security: parseInt(row.id_security, 10),
          nombre: row.nombre || '',
          descripcion: row.descripcion || '',
          c_armas: parseInteger(row.cArmas),
          c_municion: parseInteger(row.cMunicion),
          c_alcohol: parseInteger(row.cAlcohol),
          c_dolares: parseInteger(row.cDolar),
          t_horas: row.tHoras || '0',
          t_minutos: row.tMinutos || '0',
          t_segundos: row.tSegundos || '0',
          fac_dura: parseFloatValue(row.facDura),
          puntos_por_nivel: parseInteger(row.puntosxnivel),
          imagen_url: row.imagenurl || '',
          ata: parseBigInt(row.ATA),
          def: parseBigInt(row.DEF),
          car: parseBigInt(row.CAR),
          vel: parseBigInt(row.VEL),
          punt: parseBigInt(row.PUNT),
        };

        await prisma.security.upsert({
          where: { id_security: securityData.id_security },
          update: securityData,
          create: securityData,
        });
        console.log(`Unidad de seguridad '${securityData.nombre}' (ID: ${securityData.id_security}) creada/actualizada.`);

    } catch(error) {
        console.error(`Error procesando la fila: ${JSON.stringify(row)}`, error);
    }
  }

  console.log(`Sembrado de seguridad completado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
