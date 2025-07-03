# Blueprint de Prompts para Implementación de Autenticación y Dashboard

Este documento detalla la secuencia de prompts para guiar a una IA de prototipado en la construcción de un sistema de autenticación robusto y un panel de control (dashboard) para la aplicación "Vendetta 01".

**Rol Asumido por la IA:** Experto absoluto en Next.js 15, App Router, TypeScript, Prisma, TailwindCSS, Zod y Zustand.

**Objetivo:** Implementar un flujo de autenticación completo y un dashboard protegido, basándose en los diseños de referencia y siguiendo las mejores prácticas del stack tecnológico definido.

---

### **Prompt 1: Configuración del Manejo de Estado con Zustand**

"Hola, IA. Vamos a empezar sentando las bases para el estado de la sesión en el cliente.

**Tarea:**
1.  Añade `zustand` como dependencia al proyecto.
2.  Crea un nuevo store de Zustand para gestionar la sesión del usuario. Este store deberá contener el estado del usuario (o `null` si no ha iniciado sesión) y acciones para `setSession` y `clearSession`.

**Archivos a modificar/crear:**
*   `package.json`: Añadir `zustand`.
*   `src/store/session.ts` (nuevo): Define la interfaz `SessionState` y crea el store `useSessionStore`."

---

### **Prompt 2: Refactorización y Mejora del Servidor de Autenticación**

"Ahora, vamos a refinar las acciones de servidor para la autenticación, asegurando que devuelvan datos claros al cliente.

**Tarea:**
1.  Modifica la acción `loginUser` en `src/actions/auth.ts`.
2.  En lugar de usar `redirect()` dentro de la acción (lo que causa excepciones), haz que devuelva un objeto con `{ success: true, user: { id_usuario, usuario, email } }` en caso de éxito. El componente cliente se encargará de la redirección.
3.  Asegúrate de que los datos del usuario devueltos no incluyan la contraseña hasheada.
4.  Actualiza `src/components/auth/LoginForm.tsx` para que, al recibir una respuesta exitosa, utilice un `useRouter` de `next/navigation` para redirigir a `/dashboard` y actualice el estado global si se implementa Zustand.

**Archivos a modificar:**
*   `src/actions/auth.ts`: Actualiza la lógica de `loginUser`.
*   `src/components/auth/LoginForm.tsx`: Actualiza la llamada a `loginUser` y maneja la redirección en el cliente."

---

### **Prompt 3: Creación de un Layout Protegido para Rutas Autenticadas**

"Necesitamos una estructura visual consistente para las secciones de la aplicación que requieren que el usuario haya iniciado sesión.

**Tarea:**
1.  Crea un `route group` de Next.js para las rutas autenticadas. Nómbralo `(authenticated)`.
2.  Dentro de este grupo, crea un `layout.tsx` que implemente una barra lateral (sidebar) y una cabecera (header) persistentes, usando los componentes de `src/components/ui/sidebar.tsx`.
3.  Mueve la página del dashboard actual a `src/app/(authenticated)/dashboard/page.tsx` y adáptala para que funcione dentro del nuevo layout. Elimina el antiguo `src/app/dashboard`.
4.  Crea componentes reutilizables para el layout, como `src/components/layout/Header.tsx` y `src/components/layout/Sidebar.tsx`.

**Archivos a crear/modificar:**
*   `src/app/(authenticated)/layout.tsx` (nuevo): Layout principal con sidebar y header.
*   `src/app/(authenticated)/dashboard/page.tsx` (nuevo, basado en el anterior `dashboard`).
*   `src/components/layout/Header.tsx` (nuevo): Componente para la cabecera.
*   `src/components/layout/Sidebar.tsx` (nuevo): Componente para la barra lateral.
*   Eliminar el directorio `src/app/dashboard`."

---

### **Prompt 4: Construcción del Dashboard Principal**

"Con el layout en su sitio, construyamos la interfaz del dashboard basándonos en el diseño de `public/principal/home.html`.

**Tarea:**
1.  Diseña la página `src/app/(authenticated)/dashboard/page.tsx`.
2.  Crea una cuadrícula (grid) para mostrar tarjetas de estadísticas.
3.  Crea un componente reutilizable `StatsCard.tsx` que acepte un ícono de `lucide-react`, un título, un valor y una descripción.
4.  Añade 4 tarjetas de ejemplo: 'Puntos de Edificios', 'Puntos de Tropas', 'Puntos de Entrenamientos' y 'Ranking Global', usando íconos como `Building`, `Swords`, `Target`, y `Shield`.

**Archivos a crear/modificar:**
*   `src/app/(authenticated)/dashboard/page.tsx`: Implementa la cuadrícula del dashboard.
*   `src/components/dashboard/StatsCard.tsx` (nuevo): Componente para las tarjetas de estadísticas."

---

### **Prompt 5: Implementación de Middleware para Proteger Rutas**

"El último paso es asegurar que solo los usuarios autenticados puedan acceder al dashboard y otras rutas protegidas.

**Tarea:**
1.  Crea un archivo `middleware.ts` en la raíz del directorio `src`.
2.  El middleware debe proteger todas las rutas dentro del grupo `(authenticated)`.
3.  La lógica verificará la existencia de una cookie o token de sesión. Si el usuario no está autenticado, debe ser redirigido a la página `/login`.
4.  Configura el `matcher` en el middleware para que se ejecute en las rutas que empiezan con `/dashboard` (o cualquier otra ruta autenticada).

**Archivos a crear:**
*   `src/middleware.ts` (nuevo): Lógica de protección de rutas.

**Nota para la IA:** La implementación real de la sesión con cookies (por ejemplo, usando `jose` para JWT) se haría en un paso posterior. El middleware inicial puede basarse en una suposición de la existencia de una cookie."
