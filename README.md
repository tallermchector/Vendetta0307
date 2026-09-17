# Vendetta - MMORTS Mafia Strategy Game

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

**Vendetta** es un videojuego de estrategia masiva multijugador online en tiempo real (MMORTS) ambientado en el submundo de las organizaciones criminales de la mafia. Los jugadores asumen el rol de Don o Capo, gestionando operaciones clandestinas, producción y contrabando de recursos, reclutamiento de matones y especialistas, guerras territoriales entre Familias y espionaje estratégico.

Construido con una arquitectura moderna de alto rendimiento basada en **Next.js 16 (App Router)**, **React Server Components**, **Server Actions con transacciones ACID** y una interfaz con estética **Dark Mafia Modern**.

---

## Características Principales

- **Economía y Producción en Tiempo Real:** Gestión de recursos ilícitos (Dinero, Armas, Alcohol, Munición) calculados con un motor matemático determinista puro.
- **Jerarquía y Familias:** Alianzas mafiosas, rangos de poder (`Leader`, `CoLeader`, `Member`), invitaciones y diplomacia entre sindicatos.
- **Inmuebles y Operaciones:** Construcción y mejora progresiva de propiedades, laboratorios clandestinos, depósitos y centros de mando.
- **Reclutamiento y Tácticas de Seguridad:** Entrenamiento de tropas de asalto, defensas de locales y misiones de intimidación.
- **Simulador de Combate:** Herramientas de cálculo táctico y simulación de asedios.
- **Seguridad y Sesión de Alto Nivel:** Autenticación protegida con JWT cifrado vía cookies `HttpOnly`, protección con Middleware perimetral y transacciones atómicas con Prisma.

---

## Requisitos Previos

- **Node.js:** Versión `>= 20.x` (LTS recomendada).
- **pnpm:** Versión `>= 9.x` (`corepack enable pnpm` o `npm install -g pnpm`).
- **Base de Datos:** PostgreSQL o compatible (vía URL de conexión directa o pooling).

---

## Guía de Instalación y Ejecución Local

Sigue estos pasos ordenados para levantar el entorno de desarrollo:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tallermchector/Vendetta0307.git
cd Vendetta0307
```

### 2. Configurar variables de entorno
Copia la plantilla de variables de entorno y ajusta tus credenciales de base de datos y secretos:
```bash
cp .env.example .env
```

### 3. Instalar dependencias con pnpm
```bash
pnpm install
```

### 4. Ejecutar migraciones de la base de datos
Aplica el esquema de Prisma en tu base de datos local o remota:
```bash
pnpm exec prisma migrate dev
```

### 5. Sembrar datos iniciales (Seed)
Inicializa los datos base del juego (edificios, tropas, unidades de seguridad y entrenamientos):
```bash
pnpm exec prisma db seed
```

### 6. Iniciar el servidor de desarrollo
Inicia Next.js en modo desarrollo:
```bash
pnpm dev
```

Accede a la aplicación en [http://localhost:3000](http://localhost:3000) (o el puerto configurado).

---

## Estructura de Directorios (`src/`)

```
src/
├── actions/                     # Server Actions (Mutaciones y lógica de negocio con Prisma)
│   ├── auth.ts                  # Registro, login y cierre de sesión
│   ├── buildings.ts             # Construcción y subida de nivel de edificios
│   ├── family.ts                # Gestión de familias, rangos e invitaciones
│   ├── property.ts              # Gestión de propiedades y cambio de sede activa
│   ├── recruitment.ts           # Reclutamiento de unidades y tropas
│   ├── security.ts              # Asignación de defensas e infraestructuras de guardia
│   ├── training.ts              # Formación e investigación tecnológica
│   └── user.ts                  # Actualizaciones de perfil y preferencias
│
├── ai/                          # Integraciones y agentes con IA / Genkit
│
├── app/                         # Enrutamiento principal (Next.js App Router)
│   ├── (authenticated)/         # Rutas protegidas que requieren sesión activa
│   │   ├── dashboard/           # Panel de mando principal del jugador
│   │   │   ├── buildings/       # Vista de edificios y ampliaciones
│   │   │   ├── family/          # Cuartel general de la Familia mafiosa
│   │   │   ├── farms/           # Operaciones de producción agrícola e insumos
│   │   │   ├── map/             # Mapa territorial y exploración
│   │   │   ├── missions/        # Misiones, contratos y encargos
│   │   │   ├── options/         # Configuración y preferencias de cuenta
│   │   │   ├── rankings/        # Clasificación global de capos y familias
│   │   │   ├── recruitment/     # Cuartel de reclutamiento de tropas
│   │   │   ├── resources/       # Estado y desglose de producción de recursos
│   │   │   ├── rooms/           # Salas operativas y cuarteles
│   │   │   ├── rules/           # Reglamento y manual del juego
│   │   │   ├── search/          # Búsqueda de objetivos y jugadores
│   │   │   ├── security/        # Sistema de seguridad y vigilancia
│   │   │   ├── simulator/       # Simulador táctico de combate
│   │   │   ├── stats/           # Estadísticas de poder y economía
│   │   │   ├── technologies/    # Árbol de investigación y avances
│   │   │   ├── training/        # Campo de entrenamiento
│   │   │   └── page.tsx         # Vista general del dashboard
│   │   └── layout.tsx           # Layout persistente para usuarios autenticados
│   ├── api/                     # Endpoints API REST y Webhooks
│   ├── forgot-password/         # Flujo de recuperación de contraseñas
│   ├── login/                   # Página de inicio de sesión
│   ├── register/                # Flujo de registro en múltiples pasos
│   ├── globals.css              # Estilos globales y tokens "Dark Mafia Modern"
│   ├── layout.tsx               # Layout raíz HTML y providers
│   └── page.tsx                 # Landing page pública y presentación
│
├── components/                  # Componentes reutilizables de React
│   ├── dashboard/               # Widgets específicos del juego
│   ├── forms/                   # Formularios de validación con Zod
│   ├── layout/                  # Barras de navegación, barras laterales y cabeceras
│   └── ui/                      # Biblioteca de primitivas de interfaz (Radix UI / Shadcn)
│
├── content/                     # Textos, reglas y descripciones estáticas
│
├── hooks/                       # Custom hooks de React para estado de cliente
│
├── lib/                         # Utilidades transversales y motor central
│   ├── engine/                  # Motor de cálculo PURO (sin efectos secundarios ni BD)
│   ├── auth.ts                  # Autenticación, protectPage y comprobación de permisos
│   ├── constants.ts             # Constantes globales del juego
│   ├── prisma.ts                # Instancia singleton del cliente de Prisma
│   ├── production.ts            # Cálculo de ritmos y flujos de producción
│   ├── serialize.ts             # Serialización segura de datos de servidor a cliente
│   ├── session.ts               # Manejo de JWT, cookies de sesión y desencriptado
│   ├── types.ts                 # Tipos de usuario autenticado y payloads de Prisma
│   └── utils.ts                 # Utilidades generales (cn, formateadores)
│
├── types/                       # Definición estricta de tipos de dominio
│   └── game.ts                  # Tipos del juego, recursos, tropas y resultados de acción
│
└── middleware.ts                # Interceptor perimetral para protección de rutas
```

---

## Reglas de Contribución

Todo código nuevo debe cumplir rigurosamente las pautas descritas en [AGENTS.md](AGENTS.md):
- **Funciones Puras:** El motor de cálculo en `src/lib/engine/` nunca debe invocar base de datos ni provocar efectos secundarios.
- **Transacciones ACID:** Toda Server Action en `src/actions/` debe utilizar `prisma.$transaction` para asegurar la atomicidad de las operaciones.
- **Tipado Estricto:** Prohibido el uso de `any`; todos los modelos del juego deben tiparse en `src/types/game.ts`.
