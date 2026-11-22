// RF01 — autenticação por JWT e bloqueio de rotas por perfil (403).
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function autenticar(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ erro: "Token ausente." });
  try { req.user = jwt.verify(token, jwtSecret); next(); }
  catch { return res.status(401).json({ erro: "Token inválido ou expirado." }); }
}

// Bloqueia quem não tem o perfil exigido -> 403.
function exigirPerfil(...perfis) {
  return (req, res, next) => {
    if (!req.user || !perfis.includes(req.user.perfil))
      return res.status(403).json({ erro: "Acesso negado para este perfil." });
    next();
  };
}

const ehStaff = (req) => req.user && req.user.perfil !== "solicitante";

module.exports = { autenticar, exigirPerfil, ehStaff };
