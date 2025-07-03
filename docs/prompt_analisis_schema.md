**Tarea:** Analiza en profundidad el archivo `prisma/schema.prisma` para generar un informe completo y estructurado en formato Markdown.

**Archivo de entrada:** `prisma/schema.prisma`
**Archivo de salida a generar:** `docs/database_report.md`

**Contenido del Informe:**

Por cada `model` encontrado en el esquema, debes incluir la siguiente información:

1.  **Nombre y Propósito:**
    *   **Modelo:** `NombreDelModelo`
    *   **Propósito Inferido:** Describe en una frase la función principal de este modelo dentro de la lógica del juego.

2.  **Estructura de Campos:**
    *   Presenta una tabla en Markdown con las siguientes columnas para cada campo del modelo:
        *   `Campo`: El nombre del campo.
        *   `Tipo`: El tipo de dato (ej: `String`, `Int`, `DateTime`).
        *   `Atributos`: Lista todos los atributos aplicados (ej: `@id`, `@unique`, `@default`, `?` para opcional).
        *   `Descripción`: Infiere y explica brevemente qué valor almacena este campo.

3.  **Relaciones:**
    *   Debajo de la tabla de campos, añade una sección que describa las relaciones (`@relation`) del modelo.
    *   Para cada relación, especifica:
        *   **Tipo de Relación:** (ej: "Uno a Uno", "Uno a Muchos", "Muchos a Muchos").
        *   **Modelo Relacionado:** El nombre del otro modelo en la relación.
        *   **Campos de Clave:** Los campos `fields` y `references` que definen la relación.
