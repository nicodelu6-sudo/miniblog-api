const { loadEnvFile } = require("node:process");
loadEnvFile(".env");

const pool = require("./pool");

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Conexión exitosa a PostgreSQL");
    console.log("Hora del servidor de base de datos:", result.rows[0].now);

    const authors = await pool.query("SELECT COUNT(*) AS total FROM authors");
    console.log("Authors en la base:", authors.rows[0].total);
  } catch (error) {
    console.error("Error conectando a PostgreSQL:", error.message);
  } finally {
    await pool.end(); // en un script se cierra; en la API nunca 
  }
}

testConnection();