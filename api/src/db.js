const { Pool } = require("pg");
const { databaseUrl } = require("./config");

const pool = new Pool({ connectionString: databaseUrl });
pool.on("error", (e) => console.error("Erro no pool PostgreSQL:", e.message));

module.exports = { pool, query: (t, p) => pool.query(t, p) };
