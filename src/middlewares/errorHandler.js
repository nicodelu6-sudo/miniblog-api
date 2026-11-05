// Ruta inexistente
function notFound(req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

// Middleware global de errores 
function errorHandler(err, req, res, next) {
  // Body con JSON mal escrito 
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El body no es un JSON válido" });
  }

  // Red de seguridad: errores de la base de datos (PostgreSQL)
  if (err.code === "23505") {
    return res.status(400).json({ error: "Ya existe un author con ese email" });
  }
  if (err.code === "23503") {
    return res.status(400).json({ error: "El author_id no corresponde a ningún author" });
  }

  // Cualquier otro error no manejado
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = { notFound, errorHandler };