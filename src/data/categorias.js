export let CATS = [];
const slaDisplay = (critico) => (critico ? 2 : 8);
export function setCats(lista) {
  CATS = (lista || []).map((c) => ({
    id: c.id, nome: c.nome, critico: !!c.critico,
    especialidade: c.especialidade || null, icon: c.icon || "tag", sla: slaDisplay(c.critico),
  }));
  return CATS;
}
export const catById = (id) => CATS.find((c) => c.id === id) || { nome: "—", icon: "tag", critico: false, sla: 8 };
