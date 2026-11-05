# MiniBlog API

API REST para gestionar **authors** y **posts** de un blog (CRUD completo). Cada post pertenece a un author (relación 1 a N).

Hecha con Node.js, Express y PostgreSQL. Desplegada en Railway.

Proyecto Integrador del Módulo 2 de Henry.

## URL pública

https://miniblog-api-production-ac73.up.railway.app

## Tecnologías

- Node.js + Express 5
- PostgreSQL, con `pg` (`Pool` y consultas parametrizadas)
- Vitest + supertest para los tests
- OpenAPI 3.1 para la documentación
- Railway para el deploy

## Endpoints

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/authors` | Lista todos los authors |
| GET | `/authors/:id` | Devuelve un author |
| POST | `/authors` | Crea un author (`name` y `email` obligatorios, email único) |
| PUT | `/authors/:id` | Actualiza un author |
| DELETE | `/authors/:id` | Borra un author (y sus posts) |
| GET | `/posts` | Lista todos los posts |
| GET | `/posts/:id` | Devuelve un post |
| GET | `/posts/author/:authorId` | Posts de un author, con el nombre y email del author |
| POST | `/posts` | Crea un post (`title`, `content` y `author_id` obligatorios) |
| PUT | `/posts/:id` | Actualiza un post |
| DELETE | `/posts/:id` | Borra un post |
| GET | `/health` | Chequeo de que la API está funcionando |

Códigos de respuesta: 200 (GET y PUT), 201 (POST), 204 (DELETE, sin body), 400 (datos inválidos, campos faltantes o email repetido), 404 (no existe) y 500 (error inesperado). Los errores responden en JSON: `{ "error": "mensaje" }`.

## Ejemplos

```bash
curl https://miniblog-api-production-ac73.up.railway.app/health
# {"status":"ok"}

curl https://miniblog-api-production-ac73.up.railway.app/authors
# lista de authors

curl https://miniblog-api-production-ac73.up.railway.app/author
# {"error":"Ruta no encontrada"}
```

## Correr el proyecto en local

**Requisitos:** Node.js (se usó la versión 24), PostgreSQL (se usó la 18) y Git.

1. Clonar el repo e instalar las dependencias:

```bash
git clone https://github.com/nicodelu6-sudo/miniblog-api.git
cd miniblog-api
npm install
```

2. Crear la base y cargar las tablas y los datos de ejemplo:

```bash
createdb -U postgres miniblog
psql -U postgres -d miniblog -f sql/setup.sql
psql -U postgres -d miniblog -f sql/seed.sql
```

`setup.sql` borra las tablas si ya existen y las vuelve a crear: correrlo de nuevo borra todos los datos.

3. Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

y completar usuario y contraseña de PostgreSQL:

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/miniblog
PORT=3000
```

4. Levantar el servidor:

```bash
npm run dev
```

La API queda en `http://localhost:3000` (probar con `http://localhost:3000/health`).

## Tests

```bash
npm test
```

Corre 8 tests con Vitest y supertest (`tests/api.test.js`) contra la base local: crear y obtener un author, author sin `name` (400), email repetido (400), crear un post, posts de un author con sus datos, borrar un author (204) y borrar un post inexistente (404).

Necesitan PostgreSQL prendido, la base creada (paso 2) y el `.env` (paso 3). No hace falta levantar el servidor. Los tests crean un author de prueba y lo borran al final.

## Documentación OpenAPI

La documentación de los endpoints está en [`openapi.yaml`](./openapi.yaml).

Para verla: abrir https://editor-next.swagger.io, borrar el contenido de la izquierda y pegar todo el contenido de `openapi.yaml`. A la derecha se ven los endpoints, con sus parámetros, bodies y respuestas.

También se puede importar en Postman (Import → elegir el archivo).

## Deploy en Railway

El proyecto de Railway tiene dos servicios: la base (`Postgres`) y la API (`miniblog-api`).

1. **Base de datos:** crear un servicio de PostgreSQL y activarle el acceso público. Desde la compu, crear las tablas y cargar los datos con la URL pública de la base (variable `DATABASE_PUBLIC_URL` del servicio `Postgres`):

```bash
psql 'URL_PUBLICA_DE_LA_BASE' -f sql/setup.sql
psql 'URL_PUBLICA_DE_LA_BASE' -f sql/seed.sql
```

2. **API:** crear un servicio desde este repo de GitHub (rama `main`). Cada `git push` a `main` vuelve a desplegar la API sola. Railway la arranca con `npm start`.

3. **Variables de entorno** del servicio de la API:

```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

`NODE_ENV=production` hace que la app no busque el archivo `.env` (en Railway no existe). `${{Postgres.DATABASE_URL}}` es una referencia: toma la URL interna del servicio `Postgres`. El `PORT` lo pone Railway solo.

4. **Dominio:** en Settings → Networking → Generate Domain, con el puerto que usa la app (8080). Ese dominio es la URL pública de la API.

**URL interna vs URL pública:**

- **URL interna** (`postgres.railway.internal`): la usa la API para hablar con la base. Solo funciona entre servicios del mismo proyecto de Railway.
- **URL pública de la base** (`...proxy.rlwy.net`): sirve para conectarse desde afuera de Railway, por ejemplo desde la compu con `psql`. Se usó para cargar las tablas.
- **URL pública de la API:** el dominio generado en el paso 4, el que se usa para hacerle pedidos.

## Estructura

```
sql/            setup.sql (tablas) y seed.sql (datos de ejemplo)
src/app.js      arma Express: middlewares, rutas y manejo de errores
src/server.js   levanta el servidor (app.listen)
src/db/         pool.js: conexión a PostgreSQL
src/routes/     rutas de authors y posts (HTTP y validaciones)
src/services/   consultas SQL
src/middlewares/  404 en JSON y middleware global de errores
tests/          tests con supertest
openapi.yaml    documentación de la API
```

## Uso de IA

Usé Claude (Anthropic) como tutor durante el proyecto. Me ayudó a entender los conceptos y el flujo de la API (cómo viaja un pedido desde la ruta hasta la base y vuelve) y me dio borradores de código, que revisé y probé antes de subirlos y en algunos casos cambié. Algunas decisiones que tomé en el camino:

- `node --watch` en vez de nodemon, para no sumar dependencias.
- Hacer el deploy en Railway apenas conecté la base, en vez de dejarlo para el final.
- Simplificar los tests: sin `describe` y un `expect` por test.

El registro completo por etapa (qué pedí, qué me devolvió y qué usé o cambié) está en [`AI_LOG.md`](./AI_LOG.md).
