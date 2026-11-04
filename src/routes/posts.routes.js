const express = require("express");
const postsService = require("../services/posts.service");
const authorsService = require("../services/authors.service");

const router = express.Router();

// GET /posts → listar todos
router.get("/", async (req, res) => {
  const posts = await postsService.getAll();
  res.status(200).json(posts);
});

// GET /posts/author/:authorId → posts de un author con sus datos (JOIN)
router.get("/author/:authorId", async (req, res) => {
  const authorId = Number(req.params.authorId);
  if (!Number.isInteger(authorId)) {
    return res.status(400).json({ error: "El authorId debe ser un número entero" });
  }

  const author = await authorsService.getById(authorId);
  if (!author) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  const posts = await postsService.getByAuthorId(authorId);
  res.status(200).json(posts);
});

// GET /posts/:id → detalle de uno
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }

  const post = await postsService.getById(id);
  if (!post) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  res.status(200).json(post);
});

// POST /posts → crear uno
router.post("/", async (req, res) => {
  const { title, content, author_id, published } = req.body || {};
  if (!title || !content || !author_id) {
    return res.status(400).json({ error: "title, content y author_id son obligatorios" });
  }

  const authorId = Number(author_id);
  if (!Number.isInteger(authorId)) {
    return res.status(400).json({ error: "El author_id debe ser un número entero" });
  }

  const author = await authorsService.getById(authorId);
  if (!author) {
    return res.status(400).json({ error: "El author_id no corresponde a ningún author" });
  }

  const newPost = await postsService.create(title, content, authorId, published === true);
  res.status(201).json(newPost);
});

// PUT /posts/:id → reemplazar los datos de uno
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }

  const { title, content, author_id, published } = req.body || {};
  if (!title || !content || !author_id) {
    return res.status(400).json({ error: "title, content y author_id son obligatorios" });
  }

  const authorId = Number(author_id);
  if (!Number.isInteger(authorId)) {
    return res.status(400).json({ error: "El author_id debe ser un número entero" });
  }

  const post = await postsService.getById(id);
  if (!post) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  const author = await authorsService.getById(authorId);
  if (!author) {
    return res.status(400).json({ error: "El author_id no corresponde a ningún author" });
  }

  const updated = await postsService.update(id, title, content, authorId, published === true);
  res.status(200).json(updated);
});

// DELETE /posts/:id → borrar uno
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }

  const deleted = await postsService.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  res.status(204).send();
});

module.exports = router;