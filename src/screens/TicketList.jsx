import React, { useState } from "react";
import { T } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, Btn, ScreenHead } from "../components/ui.jsx";
import { TicketTable, Empty } from "../components/TicketRow.jsx";
import { CATS } from "../data/categorias.js";

// Tela Fila de chamados — RF05 (listagem em tabela, busca e filtros).
export function TicketList({ tickets, isStaff, go }) {
  const [q, setQ] = useState("");
  const [prio, setPrio] = useState("");
  const [catF, setCatF] = useState("");
  const [tab, setTab] = useState("all");

  const tabs = [["all", "Todos"], ["open", "Abertos"], ["mine", isStaff ? "Em atendimento" : "Em andamento"], ["done", "Resolvidos"]];
  const filtered = tickets.filter((t) => {
    if (tab === "open" && !["Aberto", "Em atendimento", "Aguardando"].includes(t.status)) return false;
    if (tab === "done" && !["Resolvido", "Fechado"].includes(t.status)) return false;
    if (tab === "mine" && isStaff && t.status !== "Em atendimento") return false;
    if (tab === "mine" && !isStaff && !["Aberto", "Em atendimento", "Aguardando"].includes(t.status)) return false;
    if (prio && t.prioridade !== prio) return false;
    if (catF && t.catId !== catF) return false;
    if (q && !(`${t.titulo} ${t.protocolo} ${t.descricao}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }).sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

  return (
    <div className="col" style={{ gap: 14 }}>
      <ScreenHead view="fila" titulo={isStaff ? "Fila de chamados" : "Meus chamados"} sub="Chamados de suporte à telemedicina."
        right={!isStaff && <Btn color={T.rust} onClick={() => go("abrir")}><Icon n="plus" s={16} /> Abrir chamado</Btn>} />

      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={"chip" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      <div className="filters">
        <div className="searchbox"><Icon n="search" s={16} c={T.dim} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título ou protocolo" aria-label="Buscar chamados" /></div>
        <select value={prio} onChange={(e) => setPrio(e.target.value)} aria-label="Filtrar por prioridade"><option value="">Prioridade</option>{["Crítica", "Alta", "Média", "Baixa"].map((p) => <option key={p}>{p}</option>)}</select>
        <select value={catF} onChange={(e) => setCatF(e.target.value)} aria-label="Filtrar por categoria"><option value="">Categoria</option>{CATS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
      </div>

      <Card cls="tablecard">
        {filtered.length === 0
          ? <Empty go={!isStaff ? go : null} />
          : <>
              <TicketTable tickets={filtered} isStaff={isStaff} go={go} />
              <div className="tablefoot">Exibindo {filtered.length} de {tickets.length} chamado(s)</div>
            </>}
      </Card>
    </div>
  );
}
