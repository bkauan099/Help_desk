import { useState, useEffect, useCallback } from "react";
import Icon from "../components/Icon.jsx";
import { api } from "../services/api";
import { selo } from "../data/requisitos";

// Base de conhecimento (RF10) — artigos persistidos no banco, busca por
// palavra-chave e publicação por atendentes/admin.
export default function Base({ isStaff = false }) {
  const [q, setQ] = useState("");
  const [artigos, setArtigos] = useState([]);
  const [aberto, setAberto] = useState(null);
  const [form, setForm] = useState(false);
  const [novo, setNovo] = useState({ categoria: "", titulo: "", conteudo: "" });
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const buscar = useCallback((termo) => { api.kb(termo).then(setArtigos).catch(() => setArtigos([])); }, []);
  useEffect(() => { const id = setTimeout(() => buscar(q.trim()), 200); return () => clearTimeout(id); }, [q, buscar]);

  const valido = novo.titulo.trim().length >= 5 && novo.conteudo.trim().length >= 15 && novo.categoria.trim().length >= 2;
  async function publicar() {
    setErro(""); setOk("");
    try {
      await api.publicarArtigo({ categoria: novo.categoria.trim(), titulo: novo.titulo.trim(), conteudo: novo.conteudo.trim() });
      setNovo({ categoria: "", titulo: "", conteudo: "" }); setForm(false); setOk("Artigo publicado na base.");
      buscar(q.trim());
    } catch (e) { setErro(e.message); }
  }

  return (
    <>
      <div className="pagehead">
        <div><h1>Base de conhecimento</h1><p>Soluções e procedimentos para os problemas mais comuns.</p></div>
        {isStaff && <button className="btn" onClick={() => { setForm((f) => !f); setOk(""); }}>
          <Icon name={form ? "x" : "plus"} size={15} /> {form ? "Fechar" : "Publicar artigo"}</button>}
      </div>

      {isStaff && form && (
        <div className="card pad" style={{ display: "grid", gap: 11, marginBottom: 16 }}>
          <strong style={{ color: "#163a52" }}>Novo artigo</strong>
          <div><label>Categoria</label><input value={novo.categoria} onChange={(e) => setNovo({ ...novo, categoria: e.target.value })} placeholder="Ex.: Áudio/Vídeo" /></div>
          <div><label>Título</label><input value={novo.titulo} onChange={(e) => setNovo({ ...novo, titulo: e.target.value })} placeholder="Título do artigo" /></div>
          <div><label>Conteúdo</label><textarea rows={4} value={novo.conteudo} onChange={(e) => setNovo({ ...novo, conteudo: e.target.value })} placeholder="Descreva os passos de solução." /></div>
          {erro && <p className="erro" role="alert" style={{ background: "#fde7e3", color: "#b4301a", padding: "8px 11px", borderRadius: 8, margin: 0, fontWeight: 600, fontSize: 12.5 }}>{erro}</p>}
          <button className="btn" disabled={!valido} onClick={publicar}><Icon name="send" size={15} /> Publicar na base</button>
        </div>
      )}
      {ok && <p style={{ background: "#e4f6e9", color: "#1f7a46", padding: "8px 11px", borderRadius: 8, fontWeight: 600, fontSize: 12.5, marginBottom: 12 }}>{ok}</p>}

      <div className="card pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="search" size={18} />
          <input placeholder="Buscar por título ou palavra-chave…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar artigo" />
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {artigos.map((a) => (
          <div className="card pad" key={a.id} style={{ cursor: "pointer" }} onClick={() => setAberto(aberto === a.id ? null : a.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <strong style={{ color: "#163a52" }}>{a.titulo}</strong>
              <span className="badge st-andamento">{a.cat}</span>
            </div>
            <p style={{ margin: "6px 0 0", color: "#475569", whiteSpace: "pre-line" }}>
              {aberto === a.id ? a.conteudo : (a.conteudo.length > 120 ? a.conteudo.slice(0, 120) + "…" : a.conteudo)}
            </p>
            {aberto === a.id && a.autorNome && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8" }}>Publicado por {a.autorNome}</p>}
          </div>
        ))}
        {artigos.length === 0 && <div className="empty">Nenhum artigo encontrado.</div>}
      </div>

      <div className="selo">{selo("base").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
