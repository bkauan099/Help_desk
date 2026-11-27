import { slaInfo } from "../lib/format";
import { selo } from "../data/requisitos";

const COR_PRIO = { "Crítica": "#e8622a", "Alta": "#d98a04", "Média": "#1498b4", "Baixa": "#94a3b8" };
const COR_ST = { "Aberto": "#2563a8", "Em atendimento": "#1c7a4e", "Aguardando solicitante": "#8a6400", "Resolvido": "#1f9d57", "Fechado": "#64748b" };

function Barras({ titulo, dados, cores }) {
  const total = dados.reduce((s, d) => s + d.v, 0) || 1;
  return (
    <div className="card pad">
      <strong style={{ color: "#163a52" }}>{titulo}</strong>
      <div style={{ display: "grid", gap: 11, marginTop: 14 }}>
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

export default function Relatorios({ tickets }) {
  const porStatus = ["Aberto", "Em atendimento", "Aguardando solicitante", "Resolvido", "Fechado"]
    .map((k) => ({ k, v: tickets.filter((t) => t.status === k).length }));
  const porPrio = ["Crítica", "Alta", "Média", "Baixa"]
    .map((k) => ({ k, v: tickets.filter((t) => t.prioridade === k).length }));

  const ativos = tickets.filter((t) => !["Resolvido", "Fechado"].includes(t.status));
  const estourados = ativos.filter((t) => slaInfo(t).estado === "ruim").length;
  const dentroSla = ativos.length - estourados;
  const pctSla = ativos.length ? Math.round((dentroSla / ativos.length) * 100) : 100;
  const avaliados = tickets.filter((t) => t.avaliacao);
  const notaMedia = avaliados.length ? (avaliados.reduce((s, t) => s + t.avaliacao.nota, 0) / avaliados.length).toFixed(1) : "—";

  const tiles = [
    { l: "Total de chamados", v: tickets.length, c: "#1498b4" },
    { l: "Dentro do SLA", v: `${pctSla}%`, c: "#1f9d57" },
    { l: "SLA estourado (ativos)", v: estourados, c: "#e8622a" },
    { l: "Nota média", v: notaMedia, c: "#163a52" },
  ];

  return (
    <>
      <div className="pagehead"><div><h1>Relatórios e indicadores</h1><p>Panorama de volume, prioridades e cumprimento de SLA.</p></div></div>

      <div className="tiles">
        {tiles.map((t) => (
          <div className="tile" key={t.l}><span className="bar" style={{ background: t.c }} />
            <span className="v">{t.v}</span><span className="l">{t.l}</span></div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Barras titulo="Chamados por status" dados={porStatus} cores={COR_ST} />
        <Barras titulo="Chamados por prioridade" dados={porPrio} cores={COR_PRIO} />
      </div>

      <div className="selo">{selo("relatorios").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
