// Cria o esquema (executa schema.sql).
const fs = require("fs");
const path = require("path");
const { pool } = require("../src/db");

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Esquema criado (6 tabelas).");
  await pool.end();
})().catch((e) => { console.error("Falha na migração:", e.message); process.exit(1); });
