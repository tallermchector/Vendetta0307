# Blueprint de Prompts para Implementación de Base de Datos

Este documento detalla la secuencia de prompts para guiar a una IA en la creación e inicialización de la base de datos del proyecto "Vendetta 01" utilizando Prisma.

---

### **Prompt 1: Creación del Esquema de Prisma**

"**Tarea:**
1.  Crea un nuevo archivo `prisma/schema.prisma`.
2.  Define el `generator` para el cliente de Prisma y el `datasource` para una base de datos PostgreSQL, utilizando la variable de entorno `DATABASE_URL`.
3.  Basándote en el archivo `docs/database.md`, implementa todos los modelos de datos: `User`, `Family`, `PlayerProfile`, `PlayerResources`, `Propiedad`, `Building` y la tabla pivote `PropiedadEdificio`.
4.  Asegúrate de definir correctamente todas las relaciones (`@relation`), claves primarias (`@id`), campos únicos (`@unique`) y valores por defecto (`@default`).
5.  Añade un índice compuesto único para las coordenadas en la tabla `Propiedad`.

**Archivos a crear:**
*   `prisma/schema.prisma`"

---

### **Prompt 2: Creación del Seeder para Datos del Juego**

"**Tarea:**
1.  Crea un nuevo archivo de sembrado llamado `prisma/datos.ts`.
2.  Este script debe encargarse de poblar la tabla `Building` con datos estáticos iniciales.
3.  Define al menos 3-4 tipos de edificios con su nombre, descripción, costo base en formato JSON y factor de costo, como se describe en `docs/database.md`.
4.  El script debe usar `prisma.building.upsert` para evitar duplicados si se ejecuta varias veces.
5.  Añade mensajes de consola para indicar el inicio y fin del proceso de sembrado.

**Archivos a crear:**
*   `prisma/datos.ts`"

---

### **Prompt 3: Actualización de Scripts del Proyecto**

"**Tarea:**
1.  Modifica el archivo `package.json`.
2.  Añade un nuevo script en la sección `scripts` llamado `"db:seed:data"` que ejecute el nuevo archivo de sembrado con `bun prisma/datos.ts`.
3.  Crea un script de conveniencia llamado `"db:seed:all"` que ejecute tanto el sembrado de usuarios como el de datos del juego en secuencia (ej: `"bun run db:seed && bun run db:seed:data"`).

**Archivos a modificar:**
*   `package.json`"

---

### **Prompt 4: Ejecución y Verificación**

"**Tarea:** (Para ser ejecutado por el desarrollador)
1.  Ejecuta `bunx prisma migrate dev --name init` para crear una migración inicial a partir del nuevo `schema.prisma` y aplicarla a la base de datos.
2.  Ejecuta `bunx prisma generate` para actualizar el cliente de Prisma.
3.  Ejecuta los scripts de sembrado: `bun run db:seed:all`.
4.  Verifica que las tablas y los datos se hayan creado correctamente en la base de datos."

**Nota para la IA:** El Prompt 4 es una instrucción para el desarrollador, no para que lo ejecutes tú. Tu tarea es generar los archivos de los prompts 1, 2 y 3.
