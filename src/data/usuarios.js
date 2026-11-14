import { T } from "../theme.js";

// Usuários de demonstração (3 perfis: solicitante, atendente, admin).
export let USERS = [
  { id: "u1", nome: "Dra. Helena Martins", perfil: "solicitante", email: "helena.martins@hospital.br", cargo: "Médica · Cardiologia",       ini: "HM", cor: T.rust },
  { id: "u2", nome: "Enf. Marcos Vieira",  perfil: "solicitante", email: "marcos.vieira@hospital.br",  cargo: "Enfermagem · UTI",            ini: "MV", cor: T.blue },
  { id: "u3", nome: "Rafael Souza",        perfil: "atendente",   email: "rafael.souza@ti.hospital.br", cargo: "Suporte N2 · Infraestrutura", ini: "RS", cor: T.teal },
  { id: "u4", nome: "Beatriz Lima",        perfil: "atendente",   email: "beatriz.lima@ti.hospital.br", cargo: "Suporte N1 · Aplicações",     ini: "BL", cor: "#6a5acd" },
  { id: "u5", nome: "Coord. TI",           perfil: "admin",       email: "admin@ti.hospital.br",        cargo: "Coordenação de TI",           ini: "CT", cor: T.amber },
];

export const userById = (id) => USERS.find((u) => u.id === id);
export const atendentes = () => USERS.filter((u) => u.perfil !== "solicitante");

const CORES = [T.rust, T.blue, T.teal, "#6a5acd", T.amber];
const iniciais = (nome) => {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
};

export function addUser(nome, email, perfil, cargo) {
  USERS.push({ id: "u" + Date.now(), nome: nome.trim(), email, perfil, cargo: cargo.trim() || "—", ini: iniciais(nome), cor: CORES[USERS.length % CORES.length] });
}

export function updateUser(id, { nome, email, perfil, cargo }) {
  const u = userById(id);
  if (!u) return;
  u.nome = nome.trim(); u.email = email; u.perfil = perfil; u.cargo = cargo.trim() || "—"; u.ini = iniciais(nome);
}

export function removeUser(id) {
  const i = USERS.findIndex((u) => u.id === id);
  if (i >= 0) USERS.splice(i, 1);
}
