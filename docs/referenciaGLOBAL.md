# Referencia para la Vista Global (Dashboard)

**Objetivo:** Este documento describe la estructura y los componentes de la vista principal o "global" que los usuarios verán en su panel de control. La referencia visual es la imagen proporcionada del dashboard del juego.

**Componentes Principales:** `src/app/(authenticated)/dashboard/page.tsx` y `src/components/layout/Header.tsx`

---

### **Estructura General y Estilo**

*   **Fondo:** Oscuro, consistente con el tema general de la aplicación (`#222222`).
*   **Texto:** Color claro (`#CCCCCC`) para una buena legibilidad.
*   **Separadores y Acentos:** Líneas y fondos de color rojo (`#8B0000`) para delimitar secciones y resaltar información clave.
*   **Diseño:** Múltiples secciones apiladas verticalmente, cada una con su propio propósito y diseño.

---

### **Elementos Clave a Implementar**

1.  **Barra Superior de Recursos (`Header.tsx`):**
    *   Una barra horizontal fija en la parte superior del layout autenticado.
    *   **Elementos:** Muestra los recursos vitales del jugador.
        *   ARMAS
        *   MUNICION
        *   ALCOHOL (con icono)
        *   DOLARES (con icono)
        *   HORA (Servidor) con fecha y hora actual.
    *   Cada recurso tiene un valor numérico asociado.

2.  **Sección de Información del Jugador (`dashboard/page.tsx`):**
    *   Un área principal debajo de la barra de recursos.
    *   **Diseño de 3 columnas:**
        *   **Columna 1 (Jugador):** Muestra el nombre del jugador ("NOMBRE") y su avatar.
        *   **Columna 2 (Visión General - Edificio):** Muestra el contexto actual (ej. edificio, planeta) con coordenadas o identificador y una imagen representativa.
        *   **Columna 3 (Familia):** Muestra el nombre de la familia/clan del jugador y su emblema.

3.  **Iconos de Acción/Notificación (`dashboard/page.tsx`):**
    *   Una columna vertical de iconos a la derecha de la sección de información del jugador.
    *   **Iconos:**
        *   **Mensajes/Correo:** Icono de sobre con un contador de mensajes no leídos.
        *   **Informes:** Icono con un contador de informes (ej. espionaje, batalla).
        *   **Ataques:** Icono de espadas con un contador de ataques entrantes/salientes.
        *   **Movimientos:** Icono con un contador de movimientos de flotas/tropas.

4.  **Secciones de Contenido Principal (`dashboard/page.tsx`):**
    *   Una lista de secciones que resumen el estado actual del juego para el usuario.
    *   **Estructura:** Cada sección tiene un título, un contador y, a veces, un enlace o estado.
        *   **Misiones:** Muestra el número de misiones activas.
        *   **Construcción:** Muestra el número de edificios en construcción sobre el total. Incluye un enlace "Mostrar todo".
        *   **Reclutamiento:** Muestra las unidades en cola de reclutamiento. Incluye un enlace "Mostrar todo".
        *   **Seguridad:** Estado de la seguridad actual.
        *   **Entrenamiento:** Unidades en entrenamiento.

5.  **Barra Inferior de Estadísticas (`dashboard/page.tsx`):**
    *   Una barra horizontal en la parte inferior que muestra puntos y estadísticas clave.
    *   **Campos:**
        *   Puntos (Entrenamiento)
        *   Puntos (Edificios)
        *   Puntos (Tropas)
        *   (Otro tipo de puntos)
        *   Edificios (recuento total)
        *   Lealtad (en porcentaje)

---

**Conexión con Prompts:**

*   La implementación de la barra de recursos se realizará en el contexto del **Prompt 3**, al crear el `Header.tsx`.
*   La implementación del resto de la página (información del jugador, acciones, contenido y estadísticas) se detallará en el **Prompt 4**, al construir el `dashboard/page.tsx`.