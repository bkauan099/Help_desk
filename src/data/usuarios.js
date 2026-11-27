export let USERS = [];
const CORES = ["#1498b4", "#e8622a", "#163a52", "#2a9d8f", "#9b5de5", "#577590"];
const iniciais = (nome) => nome.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
export function setUsers(lista) {
  USERS = (lista || []).map((u, i) => ({
    id: u.id, nome: u.nome, email: u.email, perfil: u.perfil,
    cargo: u.cargo || "", especialidade: u.especialidade || null,
    ativo: u.ativo !== false, ini: iniciais(u.nome), cor: CORES[i % CORES.length],
  }));
  return USERS;
}
export const userById = (id) => USERS.find((u) => u.id === id) || { nome: "—", ini: "—", cor: "#94a3b8", perfil: "" };
export const atendentes = () => USERS.filter((u) => u.perfil === "atendente" && u.ativo);
