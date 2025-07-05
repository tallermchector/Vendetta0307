
# Informe Técnico del Proyecto: Vendetta 01

**Versión:** 1.0
**Fecha:** 5 de Julio de 2025
**Autor:** Arquitecto de Software (IA)

---

## 1. Resumen Ejecutivo

**Vendetta 01** es una aplicación web moderna que revive la esencia de los juegos de estrategia multijugador online. El objetivo principal de este proyecto es desarrollar una plataforma robusta, segura y escalable que sirva como base para un juego de estrategia, centrándose inicialmente en un sistema de autenticación de nivel profesional y un panel de control interactivo para el jugador.

Este documento sirve como la referencia técnica central, detallando la arquitectura, tecnologías, flujos de datos y prácticas de seguridad implementadas.

---

## 2. Pila Tecnológica (Stack)

El proyecto se construye sobre un conjunto de tecnologías modernas seleccionadas para garantizar un rendimiento óptimo, seguridad y una experiencia de desarrollo eficiente.

| Tecnología | Propósito en el Proyecto |
| :--- | :--- |
| **Next.js 15 (App Router)** | Framework principal de React. Se utiliza el App Router para una arquitectura basada en **React Server Components (RSC)**, rutas anidadas y layouts. |
| **TypeScript** | Superset de JavaScript que añade tipado estático, mejorando la robustez del código, la mantenibilidad y la experiencia del desarrollador. |
| **Prisma ORM** | Capa de acceso a la base de datos. Se utiliza para definir el esquema (`schema.prisma`), ejecutar migraciones y realizar consultas a la base de datos PostgreSQL de forma segura y tipada. |
| **TailwindCSS & ShadCN/UI** | Utilizados para el diseño de la interfaz de usuario. TailwindCSS provee las clases de utilidad, mientras que ShadCN/UI ofrece un conjunto de componentes accesibles, reutilizables y componibles. |
| **Server Actions** | Para ejecutar lógica de backend directamente desde los componentes, eliminando la necesidad de crear endpoints de API para operaciones como el login o las mejoras de edificios. |
| **Zod** | Librería para la validación de esquemas. Es fundamental para validar los datos de formularios y Server Actions, asegurando la integridad de los datos antes de procesarlos. |
| **Jose & Bcrypt.js** | Utilizados para la seguridad de la autenticación. `bcrypt` se encarga de hashear contraseñas, y `jose` gestiona la creación y verificación de JSON Web Tokens (JWT) para la sesión. |
| **Lucide React** | Librería de iconos SVG ligera y personalizable, usada en toda la interfaz de usuario para mantener una estética consistente y moderna. |

---

## 3. Arquitectura y Estructura del Proyecto

### 3.1. Arquitectura General

La arquitectura de **Vendetta 01** está centrada en el **App Router** de Next.js y el paradigma de **React Server Components (RSC)**. Este enfoque "server-first" es deliberado y aporta dos ventajas fundamentales:

1.  **Seguridad:** La lógica de negocio sensible, el acceso a la base de datos y las claves secretas **nunca abandonan el servidor**. El cliente solo recibe HTML renderizado, minimizando la superficie de ataque.
2.  **Rendimiento:** Se reduce drásticamente la cantidad de JavaScript enviado al cliente. Las páginas se renderizan en el servidor, lo que resulta en tiempos de carga inicial (FCP) más rápidos y una mejor experiencia de usuario.

### 3.2. Estructura de Directorios

La organización del proyecto sigue las convenciones modernas de Next.js para promover la modularidad y la claridad.

```
/
├── prisma/             # Esquema de la DB, migraciones y scripts de sembrado.
├── public/             # Archivos estáticos (imágenes, fuentes, etc.).
├── src/
│   ├── app/            # Corazón de la aplicación (App Router).
│   │   ├── (authenticated)/ # Grupo de rutas protegidas por sesión.
│   │   ├── login/      # Página de inicio de sesión.
│   │   ├── register/   # Páginas para el flujo de registro.
│   │   ├── layout.tsx  # Layout raíz de la aplicación.
│   │   └── page.tsx    # Página de inicio (landing).
│   │
│   ├── actions/        # Server Actions (lógica de backend).
│   ├── components/     # Componentes de React reutilizables (UI y de dominio).
│   ├── lib/            # Lógica central, utilidades y configuración de servicios (Prisma, sesión, etc.).
│   └── middleware.ts   # Middleware para la protección de rutas.
│
├── docs/               # Documentación del proyecto.
└── ...                 # Archivos de configuración (next.config.ts, etc.).
```

---

## 4. Análisis Detallado de Módulos Core

### 4.1. Módulo de Autenticación (`/login`)

El flujo de autenticación es un ejemplo claro de la arquitectura RSC + Server Actions.

1.  **Frontend (`LoginForm.tsx`):** Un Componente de Cliente que utiliza `react-hook-form` para gestionar el estado del formulario y `zod` para la validación del lado del cliente.
2.  **Llamada a Server Action:** Al enviar el formulario, en lugar de una petición `fetch`, se invoca directamente la Server Action `loginUser` desde `src/actions/auth.ts`.
3.  **Backend (Server Action `loginUser`):**
    *   La acción se ejecuta exclusivamente en el servidor.
    *   Valida los datos recibidos con un `loginSchema` de Zod.
    *   Usa `Prisma` para buscar al usuario en la base de datos por su email.
    *   Compara la contraseña proporcionada con el hash almacenado usando `bcrypt.compare()`.
4.  **Gestión de Sesión:**
    *   Si las credenciales son válidas, la acción llama a `createSession()` de `src/lib/session.ts`.
    *   `createSession` utiliza `jose` para generar un JWT, que contiene el `userId`.
    *   Este JWT se establece en una **cookie `HttpOnly` y `Secure`**, lo que impide su acceso desde el JavaScript del cliente (protección XSS).
5.  **Redirección:** La acción `loginUser` devuelve un objeto con la URL de redirección (`/dashboard` o `/register/create-property`). El componente cliente usa el `useRouter` de Next.js para realizar la navegación.

### 4.2. Módulo de Dashboard Principal (`/dashboard`)

1.  **Protección de Ruta (`middleware.ts`):** Antes de que la petición llegue a la página, el middleware intercepta la solicitud. Lee la cookie de sesión, la desencripta con `decrypt()` y verifica su validez. Si el usuario no está autenticado, es redirigido a `/login`.
2.  **Renderizado en Servidor (`dashboard/page.tsx`):**
    *   La página es un **RSC** (función `async`), por lo que todo su código se ejecuta en el servidor.
    *   Llama a `protectPage()`, una función de ayuda que a su vez invoca a `getCurrentUser()`.
    *   `getCurrentUser()` obtiene los datos completos del usuario (perfil, recursos, propiedades) de la base de datos en una única consulta optimizada con Prisma.
    *   La contraseña hasheada se elimina explícitamente del objeto antes de devolverlo.
3.  **Paso de Datos a Componentes:** Los datos del jugador se pasan como props a los componentes del dashboard (ej: `StatsBar`), que los renderizan. Si un componente es de cliente, los datos complejos como `BigInt` se serializan a `string` para evitar errores.
4.  **Respuesta HTML:** El servidor envía el HTML final, ya poblado con los datos del usuario, al navegador. No hay peticiones de datos adicionales desde el cliente.

### 4.3. Módulo de Habitaciones (`/dashboard/rooms`)

Este módulo demuestra el poder de los RSC para vistas de datos complejas.

1.  **Frontend (`rooms/page.tsx`):** Es un RSC. La interfaz utiliza un componente `<Table>` de ShadCN/UI para mostrar la lista de edificios.
2.  **Lógica en el Servidor:**
    *   La página obtiene los datos del usuario autenticado y su propiedad principal con `protectPage()`.
    *   Realiza una segunda consulta a `prisma.building.findMany()` para obtener el **catálogo completo** de todos los edificios disponibles en el juego.
    *   Dentro del componente, se itera sobre el catálogo de edificios. Para cada uno, se cruza la información con los **niveles actuales** de la propiedad del jugador.
    *   Se **calculan dinámicamente** el costo y la duración de la siguiente mejora (`Nivel + 1`) en el servidor, usando los factores y costos base del catálogo.
3.  **Flujo de Mejora:**
    *   Cada fila tiene un botón "Ampliar" dentro de un `<form>`.
    *   Al hacer clic, se invoca la Server Action `upgradeBuilding`.
    *   La acción valida los recursos del jugador, ejecuta la actualización en una transacción de Prisma (resta recursos, incrementa nivel y puntos) y finalmente usa `revalidatePath('/dashboard/rooms')` para indicarle a Next.js que debe volver a renderizar la página con los datos actualizados.

### 4.4. Módulo de Entrenamiento (`/dashboard/training`)

Funciona con una lógica idéntica al módulo de "Habitaciones", pero con diferentes modelos de datos:

*   **Catálogo:** `Training`
*   **Progreso del Jugador:** `PlayerTraining` (tabla que relaciona `PlayerProfile` y `Training`, almacenando el `level`).
*   **Lógica:** La página `training/page.tsx` (RSC) obtiene el catálogo completo y el progreso del jugador, calcula los costos de mejora en el servidor y los muestra. El botón "Mejorar" invoca la Server Action `upgradeTraining`.

### 4.5. Módulo de Reclutamiento y Seguridad (`/dashboard/recruitment`, `/dashboard/security`)

Estos módulos siguen un patrón similar:

*   **Catálogo:** `Recruitment` y `Security`.
*   **Progreso del Jugador:** `PlayerRecruitment` y `PlayerSecurity` (almacenan la `quantity` de cada unidad).
*   **Lógica:** Las páginas RSC muestran las unidades disponibles. Los formularios de reclutamiento/compra invocan las Server Actions `recruitUnit` o `purchaseSecurity`.
*   **Server Actions:** Validan que el jugador tenga suficientes recursos, ejecutan una transacción para restar recursos y actualizar la cantidad de unidades, y actualizan los `puntos_tropas` del jugador.

---

## 5. Esquema de la Base de Datos (Prisma)

El esquema de la base de datos es el esqueleto del juego, definido en `prisma/schema.prisma`.

*   **`User`:** El modelo central. Almacena credenciales de autenticación y es el punto de partida para todas las demás relaciones de datos de un jugador.
*   **`Family`:** Representa los clanes o alianzas. Un `User` puede pertenecer a una `Family`.
*   **`PlayerProfile`:** Almacena todas las estadísticas y puntos de un jugador. Actúa como el centro neurálgico del progreso del jugador.
*   **`PlayerResources`:** Gestiona las cantidades de los diferentes recursos (armas, munición, etc.) que posee un jugador. Es una relación uno a uno con `User`.
*   **`Propiedad`:** Representa una base o territorio. Un `User` puede tener múltiples propiedades. Almacena los niveles de los edificios directamente en sus columnas.
*   **Catálogos (`Building`, `Training`, `Recruitment`, `Security`):** Modelos que contienen los datos estáticos del juego. Definen las propiedades base (costos, factores, tiempos, estadísticas) de todos los elementos construibles o investigables. No cambian durante el juego.
*   **Tablas de Progreso (`PlayerTraining`, `PlayerRecruitment`, `PlayerSecurity`):** Tablas de unión que conectan el `PlayerProfile` de un jugador con los catálogos, registrando su progreso específico (ej: el nivel de un entrenamiento, la cantidad de una unidad).

---

## 6. Seguridad y Mejores Prácticas

La seguridad ha sido una prioridad en el diseño de la arquitectura.

*   **Cookies `HttpOnly`:** Los JWT de sesión se almacenan en cookies `HttpOnly`, lo que previene que sean accedidos por scripts del lado del cliente, mitigando ataques XSS.
*   **Hashing de Contraseñas:** Las contraseñas se hashean con `bcrypt` antes de ser almacenadas. Nunca se guardan en texto plano.
*   **Protección de Rutas:** El `middleware.ts` actúa como un guardia, verificando la sesión en cada petición a una ruta protegida y redirigiendo si es necesario.
*   **Validación de Entradas:** Se utiliza `Zod` tanto en el cliente como en el servidor (dentro de las Server Actions) para validar todos los datos provenientes del usuario, previniendo inyecciones de datos maliciosos.
*   **Lógica en el Servidor:** Al ejecutar toda la lógica de negocio, acceso a la base de datos y cálculos de costos en el servidor (RSC y Server Actions), se evita exponer información sensible o reglas del juego al cliente.
*   **Transacciones Atómicas:** Las operaciones críticas que involucran múltiples actualizaciones en la base de datos (como mejorar un edificio y restar recursos) se envuelven en una transacción de Prisma (`prisma.$transaction`), asegurando que o se completan todas con éxito, o no se realiza ninguna.
