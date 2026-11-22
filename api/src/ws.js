// RF07 — chat em tempo real (WebSocket). Entrega a mensagem em ~tempo real
// para os envolvidos no chamado e para a equipe de suporte conectada.
const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./config");

const clientes = new Map(); // userId -> Set<socket>

function registrar(id, ws) { if (!clientes.has(id)) clientes.set(id, new Set()); clientes.get(id).add(ws); }
function remover(id, ws) { const s = clientes.get(id); if (s) { s.delete(ws); if (!s.size) clientes.delete(id); } }

function enviar(id, payload) {
  const s = clientes.get(id); if (!s) return;
  const data = JSON.stringify(payload);
  for (const ws of s) if (ws.readyState === ws.OPEN) ws.send(data);
}

// Propaga um evento aos envolvidos (+ equipe).
function notificar(payload, { solicitanteId, atendenteId, staffIds = [] } = {}) {
  const alvos = new Set([solicitanteId, atendenteId, ...staffIds].filter(Boolean));
  for (const id of alvos) enviar(id, payload);
}

function init(server, getStaffIds) {
  const wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    try { var user = jwt.verify(url.searchParams.get("token"), jwtSecret); }
    catch { ws.close(4001, "token inválido"); return; }
    registrar(user.id, ws);
    ws.send(JSON.stringify({ tipo: "conectado", userId: user.id }));
    ws.on("close", () => remover(user.id, ws));
    ws.on("error", () => remover(user.id, ws));
  });
  return {
    wss,
    async emitir(payload, envolvidos = {}) {
      let staffIds = envolvidos.staffIds;
      if (!staffIds && getStaffIds) staffIds = await getStaffIds();
      notificar(payload, { ...envolvidos, staffIds });
    },
  };
}

module.exports = { init };
