const express = require("express");
const authorsRouter = require("./routes/authors.routes");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/authors", authorsRouter);

module.exports = app;