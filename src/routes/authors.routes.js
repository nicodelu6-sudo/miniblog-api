const express = require("express");
const authorsService = require("../services/authors.service");

const router = express.Router();

// GET /authors → listar todos
router.get("/", async (req, res) => {
  const authors = await authorsService.getAll();
  res.status(200).json(authors);
});

// GET /authors/:id → detalle de uno
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }

  const author = await authorsService.getById(id);
  if (!author) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  res.status(200).json(author);
});

// POST /authors → crear uno
router.post("/", async (req, res) => {
  const { name, email, bio } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name y email son obligatorios" });
  }

  const existing = await authorsService.getByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "Ya existe un author con ese email" });
  }

  const newAuthor = await authorsService.create(name, email, bio || null);
  res.status(201).json(newAuthor);
});

// PUT /authors/:id → reemplazar los datos de uno
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }

  const { name, email, bio } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name y email son obligatorios" });
  }

  const author = await authorsService.getById(id);
  if (!author) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  const existing = await authorsService.getByEmail(email);
  if (existing && existing.id !== id) {
    return res.status(400).json({ error: "Ya existe un author con ese email" });
  }

  const updated = await authorsService.update(id, name, email, bio || null);
  res.status(200).json(updated);
});

// DELETE /authors/:id → borrar uno
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }

  const deleted = await authorsService.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: "Author no encontrado" });
  }

  res.status(204).send();
});

module.exports = router;