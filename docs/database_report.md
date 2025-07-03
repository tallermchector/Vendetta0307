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
*   **Propósito Inferido:** Almacena estadísticas de rendimiento y clasificación del jugador, como puntos y ranking, para ser mostradas en el dashboard.

**Estructura de Campos:**

| Campo                  | Tipo   | Atributos                       | Descripción                                            |
| ---------------------- | ------ | ------------------------------- | ------------------------------------------------------ |
| `id_perfil`            | `Int`  | `@id`, `@default(autoincrement())` | Identificador único del perfil.                        |
| `id_usuario`           | `Int`  | `@unique`                       | Clave foránea que enlaza con un `User` de forma única. |
| `usuario`              | `User` | `@relation(...)`                | Relación con el modelo `User`.                         |
| `puntos_edificios`     | `Int`  |                                 | Puntos acumulados por la construcción de edificios.    |
| `puntos_tropas`        | `Int`  |                                 | Puntos acumulados por el número de tropas.             |
| `puntos_entrenamiento` | `Int`  |                                 | Puntos acumulados por los entrenamientos completados.  |
| `ranking_global`       | `Int`  |                                 | Posición del jugador en la clasificación global.       |
| `lealtad`              | `Int`  |                                 | Nivel de lealtad del jugador (en porcentaje).          |

**Relaciones:**
*   **Relación con `User`:**
    *   **Tipo:** Uno a Uno.
    *   **Modelo Relacionado:** `User`.
    *   **Campos de Clave:** `fields: [id_usuario]`, `references: [id_usuario]`.

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
    *   **Campos de Clave:** `fields: [id_usuario]`, `references: [id_usuario]`.

---

### **Modelo: `Propiedad`**
*   **Propósito Inferido:** Representa una propiedad, base o territorio controlado por un jugador en una ubicación específica del mapa del juego.

**Estructura de Campos:**

| Campo        | Tipo                | Atributos                       | Descripción                                             |
| ------------ | ------------------- | ------------------------------- | ------------------------------------------------------- |
| `id_propiedad`| `Int`               | `@id`, `@default(autoincrement())` | Identificador único de la propiedad.                    |
| `id_usuario` | `Int`               |                                 | Clave foránea que enlaza con el `User` propietario.     |
| `usuario`    | `User`              | `@relation(...)`                | Relación con el modelo `User`.                          |
| `nombre`     | `String`            |                                 | Nombre de la propiedad.                                 |
| `coord_x`    | `Int`               |                                 | Coordenada X de la propiedad en el mapa.                |
| `coord_y`    | `Int`               |                                 | Coordenada Y de la propiedad en el mapa.                |
| `coord_z`    | `Int`               |                                 | Coordenada Z de la propiedad en el mapa (ej: sector).   |
| `edificios`  | `PropiedadEdificio[]` |                                 | Lista de edificios construidos en esta propiedad.       |

**Relaciones:**
*   **Relación con `User`:**
    *   **Tipo:** Muchos a Uno.
    *   **Modelo Relacionado:** `User`.
    *   **Campos de Clave:** `fields: [id_usuario]`, `references: [id_usuario]`.
*   **Relación con `PropiedadEdificio`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `PropiedadEdificio`.

---

### **Modelo: `Building`**
*   **Propósito Inferido:** Actúa como un catálogo de todos los tipos de edificios disponibles para construir, definiendo sus propiedades base.

**Estructura de Campos:**

| Campo         | Tipo                | Atributos         | Descripción                                                    |
| ------------- | ------------------- | ----------------- | -------------------------------------------------------------- |
| `id_edificio` | `Int`               | `@id`             | Identificador único para el tipo de edificio (no autoincremental). |
| `nombre`      | `String`            |                   | Nombre del edificio (ej: "Cuartel").                           |
| `descripcion` | `String`            |                   | Descripción del propósito del edificio.                        |
| `costo_base`  | `Json`              |                   | Objeto JSON con el costo en recursos para construir el nivel 1. |
| `factor_costo`| `Float`             |                   | Multiplicador aplicado al costo por cada nivel adicional.      |
| `propiedades` | `PropiedadEdificio[]` |                   | Lista de las instancias de este edificio en varias propiedades. |

**Relaciones:**
*   **Relación con `PropiedadEdificio`:**
    *   **Tipo:** Uno a Muchos.
    *   **Modelo Relacionado:** `PropiedadEdificio`.

---

### **Modelo: `PropiedadEdificio`**
*   **Propósito Inferido:** Tabla pivote que conecta una `Propiedad` con un `Building`, almacenando el nivel específico de un tipo de edificio en una propiedad concreta.

**Estructura de Campos:**

| Campo         | Tipo      | Atributos                       | Descripción                                           |
| ------------- | --------- | ------------------------------- | ----------------------------------------------------- |
| `id`          | `Int`     | `@id`, `@default(autoincrement())` | ID único para la instancia del edificio en la propiedad. |
| `id_propiedad`| `Int`     |                                 | Clave foránea que enlaza con `Propiedad`.             |
| `id_edificio` | `Int`     |                                 | Clave foránea que enlaza con `Building`.              |
| `nivel`       | `Int`     |                                 | Nivel actual del edificio en esta propiedad.          |
| `propiedad`   | `Propiedad`| `@relation(...)`                | Relación con el modelo `Propiedad`.                   |
| `edificio`    | `Building`| `@relation(...)`                | Relación con el modelo `Building`.                    |

**Relaciones:**
*   **Relación con `Propiedad`:**
    *   **Tipo:** Muchos a Uno.
    *   **Modelo Relacionado:** `Propiedad`.
    *   **Campos de Clave:** `fields: [id_propiedad]`, `references: [id_propiedad]`.
*   **Relación con `Building`:**
    *   **Tipo:** Muchos a Uno.
    *   **Modelo Relacionado:** `Building`.
    *   **Campos de Clave:** `fields: [id_edificio]`, `references: [id_edificio]`.

---
