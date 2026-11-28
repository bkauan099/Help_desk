// Cliente da API do MP Desk.
const BASE = (import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:4000/api";

let token = localStorage.getItem("mpdesk_token") || null;
export const getToken = () => token;
export function setToken(t) {
  token = t;
  try { t ? localStorage.setItem("mpdesk_token", t) : localStorage.removeItem("mpdesk_token"); } catch (e) {}
}

async function req(path, { method = "GET", body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || `Erro ${res.status}`);
  return data;
}

export const api = {
  base: BASE,
  login: (email, senha) => req("/auth/login", { method: "POST", body: { email, senha } }),
  me: () => req("/auth/me"),
  categorias: () => req("/categorias"),
  usuarios: () => req("/usuarios"),
  kb: (q) => req("/kb" + (q ? `?q=${encodeURIComponent(q)}` : "")),
  criarUsuario: (d) => req("/usuarios", { method: "POST", body: d }),
  editarUsuario: (id, d) => req(`/usuarios/${id}`, { method: "PATCH", body: d }),
  ativarUsuario: (id, ativo) => req(`/usuarios/${id}/ativo`, { method: "PATCH", body: { ativo } }),
  criarCategoria: (d) => req("/categorias", { method: "POST", body: d }),
  listarChamados: (f = {}) => req("/chamados" + (Object.keys(f).length ? "?" + new URLSearchParams(f) : "")),
  chamado: (id) => req(`/chamados/${id}`),
  abrirChamado: (formData) => req("/chamados", { method: "POST", form: formData }),
  enviarMensagem: (id, mensagem) => req(`/chamados/${id}/mensagens`, { method: "POST", body: { mensagem } }),
  assumir: (id) => req(`/chamados/${id}/assumir`, { method: "POST" }),
  atribuir: (id, atendenteId) => req(`/chamados/${id}/atribuir`, { method: "POST", body: { atendenteId } }),
  mudarStatus: (id, status) => req(`/chamados/${id}/status`, { method: "PATCH", body: { status } }),
  avaliar: (id, nota, comentario) => req(`/chamados/${id}/avaliacao`, { method: "POST", body: { nota, comentario } }),
  reabrir: (id) => req(`/chamados/${id}/reabrir`, { method: "POST" }),                 // RF14
  publicarArtigo: (d) => req("/kb", { method: "POST", body: d }),                        // RF10
  regrasSla: () => req("/sla"),                                                          // RF13
  salvarRegraSla: (prioridade, d) => req(`/sla/${encodeURIComponent(prioridade)}`, { method: "PATCH", body: d }), // RF13
  stats: (dias) => req("/dashboard/stats" + (dias ? `?dias=${dias}` : "")),              // RF12
  relatorioSla: () => req("/dashboard/relatorio-sla"),
};
