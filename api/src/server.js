const http = require("http");
const app = require("./app");
const db = require("./db");
const { init } = require("./ws");
const { port } = require("./config");

const server = http.createServer(app);
const staffIds = async () => (await db.query(
  "SELECT id FROM usuarios WHERE perfil IN ('atendente','admin') AND ativo = TRUE")).rows.map((r) => r.id);

app.locals.ws = init(server, staffIds);

server.listen(port, () => {
  console.log(`MP Desk API em http://localhost:${port}`);
  console.log(`WebSocket (chat) em ws://localhost:${port}/ws?token=SEU_TOKEN`);
});
