const pool = require("../db/pool");

// Todos los authors
async function getAll() {
  const result = await pool.query("SELECT * FROM authors ORDER BY id");
  return result.rows;
}

// Un author por id (undefined si no existe)
async function getById(id) {
  const result = await pool.query("SELECT * FROM authors WHERE id = $1", [id]);
  return result.rows[0];
}

// Un author por email (undefined si no existe)
async function getByEmail(email) {
  const result = await pool.query("SELECT * FROM authors WHERE email = $1", [email]);
  return result.rows[0];
}

// Crear: devuelve la fila creada, con su id y created_at
async function create(name, email, bio) {
  const result = await pool.query(
    "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
    [name, email, bio]
  );
  return result.rows[0];
}

// Reemplazar todos los campos (PUT completo, sin COALESCE)
async function update(id, name, email, bio) {
  const result = await pool.query(
    "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
    [name, email, bio, id]
  );
  return result.rows[0];
}

// Borrar: true si borró algo, false si no existía
async function remove(id) {
  const result = await pool.query("DELETE FROM authors WHERE id = $1", [id]);
  return result.rowCount > 0;
}

module.exports = { getAll, getById, getByEmail, create, update, remove };