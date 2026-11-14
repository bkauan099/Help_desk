import React, { useState, useEffect } from "react";
import { TopNav } from "./components/TopNav.jsx";
import { Login } from "./screens/Login.jsx";
import { Dashboard } from "./screens/Dashboard.jsx";
import { TicketList } from "./screens/TicketList.jsx";
import { NewTicket } from "./screens/NewTicket.jsx";
import { TicketDetail } from "./screens/TicketDetail.jsx";
import { Knowledge } from "./screens/Knowledge.jsx";
import { Reports } from "./screens/Reports.jsx";
import { Admin } from "./screens/Admin.jsx";
import { SCREEN_RF } from "./data/requisitos.js";
import { SEED, sys, msg } from "./data/chamados.js";
import { catById } from "./data/categorias.js";
import { userById } from "./data/usuarios.js";
import { derivePrio } from "./lib/sla.js";

// Trilha de navegação (breadcrumb) por tela.
function crumbs(view, current) {
  const map = {
    painel: ["Início", "Painel"],
    fila: ["Início", "Assistência", "Chamados"],
    abrir: ["Início", "Assistência", "Chamados", "Novo"],
    detalhe: ["Início", "Assistência", "Chamados", current ? current.protocolo : "Chamado"],
    base: ["Início", "Base de conhecimento"],
    relatorios: ["Início", "Relatórios"],
    gestao: ["Início", "Administração", "Gestão"],
  };
  return map[view] || ["Início"];
}

// Componente raiz: autenticação, estado dos chamados e roteamento por hash.
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("painel");
  const [sel, setSel] = useState(null);
  const [tickets, setTickets] = useState(SEED);
  const [seq, setSeq] = useState(1008);
  const [toast, setToast] = useState(null);

  const isStaff = user && user.perfil !== "solicitante";
  const isAdmin = user && user.perfil === "admin";

  useEffect(() => {
    const sync = () => {
      const h = (location.hash || "").replace(/^#/, "");
      if (SCREEN_RF[h] && h !== "login") setView(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = (v, id = null) => {
    setView(v); setSel(id);
    try { if (location.hash.replace(/^#/, "") !== v) location.hash = v; } catch (e) { /* ignore */ }
    const main = document.getElementById("main"); if (main) main.scrollTop = 0;
  };
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2600); };

  const patch = (id, fn) => setTickets((ts) => ts.map((t) => (t.id === id ? fn({ ...t, interacoes: [...t.interacoes] }) : t)));
  const addMsg = (id, txt) => { if (!txt.trim()) return; patch(id, (t) => { t.interacoes.push(msg(user.id, txt.trim())); return t; }); };
  const setStatus = (id, ns) => { patch(id, (t) => { t.interacoes.push(sys(`Status alterado para ${ns}`)); if (ns === "Resolvido") t.resolvidoEm = new Date(); if (ns === "Fechado") t.fechadoEm = new Date(); t.status = ns; return t; }); flash(`Status → ${ns}`); };
  const assume = (id) => { patch(id, (t) => { t.atendenteId = user.id; t.interacoes.push(sys(`Chamado assumido por ${user.nome}`)); if (t.status === "Aberto") t.status = "Em atendimento"; return t; }); flash("Chamado assumido"); };
  const reatribuir = (id, aid) => { patch(id, (t) => { t.atendenteId = aid; if (t.status === "Aberto") t.status = "Em atendimento"; t.interacoes.push(sys(`Chamado atribuído a ${userById(aid)?.nome || "atendente"}`)); return t; }); flash("Chamado atribuído"); };
  const avaliar = (id, nota, com) => { patch(id, (t) => { t.avaliacao = { nota, comentario: com, data: new Date() }; t.interacoes.push(sys(`Atendimento avaliado com ${nota} estrela(s)`)); return t; }); flash("Avaliação registrada"); };
  const criar = (d) => {
    const cat = catById(d.catId);
    const t = { id: "t" + Date.now(), protocolo: "MPD-" + seq, titulo: d.titulo.trim(), descricao: d.descricao.trim(), catId: d.catId, prioridade: derivePrio(cat, d.impacto), status: "Aberto", impacto: d.impacto, anexos: d.anexos || [], solicitanteId: user.id, atendenteId: null, criadoEm: new Date(), interacoes: [sys("Chamado aberto")] };
    setSeq((s) => s + 1); setTickets((ts) => [t, ...ts]); flash("Chamado aberto: " + t.protocolo); go("detalhe", t.id);
  };

  if (!user) return <Login onLogin={(u) => { setUser(u); go("painel"); }} />;

  const visible = user.perfil === "solicitante" ? tickets.filter((t) => t.solicitanteId === user.id) : tickets;
  const current = sel ? tickets.find((t) => t.id === sel) : visible[0];
  const trilha = crumbs(view, current);

  return (
    <div className="app">
      <TopNav user={user} view={view} go={go} isStaff={isStaff} isAdmin={isAdmin} onLogout={() => { setUser(null); setSel(null); }} />
      <div className="crumbbar">
        <div className="crumbbar-in">
          <nav className="crumb" aria-label="Trilha de navegação">
            {trilha.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">›</span>}
                <span className={i === trilha.length - 1 ? "cur" : undefined}>{c}</span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
      <main className="main" id="main">
        <div className="wrap">
          {view === "painel" && <Dashboard user={user} tickets={visible} isStaff={isStaff} go={go} />}
          {view === "fila" && <TicketList user={user} tickets={visible} isStaff={isStaff} go={go} />}
          {view === "abrir" && <NewTicket onCreate={criar} onCancel={() => go("fila")} />}
          {view === "detalhe" && current && <TicketDetail t={current} user={user} isStaff={isStaff} go={go} addMsg={addMsg} setStatus={setStatus} assume={assume} reatribuir={reatribuir} avaliar={avaliar} />}
          {view === "base" && <Knowledge />}
          {view === "relatorios" && <Reports tickets={tickets} />}
          {view === "gestao" && <Admin />}
        </div>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
