# Documento de Referencia Visual

Este documento sirve como guía para interpretar los archivos HTML de referencia ubicados en el directorio `public` y conectarlos con los prompts de implementación definidos en `docs/prompts.md`.

---

### **1. Referencia para `public/login/login.html`**

**Objetivo:** Este archivo proporciona una representación visual estática de la página de inicio de sesión. Sirve como maqueta para construir el componente `src/components/auth/LoginForm.tsx`.

**Elementos clave a implementar:**
*   **Contenedor Principal:** Un componente `Card` centrado en la página.
*   **Encabezado (`CardHeader`):**
    *   Título (`CardTitle`): "Bienvenido de nuevo".
    *   Descripción (`CardDescription`): "Introduce tus credenciales para acceder a tu cuenta."
*   **Formulario (`CardContent`):**
    *   **Campo de Email:** Un `Input` con un ícono de `Mail` de `lucide-react` a la izquierda.
    *   **Campo de Contraseña:** Un `Input` de tipo `password` con un ícono de `Lock` a la izquierda.
    *   **Enlace de "Olvidé mi contraseña":** Un `Link` de Next.js que dirige a `/forgot-password`.
*   **Botón de Envío:** Un `Button` para enviar el formulario con el texto "Iniciar sesión" y un ícono de `LogIn`.
*   **Pie de Página (`CardFooter`):**
    *   Un texto que invita al registro con un `Link` a la página `/register`.

**Conexión con Prompts:** La implementación de este diseño se detalla en los prompts relacionados con la autenticación, específicamente en la refactorización de `LoginForm.tsx` (Prompt 2).

---

### **2. Referencia para `public/principal/home.html`**

**Objetivo:** Este archivo es una maqueta visual del panel de control principal que los usuarios verán después de iniciar sesión. Guía la construcción de la página `src/app/(authenticated)/dashboard/page.tsx`.

**Elementos clave a implementar:**
*   **Layout General:** El diseño asume que está envuelto por el layout de rutas autenticadas (`(authenticated)/layout.tsx`), que incluye una cabecera y una barra lateral.
*   **Contenido Principal:**
    *   **Encabezado de la Página:** Un título principal, como "Dashboard" o "Panel Principal".
    *   **Cuadrícula de Estadísticas:** Un layout de `grid` (por ejemplo, `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) para mostrar tarjetas de información.
*   **Tarjeta de Estadística (Componente `StatsCard.tsx`):**
    *   Este será un componente reutilizable.
    *   **Estructura de la tarjeta:**
        *   Un `Card` como contenedor.
        *   `CardHeader`: Contiene el título de la estadística (ej: "Puntos de Edificios") y un ícono de `lucide-react` (ej: `Building`).
        *   `CardContent`: Muestra el valor numérico principal de la estadística.
        *   `CardFooter`: Opcionalmente, puede incluir una descripción o un pequeño gráfico de tendencia.

**Conexión con Prompts:** La construcción de esta interfaz se detalla en el **Prompt 4: Construcción del Dashboard Principal**, que incluye la creación de la página del dashboard y el componente reutilizable `StatsCard.tsx`.
