# Referencia para `public/login/login.html`

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
