# Análisis del Panel de Control Principal (/dashboard)

Este documento detalla el funcionamiento del panel de control (`/dashboard`), que es la vista principal para un usuario autenticado en "Vendetta 01". Se analiza desde la protección de la ruta hasta cómo se muestran los datos del jugador.

---

### 1. Protección de la Ruta (Middleware)

El archivo `src/middleware.ts` es la primera línea de defensa. Actúa como un guardia de seguridad para todas las rutas protegidas.

#### **Intercepción y Validación del JWT**

1.  **Intercepción de Petición:** Cuando un usuario intenta acceder a `/dashboard` (o cualquier ruta dentro de `/dashboard/*`), el `middleware` intercepta la petición antes de que llegue a la página.
2.  **Lectura de la Cookie:** Lee la cookie de sesión (`session`) directamente desde la petición entrante.
3.  **Validación del JWT:** Llama a la función `decrypt()` de `src/lib/session.ts`. Esta función utiliza la librería `jose` para verificar la firma del JSON Web Token (JWT) usando el secreto (`SESSION_SECRET`). Comprueba si el token es auténtico y si no ha expirado.
4.  **Decisión de Acceso:**
    *   **Si el token es válido:** El middleware permite que la petición continúe hacia la página solicitada.
    *   **Si el token no es válido, ha expirado o no existe:** El middleware detiene la petición y devuelve una respuesta de redirección (`NextResponse.redirect`) que envía al usuario de vuelta a `/login`.

Este proceso asegura que ningún usuario no autenticado pueda siquiera intentar renderizar una página protegida.

---

### 2. Frontend (`/dashboard/page.tsx`)

La página del dashboard está diseñada para ser eficiente y segura, aprovechando las características de Next.js.

#### **Estructura y Renderizado**

-   **Componente de Servidor (RSC):** La página `/dashboard/page.tsx` es un **React Server Component (RSC)**. Esto se identifica porque es una función `async`.
-   **Importancia de ser un RSC:**
    *   **Seguridad:** Toda la lógica de obtención de datos y el acceso a la base de datos ocurren exclusivamente en el servidor. Las claves de API, secretos y consultas directas a la base de datos nunca se exponen al navegador del cliente.
    *   **Rendimiento:** El componente se renderiza a HTML en el servidor. El cliente recibe una página ya construida, lo que resulta en un tiempo de carga inicial más rápido (First Contentful Paint) y reduce la cantidad de JavaScript que se necesita descargar y ejecutar en el navegador.
-   **Estructura Visual:** La interfaz está construida con componentes de **ShadCN/UI** (`Card`, `Avatar`, `Button`, etc.) organizados en un layout de rejilla para mostrar de forma clara los recursos, información del jugador, estado de la familia y otras estadísticas clave del juego.

---

### 3. Obtención de Datos del Lado del Servidor

Al ser un Server Component, la página obtiene todos los datos que necesita directamente en el servidor antes de enviar el resultado al cliente.

#### **Función `protectPage()` y `getCurrentUser()`**

1.  **Llamada Segura:** La página `dashboard/page.tsx` invoca `await protectPage()` desde `src/lib/auth.ts` al inicio de su ejecución.
2.  **Obtención de Sesión:** `protectPage` a su vez llama a `getCurrentUser()`. Esta función obtiene la sesión del usuario llamando a `getSession()`, que lee y descifra el JWT de la cookie de sesión para extraer el `userId`.
3.  **Consulta a la Base de Datos con Prisma:**
    *   Con el `userId` obtenido del token, `getCurrentUser()` realiza una consulta a la base de datos usando `prisma.user.findUnique(...)`.
    *   Esta consulta está optimizada para obtener no solo los datos del usuario, sino también toda la información relacionada necesaria para el dashboard en una sola llamada (gracias a `include`): el perfil del jugador (`perfil`), sus recursos (`recursos`), sus propiedades (`propiedades`) y su familia (`familia`).
4.  **Retorno Seguro de Datos:** Antes de devolver el objeto de usuario, se elimina explícitamente el campo de la contraseña (`pass`) para garantizar que el hash nunca, bajo ninguna circunstancia, se filtre a la lógica de renderizado.

---

### 4. Flujo de Datos Completo

El proceso, de principio a fin, es un ciclo robusto y seguro:

1.  **Petición del Usuario:** El navegador solicita la URL `/dashboard`.
2.  **Validación del Middleware:** `middleware.ts` valida la cookie de sesión. Si es válida, la petición sigue; si no, redirige a `/login`.
3.  **Renderizado en Servidor:** Next.js comienza a renderizar el Server Component `dashboard/page.tsx`.
4.  **Obtención de Datos:** El componente llama a `protectPage() -> getCurrentUser()`.
5.  **Acceso a Sesión y DB:** `getCurrentUser()` lee la sesión, obtiene el `userId` y usa Prisma para consultar la base de datos y traer toda la información del jugador.
6.  **Paso de Datos:** Los datos del jugador se pasan como `props` (implícitamente) a los componentes que los necesitan para el renderizado.
7.  **Respuesta HTML:** El servidor finaliza el renderizado y envía el HTML completo y poblado con los datos del usuario al navegador. El cliente recibe una página lista para ser mostrada, sin necesidad de realizar peticiones de datos adicionales.