# Guía para la Migración de tu Proyecto Anterior

**Objetivo:** Este documento está diseñado para recopilar toda la información necesaria sobre tu proyecto anterior y así poder adaptarlo de la manera más fiel y eficiente a la nueva arquitectura con Next.js, Prisma y TailwindCSS.

Por favor, completa cada sección con el mayor detalle posible. Cuanta más información proporciones, más precisa y rápida será la migración.

---

## 1. Visión General del Proyecto Anterior

*   **Nombre del Proyecto:**
*   **Stack Tecnológico (Lenguajes, Frameworks, etc.):** (Ej: PHP, CodeIgniter, MySQL, jQuery)
*   **Descripción General:** ¿Cuál era el objetivo principal del juego? ¿Cuáles eran sus mecánicas fundamentales?

---

## 2. Base de Datos

Esta es una de las partes más críticas.

*   **Esquema Completo:** Por favor, proporciona el `CREATE TABLE` de **todas** las tablas de tu base de datos anterior. Puedes obtenerlo con un `dump` de la estructura.

    ```sql
    -- Pega aquí el SQL completo del esquema de tu base de datos
    ```

*   **Descripción de Tablas Clave:** Si algunas tablas tienen una lógica especial o no es obvia, por favor, descríbela. (Ej: La tabla `eventos` se usa para registrar acciones pendientes de los usuarios).

---

## 3. Archivos de Configuración y Datos Iniciales

Cualquier archivo que defina constantes, reglas del juego o datos iniciales es fundamental.

*   **Contenido de `gameconfig.txt` (o similar):** Por favor, pega el contenido completo de cualquier archivo de configuración. Este archivo parece contener información vital como los costes y detalles de las habitaciones.

    ```text
    // Pega aquí el contenido completo de tus archivos de configuración
    ```

---

## 4. Lógica del Backend (Lado del Servidor)

Necesito entender cómo funcionaban las mecánicas del juego.

*   **Flujo de Autenticación:** ¿Cómo funcionaba el login y el registro? ¿Cómo se mantenía la sesión del usuario (cookies, sesiones de PHP, etc.)?
*   **Actualización de Recursos:** ¿Cómo se calculaba el incremento de recursos (armas, munición, etc.) por segundo/hora? ¿Era un `cron job` (tarea programada) o se calculaba al cargar la página?
*   **Construcción y Ampliación de Edificios:** ¿Cuál era la lógica para iniciar una construcción? ¿Cómo se calculaba el tiempo y el costo? Por favor, proporciona el snippet de código PHP/otro lenguaje que manejaba esto.
*   **Otras Mecánicas Clave (Ataques, Espionaje, etc.):** Describe el flujo de cualquier otra mecánica importante y, si es posible, adjunta los fragmentos de código relevantes.

    ```php
    // Ejemplo: Pega aquí snippets de código de la lógica clave
    function construirEdificio($usuario, $edificio) {
        // ... tu lógica anterior ...
    }
    ```

---

## 5. Interfaz de Usuario (Frontend)

*   **Páginas Principales:** Haz una lista de las páginas más importantes y qué se podía hacer en cada una. (Ej: `vision_general.php`, `edificios.php`, `mapa.php`).
*   **Interacción con el Servidor:** ¿Cómo se comunicaba el frontend con el backend? ¿Eran envíos de formularios que recargaban la página completa, o se usaba AJAX (Fetch/jQuery.ajax) para actualizaciones parciales?
*   **Capturas de Pantalla (Opcional pero muy útil):** Si tienes capturas de pantalla de la interfaz anterior, serían de gran ayuda para replicar la experiencia visual. Puedes describirlas aquí.

---

Una vez que tengas este documento completo, podré analizarlo y crear un plan de migración mucho más preciso para tu nuevo proyecto.
