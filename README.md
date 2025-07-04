 
# Vendetta 01: Un Juego de Estrategia Online

Bienvenido al repositorio de **Vendetta 01**, una aplicación web moderna que revive la esencia de los juegos de estrategia online, construida con un stack tecnológico de última generación.

## Cometido del Proyecto

El objetivo principal de **Vendetta 01** es desarrollar una aplicación web robusta y escalable que sirva como plataforma para un juego de estrategia multijugador online. El núcleo de la aplicación se centra en un sistema de autenticación seguro y un panel de control (dashboard) interactivo, desde donde los jugadores gestionan sus recursos, propiedades y progreso en el juego.

## Tecnologías Utilizadas

Este proyecto aprovecha un conjunto de tecnologías modernas para garantizar un rendimiento óptimo, seguridad y una experiencia de desarrollo eficiente.

| Tecnología | Propósito en el Proyecto |
| :--- | :--- |
| **Next.js 15 (App Router)** | Framework principal de React. Se utiliza el App Router para una arquitectura basada en componentes de servidor (RSC), rutas anidadas y layouts. |
| **TypeScript** | Superset de JavaScript que añade tipado estático, mejorando la robustez del código y la experiencia del desarrollador. |
| **Prisma ORM** | Capa de acceso a la base de datos. Se utiliza para definir el esquema, ejecutar migraciones y realizar consultas a la base de datos PostgreSQL de forma segura y tipada. |
| **TailwindCSS & ShadCN/UI** | Utilizado para el diseño de la interfaz de usuario. TailwindCSS provee las clases de utilidad, mientras que ShadCN/UI ofrece un conjunto de componentes accesibles y reutilizables. |
| **Server Actions** | Para ejecutar lógica de backend directamente desde los componentes, eliminando la necesidad de crear endpoints de API para operaciones como el login o la creación de propiedades. |
| **Zod** | Librería para la validación de esquemas. Es fundamental para validar los datos de formularios y acciones de servidor, asegurando la integridad de los datos. |
| **Jose & Bcrypt.js** | Utilizados para la seguridad de la autenticación. `bcrypt` se encarga de hashear contraseñas, y `jose` gestiona la creación y verificación de JSON Web Tokens (JWT) para la sesión. |
| **Lucide React** | Librería de iconos SVG ligera y personalizable, usada en toda la interfaz de usuario. |

## Estructura del Proyecto

La organización del proyecto sigue las convenciones modernas de Next.js, promoviendo la modularidad y la claridad.

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
│   ├── components/     # Componentes de React reutilizables.
│   ├── lib/            # Lógica central y utilidades (Prisma, sesión, etc.).
│   └── middleware.ts   # Middleware para la protección de rutas.
│
├── docs/               # Documentación del proyecto.
└── ...                 # Archivos de configuración (next.config.ts, tsconfig.json, etc.).
```

## Módulos Principales

La aplicación se estructura en varios módulos funcionales clave:

1.  **Autenticación y Sesión:**
    *   Registro de usuarios en dos pasos (credenciales y creación de la propiedad inicial).
    *   Inicio y cierre de sesión.
    *   Gestión de sesiones mediante JSON Web Tokens (JWT) almacenados en cookies `HttpOnly` y `Secure`.
    *   Protección de rutas a través de middleware.

2.  **Dashboard (Visión General):**
    *   Es la vista principal para los usuarios autenticados.
    *   Muestra un resumen del estado del jugador: recursos, información de la propiedad activa, datos de la familia y estadísticas clave.
    *   Actúa como punto de entrada a las demás secciones del juego.

3.  **Gestión de Propiedades y Habitaciones:**
    *   Permite a los usuarios visualizar los niveles de los edificios en su propiedad.
    *   Un selector en la barra lateral permite cambiar entre las diferentes propiedades que posea el jugador.

## Flujo de Datos de Autenticación

El flujo de autenticación es un ejemplo claro de la arquitectura del proyecto:

1.  **Frontend:** El usuario introduce sus credenciales en un formulario (`LoginForm.tsx`).
2.  **Server Action:** Al enviar, se invoca la `loginUser` Server Action (`src/actions/auth.ts`).
3.  **Backend (Validación):** La acción valida los datos con `zod`, busca al usuario en la base de datos con `Prisma` y verifica la contraseña con `bcrypt`.
4.  **Creación de Sesión:** Si las credenciales son válidas, `src/lib/session.ts` utiliza `jose` para crear un JWT y lo establece como una cookie `HttpOnly`.
5.  **Middleware:** En la siguiente petición a una ruta protegida (ej. `/dashboard`), el `middleware.ts` intercepta la solicitud, valida el JWT de la cookie y decide si permite o deniega el acceso, redirigiendo a `/login` si es necesario.
6.  **Renderizado del Servidor:** Dentro de los Server Components protegidos, se llama a la función `protectPage()` (`src/lib/auth.ts`), que obtiene los datos del usuario de forma segura para renderizar la página con la información correcta.
