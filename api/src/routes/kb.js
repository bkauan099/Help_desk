// RF10/RF11 — base de conhecimento persistida no banco.
// Atendentes/admin publicam artigos por categoria; qualquer usuário busca.
const express = require("express");
const db = require("../db");
const { autenticar, exigirPerfil } = require("../mw/auth");
const { mapArtigo } = require("../util/map");

const router = express.Router();
router.use(autenticar);

// RF10/RF11 — lista/busca por palavra-chave (título, conteúdo ou categoria).
router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const sql = `SELECT a.*, u.nome AS autor_nome
               FROM kb_artigos a LEFT JOIN usuarios u ON u.id = a.autor_id`;
  const { rows } = q
    ? await db.query(`${sql} WHERE a.titulo ILIKE $1 OR a.conteudo ILIKE $1 OR a.categoria ILIKE $1 ORDER BY a.criado_em DESC`, [`%${q}%`])
    : await db.query(`${sql} ORDER BY a.criado_em DESC`);
  res.json(rows.map(mapArtigo));
});

// RF10 — publicar artigo (apenas atendente/admin).
router.post("/", exigirPerfil("atendente", "admin"), async (req, res) => {
  const { categoria, titulo, conteudo } = req.body || {};
  if (!categoria || !titulo || !conteudo)
    return res.status(400).json({ erro: "categoria, titulo e conteudo são obrigatórios." });
  const { rows } = await db.query(
    "INSERT INTO kb_artigos (categoria,titulo,conteudo,autor_id) VALUES ($1,$2,$3,$4) RETURNING *",
    [categoria.trim(), titulo.trim(), conteudo.trim(), req.user.id]);
  const { rows: full } = await db.query(
    "SELECT a.*, u.nome AS autor_nome FROM kb_artigos a LEFT JOIN usuarios u ON u.id=a.autor_id WHERE a.id=$1", [rows[0].id]);
  res.status(201).json(mapArtigo(full[0]));
});

module.exports = router;
