import Icon from "../components/Icon.jsx";
import { PrioBadge, StatusBadge, Avatar } from "../components/Badge.jsx";
import { userById } from "../data/usuarios";
import { catById } from "../data/categorias";
import { tempoRelativo, PESO } from "../lib/format";
import { selo } from "../data/requisitos";

export default function Painel({ user, tickets, go, ehStaff }) {
  const abertos = tickets.filter((t) => !["Resolvido", "Fechado"].includes(t.status));
  const criticos = abertos.filter((t) => t.prioridade === "Crítica").length;
  const meus = ehStaff ? tickets.filter((t) => t.atendenteId === user.id && !["Fechado"].includes(t.status)).length : abertos.length;
  const resolvidos = tickets.filter((t) => ["Resolvido", "Fechado"].includes(t.status)).length;

  const recentes = [...tickets]
    .sort((a, b) => (PESO[a.prioridade] - PESO[b.prioridade]) || (new Date(b.criadoEm) - new Date(a.criadoEm)))
    .slice(0, 6);

  const tiles = [
    { l: "Chamados abertos", v: abertos.length, c: "#1498b4" },
    { l: "Críticos", v: criticos, c: "#e8622a" },
    { l: ehStaff ? "Atribuídos a mim" : "Meus chamados", v: meus, c: "#163a52" },
    { l: "Resolvidos", v: resolvidos, c: "#1f9d57" },
  ];

  return (
    <>
      <div className="pagehead">
        <div>
          <h1>Olá, {user.nome.split(" ")[0]}</h1>
          <p>Visão geral da fila de atendimento e dos indicadores.</p>
        </div>
        <button className="btn orange" onClick={() => go("novo")}><Icon name="plus" size={16} /> Novo chamado</button>
      </div>

      <div className="tiles">
        {tiles.map((t) => (
          <div className="tile" key={t.l}><span className="bar" style={{ background: t.c }} />
            <span className="v">{t.v}</span><span className="l">{t.l}</span></div>
        ))}
      </div>

      <div className="card">
        <table>
          <thead><tr>
            <th>Protocolo</th><th>Assunto</th><th>Prioridade</th><th>Status</th>
            <th>Responsável</th><th>Aberto</th>
          </tr></thead>
          <tbody>
            {recentes.map((t) => {
              const resp = t.atendenteId ? userById(t.atendenteId) : null;
              return (
                <tr key={t.id} onClick={() => go("detalhe", t.id)}>
                  <td className="proto">{t.protocolo}</td>
                  <td><strong>{t.titulo}</strong><br /><span style={{ color: "#64748b", fontSize: 12 }}>{catById(t.catId).nome}</span></td>
                  <td><PrioBadge p={t.prioridade} /></td>
                  <td><StatusBadge s={t.status} /></td>
                  <td>{resp ? <span className="row-usr"><Avatar u={resp} size={26} /> {resp.nome.split(" ")[0]}</span> : <span style={{ color: "#94a3b8" }}>—</span>}</td>
                  <td style={{ color: "#64748b" }}>{tempoRelativo(t.criadoEm)}</td>
                </tr>
              );
            })}
            {recentes.length === 0 && <tr><td colSpan={6} className="empty">Nenhum chamado ainda.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="selo">{selo("painel").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
