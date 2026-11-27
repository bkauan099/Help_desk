import { useState, useEffect } from "react";
import { api } from "../services/api";
import { selo } from "../data/requisitos";

const COR_PRIO = { "Crítica": "#e8622a", "Alta": "#d98a04", "Média": "#1498b4", "Baixa": "#94a3b8" };
const COR_ST = { "Aberto": "#2563a8", "Em atendimento": "#1c7a4e", "Aguardando": "#8a6400", "Resolvido": "#1f9d57", "Fechado": "#64748b" };
const PERIODOS = [["7", "7 dias"], ["30", "30 dias"], ["90", "90 dias"], ["", "Tudo"]];

function Barras({ titulo, dados, cores }) {
  const total = dados.reduce((s, d) => s + d.v, 0) || 1;
  return (
    <div className="card pad">
      <strong style={{ color: "#163a52" }}>{titulo}</strong>
      <div style={{ display: "grid", gap: 11, marginTop: 14 }}>
        {dados.length === 0 && <span style={{ color: "#94a3b8", fontSize: 13 }}>Sem dados no período.</span>}
        {dados.map((d) => (
          <div key={d.k}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{d.k}</span><span style={{ color: "#64748b" }}>{d.v}</span>
            </div>
            <div className="barbg"><div className="barfill" style={{ width: `${(d.v / total) * 100}%`, background: cores[d.k] || "#1498b4" }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// RF12 — dashboard de indicadores (exclusivo do administrador). Lê agregações
// do servidor, com filtro por período e tempos médios de resposta/resolução.
export default function Relatorios() {
  const [dias, setDias] = useState("30");
  const [st, setSt] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.stats(dias).then(setSt).catch((e) => setErro(e.message));
  }, [dias]);

  if (erro) return <div className="empty">{erro}</div>;
  if (!st) return <div className="loading">Carregando indicadores…</div>;

  const porStatus = ["Aberto", "Em atendimento", "Aguardando", "Resolvido", "Fechado"]
    .map((k) => ({ k, v: (st.porStatus.find((x) => x.status === k) || {}).total || 0 }));
  const porPrio = ["Crítica", "Alta", "Média", "Baixa"]
    .map((k) => ({ k, v: (st.porPrioridade.find((x) => x.prioridade === k) || {}).total || 0 }));
  const porCat = st.porCategoria.map((c) => ({ k: c.categoria, v: c.total }));

  const num = (v) => (v == null ? "—" : v);
  const tiles = [
    { l: "Cumprimento de SLA", v: st.cumprimento == null ? "—" : `${st.cumprimento}%`, c: "#1f9d57" },
    { l: "Tempo médio 1ª resposta", v: num(st.tempos.primeira_resposta) + (st.tempos.primeira_resposta != null ? " h" : ""), c: "#1498b4" },
    { l: "Tempo médio de resolução", v: num(st.tempos.resolucao) + (st.tempos.resolucao != null ? " h" : ""), c: "#3f7cb4" },
    { l: "Nota média", v: num(st.satisfacao.media), c: "#163a52" },
  ];

  return (
    <>
      <div className="pagehead">
        <div><h1>Dashboard de indicadores</h1><p>Desempenho do suporte e cumprimento dos prazos (apenas administrador).</p></div>
      </div>

      <div className="chips" style={{ marginBottom: 16 }}>
        <span style={{ alignSelf: "center", color: "#64748b", fontSize: 12.5, fontWeight: 600, marginRight: 4 }}>Período:</span>
        {PERIODOS.map(([k, l]) => (
          <button key={k} className={`chip ${dias === k ? "on" : ""}`} onClick={() => setDias(k)}>{l}</button>
        ))}
      </div>

      <div className="tiles">
        {tiles.map((t) => (
          <div className="tile" key={t.l}><span className="bar" style={{ background: t.c }} />
            <span className="v">{t.v}</span><span className="l">{t.l}</span></div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Barras titulo="Chamados por status" dados={porStatus} cores={COR_ST} />
        <Barras titulo="Chamados por categoria" dados={porCat} cores={{}} />
        <Barras titulo="Chamados por prioridade" dados={porPrio} cores={COR_PRIO} />
      </div>

      <div className="selo">{selo("relatorios").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
