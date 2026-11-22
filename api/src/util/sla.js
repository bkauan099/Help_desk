// RF04 — cálculo automático de prioridade e prazos de SLA.
const db = require("../db");

// Prioridade a partir da categoria (crítica) + impacto clínico informado.
// Ex.: "consulta em andamento" (impacto) em categoria crítica => Crítica.
function derivarPrioridade(categoria, impactoClinico) {
  if (impactoClinico) return categoria.critico ? "Crítica" : "Alta";
  return categoria.critico ? "Média" : "Baixa";
}

// Busca a regra de SLA da prioridade e devolve os prazos a partir de `base`.
async function calcularPrazos(prioridade, base = new Date()) {
  const { rows } = await db.query("SELECT * FROM regras_sla WHERE prioridade = $1", [prioridade]);
  const r = rows[0] || { primeira_resposta_min: 240, resolucao_horas: 24 };
  return {
    prazoResposta: new Date(base.getTime() + r.primeira_resposta_min * 60000),
    prazoResolucao: new Date(base.getTime() + r.resolucao_horas * 3600000),
  };
}

// Situação do SLA de resolução (para a lista e o painel).
function situacaoSla(ch) {
  const encerrado = ch.status === "Resolvido" || ch.status === "Fechado";
  const prazo = ch.prazo_resolucao ? new Date(ch.prazo_resolucao) : null;
  if (!prazo) return { estado: "sem_prazo" };
  if (encerrado) {
    const ref = new Date(ch.resolvido_em || ch.fechado_em || ch.criado_em);
    return { estado: ref <= prazo ? "cumprido" : "estourado", prazo };
  }
  const horas = (prazo - Date.now()) / 3600000;
  if (horas < 0) return { estado: "vencido", prazo, horas };
  if (horas <= 1) return { estado: "em_risco", prazo, horas };
  return { estado: "no_prazo", prazo, horas };
}

// Peso para ordenar a fila por prioridade (RF05).
const PESO = { "Crítica": 0, "Alta": 1, "Média": 2, "Baixa": 3 };

module.exports = { derivarPrioridade, calcularPrazos, situacaoSla, PESO };
