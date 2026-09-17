/**
 * Motor de cálculo determinista para Vendetta MMORTS.
 *
 * REGLAS ARQUITECTÓNICAS INMUTABLES:
 * 1. Funciones 100% PURAS. Cero efectos secundarios.
 * 2. CERO importaciones o llamadas a bases de datos (ni Prisma ni APIs externas).
 * 3. Determinismo total: mismas entradas devuelven idénticas salidas.
 */

import type { ResourceProductionRates, ResourceState } from '@/types/game';

/**
 * Calcula la cantidad de recursos acumulados entre dos instantes de tiempo.
 *
 * @param previousState Estado inicial de recursos y fecha de último cálculo.
 * @param rates Tasas de producción por hora para cada recurso.
 * @param targetDate Fecha objetivo para el cálculo (típicamente la actual).
 * @returns Nuevo estado calculado de recursos de manera pura.
 */
export function calculateAccumulatedResources(
  previousState: ResourceState,
  rates: ResourceProductionRates,
  targetDate: Date
): ResourceState {
  const elapsedMs = Math.max(0, targetDate.getTime() - previousState.lastUpdated.getTime());
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  return {
    dinero: Math.floor(previousState.dinero + rates.dineroPerHour * elapsedHours),
    armas: Math.floor(previousState.armas + rates.armasPerHour * elapsedHours),
    alcohol: Math.floor(previousState.alcohol + rates.alcoholPerHour * elapsedHours),
    municion: Math.floor(previousState.municion + rates.municionPerHour * elapsedHours),
    lastUpdated: targetDate,
  };
}

/**
 * Calcula el costo de recursos y tiempo necesario para mejorar un edificio.
 */
export function calculateBuildingUpgradeCost(
  baseCost: number,
  currentLevel: number,
  multiplier: number = 1.25
): { cost: number; durationSeconds: number } {
  const cost = Math.floor(baseCost * Math.pow(multiplier, currentLevel));
  const durationSeconds = Math.floor(60 * Math.pow(1.2, currentLevel));
  return { cost, durationSeconds };
}
