# Explicación Detallada del Flujo de Autenticación en Vendetta 01

Este documento desglosa el proceso completo de inicio de sesión de un usuario en la aplicación, desde la interacción inicial con la página `/login` hasta la redirección exitosa al `/dashboard`.

---

### 1. Frontend (`/login/page.tsx` y `LoginForm.tsx`)

El viaje comienza en la interfaz de usuario, que está diseñada para ser segura y reactiva.

#### **Construcción del Formulario**

-   **Componente Principal:** La página `/login` renderiza el componente `src/components/auth/LoginForm.tsx`.
-   **Estructura Visual:** El formulario está construido con componentes de **ShadCN/UI** (`Card`, `Input`, `Button`) para una apariencia consistente y profesional.
-   **Manejo de Estado:** Se utiliza la librería **`react-hook-form`** para gestionar el estado del formulario (valores de los campos, validación y estado de envío) de manera eficiente en el lado del cliente.

#### **Captura de Credenciales**

1.  **Control del Envío:** Cuando el usuario hace clic en el botón "Iniciar sesión", la función `onSubmit` definida en `LoginForm.tsx` se ejecuta.
2.  **Prevención de Recarga:** El método `form.handleSubmit(onSubmit)` de `react-hook-form` envuelve el manejador. Esto previene el comportamiento por defecto del navegador de recargar la página completa.
3.  **Llamada a la Acción del Servidor:** En lugar de enviar una petición HTTP tradicional, el `onSubmit` invoca directamente la Server Action `loginUser`, pasándole los valores del formulario. Esta comunicación es un RPC (Remote Procedure Call) seguro y optimizado por Next.js.

---

### 2. Lógica de Backend (Server Action: `src/actions/auth.ts`)

La Server Action `loginUser` es el cerebro del proceso de autenticación. Se ejecuta exclusivamente en el servidor.

1.  **Recepción de Datos:** La acción recibe los `values` (email y contraseña) desde el formulario.
2.  **Validación con Zod:**
    -   Lo primero que hace es validar los datos de entrada contra el `loginSchema` definido con **Zod**.
    -   `loginSchema.safeParse(values)` intenta analizar los datos. Si el email no es válido o la contraseña está vacía, la validación falla y la acción devuelve un objeto `{ error: "..." }` al cliente, que lo mostrará como una notificación (`toast`).
3.  **Interacción con la Base de Datos (Prisma):**
    -   Si la validación es exitosa, la acción utiliza **Prisma** para buscar al usuario en la base de datos.
    -   `await prisma.user.findUnique({ where: { email } })` ejecuta una consulta SQL optimizada para encontrar un único usuario que coincida con el correo electrónico proporcionado.
    -   Si no se encuentra ningún usuario, devuelve un error.
4.  **Verificación Segura de Contraseña (bcrypt):**
    -   Si se encuentra un usuario, el siguiente paso es verificar la contraseña.
    -   `await bcrypt.compare(password, user.pass)` compara la contraseña introducida por el usuario con el hash seguro almacenado en la base de datos. **`bcrypt`** es una librería diseñada para ser lenta computacionalmente, lo que protege contra ataques de fuerza bruta. Es fundamental que **nunca se almacenen contraseñas en texto plano**.
    -   Si la comparación falla, se devuelve un error de contraseña incorrecta.

---

### 3. Gestión de la Sesión (`src/lib/session.ts`)

Si las credenciales son válidas, la acción `loginUser` procede a crear una sesión segura.

1.  **Llamada a `createSession`:** La acción `loginUser` invoca `await createSession({ userId: user.id_usuario })`, pasándole el ID del usuario validado.
2.  **Creación del JWT (jose):**
    -   Dentro de `createSession`, se utiliza la librería **`jose`** para crear un JSON Web Token (JWT).
    -   El `payload` del token contiene la información esencial y no sensible: `{ userId: ... }`.
    -   `new SignJWT(payload).sign(encodedKey)` firma el token usando un secreto (`SESSION_SECRET`) y el algoritmo `HS256`, garantizando su integridad.
3.  **Establecimiento de la Cookie:**
    -   La función `cookies().set('session', ...)` de `next/headers` establece la cookie en la respuesta del servidor.
    -   **Seguridad:** La cookie se configura como `httpOnly: true`. Esto es una medida de seguridad crucial que **impide que el JavaScript del lado del cliente pueda acceder a la cookie**. De esta forma, se protege la sesión contra ataques de Cross-Site Scripting (XSS).

---

### 4. Flujo de Datos y Redirección

El proceso completo, desde el clic hasta la nueva página, es el siguiente:

1.  **Cliente -> Servidor:** El usuario envía el formulario, lo que desencadena la llamada a la Server Action `loginUser`.
2.  **Servidor:** La acción valida los datos, consulta la base de datos con Prisma y verifica la contraseña con bcrypt.
3.  **Creación de Sesión:** Si todo es correcto, la acción llama a `createSession` para generar un JWT y establecer la cookie `HttpOnly` en la cabecera de la respuesta.
4.  **Redirección del Servidor:**
    -   Después de crear la sesión, la acción `loginUser` ejecuta `redirect('/dashboard')`.
    -   Esta función de Next.js **no devuelve una respuesta**, sino que lanza una excepción especial que el framework intercepta.
    -   Next.js detiene la ejecución de la acción y envía una respuesta HTTP `307 (Temporary Redirect)` al navegador, indicándole que debe navegar a `/dashboard`.
5.  **Navegación y Verificación:**
    -   El navegador del cliente recibe la respuesta de redirección y realiza una nueva petición GET a `/dashboard`.
    -   El `middleware.ts` intercepta esta nueva petición, lee la cookie de sesión que acaba de ser establecida, la valida y, al confirmar que el usuario está autenticado, permite el acceso a la ruta protegida.
    -   Finalmente, la página del dashboard se renderiza para el usuario.
