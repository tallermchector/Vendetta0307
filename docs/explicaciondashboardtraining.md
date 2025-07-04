# Análisis del Módulo de Entrenamiento (/dashboard/training)

Este documento detalla el funcionamiento de la página de "Entrenamiento", que permite a los jugadores mejorar sus habilidades. La implementación sigue la arquitectura moderna de **React Server Components (RSC)**, similar al módulo de "Habitaciones", lo que garantiza un rendimiento y seguridad óptimos al ejecutar la lógica en el servidor.

---

### 1. Modelos de Datos Relevantes (`prisma/schema.prisma`)

Dos modelos son fundamentales para este módulo:

-   **`Training`**: Actúa como el **catálogo maestro** de todos los entrenamientos posibles en el juego. Almacena información estática como:
    *   `id_training`, `nombre`, `descripcion`, `imagen_url`: Identificadores y detalles del entrenamiento.
    *   `c_armas`, `c_municion`, `c_alcohol`, `c_dolares`: El **costo base** para el nivel 1.
    *   `fac_costo`, `fac_dura`: Los **factores de multiplicación** que determinan cómo aumentan el costo y la duración con cada nivel.

-   **`PlayerTraining`**: Es una tabla de unión que representa el **progreso específico de un jugador**. Vincula un `PlayerProfile` con un `Training` y almacena el `level` actual que el jugador ha alcanzado para esa habilidad.

---

### 2. Frontend (`/dashboard/training/page.tsx`)

La interfaz está diseñada para ser un centro de mando claro para las mejoras de habilidades.

#### **Diseño de la Interfaz**

-   **Componente de Servidor (RSC):** La página es una función `async`, lo que significa que todo su código, incluida la obtención y el procesamiento de datos, se ejecuta exclusivamente en el servidor. El cliente recibe una página HTML ya construida.
-   **Estructura Visual:** Utiliza un componente `<Table>` de ShadCN/UI para mostrar una lista detallada de todos los entrenamientos disponibles.
    *   **`TableRow`:** Cada fila corresponde a un entrenamiento del catálogo del juego.
    *   **Columnas:**
        *   **Icono y Nombre:** Muestra la imagen del entrenamiento, su nombre y el **nivel actual** del jugador para esa habilidad.
        *   **Descripción:** Explica los beneficios del entrenamiento.
        *   **Costo de Mejora:** Muestra el costo dinámicamente calculado (recursos y tiempo) para avanzar al **siguiente nivel**.
        *   **Acciones:** Un botón "Mejorar" para iniciar el proceso de mejora.

---

### 3. Lógica y Obtención de Datos (en el Servidor)

Toda la lógica compleja reside dentro del propio componente `page.tsx`, eliminando la necesidad de endpoints de API o manejo de estado del lado del cliente.

#### **Obtención y Combinación de Datos**

1.  **`protectPage()`:** La primera llamada es `await protectPage()`, que asegura que el usuario esté autenticado. Si no lo está, es redirigido a `/login`. Esta función también devuelve el objeto completo del usuario, incluyendo sus relaciones.
2.  **Obtención del Catálogo:** Se realiza una consulta a la base de datos para obtener todos los entrenamientos disponibles: `prisma.training.findMany()`.
3.  **Obtención del Progreso del Jugador:** Los niveles de entrenamiento del jugador se obtienen de la relación `user.perfil.trainings`. Para una búsqueda eficiente, estos datos se cargan en un `Map`.
4.  **Cálculos en el Servidor:** El componente itera sobre el **catálogo de entrenamientos**. Para cada uno:
    *   Busca el nivel actual del jugador en el `Map`.
    *   Aplica las fórmulas de costo y duración utilizando el nivel actual y los factores de multiplicación (`fac_costo`, `fac_dura`) para calcular los requisitos de la **siguiente mejora (Nivel + 1)**.

---

### 4. Flujo de Interacción (Mejora de Entrenamiento)

Cuando un usuario decide mejorar una habilidad, el flujo es el siguiente:

1.  **Acción del Usuario:** El usuario hace clic en el botón "Mejorar".
2.  **Llamada a Server Action:** Este clic invocaría una **Server Action** (por ejemplo, `improveTraining(trainingId)`). Las Server Actions son funciones que se ejecutan de forma segura en el servidor.
3.  **Lógica en el Backend (Server Action):**
    *   **Validación:** La acción verifica si el jugador tiene suficientes recursos (armas, munición, etc.) para pagar el costo de la mejora.
    *   **Actualización de DB:** Si la validación es exitosa, utiliza una transacción de Prisma para:
        *   Restar los recursos del modelo `PlayerResources` del jugador.
        *   Incrementar el `level` del entrenamiento correspondiente en la tabla `PlayerTraining`.
    *   **Gestión de Cola (Futuro):** En una implementación más avanzada, en lugar de una actualización instantánea, se podría añadir una entrada a una tabla de "cola de eventos" para gestionar el tiempo de mejora.
4.  **Respuesta al Cliente:** Tras la ejecución, la acción puede usar `revalidatePath('/dashboard/training')` para indicarle a Next.js que debe volver a renderizar la página con los datos actualizados, mostrando el nuevo nivel y los nuevos costos.

Este enfoque (RSC + Server Actions) mantiene toda la lógica de negocio sensible y el acceso a la base de datos en el servidor, proporcionando una experiencia de usuario rápida y segura.
