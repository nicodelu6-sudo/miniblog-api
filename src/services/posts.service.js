const pool = require("../db/pool");

// Todos los posts
async function getAll() {
  const result = await pool.query("SELECT * FROM posts ORDER BY id");
  return result.rows;
}

// Un post por id (undefined si no existe)
async function getById(id) {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return result.rows[0];
}

// Posts de un author, cada uno con el nombre y el email del author (JOIN)
async function getByAuthorId(authorId) {
  const result = await pool.query(
    `SELECT posts.*, authors.name AS author_name, authors.email AS author_email
     FROM posts
     JOIN authors ON posts.author_id = authors.id
     WHERE posts.author_id = $1
     ORDER BY posts.id`,
    [authorId]
  );
  return result.rows;
}

// Crear: devuelve la fila creada, con su id y created_at
async function create(title, content, authorId, published) {
  const result = await pool.query(
    "INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, content, authorId, published]
  );
  return result.rows[0];
}

// Reemplazar todos los campos (PUT completo)
async function update(id, title, content, authorId, published) {
  const result = await pool.query(
    "UPDATE posts SET title = $1, content = $2, author_id = $3, published = $4 WHERE id = $5 RETURNING *",
    [title, content, authorId, published, id]
  );
  return result.rows[0];
}

// Borrar: true si borró algo, false si no existía
async function remove(id) {
  const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
  return result.rowCount > 0;
}

module.exports = { getAll, getById, getByAuthorId, create, update, remove };