// RF12 — indicadores e relatórios de SLA.
const express = require("express");
const db = require("../db");
const { autenticar, ehStaff } = require("../mw/auth");

const router = express.Router();
router.use(autenticar);

function escopo(req, params) {
  if (ehStaff(req)) return "";
  params.push(req.user.id);
  return `WHERE solicitante_id = $${params.length}`;
}

router.get("/stats", async (req, res) => {
  const p = []; const w = escopo(req, p);
  const porStatus = (await db.query(`SELECT status, COUNT(*)::int total FROM chamados ${w} GROUP BY status`, p)).rows;
  const porPrioridade = (await db.query(`SELECT prioridade, COUNT(*)::int total FROM chamados ${w} GROUP BY prioridade`, p)).rows;
  const porCategoria = (await db.query(
    `SELECT cat.nome categoria, COUNT(*)::int total FROM chamados c JOIN categorias cat ON cat.id=c.categoria_id
     ${w ? w.replace("solicitante_id", "c.solicitante_id") : ""} GROUP BY cat.nome ORDER BY total DESC`, p)).rows;
  const totais = (await db.query(
    `SELECT COUNT(*)::int total,
       COUNT(*) FILTER (WHERE status IN ('Aberto','Em atendimento','Aguardando'))::int abertos,
       COUNT(*) FILTER (WHERE status IN ('Resolvido','Fechado'))::int resolvidos,
       COUNT(*) FILTER (WHERE status IN ('Aberto','Em atendimento','Aguardando') AND prazo_resolucao < now())::int sla_vencido
     FROM chamados ${w}`, p)).rows[0];
  const satisfacao = (await db.query(
    `SELECT ROUND(AVG(nota)::numeric,1) media, COUNT(nota)::int total FROM chamados ${w}`, p)).rows[0];
  res.json({ totais, porStatus, porPrioridade, porCategoria, satisfacao });
});

router.get("/relatorio-sla", async (req, res) => {
  if (!ehStaff(req)) return res.status(403).json({ erro: "Relatório disponível apenas para a equipe." });
  const sla = (await db.query(`
    SELECT COUNT(*)::int encerrados,
      COUNT(*) FILTER (WHERE COALESCE(resolvido_em,fechado_em) <= prazo_resolucao)::int no_prazo,
      ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(resolvido_em,fechado_em)-criado_em))/3600)::numeric,1) horas_medias
    FROM chamados WHERE status IN ('Resolvido','Fechado')`)).rows[0];
  const porDia = (await db.query(`
    SELECT to_char(d::date,'DD/MM') dia, COUNT(c.id)::int total
    FROM generate_series(current_date - interval '6 days', current_date, interval '1 day') d
    LEFT JOIN chamados c ON c.criado_em::date = d::date GROUP BY d ORDER BY d`)).rows;
  const cumprimento = sla.encerrados ? Math.round((sla.no_prazo / sla.encerrados) * 100) : null;
  res.json({ cumprimento, horasMedias: sla.horas_medias, encerrados: sla.encerrados, porDia });
});

module.exports = router;
