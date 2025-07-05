# Informe de la Base de Datos - Vendetta 01

Este documento es un análisis autogenerado del esquema de Prisma (`prisma/schema.prisma`) y detalla la estructura de la base de datos, los modelos, sus campos y las relaciones entre ellos.

---

### **Modelo: `User`**
*   **Propósito Inferido:** Almacena la información esencial de la cuenta de un usuario, utilizada para la autenticación, identificación y como punto central de las relaciones con otros datos del jugador.

**Estructura de Campos:**

| Campo            | Tipo       | Atributos                       | Descripción                                                  |
| ---------------- | ---------- | ------------------------------- | ------------------------------------------------------------ |
| `id_usuario`     | `Int`      | `@id`, `@default(autoincrement())` | Identificador único y numérico para cada usuario.            |
| `usuario`        | `String`   | `@unique`                       | Nombre de usuario único para el juego.                       |
| `email`          | `String`   | `@unique`                       | Correo electrónico único del usuario para login y notificaciones. |
| `pass`           | `String`   |                                 | Contraseña hasheada del usuario.                             |
| `idioma`         | `String`   |                                 | Idioma de preferencia del usuario (ej: 'es', 'en').          |
| `fecha_registro` | `DateTime` | `@default(now())`               | Fecha y hora de registro del usuario.                        |
| `id_familia`     | `Int`      | `?`                             | Clave foránea opcional que enlaza al usuario con una `Family`. |
| `familia`        | `Family`   | `?`, `@relation(...)`           | Relación con el modelo `Family`.                             |
| `perfil`         | `PlayerProfile` | `?`                          | Relación con el perfil de estadísticas del jugador.          |
| `recursos`       | `PlayerResources` | `?`                        | Relación con los recursos del jugador.                       |
| `propiedades`    | `Propiedad[]` |                                 | Lista de propiedades que pertenecen al usuario.              |

**Relaciones:**
*   **Relación con `Family`:**
    *   **Tipo:** Muchos a Uno.
    *   **Modelo Relacionado:** `Family`.
    *   **Campos de Clave:** `fields: [id_familia]`, `references: [id_familia]`.
*   **Relación con `PlayerProfile`:**
    *   **Tipo:** Uno a Uno.
    *   **Modelo Relacionado:** `PlayerProfile`.
*   **Relación con `PlayerResources`:**
    *   **Tipo:** Uno a Uno.
    *   **Modelo Relacionado:** `PlayerResources`.
*   **Relación con `Propiedad`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `Propiedad`.

---

### **Modelo: `Family`**
*   **Propósito Inferido:** Representa los clanes o familias a los que pueden pertenecer los jugadores, agrupándolos bajo un nombre y tag común.

**Estructura de Campos:**

| Campo         | Tipo     | Atributos                       | Descripción                                                |
| ------------- | -------- | ------------------------------- | ---------------------------------------------------------- |
| `id_familia`  | `Int`    | `@id`, `@default(autoincrement())` | Identificador único para cada familia.                     |
| `nombre`      | `String` | `@unique`                       | Nombre único de la familia.                                |
| `tag`         | `String` | `@unique`                       | Abreviatura o "tag" único de la familia (ej: [VNDTA]).     |
| `emblema_url` | `String` | `?`                             | URL opcional a la imagen del emblema de la familia.        |
| `miembros`    | `User[]` |                                 | Lista de todos los usuarios que son miembros de esta familia. |

**Relaciones:**
*   **Relación con `User`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `User`.

---

### **Modelo: `PlayerProfile`**
*   **Propósito Inferido:** Almacena estadísticas de rendimiento, progreso y clasificación del jugador. Es la tabla central para el estado del jugador.

**Estructura de Campos:**

| Campo                  | Tipo   | Atributos                       | Descripción                                            |
| ---------------------- | ------ | ------------------------------- | ------------------------------------------------------ |
| `id_perfil`            | `Int`  | `@id`, `@default(autoincrement())` | Identificador único del perfil.                        |
| `id_usuario`           | `Int`  | `@unique`                       | Clave foránea que enlaza con un `User` de forma única. |
| `usuario`              | `User` | `@relation(...)`                | Relación con el modelo `User`.                         |
| `puntos_edificios`     | `BigInt` |                                 | Puntos acumulados por la construcción de edificios.    |
| `puntos_tropas`        | `BigInt` |                                 | Puntos acumulados por el número de tropas.             |
| `puntos_entrenamiento` | `BigInt` |                                 | Puntos acumulados por los entrenamientos completados.  |
| `ranking_global`       | `Int`  |                                 | Posición del jugador en la clasificación global.       |
| `lealtad`              | `Int`  |                                 | Nivel de lealtad del jugador (en porcentaje).          |
| `trainings`            | `PlayerTraining[]` |                    | Progreso de los entrenamientos del jugador.            |
| `recruitments`         | `PlayerRecruitment[]` |                 | Unidades reclutadas por el jugador.                    |
| `securities`           | `PlayerSecurity[]` |                      | Defensas de seguridad del jugador.                     |

**Relaciones:**
*   **Relación con `User`:**
    *   **Tipo:** Uno a Uno.
    *   **Modelo Relacionado:** `User`.
    *   **Campos de Clave:** `fields: [id_usuario]`, `references: [id_usuario]`, `onDelete: Cascade`.
*   **Relación con `PlayerTraining`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `PlayerTraining`.
*   **Relación con `PlayerRecruitment`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `PlayerRecruitment`.
*   **Relación con `PlayerSecurity`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `PlayerSecurity`.

---

### **Modelo: `PlayerResources`**
*   **Propósito Inferido:** Gestiona las cantidades de los diferentes tipos de recursos (armas, munición, etc.) que posee un jugador.

**Estructura de Campos:**

| Campo                | Tipo     | Atributos                       | Descripción                                           |
| -------------------- | -------- | ------------------------------- | ----------------------------------------------------- |
| `id_recursos`        | `Int`    | `@id`, `@default(autoincrement())` | Identificador único del registro de recursos.         |
| `id_usuario`         | `Int`    | `@unique`                       | Clave foránea que enlaza con un `User` de forma única.|
| `usuario`            | `User`   | `@relation(...)`                | Relación con el modelo `User`.                        |
| `armas`              | `BigInt` |                                 | Cantidad del recurso "Armas".                         |
| `municion`           | `BigInt` |                                 | Cantidad del recurso "Munición".                      |
| `alcohol`            | `BigInt` |                                 | Cantidad del recurso "Alcohol".                       |
| `dolares`            | `BigInt` |                                 | Cantidad del recurso "Dólares".                       |
| `ultima_actualizacion`| `DateTime` | `@updatedAt`                  | Fecha y hora de la última modificación del registro.  |

**Relaciones:**
*   **Relación con `User`:**
    *   **Tipo:** Uno a Uno.
    *   **Modelo Relacionado:** `User`.
    *   **Campos de Clave:** `fields: [id_usuario]`, `references: [id_usuario]`, `onDelete: Cascade`.

---

### **Modelo: `Propiedad`**
*   **Propósito Inferido:** Representa una propiedad, base o territorio controlado por un jugador. Almacena directamente los niveles de cada edificio construido en ella.

**Estructura de Campos:**

| Campo        | Tipo     | Atributos                       | Descripción                                           |
| ------------ | -------- | ------------------------------- | ----------------------------------------------------- |
| `id_propiedad`| `Int`    | `@id`, `@default(autoincrement())` | Identificador único de la propiedad.                  |
| `id_usuario` | `Int`    |                                 | Clave foránea que enlaza con el `User` propietario.   |
| `usuario`    | `User`   | `@relation(...)`                | Relación con el modelo `User`.                        |
| `nombre`     | `String` |                                 | Nombre de la propiedad.                               |
| `coord_x`    | `Int`    |                                 | Coordenada X de la propiedad en el mapa.              |
| `coord_y`    | `Int`    |                                 | Coordenada Y de la propiedad en el mapa.              |
| `coord_z`    | `Int`    |                                 | Coordenada Z de la propiedad en el mapa (ej: sector). |
| `oficina`    | `Int`    | `@default(0)`                   | Nivel del edificio "Oficina".                         |
| ...          | `Int`    | `@default(0)`                   | (Todos los demás campos de edificios)                 |

**Relaciones:**
*   **Relación con `User`:**
    *   **Tipo:** Muchos a Uno.
    *   **Modelo Relacionado:** `User`.
    *   **Campos de Clave:** `fields: [id_usuario]`, `references: [id_usuario]`, `onDelete: Cascade`.
*   **Atributo Único:** `@@unique([coord_x, coord_y, coord_z])` para evitar múltiples propiedades en las mismas coordenadas.

---

### **Catálogos (Building, Training, Recruitment, Security)**
*   **Propósito Inferido:** Estos modelos (`Building`, `Training`, etc.) actúan como catálogos de todos los tipos de elementos disponibles en el juego. Definen sus propiedades base como costos, tiempos y factores de incremento. Son datos estáticos.

**Estructura de Campos (Ejemplo con `Building`):**

| Campo         | Tipo   | Atributos | Descripción                                                    |
| ------------- | ------ | --------- | -------------------------------------------------------------- |
| `id_edificio` | `Int`  | `@id`     | Identificador único para el tipo de edificio.                  |
| `nombre`      | `String`|           | Nombre del edificio.                                           |
| ...           | ...    |           | (costos, factores, tiempos, descripción, imagen)             |

**Relaciones:**
*   Estos modelos de catálogo no tienen relaciones directas salientes. Son referenciados por las tablas de progreso del jugador.

---

### **Tablas de Progreso (PlayerTraining, PlayerRecruitment, PlayerSecurity)**
*   **Propósito Inferido:** Estas tablas actúan como tablas "pivote" o de unión, conectando a un jugador con los catálogos para registrar su progreso específico (nivel de entrenamiento, cantidad de unidades, etc.).

**Estructura de Campos (Ejemplo con `PlayerTraining`):**

| Campo               | Tipo     | Atributos                       | Descripción                                                  |
| ------------------- | -------- | ------------------------------- | ------------------------------------------------------------ |
| `id_player_training`| `Int`    | `@id @default(autoincrement())` | ID único del registro de progreso.                           |
| `id_perfil`         | `Int`    |                                 | Clave foránea que enlaza con `PlayerProfile`.                 |
| `id_training`       | `Int`    |                                 | Clave foránea que enlaza con `Training`.                      |
| `perfil`            | `PlayerProfile`| `@relation(...)`         | Relación con el perfil del jugador.                          |
| `training`          | `Training`| `@relation(...)`               | Relación con el catálogo de entrenamientos.                  |
| `level`             | `Int`    | `@default(0)`                   | Nivel actual del jugador para este entrenamiento.            |

**Relaciones y Atributos:**
*   Cada tabla de progreso tiene una relación "Muchos a Uno" con `PlayerProfile` y una con su catálogo correspondiente.
*   Se define una restricción única (`@@unique`) sobre los campos `id_perfil` y `id_training` para asegurar que un jugador solo pueda tener un registro por cada tipo de entrenamiento, unidad o defensa.
