import React from "react";
import { T, STATUS, PRIO } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, Btn, ScreenHead } from "../components/ui.jsx";
import { Donut, Bars } from "../components/charts.jsx";
import { TicketTable, Empty } from "../components/TicketRow.jsx";
import { CATS } from "../data/categorias.js";
import { RFS, SCREEN_RF, TELA_NOME } from "../data/requisitos.js";
import { slaInfo } from "../lib/sla.js";

// Tile de contador no estilo GLPI (bloco colorido com número grande).
const Tile = ({ num, label, bg, i }) => (
  <div className="tile" style={{ background: bg }}>
    <Icon n={i} s={20} c="#fff" style={{ opacity: 0.4 }} />
    <div className="tnum">{num}</div>
    <div className="tlab">{label}</div>
  </div>
);

// Mapa de rastreabilidade RF x Tela (nenhum requisito essencial sem tela).
function CoverageMap() {
  return (
    <Card style={{ padding: 16 }}>
      <div className="ctit">Cobertura de requisitos — RF × Tela</div>
      <p className="sub" style={{ margin: "0 0 12px" }}>Cada requisito funcional essencial é atendido por pelo menos uma tela do protótipo.</p>
      <div className="cov">
        {Object.keys(RFS).map((id) => {
          const telas = Object.keys(SCREEN_RF).filter((v) => SCREEN_RF[v].includes(id)).map((v) => TELA_NOME[v]);
          return (<div key={id} className="covrow"><span className="rfchip" title={RFS[id]}>{id}</span><span className="covnome">{RFS[id]}</span><span className="covtelas">{telas.join(" · ")}</span></div>);
        })}
      </div>
    </Card>
  );
}

// Tela Painel — RF05 (acompanhamento / visão geral).
export function Dashboard({ user, tickets, isStaff, go }) {
  const count = (s) => tickets.filter((t) => t.status === s).length;
  const emAberto = tickets.filter((t) => ["Aberto", "Em atendimento", "Aguardando"].includes(t.status));
  const vencidos = emAberto.filter((t) => { const s = slaInfo(t); return s.left < 0; }).length;
  const resolvidos = tickets.filter((t) => ["Resolvido", "Fechado"].includes(t.status)).length;

  const byStatus = Object.keys(STATUS).map((k) => ({ name: k, value: count(k), c: STATUS[k].c })).filter((d) => d.value);
  const byCat = CATS.map((c) => ({ name: c.nome.split(" ")[0], value: tickets.filter((t) => t.catId === c.id).length })).filter((d) => d.value);
  const byPrio = ["Crítica", "Alta", "Média", "Baixa"].map((p) => ({ name: p, value: tickets.filter((t) => t.prioridade === p).length, c: PRIO[p] })).filter((d) => d.value);
  const aval = tickets.filter((t) => t.avaliacao);
  const nota = aval.length ? (aval.reduce((a, t) => a + t.avaliacao.nota, 0) / aval.length).toFixed(1) : "—";
  const recentes = [...tickets].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)).slice(0, 6);

  return (
    <div className="col" style={{ gap: 16 }}>
      <ScreenHead view="painel" titulo={isStaff ? "Painel de atendimento" : `Olá, ${user.nome.split(" ").slice(-1)}`}
        sub={isStaff ? "Visão geral dos chamados de suporte à telemedicina." : "Acompanhe seus chamados e abra novas solicitações."}
        right={!isStaff && <Btn color={T.rust} onClick={() => go("abrir")}><Icon n="plus" s={16} /> Abrir chamado</Btn>} />

      <div className="tiles">
        <Tile num={count("Aberto")} label="Novos" bg={T.green} i="circle" />
        <Tile num={count("Em atendimento")} label="Em atendimento" bg={T.teal} i="activity" />
        <Tile num={count("Aguardando")} label="Aguardando" bg={T.amber} i="clock" />
        <Tile num={vencidos} label="SLA atrasado" bg={T.red} i="alert" />
        <Tile num={resolvidos} label="Resolvidos" bg={T.blue} i="check" />
        <Tile num={tickets.length} label="Total" bg={T.navy} i="inbox" />
      </div>

      <div className="grid3">
        <Card style={{ padding: 16 }}><div className="ctit">Chamados por status</div><Donut data={byStatus} /></Card>
        <Card style={{ padding: 16 }}><div className="ctit">Chamados por categoria</div><Bars data={byCat} /></Card>
        <Card style={{ padding: 16 }}>
          <div className="ctit">Prioridade</div><Bars data={byPrio} />
          {isStaff && <div className="notarow"><Icon n="star" s={18} c={T.amber} fill={T.amber} /><b style={{ fontSize: 20, color: T.navy }}>{nota}</b><span className="sub" style={{ fontSize: 12.5 }}>satisfação média ({aval.length})</span></div>}
        </Card>
      </div>

      <Card cls="tablecard">
        <div className="list-head"><div className="ctit" style={{ margin: 0 }}>Chamados recentes</div><button className="linkbtn" onClick={() => go("fila")}>Ver todos</button></div>
        {recentes.length === 0 ? <Empty go={go} /> : <TicketTable tickets={recentes} isStaff={isStaff} go={go} compact />}
      </Card>

      <CoverageMap />
    </div>
  );
}
