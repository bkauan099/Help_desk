// RF03 — gera protocolo MPD-AAAA-NNNNN (sequência por ano).
const db = require("../db");

async function gerarProtocolo(client = db) {
  const ano = new Date().getFullYear();
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS n FROM chamados WHERE EXTRACT(YEAR FROM criado_em) = $1", [ano]);
  const seq = (rows[0].n + 1).toString().padStart(5, "0");
  return `MPD-${ano}-${seq}`;
}

module.exports = { gerarProtocolo };
