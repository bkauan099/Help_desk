import { useState, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import { api } from "../services/api";
import { selo } from "../data/requisitos";

const PERFIS = ["solicitante", "atendente", "admin"];
const vazio = { nome: "", email: "", senha: "", perfil: "solicitante", cargo: "", especialidade: "" };

export default function Gestao() {
  const [aba, setAba] = useState("usuarios");
  const [lista, setLista] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(vazio);
  const [editId, setEditId] = useState(null);
  const [erro, setErro] = useState("");
  const [cat, setCat] = useState({ nome: "", critico: false, especialidade: "", icon: "tag" });

  const carregar = () => {
    api.usuarios().then(setLista).catch(() => {});
    api.categorias().then(setCats).catch(() => {});
  };
  useEffect(carregar, []);

  function editar(u) { setEditId(u.id); setForm({ ...vazio, ...u, senha: "" }); setErro(""); window.scrollTo(0, 0); }
  function limpar() { setEditId(null); setForm(vazio); setErro(""); }

  async function salvar() {
    setErro("");
    try {
      const d = { nome: form.nome.trim(), email: form.email.trim(), perfil: form.perfil, cargo: form.cargo, especialidade: form.especialidade || null };
      if (form.senha) d.senha = form.senha;
      if (editId) await api.editarUsuario(editId, d);
      else { if (!form.senha) { setErro("Defina uma senha para o novo usuário."); return; } await api.criarUsuario(d); }
      limpar(); carregar();
    } catch (e) { setErro(e.message); } // e-mail duplicado → 409
  }
  const alternar = async (u) => { try { await api.ativarUsuario(u.id, !u.ativo); carregar(); } catch (e) { setErro(e.message); } };

  async function salvarCat() {
    setErro("");
    try { await api.criarCategoria({ ...cat, nome: cat.nome.trim() }); setCat({ nome: "", critico: false, especialidade: "", icon: "tag" }); carregar(); }
    catch (e) { setErro(e.message); }
  }

  return (
    <>
      <div className="pagehead"><div><h1>Gestão</h1><p>Administração de usuários e categorias do sistema.</p></div></div>

      <div className="chips">
        <button className={`chip ${aba === "usuarios" ? "on" : ""}`} onClick={() => setAba("usuarios")}>Usuários</button>
        <button className={`chip ${aba === "categorias" ? "on" : ""}`} onClick={() => setAba("categorias")}>Categorias</button>
      </div>

      {erro && <p style={{ background: "#fde7e3", color: "#b4301a", padding: "8px 11px", borderRadius: 8, fontWeight: 600, fontSize: 12.5 }} role="alert">{erro}</p>}

      {aba === "usuarios" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
          <div className="card pad" style={{ display: "grid", gap: 11, alignContent: "start" }}>
            <strong style={{ color: "#163a52" }}>{editId ? "Editar usuário" : "Novo usuário"}</strong>
            <div><label>Nome</label><input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div><label>E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label>Senha {editId && <span style={{ color: "#94a3b8", fontWeight: 400 }}>(deixe em branco p/ manter)</span>}</label>
              <input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} /></div>
            <div><label>Perfil</label>
              <select value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}>
                {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select></div>
            <div><label>Cargo</label><input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="ex.: Suporte N2" /></div>
            {form.perfil === "atendente" && (
              <div><label>Especialidade</label><input value={form.especialidade || ""} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} placeholder="ex.: Infraestrutura" /></div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={salvar}>{editId ? "Salvar" : "Criar"}</button>
              {editId && <button className="btn sec" onClick={limpar}>Cancelar</button>}
            </div>
          </div>

          <div className="card">
            <table>
              <thead><tr><th>Nome</th><th>Perfil</th><th>Cargo</th><th>Situação</th><th></th></tr></thead>
              <tbody>
                {lista.map((u) => (
                  <tr key={u.id} style={{ cursor: "default", opacity: u.ativo === false ? .55 : 1 }}>
                    <td><strong>{u.nome}</strong><br /><span style={{ color: "#64748b", fontSize: 12 }}>{u.email}</span></td>
                    <td><span className="badge st-andamento">{u.perfil}</span></td>
                    <td>{u.cargo || "—"}</td>
                    <td>{u.ativo === false ? <span className="badge st-fechado">desativado</span> : <span className="badge st-resolvido">ativo</span>}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn sec sm" onClick={() => editar(u)}>editar</button>{" "}
                      <button className="btn sec sm" onClick={() => alternar(u)}>{u.ativo === false ? "reativar" : "desativar"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba === "categorias" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
          <div className="card pad" style={{ display: "grid", gap: 11, alignContent: "start" }}>
            <strong style={{ color: "#163a52" }}>Nova categoria</strong>
            <div><label>Nome</label><input value={cat.nome} onChange={(e) => setCat({ ...cat, nome: e.target.value })} /></div>
            <div><label>Especialidade do atendimento</label><input value={cat.especialidade} onChange={(e) => setCat({ ...cat, especialidade: e.target.value })} placeholder="ex.: Aplicações" /></div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
              <input type="checkbox" style={{ width: 16, height: 16 }} checked={cat.critico} onChange={(e) => setCat({ ...cat, critico: e.target.checked })} />
              Pode gerar prioridade crítica
            </label>
            <button className="btn" onClick={salvarCat}><Icon name="plus" size={15} /> Adicionar</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>Categoria</th><th>Especialidade</th><th>Crítica</th></tr></thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c.id} style={{ cursor: "default" }}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.especialidade || "—"}</td>
                    <td>{c.critico ? <span className="badge prio-crit">sim</span> : <span className="badge prio-baixa">não</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="selo">{selo("gestao").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
