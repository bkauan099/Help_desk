import { T } from "../theme.js";
import { catById } from "../data/categorias.js";

// Prioridade derivada da categoria + impacto clínico (RF03).
export const derivePrio = (cat, imp) =>
  imp ? (cat.critico ? "Crítica" : "Alta") : (cat.sla <= 4 ? "Média" : "Baixa");

export const fimRes = (t) => t.resolvidoEm || t.fechadoEm || null;

// Situação do SLA de um chamado (cor + rótulo para a interface).
export function slaInfo(t) {
  const cat = catById(t.catId);
  const dl = new Date(new Date(t.criadoEm).getTime() + cat.sla * 3600000);
  if (t.status === "Resolvido" || t.status === "Fechado") {
    const ok = new Date(fimRes(t) || t.criadoEm) <= dl;
    return { label: ok ? "SLA cumprido" : "SLA estourado", c: ok ? T.green : T.red, dl, closed: true, ok };
  }
  const left = (dl - Date.now()) / 3600000;
  if (left < 0) return { label: "SLA vencido", c: T.red, dl, left };
  if (left <= cat.sla * 0.25)
    return { label: `Vence em ${left < 1 ? Math.round(left * 60) + " min" : left.toFixed(1) + " h"}`, c: T.amber, dl, left };
  return { label: `No prazo · ${left < 1 ? Math.round(left * 60) + " min" : left.toFixed(1) + " h"}`, c: T.green, dl, left };
}
