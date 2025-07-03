# Referencia para la Barra de Navegación (Sidebar)

**Objetivo:** Este documento describe la estructura y los componentes de la barra de navegación lateral (sidebar) que se mostrará en las secciones autenticadas de la aplicación, como el dashboard. La referencia visual es la imagen proporcionada del menú del juego.

**Componente Principal:** `src/components/layout/Sidebar.tsx`

---

### **Estructura General y Estilo**

*   **Fondo:** Oscuro, consistente con el tema general de la aplicación (`#222222`).
*   **Texto:** Color claro (`#CCCCCC`) para una buena legibilidad.
*   **Separadores:** Líneas horizontales de color rojo (`#8B0000`) que dividen las secciones del menú.
*   **Diseño:** Una sola columna vertical, fija en el lateral de la pantalla.

---

### **Elementos Clave a Implementar**

1.  **Cabecera del Menú:**
    *   Un título "MENU" con un fondo rojo distintivo que actúa como cabecera para la primera sección de navegación.

2.  **Grupos de Enlaces de Navegación:**
    *   La navegación está organizada en varios grupos semánticos, cada uno compuesto por enlaces de texto.
    *   **Grupo 1 (Principal):**
        *   Visión General
        *   Habitaciones
        *   Reclutamiento
        *   Seguridad
        *   Entrenamiento
        *   Edificios
        *   Buscar
    *   **Grupo 2 (Juego y Mundo):**
        *   Tecnologías
        *   Familia
        *   Recursos
        *   Mapa
        *   Misiones
        *   Simulador
        *   Lista de granjas
        *   Mensajes
        *   Estadísticas
        *   Clasificaciones
    *   **Grupo 3 (Comunidad y Configuración):**
        *   Chat
        *   Foro
        *   Reglas
        *   Opciones

3.  **Selector de Ubicación/Contexto:**
    *   Un componente interactivo (posiblemente un `Select` o un widget personalizado) ubicado entre los dos primeros grupos de enlaces.
    *   **Funcionalidad:** Permite al usuario cambiar de contexto (por ejemplo, entre diferentes ciudades o planetas que controle).
    *   **Controles:** Debe incluir flechas para navegar hacia arriba y hacia abajo en la lista de opciones.
    *   **Valor visible:** Muestra la selección actual (ej: "40:23:220").

4.  **Acción de Cierre de Sesión (Logout):**
    *   Un enlace o botón "Logout" claramente visible al final de la barra de navegación.
    *   **Funcionalidad:** Debe terminar la sesión del usuario y redirigirlo a la página de inicio de sesión (`/login`).

---

**Conexión con Prompts:**

*   La implementación de esta barra lateral se detalla en el **Prompt 3: Creación de un Layout Protegido para Rutas Autenticadas**.
*   Este documento de referencia debe usarse para guiar la construcción del componente `src/components/layout/Sidebar.tsx` y asegurar que el resultado final sea fiel al diseño de la imagen.
