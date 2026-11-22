// RF01 — login real (bcrypt + JWT). Usuário desativado não entra.
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { jwtSecret } = require("../config");
const { autenticar } = require("../mw/auth");
const { mapUsuario } = require("../util/map");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ erro: "Informe e-mail e senha." });
  const { rows } = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(senha, u.senha_hash)))
    return res.status(401).json({ erro: "Credenciais inválidas." });
  if (!u.ativo) return res.status(403).json({ erro: "Usuário desativado. Procure o administrador." });
  const token = jwt.sign({ id: u.id, perfil: u.perfil, nome: u.nome }, jwtSecret, { expiresIn: "12h" });
  res.json({ token, usuario: mapUsuario(u) });
});

router.get("/me", autenticar, async (req, res) => {
  const { rows } = await db.query("SELECT * FROM usuarios WHERE id = $1", [req.user.id]);
  if (!rows[0]) return res.status(404).json({ erro: "Usuário não encontrado." });
  res.json(mapUsuario(rows[0]));
});

module.exports = router;
