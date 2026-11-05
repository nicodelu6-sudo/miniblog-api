# Registro de uso de IA

## Etapa 0  Entorno
- **Que pedi:** guia para instalar Postgres en Windows y armar el repo.
- **Que me devolvio:** pasos de instalacion, comandos de git y npm, estructura de carpetas.


## Etapa 1 — Base de datos
- **que pedi:** ayuda para armar setup.sql y seed.sql, entender constraints y probar las tablas en psql.
- **que me devolvio:** los scripts explicados linea por linea, los comandos para correrlos y consultas de prueba, incluido el JOIN.
- **que use / cambie:** use los scripts de la guia; agregué DROP TABLE IF EXISTS para poder correr el setup varias veces y SET client_encoding = 'UTF8' porque las tildes se guardaban mal en Windows.

## Etapa 2 — Express con datos en memoria
- **que pedi:** Un borrador para armar el servidor con Express y los 11 endpoints de authors y posts con datos en memoria, y para probarlos con Postman.
- **que me devolvio:** la separación app.js / server.js, los datos en memoria (src/db/memory.js), los routers de authors y posts explicados linea por linea con sus status codes, y una lista de pruebas por endpoint.
- **que use / cambie:** use el codigo propuesto. Use `node --watch` en vez de nodemon para no sumar dependencias. Puse el post 5 con author_id 1 para que coincida con el seed.sql.

## Etapa 3 — Conexion a PostgreSQL
- **que pedi:** configurar la conexion de Express a PostgreSQL con Pool y variables de entorno.
- **que me devolvio:** El Pool centralizado, la carga del .env con loadEnvFile, el .env y el .env.example, el PORT desde el entorno y un script para probar la conexion.
- **que use / cambie:** use DATABASE_URL en vez de DB_HOST o DB_PORT, para que la configuracion sea la misma en local y en Railway. Cargo el .env en app.js en vez de server.js porque los tests van a importar app.js. Agregue al script de prueba un conteo de authors para confirmar que estoy en la base miniblog.

## Etapa 4 · De arrays a PostgreSQL (routes + services)

**Qué pedí:** reemplazar los datos en memoria por consultas a PostgreSQL, separando las rutas (HTTP) de la lógica de datos, con queries parametrizadas y async/await, manteniendo los mismos endpoints, status y mensajes de la etapa 2.

**Qué me devolvió:** los archivos `authors.service.js` y `posts.service.js` (funciones async con `pool.query` y `RETURNING *`), los routers reescritos para usar los services, el JOIN de posts por author y tablas de pruebas en Postman para cada endpoint.

**Que use o cambie:** use el codigo propuesto. Decidi validar los ids con `Number.isInteger` (antes `Number.isNaN`), para que valores como `abc` o `1.5` den 400 en vez de un error 500 de Postgres, y sume la misma validación para el `author_id` del body. Borre `memory.js` porque ya no servia. En las pruebas me equivoqué de URL (`/author` en vez de `/authors`) y aprendi a distinguir el 404 HTML de Express (ruta inexistente) de los 404 JSON de mi API.

## Etapa 8 (adelantada) · Deploy en Railway

**Qué pedí:** Que Claude me guiara en el deploy en Railway paso a paso y esperando mi confirmación en cada uno.

**Qué me devolvió:** Un plan de 8 pasos en orden (base → variables → app): revisar el repo antes de subirlo (`git status`, `git ls-files`, script `start`), crear el proyecto en Railway, agregar el servicio Postgres, crear las tablas y cargar los datos con `psql` usando la URL pública, conectar el repo de GitHub, cargar `NODE_ENV=production` y `DATABASE_URL=${{Postgres.DATABASE_URL}}`, generar el dominio y probar con Postman, incluida la prueba de persistencia con Restart. También me ayudó a leer los logs y los errores que fueron saliendo.

**Qué usé o cambié:**

- **Cambio de orden respecto de la guía:** los apuntes recomendaban dejar el deploy para el final. Claude me sugirió adelantarlo y hacerlo apenas conecté la API a PostgreSQL (etapa 4), y lo acepté por tres motivos: 1) es el paso con más cosas que pueden fallar fuera de mi código (variables de entorno, base remota, build); 2) en ese momento la API estaba completa y probada, así que si algo fallaba en Railway sabía que era un problema de configuración y no del código; 3) una vez conectado Railway con GitHub, cada push redeploya solo, así que las etapas siguientes se fueron publicando a medida que las terminaba.

## Etapa 5 · Middleware global de errores

**Qué pedí:** Que la API conteste siempre en JSON y que sugiera alternativas de manejo de errores y las validaciones.

**Qué me devolvió:** Un plan de 4 pasos y el archivo `src/middlewares/errorHandler.js` con dos middlewares que van al final de `app.js`: `notFound`, que responde 404 en JSON para rutas que no existen (en vez de la página HTML de Express), y `errorHandler`, el middleware global de errores (4 parámetros), que responde 400 si el body es un JSON mal escrito, 400 si Postgres rechaza un email repetido (23505) o un author_id inexistente (23503) como red de seguridad, y 500 con un mensaje genérico para cualquier otro error, registrando el detalle con `console.error`. También me propuso un middleware `validateId` y validaciones extra del body.

**Qué usé o cambié:**
- Usé `errorHandler.js` tal cual y lo probé con una ruta inexistente, un JSON mal formado y un id fuera del rango de INTEGER (500 en JSON y el detalle en la terminal).
- No le mando al cliente `err.message` porque podría mostrar detalles internos de la base.
- El 404 de rutas usa el `app.use((req, res) => ...)` de L5 en vez del `app.all('*')` de L6, que no funciona en Express 5.

## Etapa 6 · Tests con Vitest y supertest

**Qué pedí:** Agregar tests automáticos de los endpoints con Vitest y supertest con al menos 6 tests, con casos de error, que corran con `npm test`.

**Qué me devolvió:** El comando de instalación, el cambio del script `test`, el archivo `vitest.config.mjs` y `tests/api.test.js` con 8 tests: crear y obtener un author, author sin name (400), email repetido (400), crear un post, posts de un author con los datos del author (JOIN), borrar el author (204) y borrar un post inexistente (404).

**Qué usé o cambié:**
- Usé `"test": "vitest run"` en vez de `"vitest"`, para que los tests corran una vez y terminen: con `vitest` solo, la terminal queda en modo watch.
- Le pedí a Claude que simplificara la primera versión: saqué los `describe` y dejé un `expect` por test (el status), más el dato clave en los dos GET.

## Etapa 7 · Documentación con OpenAPI

**Qué pedí:** Documentar la API con OpenAPI, como pide la consigna: un archivo que describa los 11 endpoints.

**Qué me devolvió:** El archivo `openapi.yaml` con los 11 endpoints (más `/health`), sus parámetros, bodies y respuestas (200, 201, 204, 400, 404), los modelos de datos (Author, Post, Error…) y los pasos para verlo en Swagger Editor.

**Qué usé o cambié:**
- Usé el archivo tal cual y lo revisé en Swagger Editor.
- Lo abrí en `editor-next.swagger.io` y no en `editor.swagger.io`, porque la versión vieja no lee OpenAPI 3.1.

