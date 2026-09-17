/**
 * Definiciones y tipos de dominio estrictos para el MMORTS Vendetta.
 * REGLA GLOBAL: Prohibido el uso de `any`. Toda estructura debe ser fuertemente tipada.
 */

export type ResourceType = 'dinero' | 'armas' | 'alcohol' | 'municion';

export interface ResourceState {
  dinero: number;
  armas: number;
  alcohol: number;
  municion: number;
  lastUpdated: Date;
}

export interface ResourceProductionRates {
  dineroPerHour: number;
  armasPerHour: number;
  alcoholPerHour: number;
  municionPerHour: number;
}

export type BuildingIdentifier =
  | 'sede_principal'
  | 'destileria'
  | 'taller_armas'
  | 'fabrica_municion'
  | 'almacen'
  | 'campo_entrenamiento'
  | 'cuartel_guardias'
  | 'laboratorio_investigacion';

export interface BuildingState {
  id: number;
  propertyId: number;
  type: BuildingIdentifier;
  level: number;
  isUpgrading: boolean;
  upgradeFinishesAt: Date | null;
}

export interface TroopUnit {
  id: string;
  name: string;
  category: 'infantry' | 'specialist' | 'heavy';
  attackPower: number;
  defensePower: number;
  capacity: number;
  maintenanceCost: number;
}

export type FamilyRole = 'Leader' | 'CoLeader' | 'Member';

export interface FamilyMemberSummary {
  userId: number;
  username: string;
  role: FamilyRole;
  reputation: number;
  joinedAt: Date;
}

/**
 * Resultado tipado y predecible para Server Actions
 */
export type ActionResult<T = void> =
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      error: string;
      data?: never;
    };
