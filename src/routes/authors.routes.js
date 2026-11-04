const express = require("express");
const { authors } = require("../db/memory");

const router = express.Router();

// Arranca en 4 porque ya hay 3 authors
let nextId = authors.length + 1;

// GET /authors → listar todos
router.get("/", (req, res) => {
  res.status(200).json(authors);
});

// GET /authors/:id → detalle de uno
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const author = authors.find((a) => a.id === id);
  if (!author) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  res.status(200).json(author);
});

// ← nuevo: POST /authors → crear uno
router.post("/", (req, res) => {
  const { name, email, bio } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "name y email son obligatorios" });
  }

  const emailExists = authors.some((a) => a.email === email);
  if (emailExists) {
    return res.status(400).json({ error: "Ya existe un author con ese email" });
  }

  const newAuthor = { id: nextId++, name, email, bio: bio || null };
  authors.push(newAuthor);

  res.status(201).json(newAuthor);
});

// PUT /authors/:id → reemplazar los datos de uno
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const { name, email, bio } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name y email son obligatorios" });
  }

  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  const emailTaken = authors.some((a) => a.email === email && a.id !== id);
  if (emailTaken) {
    return res.status(400).json({ error: "Ya existe un author con ese email" });
  }

  authors[index] = { id, name, email, bio: bio || null };
  res.status(200).json(authors[index]);
});

// DELETE /authors/:id → borrar uno
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número" });
  }

  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  authors.splice(index, 1);
  res.status(204).send();
});

module.exports = router;