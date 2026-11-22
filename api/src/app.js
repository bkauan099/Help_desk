const path = require("path");
const express = require("express");
const cors = require("cors");
const { corsOrigin, uploadDir } = require("./config");
const db = require("./db");

const app = express();
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// anexos servidos estaticamente (RF03)
app.use("/uploads", express.static(path.resolve(uploadDir)));

app.get("/api/health", async (req, res) => {
  try { await db.query("SELECT 1"); res.json({ ok: true }); }
  catch { res.status(503).json({ ok: false }); }
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/chamados", require("./routes/chamados"));
app.use("/api/kb", require("./routes/kb"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.use("/api", (req, res) => res.status(404).json({ erro: "Rota não encontrada." }));

// erros (inclui limite de upload do multer)
app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ erro: "Arquivo acima de 5 MB." });
  if (err && err.code === "LIMIT_FILE_COUNT") return res.status(413).json({ erro: "Máximo de 3 anexos." });
  if (err && /não permitido/.test(err.message || "")) return res.status(415).json({ erro: err.message });
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

module.exports = app;
