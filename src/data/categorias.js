import { T } from "../theme.js";

// Categorias de chamado. `sla` em horas; `critico` = impacto clínico.
// `icon` referencia um nome em components/Icon.jsx.
export let CATS = [
  { id: "c1", nome: "Áudio/Vídeo na teleconsulta", sla: 2,  critico: true,  icon: "video" },
  { id: "c2", nome: "Acesso e autenticação",       sla: 4,  critico: false, icon: "shield" },
  { id: "c3", nome: "Prescrição eletrônica",       sla: 3,  critico: true,  icon: "steth" },
  { id: "c4", nome: "Integração / prontuário",     sla: 6,  critico: false, icon: "cpu" },
  { id: "c5", nome: "Equipamento / periférico",    sla: 8,  critico: false, icon: "monitor" },
  { id: "c6", nome: "Outros",                       sla: 24, critico: false, icon: "tag" },
];

export const catById = (id) => CATS.find((c) => c.id === id);

export function addCat(nome, sla, critico) {
  CATS.push({ id: "c" + Date.now(), nome, sla: Number(sla) || 24, critico: !!critico, icon: "tag" });
}
