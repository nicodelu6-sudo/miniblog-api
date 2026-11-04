const express = require("express");
const { authors, posts } = require("../db/memory");

const router = express.Router();

let nextId = posts.length + 1;

// GET /posts → listar todos
router.get("/", (req, res) => {
  res.status(200).json(posts);
});

// GET /posts/author/:authorId → posts de un author con sus datos (el "JOIN")
router.get("/author/:authorId", (req, res) => {
  const authorId = Number(req.params.authorId);
  if (Number.isNaN(authorId)) {
    return res.status(400).json({ error: "El authorId debe ser un número" });
  }

  const author = authors.find((a) => a.id === authorId);
  if (!author) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  const authorPosts = posts
    .filter((p) => p.author_id === authorId)
    .map((p) => ({ ...p, author_name: author.name, author_email: author.email }));

  res.status(200).json(authorPosts);
});

// GET /posts/:id → detalle de uno
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  res.status(200).json(post);
});

// POST /posts → crear uno
router.post("/", (req, res) => {
  const { title, content, author_id, published } = req.body || {};

  if (!title || !content || !author_id) {
    return res.status(400).json({ error: "title, content y author_id son obligatorios" });
  }

  const authorExists = authors.some((a) => a.id === Number(author_id));
  if (!authorExists) {
    return res.status(400).json({ error: "El author_id no corresponde a ningún author" });
  }

  const newPost = {
    id: nextId++,
    title,
    content,
    author_id: Number(author_id),
    published: published === true,
  };
  posts.push(newPost);

  res.status(201).json(newPost);
});

// PUT /posts/:id → reemplazar los datos de uno
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const { title, content, author_id, published } = req.body || {};
  if (!title || !content || !author_id) {
    return res.status(400).json({ error: "title, content y author_id son obligatorios" });
  }

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  const authorExists = authors.some((a) => a.id === Number(author_id));
  if (!authorExists) {
    return res.status(400).json({ error: "El author_id no corresponde a ningún author" });
  }

  posts[index] = {
    id,
    title,
    content,
    author_id: Number(author_id),
    published: published === true,
  };
  res.status(200).json(posts[index]);
});

// DELETE /posts/:id → borrar uno
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Post no encontrado" });
  }

  posts.splice(index, 1);
  res.status(204).send();
});

module.exports = router;