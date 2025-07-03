# Esquema de Base de Datos para "Vendetta 01"

**Objetivo:** Este documento define la estructura de la base de datos que soportará las mecánicas del juego "Vendetta 01". El esquema está diseñado para ser implementado con Prisma ORM y PostgreSQL.

---

### **Tabla: `User`**

Almacena la información esencial de la cuenta de un usuario. Es el punto de entrada para la autenticación y la identificación del jugador.

| Nombre del Campo | Tipo de Dato       | Descripción y Relaciones                                       |
| ---------------- | ------------------ | -------------------------------------------------------------- |
| `id_usuario`     | `Int @id @default(autoincrement())` | Identificador único para cada usuario.                         |
| `usuario`        | `String @unique`   | Nombre de usuario único para el juego.                         |
| `email`          | `String @unique`   | Correo electrónico del usuario, usado para login y notificaciones. |
| `pass`           | `String`           | Contraseña hasheada del usuario.                               |
| `idioma`         | `String`           | Idioma de preferencia del usuario (ej: 'es', 'en').            |
| `fecha_registro` | `DateTime @default(now())` | Fecha y hora en que el usuario se registró.                    |
| `id_familia`     | `Int?`             | FK a `Family`. La familia/clan a la que pertenece el usuario.  |
| `familia`        | `Family? @relation(fields: [id_familia], references: [id_familia])` | Relación con la tabla `Family`.                                |
| `perfil`         | `PlayerProfile?`   | Relación uno a uno con el perfil del jugador.                  |
| `recursos`       | `PlayerResources?` | Relación uno a uno con los recursos del jugador.               |
| `propiedades`    | `Propiedad[]`      | Un jugador puede controlar múltiples propiedades.              |

---

### **Tabla: `Family`**

Representa a los clanes o familias dentro del juego.

| Nombre del Campo | Tipo de Dato       | Descripción y Relaciones                            |
| ---------------- | ------------------ | --------------------------------------------------- |
| `id_familia`     | `Int @id @default(autoincrement())` | Identificador único para cada familia.              |
| `nombre`         | `String @unique`   | Nombre único de la familia.                         |
| `tag`            | `String @unique`   | Abreviatura o "tag" de la familia (ej: [VNDTA]).    |
| `emblema_url`    | `String?`          | URL a la imagen del emblema de la familia.          |
| `miembros`       | `User[]`           | Una familia puede tener múltiples miembros.         |

---

### **Tabla: `PlayerProfile`**

Almacena las estadísticas y puntos del jugador que se muestran en el dashboard.

| Nombre del Campo        | Tipo de Dato | Descripción y Relaciones                               |
| ----------------------- | ------------ | ------------------------------------------------------ |
| `id_perfil`             | `Int @id @default(autoincrement())` | Identificador único del perfil.                        |
| `id_usuario`            | `Int @unique`| FK a `User`.                                           |
| `usuario`               | `User @relation(fields: [id_usuario], references: [id_usuario])` | Relación uno a uno con `User`.                         |
| `puntos_edificios`      | `Int`        | Puntos acumulados por construcción de edificios.       |
| `puntos_tropas`         | `Int`        | Puntos acumulados por tener tropas.                    |
| `puntos_entrenamiento`  | `Int`        | Puntos acumulados por entrenamientos.                  |
| `ranking_global`        | `Int`        | Posición del jugador en la clasificación global.       |
| `lealtad`               | `Int`        | Nivel de lealtad (en porcentaje).                      |

---

### **Tabla: `PlayerResources`**

Gestiona los recursos principales del jugador.

| Nombre del Campo | Tipo de Dato | Descripción y Relaciones                               |
| ---------------- | ------------ | ------------------------------------------------------ |
| `id_recursos`    | `Int @id @default(autoincrement())` | Identificador único.                                   |
| `id_usuario`     | `Int @unique`| FK a `User`.                                           |
| `usuario`        | `User @relation(fields: [id_usuario], references: [id_usuario])` | Relación uno a uno con `User`.                         |
| `armas`          | `BigInt`     | Cantidad de recurso "Armas".                           |
| `municion`       | `BigInt`     | Cantidad de recurso "Munición".                        |
| `alcohol`        | `BigInt`     | Cantidad de recurso "Alcohol".                         |
| `dolares`        | `BigInt`     | Cantidad de recurso "Dólares".                         |
| `ultima_actualizacion` | `DateTime @updatedAt` | Fecha y hora de la última actualización de recursos. |

---

### **Tabla: `Propiedad`**

Representa una propiedad (un territorio, base o complejo) controlada por un jugador.

| Nombre del Campo | Tipo de Dato       | Descripción y Relaciones                               |
| ---------------- | ------------------ | ------------------------------------------------------ |
| `id_propiedad`   | `Int @id @default(autoincrement())` | Identificador único de la propiedad.                   |
| `id_usuario`     | `Int`              | FK a `User`, el dueño de la propiedad.                     |
| `usuario`        | `User @relation(fields: [id_usuario], references: [id_usuario])` | Relación con el jugador propietario.                   |
| `nombre`         | `String`           | Nombre de la propiedad.                                    |
| `coord_x`        | `Int`              | Coordenada X en el mapa del juego.                     |
| `coord_y`        | `Int`              | Coordenada Y en el mapa del juego.                     |
| `coord_z`        | `Int`              | Coordenada Z en el mapa del juego.                     |
| `edificios`      | `PropiedadEdificio[]` | Edificios construidos en esta propiedad.                 |

_Nota: La combinación de `coord_x`, `coord_y`, `coord_z` debe ser única._

---

### **Tabla: `Building`**

Catálogo de todos los tipos de edificios disponibles en el juego.

| Nombre del Campo | Tipo de Dato | Descripción                                           |
| ---------------- | ------------ | ----------------------------------------------------- |
| `id_edificio`    | `Int @id`    | Identificador único para el tipo de edificio.         |
| `nombre`         | `String`     | Nombre del edificio (ej: "Cuartel", "Fábrica").       |
| `descripcion`    | `String`     | Descripción del propósito del edificio.               |
| `costo_base`     | `Json`       | Costo en recursos para construir el nivel 1.          |
| `factor_costo`   | `Float`      | Multiplicador de costo por cada nivel.                |

---

### **Tabla: `PropiedadEdificio` (Tabla Pivote)**

Representa una instancia de un edificio en una propiedad específica, con su nivel actual.

| Nombre del Campo | Tipo de Dato  | Descripción y Relaciones                             |
| ---------------- | ------------- | ---------------------------------------------------- |
| `id`             | `Int @id @default(autoincrement())` | ID único.                                          |
| `id_propiedad`   | `Int`         | FK a `Propiedad`.                                       |
| `id_edificio`    | `Int`         | FK a `Building`.                                     |
| `nivel`          | `Int`         | Nivel actual del edificio en esta propiedad.           |
| `propiedad`      | `Propiedad @relation(fields: [id_propiedad], references: [id_propiedad])` | Relación con `Propiedad`.                             |
| `edificio`       | `Building @relation(fields: [id_edificio], references: [id_edificio])` | Relación con `Building`.                           |
