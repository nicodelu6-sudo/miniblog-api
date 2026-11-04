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