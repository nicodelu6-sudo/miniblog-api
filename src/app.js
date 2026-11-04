const { loadEnvFile } = require("node:process");

// En local lee el .env; en Railway las variables vienen del panel (L7)
if (process.env.NODE_ENV !== "production") {
  loadEnvFile(".env");
}

const express = require("express");
const authorsRouter = require("./routes/authors.routes");
const postsRouter = require("./routes/posts.routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

module.exports = app;