import { useState } from "react";
import Icon from "../components/Icon.jsx";
import { PrioBadge, StatusBadge, Avatar } from "../components/Badge.jsx";
import { userById } from "../data/usuarios";
import { catById } from "../data/categorias";
import { tempoRelativo, slaInfo, PESO } from "../lib/format";
import { selo } from "../data/requisitos";

const FILTROS = ["Todos", "Aberto", "Em atendimento", "Aguardando solicitante", "Resolvido", "Fechado"];

export default function Chamados({ tickets, go }) {
  const [f, setF] = useState("Todos");
  const lista = tickets
    .filter((t) => f === "Todos" || t.status === f)
    .sort((a, b) => (PESO[a.prioridade] - PESO[b.prioridade]) || (new Date(a.prazoResolucao || 0) - new Date(b.prazoResolucao || 0)));

  return (
    <>
      <div className="pagehead">
        <div><h1>Chamados</h1><p>Fila ordenada por prioridade e prazo de SLA.</p></div>
        <button className="btn orange" onClick={() => go("novo")}><Icon name="plus" size={16} /> Novo chamado</button>
      </div>

      <div className="chips">
        {FILTROS.map((x) => (
          <button key={x} className={`chip ${f === x ? "on" : ""}`} onClick={() => setF(x)}>
            {x}{x !== "Todos" ? ` (${tickets.filter((t) => t.status === x).length})` : ` (${tickets.length})`}
          </button>
        ))}
      </div>

      <div className="card">
        <table>
          <thead><tr>
            <th>Protocolo</th><th>Assunto</th><th>Prioridade</th><th>Status</th>
            <th>Responsável</th><th>SLA</th><th>Aberto</th>
          </tr></thead>
          <tbody>
            {lista.map((t) => {
              const resp = t.atendenteId ? userById(t.atendenteId) : null;
              const sla = slaInfo(t);
              return (
                <tr key={t.id} onClick={() => go("detalhe", t.id)}>
                  <td className="proto">{t.protocolo}</td>
                  <td><strong>{t.titulo}</strong><br /><span style={{ color: "#64748b", fontSize: 12 }}>{catById(t.catId).nome}</span></td>
                  <td><PrioBadge p={t.prioridade} /></td>
                  <td><StatusBadge s={t.status} /></td>
                  <td>{resp ? <span className="row-usr"><Avatar u={resp} size={26} /> {resp.nome.split(" ")[0]}</span> : <span style={{ color: "#94a3b8" }}>não atribuído</span>}</td>
                  <td style={{ color: sla.estado === "ruim" ? "#d4391f" : sla.estado === "alerta" ? "#d98a04" : "#1f9d57", fontWeight: 600, fontSize: 12.5 }}>{sla.txt}</td>
                  <td style={{ color: "#64748b" }}>{tempoRelativo(t.criadoEm)}</td>
                </tr>
              );
            })}
            {lista.length === 0 && <tr><td colSpan={7} className="empty">Nenhum chamado neste filtro.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="selo">{selo("chamados").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
