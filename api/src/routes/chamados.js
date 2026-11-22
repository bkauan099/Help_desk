const express = require("express");
const db = require("../db");
const { autenticar, ehStaff } = require("../mw/auth");
const { upload } = require("../mw/upload");
const { derivarPrioridade, calcularPrazos, PESO } = require("../util/sla");
const { gerarProtocolo } = require("../util/protocolo");
const { mapChamado, mapInteracao, mapAnexo } = require("../util/map");

const router = express.Router();
router.use(autenticar);

const staffIds = async () => (await db.query(
  "SELECT id FROM usuarios WHERE perfil IN ('atendente','admin') AND ativo = TRUE")).rows.map((r) => r.id);

const carregar = async (id) => (await db.query("SELECT * FROM chamados WHERE id = $1", [id])).rows[0];

async function interacoesDe(id) {
  const { rows } = await db.query(
    `SELECT i.*, u.nome AS autor_nome, u.perfil AS autor_perfil
     FROM interacoes i LEFT JOIN usuarios u ON u.id = i.autor_id
     WHERE i.chamado_id = $1 ORDER BY i.criado_em ASC`, [id]);
  return rows.map(mapInteracao);
}
async function anexosDe(id) {
  const { rows } = await db.query("SELECT * FROM anexos WHERE chamado_id = $1 ORDER BY id", [id]);
  return rows.map(mapAnexo);
}
async function sys(id, msg) {
  await db.query("INSERT INTO interacoes (chamado_id,autor_id,tipo,mensagem) VALUES ($1,NULL,'sys',$2)", [id, msg]);
}
const emit = (req, payload, env) => req.app.locals.ws?.emitir(payload, env);

// ---------------- RF05: listar fila ordenada por prioridade e SLA ----------------
router.get("/", async (req, res) => {
  const cond = [], params = [];
  if (!ehStaff(req)) { params.push(req.user.id); cond.push(`solicitante_id = $${params.length}`); }
  if (req.query.status)     { params.push(req.query.status);     cond.push(`status = $${params.length}`); }
  if (req.query.prioridade) { params.push(req.query.prioridade); cond.push(`prioridade = $${params.length}`); }
  const where = cond.length ? `WHERE ${cond.join(" AND ")}` : "";
  const { rows } = await db.query(`SELECT * FROM chamados ${where}`, params);
  const lista = rows.map(mapChamado).sort((a, b) =>
    (PESO[a.prioridade] - PESO[b.prioridade]) ||
    (new Date(a.prazoResolucao || a.criadoEm) - new Date(b.prazoResolucao || b.criadoEm)));
  res.json(lista);
});

// ---------------- Detalhe ----------------
router.get("/:id", async (req, res) => {
  const ch = await carregar(req.params.id);
  if (!ch) return res.status(404).json({ erro: "Chamado não encontrado." });
  if (!ehStaff(req) && ch.solicitante_id !== req.user.id)
    return res.status(403).json({ erro: "Sem acesso a este chamado." });
  res.json({ ...mapChamado(ch), interacoes: await interacoesDe(ch.id), anexos: await anexosDe(ch.id) });
});

// ---------------- RF03 + RF04: abrir chamado com anexos, prioridade e SLA ----------------
router.post("/", upload.array("anexos", 3), async (req, res) => {
  const { titulo, descricao, categoria_id } = req.body || {};
  const impacto = req.body.impacto_clinico === "true" || req.body.impacto_clinico === true;
  if (!titulo || !descricao || !categoria_id)
    return res.status(400).json({ erro: "titulo, descricao e categoria_id são obrigatórios." });
  const cat = (await db.query("SELECT * FROM categorias WHERE id = $1", [categoria_id])).rows[0];
  if (!cat) return res.status(400).json({ erro: "Categoria inexistente." });

  const prioridade = derivarPrioridade(cat, impacto);
  const { prazoResposta, prazoResolucao } = await calcularPrazos(prioridade);
  const protocolo = await gerarProtocolo();
  const { rows } = await db.query(
    `INSERT INTO chamados (protocolo,titulo,descricao,categoria_id,prioridade,impacto_clinico,
        solicitante_id,prazo_resposta,prazo_resolucao)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [protocolo, titulo, descricao, categoria_id, prioridade, impacto, req.user.id, prazoResposta, prazoResolucao]);
  const ch = rows[0];
  await sys(ch.id, `Chamado aberto (${prioridade})`);

  for (const f of req.files || []) {
    await db.query(
      "INSERT INTO anexos (chamado_id,nome_arquivo,caminho,tipo_mime,tamanho) VALUES ($1,$2,$3,$4,$5)",
      [ch.id, f.originalname, f.filename, f.mimetype, f.size]);
  }
  emit(req, { tipo: "chamado_criado", chamado: mapChamado(ch) }, { solicitanteId: ch.solicitante_id, staffIds: await staffIds() });
  res.status(201).json({ ...mapChamado(ch), interacoes: await interacoesDe(ch.id), anexos: await anexosDe(ch.id) });
});

// ---------------- RF07: mensagem (chat) ----------------
router.post("/:id/mensagens", async (req, res) => {
  const { mensagem } = req.body || {};
  if (!mensagem || !mensagem.trim()) return res.status(400).json({ erro: "Mensagem vazia." });
  const ch = await carregar(req.params.id);
  if (!ch) return res.status(404).json({ erro: "Chamado não encontrado." });
  if (!ehStaff(req) && ch.solicitante_id !== req.user.id)
    return res.status(403).json({ erro: "Sem acesso a este chamado." });
  if (ch.status === "Fechado") return res.status(409).json({ erro: "Chamado encerrado." });

  const { rows } = await db.query(
    "INSERT INTO interacoes (chamado_id,autor_id,tipo,mensagem) VALUES ($1,$2,'msg',$3) RETURNING *", [ch.id, req.user.id, mensagem.trim()]);
  // marca 1ª resposta do suporte (RF05/RF04)
  if (ehStaff(req) && !ch.primeira_resposta_em)
    await db.query("UPDATE chamados SET primeira_resposta_em = now() WHERE id = $1", [ch.id]);
  await db.query("UPDATE chamados SET atualizado_em = now() WHERE id = $1", [ch.id]);

  const { rows: full } = await db.query(
    `SELECT i.*, u.nome AS autor_nome, u.perfil AS autor_perfil FROM interacoes i JOIN usuarios u ON u.id=i.autor_id WHERE i.id=$1`, [rows[0].id]);
  const interacao = mapInteracao(full[0]);
  emit(req, { tipo: "nova_mensagem", chamadoId: ch.id, interacao }, { solicitanteId: ch.solicitante_id, atendenteId: ch.atendente_id, staffIds: await staffIds() });
  res.status(201).json(interacao);
});

// ---------------- RF05: assumir ----------------
router.post("/:id/assumir", async (req, res) => {
  if (!ehStaff(req)) return res.status(403).json({ erro: "Apenas a equipe pode assumir chamados." });
  const ch = await carregar(req.params.id);
  if (!ch) return res.status(404).json({ erro: "Chamado não encontrado." });
  const status = ch.status === "Aberto" ? "Em atendimento" : ch.status;
  await db.query("UPDATE chamados SET atendente_id=$2, status=$3 WHERE id=$1", [ch.id, req.user.id, status]);
  await sys(ch.id, `Chamado assumido por ${req.user.nome}`);
  const at = await carregar(ch.id);
  emit(req, { tipo: "chamado_atualizado", chamado: mapChamado(at) }, { solicitanteId: ch.solicitante_id, atendenteId: req.user.id, staffIds: await staffIds() });
  res.json(mapChamado(at));
});

// ---------------- RF05: atribuir (manual ou automático por especialidade + carga) ----------------
router.post("/:id/atribuir", async (req, res) => {
  if (!ehStaff(req)) return res.status(403).json({ erro: "Apenas a equipe pode atribuir chamados." });
  const ch = await carregar(req.params.id);
  if (!ch) return res.status(404).json({ erro: "Chamado não encontrado." });
  let atendenteId = req.body && req.body.atendenteId;

  if (!atendenteId) { // automático: especialidade da categoria + menor carga
    const cat = (await db.query("SELECT especialidade FROM categorias WHERE id=$1", [ch.categoria_id])).rows[0];
    const { rows } = await db.query(
      `SELECT u.id,
              (SELECT COUNT(*) FROM chamados c WHERE c.atendente_id=u.id AND c.status IN ('Aberto','Em atendimento','Aguardando')) AS carga,
              (u.especialidade IS NOT DISTINCT FROM $1) AS casa
       FROM usuarios u WHERE u.perfil IN ('atendente','admin') AND u.ativo=TRUE
       ORDER BY casa DESC, carga ASC, u.id ASC LIMIT 1`, [cat ? cat.especialidade : null]);
    if (!rows[0]) return res.status(409).json({ erro: "Nenhum atendente disponível." });
    atendenteId = rows[0].id;
  }
  const nome = (await db.query("SELECT nome FROM usuarios WHERE id=$1", [atendenteId])).rows[0]?.nome || "atendente";
  const status = ch.status === "Aberto" ? "Em atendimento" : ch.status;
  await db.query("UPDATE chamados SET atendente_id=$2, status=$3 WHERE id=$1", [ch.id, atendenteId, status]);
  await sys(ch.id, `Chamado atribuído a ${nome}`);
  const at = await carregar(ch.id);
  emit(req, { tipo: "chamado_atualizado", chamado: mapChamado(at) }, { solicitanteId: ch.solicitante_id, atendenteId, staffIds: await staffIds() });
  res.json(mapChamado(at));
});

// ---------------- RF06: mudar status (só staff; solicitante -> 403) ----------------
const TRANSICOES = {
  "Aberto": ["Em atendimento"], "Em atendimento": ["Aguardando", "Resolvido"],
  "Aguardando": ["Em atendimento", "Resolvido"], "Resolvido": ["Fechado", "Em atendimento"], "Fechado": [],
};
router.patch("/:id/status", async (req, res) => {
  if (!ehStaff(req)) return res.status(403).json({ erro: "Apenas atendente/admin altera o status." });
  const { status } = req.body || {};
  const ch = await carregar(req.params.id);
  if (!ch) return res.status(404).json({ erro: "Chamado não encontrado." });
  if (!TRANSICOES[ch.status]?.includes(status))
    return res.status(409).json({ erro: `Transição inválida de "${ch.status}" para "${status}".` });
  const campos = ["status=$2"];
  if (status === "Resolvido") campos.push("resolvido_em=now()");
  if (status === "Fechado")   campos.push("fechado_em=now()");
  await db.query(`UPDATE chamados SET ${campos.join(",")} WHERE id=$1`, [ch.id, status]);
  await sys(ch.id, `Status alterado para ${status} por ${req.user.nome}`);
  const at = await carregar(ch.id);
  emit(req, { tipo: "chamado_atualizado", chamado: mapChamado(at) }, { solicitanteId: ch.solicitante_id, atendenteId: ch.atendente_id, staffIds: await staffIds() });
  res.json(mapChamado(at));
});

// ---------------- RF09: avaliação (solicitante dono) ----------------
router.post("/:id/avaliacao", async (req, res) => {
  const { nota, comentario } = req.body || {};
  const ch = await carregar(req.params.id);
  if (!ch) return res.status(404).json({ erro: "Chamado não encontrado." });
  if (ch.solicitante_id !== req.user.id) return res.status(403).json({ erro: "Somente o solicitante avalia." });
  if (!["Resolvido", "Fechado"].includes(ch.status)) return res.status(409).json({ erro: "Só avalia chamado resolvido/fechado." });
  if (!(nota >= 1 && nota <= 5)) return res.status(400).json({ erro: "Nota deve ser de 1 a 5." });
  await db.query("UPDATE chamados SET nota=$2, comentario_aval=$3, avaliado_em=now() WHERE id=$1", [ch.id, nota, comentario || null]);
  await sys(ch.id, `Atendimento avaliado com ${nota} estrela(s)`);
  res.status(201).json({ ok: true });
});

module.exports = router;
