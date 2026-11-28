import { useState, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import { api } from "../services/api";
import { CATS } from "../data/categorias";
import { PrioBadge } from "../components/Badge.jsx";
import { preverPrioridade } from "../lib/sla";
import { selo } from "../data/requisitos";

const MAX = 3, MAX_MB = 5;

export default function NovoChamado({ onCreate, voltar }) {
  const [catId, setCatId] = useState(CATS[0]?.id || null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [impacto, setImpacto] = useState(false);
  const [anexos, setAnexos] = useState([]);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);   // RF11
  const [sugAberta, setSugAberta] = useState(null);

  // RF11 — busca artigos da base conforme o título digitado (com debounce).
  useEffect(() => {
    const termo = titulo.trim();
    if (termo.length < 3) { setSugestoes([]); return; }
    const id = setTimeout(() => { api.kb(termo).then((a) => setSugestoes(a.slice(0, 3))).catch(() => setSugestoes([])); }, 300);
    return () => clearTimeout(id);
  }, [titulo]);

  const cat = CATS.find((c) => c.id === catId);
  const prio = preverPrioridade(cat, impacto);

  function escolher(e) {
    setErro("");
    const novos = Array.from(e.target.files);
    const grande = novos.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (grande) { setErro(`"${grande.name}" passa de ${MAX_MB} MB.`); return; }
    setAnexos((a) => [...a, ...novos].slice(0, MAX));
    e.target.value = "";
  }
  const remover = (i) => setAnexos((a) => a.filter((_, k) => k !== i));

  async function enviar() {
    if (enviando) return;
    if (!titulo.trim() || !descricao.trim() || !catId) { setErro("Preencha assunto, categoria e descrição."); return; }
    setErro(""); setEnviando(true);
    try { await onCreate({ titulo: titulo.trim(), descricao: descricao.trim(), catId, impacto, anexos }); }
    catch (e) { setErro(e.message || "Não foi possível abrir o chamado."); setEnviando(false); }
  }

  return (
    <>
      <div className="pagehead">
        <div><h1>Novo chamado</h1><p>A prioridade e o prazo de SLA são calculados automaticamente.</p></div>
        <button className="btn sec" onClick={voltar}>Voltar</button>
      </div>

      <div className="card pad" style={{ display: "grid", gap: 16 }}>
        <div>
          <label>Categoria</label>
          <div className="cat-grid">
            {CATS.map((c) => (
              <div key={c.id} className={`cat-op ${catId === c.id ? "on" : ""}`} onClick={() => setCatId(c.id)}>
                <span className="ic"><Icon name={c.icon} size={18} /></span>
                <div>
                  <strong style={{ fontSize: 13.5 }}>{c.nome}</strong>
                  <div style={{ fontSize: 11.5, color: "#64748b" }}>{c.critico ? "Pode ser crítico" : "Padrão"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="assunto">Assunto</label>
          <input id="assunto" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Resumo do problema" maxLength={120} />
          {sugestoes.length > 0 && (
            <div className="sugbox" role="region" aria-label="Artigos sugeridos">
              <div className="sugtit"><Icon name="book" size={13} /> Antes de abrir, veja se um destes artigos já resolve:</div>
              {sugestoes.map((a) => {
                const on = sugAberta === a.id;
                return (
                  <div key={a.id} className="sugitem">
                    <button type="button" className="sughead" aria-expanded={on} onClick={() => setSugAberta(on ? null : a.id)}>
                      <span style={{ flex: 1, textAlign: "left" }}><strong style={{ fontSize: 13 }}>{a.titulo}</strong> <span style={{ color: "#94a3b8", fontSize: 12 }}>· {a.cat}</span></span>
                      <Icon name="plus" size={14} />
                    </button>
                    {on && <div className="sugbody">{a.conteudo}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="desc">Descrição</label>
          <textarea id="desc" rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="O que aconteceu, quando começou, o que já tentou…" />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 500, cursor: "pointer" }}>
          <input type="checkbox" style={{ width: 17, height: 17 }} checked={impacto} onChange={(e) => setImpacto(e.target.checked)} />
          Há impacto clínico agora (ex.: teleconsulta em andamento, paciente aguardando)
        </label>

        <div>
          <label>Anexos <span style={{ color: "#94a3b8", fontWeight: 400 }}>(até {MAX} — imagem ou PDF, máx. {MAX_MB} MB)</span></label>
          <label className="btn sec sm" style={{ display: "inline-flex" }}>
            <Icon name="clip" size={15} /> Adicionar arquivo
            <input type="file" multiple accept="image/*,application/pdf" style={{ display: "none" }} onChange={escolher} disabled={anexos.length >= MAX} />
          </label>
          {anexos.map((f, i) => (
            <div className="anexo" key={i}>
              <Icon name="clip" size={14} />
              <span style={{ flex: 1 }}>{f.name}</span>
              <span style={{ color: "#64748b" }}>{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button className="btn sec sm" onClick={() => remover(i)}>remover</button>
            </div>
          ))}
        </div>

        <div className="prev">
          Prioridade estimada: <PrioBadge p={prio} />
          <span style={{ color: "#64748b", marginLeft: 8, fontSize: 12.5 }}>
            {impacto ? "impacto clínico eleva a prioridade" : "sem impacto clínico imediato"} — confirmada pelo servidor ao abrir.
          </span>
        </div>

        {erro && <p className="erro" role="alert" style={{ background: "#fde7e3", color: "#b4301a", padding: "8px 11px", borderRadius: 8, margin: 0, fontWeight: 600, fontSize: 12.5 }}>{erro}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn orange" onClick={enviar} disabled={enviando}>{enviando ? "Abrindo…" : "Abrir chamado"}</button>
          <button className="btn sec" onClick={voltar}>Cancelar</button>
        </div>
      </div>

      <div className="selo">{selo("novo").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
