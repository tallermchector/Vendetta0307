# Blueprint de Desarrollo Guiado por Prompts para "Vendetta 01"

**Rol de la IA:** Experto en Next.js, App Router, TypeScript, Prisma, TailwindCSS, Zod y Zustand.

**Objetivo General:** Construir una aplicación web robusta con un flujo de autenticación completo y un panel de control (dashboard) interactivo, siguiendo una arquitectura profesional y las mejores prácticas del stack tecnológico definido.

**Idioma del Proyecto:** Todas las interfaces de usuario, mensajes de error, confirmaciones y textos visibles para el usuario final deben ser implementados en español.

Este documento proporciona una secuencia de prompts detallados y granulares, diseñados para guiar a una IA de prototipado en la implementación paso a paso del proyecto.

---

### **Fase 1: Fundación y Estilo Visual**

#### **Prompt 1: Configuración del Tema y Estilos Globales**

"**Tarea:**
1.  Actualiza `src/app/globals.css` para que coincida con la paleta de colores definida:
    *   **Background:** Gris oscuro (`#222222`).
    *   **Primary:** Rojo oscuro (`#8B0000`).
    *   **Accent:** Gris claro (`#CCCCCC`).
    *   Convierte estos colores a formato HSL para las variables CSS de ShadCN.
2.  Asegúrate de que `src/app/layout.tsx` cargue las fuentes correctas desde Google Fonts: 'Space Grotesk' y 'Inter'.
3.  Modifica `tailwind.config.ts` para asignar 'Space Grotesk' a la clase `font-headline` y 'Inter' a `font-body`.

**Archivos a modificar:**
*   `src/app/globals.css`
*   `src/app/layout.tsx`
*   `tailwind.config.ts`"

---

### **Fase 2: Lógica de Autenticación (Backend)**

#### **Prompt 2: Refactorización de la Acción `loginUser`**

"**Tarea:** Modifica la acción `loginUser` en `src/actions/auth.ts`. En lugar de usar `redirect()`, la función debe devolver un objeto `{ success: true, user: { ... } }` si el login es exitoso. Si falla, debe devolver `{ error: "Mensaje de error" }`. Asegúrate de no devolver nunca el hash de la contraseña."

**Archivos a modificar:**
*   `src/actions/auth.ts`

---

#### **Prompt 3: Refactorización de la Acción `registerUser`**

"**Tarea:** Modifica la acción `registerUser` en `src/actions/auth.ts`. La función debe devolver `{ success: "Mensaje de confirmación" }` en caso de éxito, y `{ error: "Mensaje de error" }` si falla."

**Archivos a modificar:**
*   `src/actions/auth.ts`

---

#### **Prompt 4: Refactorización de la Acción `sendPasswordResetLink`**

"**Tarea:** Modifica la acción `sendPasswordResetLink` en `src/actions/auth.ts`. La función debe devolver `{ success: "Mensaje de confirmación" }` o `{ error: "Mensaje de error" }` según corresponda."

**Archivos a modificar:**
*   `src/actions/auth.ts`

---

### **Fase 3: Interfaz de Autenticación (Frontend)**

#### **Prompt 5: Conexión de `LoginForm` a la Acción del Servidor**

"**Tarea:** Actualiza `src/components/auth/LoginForm.tsx`. Al enviar el formulario, debe llamar a la acción `loginUser`. Si la respuesta es `{ success: true }`, usa el `useRouter` de `next/navigation` para redirigir al usuario a `/dashboard`. Si la respuesta es `{ error: "..." }`, muestra el mensaje de error usando un componente `Toast`."

**Archivos a modificar:**
*   `src/components/auth/LoginForm.tsx`

---

#### **Prompt 6: Conexión de `RegisterForm` a la Acción del Servidor**

"**Tarea:** Actualiza `src/components/auth/RegisterForm.tsx`. Al recibir una respuesta exitosa de `registerUser`, muestra un `Toast` de confirmación y redirige al usuario a `/login`. Muestra los errores de registro en un `Toast`."

**Archivos a modificar:**
*   `src/components/auth/RegisterForm.tsx`

---

#### **Prompt 7: Conexión de `ForgotPasswordForm` a la Acción del Servidor**

"**Tarea:** Implementa la lógica en `src/components/auth/ForgotPasswordForm.tsx` para llamar a `sendPasswordResetLink`. Muestra la confirmación o el error resultante en un `Toast`."

**Archivos a modificar:**
*   `src/components/auth/ForgotPasswordForm.tsx`

---

### **Fase 4: Sesión de Usuario y Rutas Protegidas**

#### **Prompt 8: Gestión de Cookies en `loginUser`**

"**Tarea:** Modifica la acción `loginUser` en `src/actions/auth.ts`. Tras un inicio de sesión exitoso, usa la librería `cookies` de `next/headers` para establecer una cookie de sesión segura (HTTP-only)."

**Archivos a modificar:**
*   `src/actions/auth.ts`

---

#### **Prompt 9: Creación de la Acción `logoutUser`**

"**Tarea:** Crea una nueva acción `logoutUser` en `src/actions/auth.ts`. Esta acción debe eliminar la cookie de sesión y luego redirigir al usuario a `/login`."

**Archivos a modificar:**
*   `src/actions/auth.ts`

---

#### **Prompt 10: Implementación de Middleware de Autenticación**

"**Tarea:** Crea un archivo `src/middleware.ts`. El middleware debe verificar la existencia de la cookie de sesión. Si la cookie no existe, debe redirigir cualquier petición a rutas dentro de `/dashboard` hacia `/login`. Configura el `matcher` del middleware para que se aplique a las rutas protegidas (ej: `'/dashboard/:path*'`)."

**Archivos a crear:**
*   `src/middleware.ts`

---

### **Fase 5: Construcción del Layout Autenticado y Dashboard**

#### **Prompt 11: Creación de la Estructura de Rutas Autenticadas**

"**Tarea:**
1.  Crea un `route group` llamado `(authenticated)` en `src/app`.
2.  Mueve la página del dashboard de `src/app/dashboard/page.tsx` a `src/app/(authenticated)/dashboard/page.tsx`.
3.  Elimina el directorio obsoleto `src/app/dashboard`."

**Archivos a modificar/crear:**
*   Crear el directorio `src/app/(authenticated)`.
*   Mover `src/app/dashboard/page.tsx` a `src/app/(authenticated)/dashboard/page.tsx`.
*   Eliminar el directorio `src/app/dashboard`.

---

#### **Prompt 12: Creación del Layout Protegido y sus Componentes**

"**Tarea:**
1.  Crea los componentes base `src/components/layout/Header.tsx` y `src/components/layout/Sidebar.tsx` como placeholders.
2.  Crea el archivo `src/app/(authenticated)/layout.tsx`. Este layout debe importar y renderizar `Header`, `Sidebar` y `children` para crear la estructura principal de la interfaz autenticada."

**Archivos a crear:**
*   `src/app/(authenticated)/layout.tsx`
*   `src/components/layout/Header.tsx`
*   `src/components/layout/Sidebar.tsx`

---

#### **Prompt 13: Implementación de la Barra Lateral (Sidebar)**

"**Tarea:**
1.  Implementa el diseño completo en `src/components/layout/Sidebar.tsx`, basándote en el archivo de referencia `docs/referencianav.md`.
2.  Usa componentes `Link` de Next.js para los elementos de navegación.
3.  Añade un botón 'Logout' que llame a la acción `logoutUser`.
4.  Divide las secciones de navegación con el componente `Separator`."

**Archivos a modificar:**
*   `src/components/layout/Sidebar.tsx`

---

#### **Prompt 14: Implementación de la Cabecera (Header) y el Dashboard**

"**Tarea:**
1.  Implementa la barra superior de recursos en `src/components/layout/Header.tsx`, basándote en `docs/referenciaGLOBAL.md` (usa valores estáticos).
2.  En `src/app/(authenticated)/dashboard/page.tsx`, construye la estructura principal descrita en `docs/referenciaGLOBAL.md`, incluyendo las secciones de información del jugador, iconos de acción y barras de contenido.
3.  Usa componentes de ShadCN (`Card`, `Avatar`, etc.) e iconos de `lucide-react` para la interfaz."

**Archivos a modificar:**
*   `src/components/layout/Header.tsx`
*   `src/app/(authenticated)/dashboard/page.tsx`
