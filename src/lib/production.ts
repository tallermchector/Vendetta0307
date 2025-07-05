import type { Propiedad } from "@prisma/client";

/**
 * @fileOverview Game logic for resource production calculations.
 *
 * - calculateProductionRates: Calculates the per-hour resource production for a single property.
 */

// Define an interface for the return type for clarity.
export interface ProductionRates {
  armas: number;
  municion: number;
  alcohol: number;
  dolares: number;
}

/**
 * Calculates the resource production rates per hour for a given property based on its building levels.
 * @param propiedad The property object from the database.
 * @returns An object containing the production rates for each resource.
 */
export function calculateProductionRates(propiedad: Propiedad): ProductionRates {
  // Producción de Armas (por Armería): Math.floor(10 * Math.pow((nivel_armeria + 1) / 2, 2))
  const armasProduction = Math.floor(
    10 * Math.pow((propiedad.armeria + 1) / 2, 2)
  );

  // Producción de Munición (por Fábrica de Munición): Math.floor(10 * Math.pow((nivel_municion + 1) / 2, 2) + 10)
  const municionProduction = Math.floor(
    10 * Math.pow((propiedad.municion + 1) / 2, 2) + 10
  );

  // Producción de Alcohol (por Cervecería): Math.floor(50 * Math.pow((nivel_cerveceria + 1) / 2, 2))
  const alcoholProduction = Math.floor(
    50 * Math.pow((propiedad.cerveceria + 1) / 2, 2)
  );

  // Producción de Dólares (combinada de Taberna y Contrabando)
  const tabernaProduction = Math.floor(
    2 * Math.pow((propiedad.taberna + 1) / 2, 2)
  );
  const contrabandoProduction = Math.floor(
    21 * Math.pow((propiedad.contrabando + 1) / 2, 2)
  );
  const dolaresProduction = tabernaProduction + contrabandoProduction;

  return {
    armas: armasProduction,
    municion: municionProduction,
    alcohol: alcoholProduction,
    dolares: dolaresProduction,
  };
}
