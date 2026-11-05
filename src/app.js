const { loadEnvFile } = require("node:process");

// Cargar variables de entorno desde un archivo .env si no estamos en producción
if (process.env.NODE_ENV !== "production") {
  loadEnvFile(".env");
}

const express = require("express");
const authorsRouter = require("./routes/authors.routes");
const postsRouter = require("./routes/posts.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);


// (errores)
app.use(notFound);
app.use(errorHandler);

module.exports = app;