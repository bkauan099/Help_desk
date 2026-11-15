import React from "react";
import { T, STATUS, PRIO } from "../theme.js";
import { Icon } from "./Icon.jsx";
import { Badge, Btn } from "./ui.jsx";
import { catById } from "../data/categorias.js";
import { userById } from "../data/usuarios.js";
import { slaInfo } from "../lib/sla.js";
import { fmt } from "../lib/format.js";

const Status = ({ s }) => {
  const st = STATUS[s];
  return <span className="st" style={{ color: st.c }}><span className="sdot" style={{ background: st.c }} />{s}</span>;
};

// Tabela de chamados no estilo de um help desk real (GLPI).
// `compact` exibe menos colunas (usado no Painel para os chamados recentes).
export function TicketTable({ tickets, isStaff, go, compact }) {
  return (
    <div className="table-scroll">
      <table className="grid">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Status</th>
            <th>Prioridade</th>
            {!compact && <th className="col-hide-sm">Categoria</th>}
            {!compact && <th className="col-hide-sm">{isStaff ? "Requerente" : "Atendente"}</th>}
            {!compact && <th className="col-hide-sm tnowrap">Abertura</th>}
            <th className="tnowrap">SLA</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const cat = catById(t.catId), sla = slaInfo(t), sol = userById(t.solicitanteId);
            const resp = isStaff ? sol.nome : (t.atendenteId ? userById(t.atendenteId).nome : "—");
            return (
              <tr key={t.id} onClick={() => go("detalhe", t.id)} tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") go("detalhe", t.id); }}>
                <td className="proto tnowrap">{t.protocolo}</td>
                <td className="tdtitle">{t.titulo}{!compact && <small>{t.descricao}</small>}</td>
                <td><Status s={t.status} /></td>
                <td><Badge c={PRIO[t.prioridade]} solid>{t.prioridade}</Badge></td>
                {!compact && <td className="col-hide-sm"><span className="row" style={{ gap: 6 }}><Icon n={cat.icon} s={13} c={T.muted} />{cat.nome}</span></td>}
                {!compact && <td className="col-hide-sm tnowrap">{resp}</td>}
                {!compact && <td className="col-hide-sm tnowrap foot">{fmt(t.criadoEm)}</td>}
                <td className="tnowrap" style={{ color: sla.c, fontWeight: 600, fontSize: 12 }}><Icon n="timer" s={12} c={sla.c} /> {sla.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const Empty = ({ go }) => (
  <div className="empty">
    <Icon n="inbox" s={30} c={T.dim} />
    <div style={{ fontWeight: 600, margin: "10px 0 3px", color: T.navy }}>Nenhum chamado por aqui</div>
    <p className="sub" style={{ margin: "0 0 14px" }}>Abra um chamado para registrar um problema técnico.</p>
    {go && <Btn color={T.rust} small onClick={() => go("abrir")}><Icon n="plus" s={15} /> Abrir chamado</Btn>}
  </div>
);
