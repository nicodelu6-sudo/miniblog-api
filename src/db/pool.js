const { Pool } = require("pg");

// Un solo pool para toda la app. Lee la URL de la base desde el entorno.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;