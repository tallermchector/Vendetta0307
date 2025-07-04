# Análisis del Módulo de Gestión de Habitaciones (/dashboard/rooms)

Este documento desglosa el funcionamiento de la página de "Gestión de Habitaciones", una de las vistas más importantes del juego. A diferencia de un enfoque tradicional con API, esta sección está implementada como un **React Server Component (RSC)**, lo que optimiza la seguridad y el rendimiento.

---

### 1. Frontend (`/dashboard/rooms/page.tsx`)

La interfaz está diseñada para presentar información compleja de manera clara y eficiente.

#### **Diseño de la Interfaz**

-   **Componente de Servidor (RSC):** La página es una función `async`, lo que la convierte en un Componente de Servidor. Toda la obtención de datos y la lógica de renderizado se ejecutan en el servidor.
-   **Estructura Visual:** En lugar de un grid de tarjetas, la interfaz utiliza un componente `<Table>` de ShadCN/UI. Esta estructura es ideal para mostrar una lista de elementos con múltiples columnas de datos:
    *   **`TableHeader`:** Define las columnas: Imagen, Edificio y Nivel, Descripción, Costo de Ampliación y Acciones.
    *   **`TableBody`:** Itera sobre un catálogo de todos los edificios disponibles en el juego.
    *   **`TableRow`:** Cada fila representa un tipo de edificio (ej: "Oficina del Jefe", "Armería") y muestra:
        *   Su imagen, nombre y el **nivel actual** que el jugador tiene en su propiedad.
        *   Su descripción.
        *   El **costo calculado** para la próxima ampliación (recursos y tiempo).
        *   Un botón de "Ampliar" para iniciar la mejora.

#### **Gestión de Estados (Carga y Error)**

-   Al ser un RSC, no hay estados de "carga" visibles para el usuario en el navegador (como un spinner). La página se renderiza completamente en el servidor. El usuario solo ve el resultado final.
-   El estado de error se maneja de forma explícita. Si no se encuentra una propiedad para el usuario, el componente devuelve una tarjeta informativa indicando que no hay propiedades para mostrar, en lugar de la tabla.

---

### 2. Lógica y Obtención de Datos (en el Servidor)

Toda la lógica reside dentro del propio componente de página, eliminando la necesidad de un endpoint de API y de la gestión de estado en el cliente (`useEffect`, `useState`).

#### **Protección y Obtención de Datos del Jugador**

1.  **`protectPage()`:** Al inicio del componente, se llama a `await protectPage()`. Esta función de `src/lib/auth.ts`:
    *   Verifica que haya una sesión de usuario válida (leyendo la cookie de sesión). Si no la hay, redirige automáticamente a `/login`.
    *   Si la sesión es válida, usa Prisma para obtener el objeto completo del usuario, incluyendo sus relaciones (`propiedades`, `perfil`, etc.).
2.  **Datos de Propiedad:** El componente accede a la primera propiedad del usuario (`user.propiedades[0]`) para obtener los niveles actuales de cada edificio.

#### **Combinación de Datos y Cálculos**

1.  **Catálogo de Edificios:** El componente realiza una segunda consulta a la base de datos con `prisma.building.findMany()` para obtener la lista completa de todos los tipos de edificios que existen en el juego. Este es el "catálogo" base.
2.  **Cálculos Dinámicos:** El componente itera sobre el **catálogo de edificios**. Por cada edificio del catálogo:
    *   Busca el nivel actual de ese edificio en la **propiedad del jugador**.
    *   Utiliza los datos del catálogo (costo base, factor de costo) y el nivel actual para calcular dinámicamente el costo y la duración de la siguiente ampliación (`Nivel + 1`).
    *   Formatea estos datos para mostrarlos en la tabla.

---

### 3. Flujo de Datos Completo (Arquitectura RSC)

El flujo es directo y eficiente, ocurriendo casi en su totalidad en el servidor:

1.  **Navegación:** El usuario hace clic en un enlace y navega a `/dashboard/rooms`.
2.  **Middleware:** El `middleware.ts` valida la cookie de sesión y permite el acceso.
3.  **Renderizado en Servidor:** Next.js comienza a renderizar el RSC `rooms/page.tsx`.
4.  **Obtención Segura de Datos:**
    *   La página llama a `protectPage()`, que valida la sesión y obtiene los datos del usuario actual, incluyendo sus propiedades, de la base de datos.
    *   La página obtiene el catálogo de edificios de la base de datos.
5.  **Lógica en el Servidor:** El componente ejecuta la lógica para cruzar los datos del catálogo con los niveles del jugador y calcular los costos de mejora.
6.  **Respuesta HTML:** El servidor envía el HTML final, completamente renderizado y con todos los datos calculados, al navegador del cliente.
7.  **Visualización:** El navegador recibe una página lista para ser mostrada, sin necesidad de realizar peticiones `fetch` adicionales ni gestionar estados de carga en el cliente. Esto resulta en una carga más rápida y una mayor seguridad, ya que la lógica de negocio y el acceso a la base de datos nunca abandonan el servidor.