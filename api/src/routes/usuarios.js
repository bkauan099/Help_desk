// RF02 — cadastrar, editar e desativar usuários (apenas admin para escrita).
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { autenticar, exigirPerfil } = require("../mw/auth");
const { mapUsuario } = require("../util/map");

const router = express.Router();
router.use(autenticar);

// Qualquer autenticado lê a lista (nomes/perfis) para exibição na interface.
router.get("/", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM usuarios ORDER BY nome");
  res.json(rows.map(mapUsuario));
});

// Criar usuário — recusa e-mail duplicado.
router.post("/", exigirPerfil("admin"), async (req, res) => {
  const { nome, email, senha, perfil, cargo, especialidade } = req.body || {};
  if (!nome || !email || !senha || !perfil)
    return res.status(400).json({ erro: "nome, email, senha e perfil são obrigatórios." });
  if (!["solicitante", "atendente", "admin"].includes(perfil))
    return res.status(400).json({ erro: "Perfil inválido." });
  try {
    const hash = await bcrypt.hash(senha, 10);
    const { rows } = await db.query(
      `INSERT INTO usuarios (nome,email,senha_hash,perfil,cargo,especialidade)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nome, email, hash, perfil, cargo || null, especialidade || null]);
    res.status(201).json(mapUsuario(rows[0]));
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ erro: "E-mail já cadastrado." });
    throw e;
  }
});

// Editar (nome, cargo, perfil, especialidade) e/ou trocar senha.
router.patch("/:id", exigirPerfil("admin"), async (req, res) => {
  const { nome, cargo, perfil, especialidade, senha } = req.body || {};
  const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;
  try {
    const { rows } = await db.query(
      `UPDATE usuarios SET
         nome=COALESCE($2,nome), cargo=COALESCE($3,cargo), perfil=COALESCE($4,perfil),
         especialidade=COALESCE($5,especialidade), senha_hash=COALESCE($6,senha_hash)
       WHERE id=$1 RETURNING *`,
      [req.params.id, nome, cargo, perfil, especialidade, senhaHash]);
    if (!rows[0]) return res.status(404).json({ erro: "Usuário não encontrado." });
    res.json(mapUsuario(rows[0]));
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ erro: "E-mail já cadastrado." });
    throw e;
  }
});

// Ativar/desativar (desativado não consegue logar — ver auth).
router.patch("/:id/ativo", exigirPerfil("admin"), async (req, res) => {
  const { ativo } = req.body || {};
  const { rows } = await db.query("UPDATE usuarios SET ativo=$2 WHERE id=$1 RETURNING *", [req.params.id, !!ativo]);
  if (!rows[0]) return res.status(404).json({ erro: "Usuário não encontrado." });
  res.json(mapUsuario(rows[0]));
});

module.exports = router;
