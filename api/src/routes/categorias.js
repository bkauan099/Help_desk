// RF13 — categorias de atendimento (leitura para todos; escrita só admin).
const express = require("express");
const db = require("../db");
const { autenticar, exigirPerfil } = require("../mw/auth");

const router = express.Router();
router.use(autenticar);

router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM categorias WHERE ativo = TRUE ORDER BY id");
  res.json(rows);
});

router.post("/", exigirPerfil("admin"), async (req, res) => {
  const { nome, critico, especialidade, icon } = req.body || {};
  if (!nome) return res.status(400).json({ erro: "Informe o nome da categoria." });
  const { rows } = await db.query(
    "INSERT INTO categorias (nome,critico,especialidade,icon) VALUES ($1,$2,$3,$4) RETURNING *",
    [nome, !!critico, especialidade || null, icon || "tag"]);
  res.status(201).json(rows[0]);
});

router.patch("/:id", exigirPerfil("admin"), async (req, res) => {
  const { nome, critico, especialidade, icon, ativo } = req.body || {};
  const { rows } = await db.query(
    `UPDATE categorias SET nome=COALESCE($2,nome), critico=COALESCE($3,critico),
       especialidade=COALESCE($4,especialidade), icon=COALESCE($5,icon), ativo=COALESCE($6,ativo)
     WHERE id=$1 RETURNING *`,
    [req.params.id, nome, critico, especialidade, icon, ativo]);
  if (!rows[0]) return res.status(404).json({ erro: "Categoria não encontrada." });
  res.json(rows[0]);
});

module.exports = router;
