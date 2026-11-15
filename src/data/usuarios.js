import { T } from "../theme.js";

// Usuários de demonstração (3 perfis: solicitante, atendente, admin).
export let USERS = [
  { id: "u1", nome: "Dra. Helena Martins", perfil: "solicitante", cargo: "Médica · Cardiologia",       ini: "HM", cor: T.rust },
  { id: "u2", nome: "Enf. Marcos Vieira",  perfil: "solicitante", cargo: "Enfermagem · UTI",            ini: "MV", cor: T.blue },
  { id: "u3", nome: "Rafael Souza",        perfil: "atendente",   cargo: "Suporte N2 · Infraestrutura", ini: "RS", cor: T.teal },
  { id: "u4", nome: "Beatriz Lima",        perfil: "atendente",   cargo: "Suporte N1 · Aplicações",     ini: "BL", cor: "#6a5acd" },
  { id: "u5", nome: "Coord. TI",           perfil: "admin",       cargo: "Coordenação de TI",           ini: "CT", cor: T.amber },
];

export const userById = (id) => USERS.find((u) => u.id === id);

const CORES = [T.rust, T.blue, T.teal, "#6a5acd", T.amber];

export function addUser(nome, email, perfil, cargo) {
  const p = nome.trim().split(/\s+/);
  const ini = ((p[0]?.[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
  USERS.push({ id: "u" + Date.now(), nome: nome.trim(), email, perfil, cargo: cargo.trim() || "—", ini, cor: CORES[USERS.length % CORES.length] });
}
