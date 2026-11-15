import React from "react";
import { T } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, ScreenHead } from "../components/ui.jsx";
import { CATS } from "../data/categorias.js";
import { slaInfo, fimRes } from "../lib/sla.js";
import { two } from "../lib/format.js";

const cor = (p) => (p >= 80 ? T.green : p >= 60 ? T.amber : T.red);

// Tela Relatórios de SLA — indicadores de gestão (apoia RNF de desempenho).
export function Reports({ tickets }) {
  const enc = tickets.filter((t) => ["Resolvido", "Fechado"].includes(t.status) && fimRes(t));
  const okN = enc.filter((t) => slaInfo(t).ok).length;
  const cumpr = enc.length ? Math.round((okN / enc.length) * 100) : 0;
  const horas = enc.map((t) => (new Date(fimRes(t)) - new Date(t.criadoEm)) / 3600000);
  const hMed = horas.length ? (horas.reduce((a, b) => a + b, 0) / horas.length).toFixed(1) : "—";
  const aval = tickets.filter((t) => t.avaliacao);
  const nota = aval.length ? (aval.reduce((a, t) => a + t.avaliacao.nota, 0) / aval.length).toFixed(1) : "—";

  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    const total = tickets.filter((t) => { const c = new Date(t.criadoEm); c.setHours(0, 0, 0, 0); return c.getTime() === d.getTime(); }).length;
    dias.push({ dia: `${two(d.getDate())}/${two(d.getMonth() + 1)}`, total });
  }
  const maxDia = Math.max(1, ...dias.map((d) => d.total));

  const porCat = CATS.map((c) => {
    const e = enc.filter((t) => t.catId === c.id);
    const ok = e.filter((t) => slaInfo(t).ok).length;
    return { nome: c.nome, total: tickets.filter((t) => t.catId === c.id).length, enc: e.length, perc: e.length ? Math.round((ok / e.length) * 100) : null };
  }).filter((r) => r.total);

  return (
    <div className="col" style={{ gap: 20 }}>
      <ScreenHead view="relatorios" titulo="Relatórios de SLA" sub="Desempenho do suporte e cumprimento dos prazos acordados." />
      <div className="grid3">
        <Card style={{ padding: 18 }}>
          <div className="row sub" style={{ gap: 8, fontWeight: 600, marginBottom: 10 }}><Icon n="gauge" s={16} c={T.green} /> Cumprimento de SLA</div>
          <div className="row" style={{ alignItems: "flex-end", gap: 8 }}><span className="big" style={{ color: cor(cumpr) }}>{cumpr}%</span><span className="foot" style={{ margin: "0 0 6px" }}>{okN}/{enc.length} no prazo</span></div>
          <div className="track" style={{ marginTop: 10 }}><div className="fill" style={{ width: cumpr + "%", background: cor(cumpr) }} /></div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="row sub" style={{ gap: 8, fontWeight: 600, marginBottom: 10 }}><Icon n="trend" s={16} c={T.blue} /> Tempo médio de resolução</div>
          <div className="row" style={{ alignItems: "flex-end", gap: 8 }}><span className="big">{hMed}</span><span className="foot" style={{ margin: "0 0 6px" }}>horas</span></div>
          <div className="foot" style={{ marginTop: 8 }}>{enc.length} chamados encerrados</div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="row sub" style={{ gap: 8, fontWeight: 600, marginBottom: 10 }}><Icon n="star" s={16} c={T.amber} /> Satisfação média</div>
          <div className="row" style={{ alignItems: "flex-end", gap: 8 }}><span className="big">{nota}</span><span className="row" style={{ gap: 2, marginBottom: 8 }}>{[1, 2, 3, 4, 5].map((n) => <Icon key={n} n="star" s={14} c={T.amber} fill={Number(nota) >= n ? T.amber : "transparent"} />)}</span></div>
          <div className="foot" style={{ marginTop: 8 }}>{aval.length} avaliações</div>
        </Card>
      </div>
      <Card style={{ padding: 16 }}>
        <div className="ctit">Chamados abertos nos últimos 7 dias</div>
        <div className="spark">
          {dias.map((d) => <div key={d.dia} className="sparkcol"><div className="sparkbar" style={{ height: (d.total / maxDia) * 100 + "%" }}><span className="sparkval">{d.total}</span></div><span className="foot" style={{ margin: 0 }}>{d.dia}</span></div>)}
        </div>
      </Card>
      <Card cls="list">
        <div className="list-head"><div className="ctit" style={{ margin: 0 }}>Cumprimento por categoria</div></div>
        {porCat.map((r) => (
          <div key={r.nome} className="catrow">
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.nome}</div><div className="foot" style={{ margin: "1px 0 0" }}>{r.total} no total · {r.enc} encerrados</div></div>
            <div style={{ width: 120 }}><div className="track"><div className="fill" style={{ width: (r.perc ?? 0) + "%", background: r.perc == null ? T.dim : cor(r.perc) }} /></div></div>
            <div className="catperc" style={{ color: r.perc == null ? T.dim : cor(r.perc) }}>{r.perc == null ? "—" : r.perc + "%"}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
