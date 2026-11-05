# Registro de uso de IA

## Etapa 0  Entorno
- **Que pedi:** gua para instalar Postgres en Windows y armar el repo.
- **Que me devolvio:** pasos de instalacion, comandos de git y npm, estructura de carpetas.
- **Que use / cambie:** 

## Etapa 1 — Base de datos
- **que pedi:** ayuda para armar setup.sql y seed.sql, entender PK/FK/constraints y probar las tablas en psql.
- **que me devolvio:** los scripts (basados en la guia de Henry) explicados linea por linea, los comandos para correrlos y consultas de prueba, incluido el JOIN.
- **que use / cambie:** use los scripts de la guia; agregué DROP TABLE IF EXISTS para poder correr el setup varias veces y SET client_encoding = 'UTF8' porque las tildes se guardaban mal en Windows.

## Etapa 2 — Express con datos en memoria
- **que pedi:** guia para armar el servidor con Express y los 11 endpoints de authors y posts con datos en memoria, y para probarlos con Postman.
- **que me devolvio:** la separación app.js / server.js, los datos en memoria (src/db/memory.js), los routers de authors y posts explicados linea por linea con sus status codes, y una lista de pruebas por endpoint.
- **que use / cambie:** use el codigo propuesto. Use `node --watch` (L7) en vez de nodemon para no sumar dependencias. El DELETE responde 204 como pide la consigna (en L2 usaban 200). El PUT reemplaza el recurso completo, segun L2. Puse el post 5 con author_id 1 para que coincida con el seed.sql.

## Etapa 3 — Conexion a PostgreSQL
- **que pedi:** configurar la conexion de Express a PostgreSQL con Pool y variables de entorno.
- **que me devolvio:** src/db/pool.js con el Pool centralizado, la carga del .env con loadEnvFile, el .env y el .env.example, el PORT desde el entorno y un script para probar la conexion (basado en L5).
- **que use / cambie:** use DATABASE_URL (L7) en vez de DB_HOST, DB_PORT, etc. (L5), para que la configuracion sea la misma en local y en Railway. Cargo el .env en app.js en vez de server.js porque los tests van a importar app.js. Agregue al script de prueba un conteo de authors para confirmar que estoy en la base miniblog.

## Etapa 4 · De arrays a PostgreSQL (routes + services)

**Qué pedí:** que me guiara para reemplazar los datos en memoria por consultas a PostgreSQL, separando las rutas (HTTP) de la lógica de datos (services), con queries parametrizadas y async/await, manteniendo los mismos endpoints, status y mensajes de la etapa 2.

**Qué me devolvió:** los archivos `authors.service.js` y `posts.service.js` (funciones async con `pool.query`, `$1, $2…` y `RETURNING *`), los routers reescritos para usar los services, el JOIN de posts por author con `AS author_name` / `AS author_email`, y tablas de pruebas en Postman para cada endpoint, incluida la persistencia al reiniciar el server y el borrado en cascada.

**Que use o cambie:** use el codigo propuesto. Decidi validar los ids con `Number.isInteger` (antes `Number.isNaN`), para que valores como `abc` o `1.5` den 400 en vez de un error 500 de Postgres, y sume la misma validación para el `author_id` del body. Mantuve el PUT como reemplazo completo, sin el `COALESCE` de los apuntes de L5. Borre `memory.js`. En las pruebas me equivoqué de URL (`/author` en vez de `/authors`) y aprendi a distinguir el 404 HTML de Express (ruta inexistente) de los 404 JSON de mi API.

## Etapa 8 (adelantada) · Deploy en Railway

**Qué pedí:** Que Claude me guiara en el deploy en Railway siguiendo L7, de a un paso por vez y esperando mi confirmación en cada uno.

**Qué me devolvió:** Un plan de 8 pasos en el orden de L7 (base → variables → app): revisar el repo antes de subirlo (`git status`, `git ls-files`, script `start`), crear el proyecto en Railway, agregar el servicio Postgres, crear las tablas y cargar los datos con `psql` usando la URL pública, conectar el repo de GitHub, cargar `NODE_ENV=production` y `DATABASE_URL=${{Postgres.DATABASE_URL}}`, generar el dominio y probar con Postman, incluida la prueba de persistencia con Restart. También me ayudó a leer los logs y los errores que fueron saliendo.

**Qué usé o cambié:**
- Railway cambió la interfaz respecto de L7: la "Public Networking" de la base ahora se llama "Public access" (botón "Add Public Access"), y recién después de activarla aparece `DATABASE_PUBLIC_URL`. No usé la opción de conectarme con Railway CLI porque no está en los apuntes.
- Al copiar `DATABASE_PUBLIC_URL` copié la "receta" con `${{...}}` en vez de la URL real, y Git Bash tiró `bad substitution`. Lo resolví copiando la URL real y usando comillas simples: `psql '...' -f sql/setup.sql`.
- La primera prueba de persistencia dio 404 porque mi POST no había llegado a la base de Railway. La repetí revisando la URL y funcionó: el author siguió estando después del Restart.
- Después del Restart aparecen `npm error ... SIGTERM` en los logs: son del proceso viejo que Railway apaga, no un error de mi API.
- URL pública: https://miniblog-api-production-ac73.up.railway.app
- **Cambio de orden respecto de la guía:** la guía de Henry recomienda dejar el deploy para el final. Claude me sugirió adelantarlo y hacerlo apenas conecté la API a PostgreSQL (etapa 4), y lo acepté por tres motivos: 1) es el paso con más cosas que pueden fallar fuera de mi código (variables de entorno, base remota, build), y quería tener margen para resolverlas antes de la entrega; 2) en ese momento la API estaba completa y probada, así que si algo fallaba en Railway sabía que era un problema de configuración y no del código; 3) una vez conectado Railway con GitHub, cada push redeploya solo (L7), así que las etapas siguientes se fueron publicando a medida que las terminaba.