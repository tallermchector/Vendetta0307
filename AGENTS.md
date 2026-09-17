# AGENTS.md - Reglas Globales de Desarrollo y Arquitectura

Bienvenido al entorno de desarrollo del MMORTS **Vendetta**. Este documento establece las normas arquitectónicas, convenciones de código y restricciones técnicas innegociables para agentes de IA y desarrolladores que contribuyan en este repositorio.

---

## 1. Stack Tecnológico Principal

- **Framework:** Next.js 16 (App Router exclusivamente, bajo la raíz `src/`).
- **Lenguaje:** TypeScript 5 en modo estricto (`strict: true`, `noImplicitAny: true`).
- **ORM:** Prisma ORM conectando a PostgreSQL (con soporte para Prisma Accelerate / Pooling).
- **Estilos:** Tailwind CSS con paleta estética **"Dark Mafia Modern"** (tonos carbón profundo, zinc, carmesí oscuro/dorado opaco para estados y jerarquías de poder).
- **Gestor de Paquetes:** `pnpm` como gestor estándar y unificado para dependencias y scripts.

---

## 2. Reglas Arquitectónicas Críticas

### 2.1 Motor de Cálculo Aislado (`src/lib/engine/`)
Todo cálculo matemático, de producción de recursos, fórmulas de combate, tiempos de construcción, penalizaciones o bonificaciones debe residir en `src/lib/engine/`:

- **Funciones 100% Puras:** Sin dependencias externas, sin mutación de estado global, sin operaciones I/O.
- **Cero Llamadas a Base de Datos:** Queda estrictamente prohibido importar Prisma o invocar conexiones de red/DB dentro de `src/lib/engine/`.
- **Determinismo y Testabilidad:** Dadas las mismas entradas, toda función del motor debe retornar exactamente la misma salida (`(inputs) => outputs`). Debe ser directamente testeable con suites unitarias sin necesidad de mocks de BD.

```typescript
// ✅ CORRECTO: Función pura en src/lib/engine/resources.ts
export function calculateResourceProduction(
  baseRate: number,
  buildingLevel: number,
  efficiencyMultiplier: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0;
  const ratePerHour = baseRate * Math.pow(1.15, buildingLevel - 1) * efficiencyMultiplier;
  return Math.floor((ratePerHour / 3600) * elapsedSeconds);
}

// ❌ PROHIBIDO: Consultar base de datos o estado impuro
export async function calculateProductionWithDb(userId: number) {
  const user = await prisma.user.findUnique(...); // ERROR: Violación arquitectónica
}
```

---

### 2.2 Server Actions y Atomicidad Transaccional (`src/actions/`)
Cualquier mutación de estado, reclutamiento, asignación de tropas o consumo de recursos ejecutada desde `src/actions/` debe garantizar consistencia ACID:

- **Transacciones Atómicas Obligatorias:** Todo cambio de estado que involucre lectura y escritura condicional, gasto de recursos o transferencias debe encapsularse en `prisma.$transaction`.
- **Prevención de Race Conditions:** Validar recursos disponibles y descontarlos dentro del mismo bloque transaccional.
- **Manejo de Errores Tipado:** Las acciones deben devolver objetos estandarizados `{ success: boolean, data?: T, error?: string }` en lugar de arrojar excepciones no controladas hacia el cliente.

```typescript
// ✅ CORRECTO: Mutación atómica en src/actions/buildings.ts
'use server';

import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/types/game';

export async function upgradeBuilding(
  propertyId: number,
  buildingCode: string
): Promise<ActionResult<{ newLevel: number }>> {
  return await prisma.$transaction(async (tx) => {
    const resources = await tx.playerResources.findFirst({
      where: { id_propiedad: propertyId },
    });

    // Validar costos calculados con el motor puro
    // Descontar recursos y actualizar edificio atómicamente
    // ...
    return { success: true, data: { newLevel: 2 } };
  });
}
```

---

### 2.3 Tipado Estricto y Prohibición de `any` (`src/types/game.ts`)
- **Prohibido `any`:** Está prohibido el uso de `any` en cualquier parte del código. Usar `unknown`, genéricos o tipos discriminados en su lugar.
- **Tipado del Dominio:** Las estructuras de datos del juego (recursos, edificaciones, tropas, rangos de familia, informes de combate) deben estar declaradas formalmente en `src/types/game.ts` o inferidas mediante esquemas Zod / Prisma Payload Types.

```typescript
// En src/types/game.ts
export type ResourceType = 'dinero' | 'armas' | 'alcohol' | 'municion';

export interface ResourceState {
  dinero: number;
  armas: number;
  alcohol: number;
  municion: number;
  lastUpdated: Date;
}

export type ActionResult<T = void> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };
```

---

## 3. Guía de Estilo y UI ("Dark Mafia Modern")

- **Fondos:** `bg-zinc-950`, `bg-neutral-900`, `bg-black/90` con bordes sutiles `border-zinc-800`.
- **Acentos:** Carmesí sombrío (`rose-700` / `red-900`), dorado envejecido (`amber-600/700`) para rangos y distinciones, y esmeralda táctico (`emerald-600`) para balances positivos.
- **Feedback:** Cargas y transiciones asíncronas con esqueletos oscuros (`animate-pulse bg-zinc-800`) y microinteracciones fluidas con Framer Motion o Tailwind transitions.

---

## 4. Flujo de Trabajo para Agentes de IA

1. **Lectura Previa:** Consulta siempre `src/types/game.ts` y los modelos de `prisma/schema.prisma` antes de generar nuevas acciones o componentes.
2. **Separación de Responsabilidades:**
   - ¿Es cálculo de reglas o fórmulas del juego? ➔ `src/lib/engine/`.
   - ¿Es interacción con BD o mutación de sesión? ➔ `src/actions/` con `prisma.$transaction`.
   - ¿Es presentación e interactividad de interfaz? ➔ `src/components/` o `src/app/`.
3. **Validación:** Comprobar siempre que `pnpm exec tsc --noEmit` pase sin errores antes de dar una tarea por completada.
