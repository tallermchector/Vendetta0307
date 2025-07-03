# Guía de Prompts para Analizar el Proyecto Legado

**Objetivo:** Utilizar los siguientes prompts con una IA (como Google IDX o Copilot) para extraer y documentar la lógica y estructura del proyecto anterior. Esto facilitará enormemente la migración al nuevo stack tecnológico.

**Instrucciones:** Copia y pega cada prompt en tu asistente de IA. Proporciona los archivos mencionados como contexto si la IA lo permite.

---

### **Prompt 1: Visión General del Proyecto**

"Analiza los archivos `public/anterior/configs/vendetta_plus_old.sql` y `public/anterior/configs/gameconfig.php`. Basándote en su contenido, por favor, responde a lo siguiente:
1.  **Nombre del Proyecto:** ¿Puedes inferir el nombre del juego o proyecto?
2.  **Stack Tecnológico:** ¿Qué tecnologías parecen haberse utilizado (lenguaje de programación, base de datos)?
3.  **Descripción General:** Describe el objetivo principal del juego y sus mecánicas fundamentales. ¿Qué hacen los jugadores? ¿Cuál es el propósito del juego según la estructura de la base de datos y la configuración?"

---

### **Prompt 2: Análisis Detallado de la Base de Datos**

"Por favor, realiza un análisis exhaustivo del archivo `public/anterior/configs/vendetta_plus_old.sql`. Quiero que me expliques la estructura de la base de datos. Para cada tabla encontrada:
1.  Describe su **propósito principal** dentro del juego (ej: `users` almacena datos de jugadores, `resources` sus recursos, etc.).
2.  Detalla las **columnas más importantes** y explica qué representa cada una (ej: en la tabla `buildings`, ¿qué significa la columna `level`?).
3.  Identifica las **claves primarias** y cualquier **clave foránea** o relación implícita que conecte las tablas entre sí. Proporciona la devolucion dentro de en public/anterior/ "

---

### **Prompt 3: Desglose de las Reglas del Juego y Configuración**

"Analiza el contenido del archivo `public/anterior/configs/gameconfig.php`. Quiero entender las reglas del juego que están codificadas en este archivo. Por favor, explica en detalle:
1.  El propósito de cada una de las **variables de configuración principales** (ej: `$game_config`, `$resource`, `$requeriments`, etc.).
2.  Cómo se definen los **costes de construcción/mejora** de los edificios o unidades.
3.  Cómo se calculan los **tiempos de construcción**.
4.  Cualquier otra regla fundamental del juego, como **factores de producción de recursos**, **capacidades de almacenamiento**, o **requisitos para desbloquear nuevas tecnologías**.Proporciona la devolucion dentro de en public/anterior/ "

---

### **Prompt 4: Análisis del Sistema de Idioma y Textos**

"Revisa el archivo `public/anterior/languages/vendetta/es.php`. Explícame cómo funciona el sistema de internacionalización (traducción de textos) en el proyecto anterior.
1.  ¿Qué **estructura de datos** se utiliza para almacenar los textos (ej: un array asociativo de PHP)?
2.  ¿Cómo crees que se **utilizaban estas claves** en el resto del código de la aplicación para mostrar los textos correctos en la interfaz de usuario? Proporciona un ejemplo teórico.Proporciona la devolucion dentro de en public/anterior/"

---

### **Prompt 5: Inferencia de Lógica de Backend**

"Combinando la información de `public/anterior/configs/vendetta_plus_old.sql` y `public/anterior/configs/gameconfig.php`, por favor, infiere y describe cómo crees que funcionaba la siguiente lógica en el lado del servidor:
1.  **Actualización de Recursos:** ¿Cómo se actualizaban los recursos de un jugador (ej: `metal`, `crystal`) a lo largo del tiempo? ¿Sugiere la estructura una tarea programada (cron job) o un cálculo dinámico cada vez que el usuario cargaba una página?
2.  **Proceso de Construcción:** Describe el flujo probable cuando un usuario decidía construir o mejorar un edificio. ¿Qué tablas se modificaban? ¿Cómo se gestionaba el tiempo de finalización?Proporciona la devolucion dentro de en public/anterior/"
