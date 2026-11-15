import React, { useState } from "react";
import { T, PRIO } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, Btn, Badge, ScreenHead } from "../components/ui.jsx";
import { CATS, catById } from "../data/categorias.js";
import { derivePrio } from "../lib/sla.js";

// Tela Abrir chamado — RF02 (abertura) e RF03 (categorização + prioridade/SLA).
export function NewTicket({ onCreate, onCancel }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [catId, setCatId] = useState("c1");
  const [impacto, setImpacto] = useState(false);
  const cat = catById(catId);
  const prio = derivePrio(cat, impacto);
  const ok = titulo.trim().length >= 5 && descricao.trim().length >= 10;

  return (
    <div style={{ maxWidth: 720 }}>
      <button className="voltar" onClick={onCancel}><Icon n="back" s={16} /> Voltar</button>
      <ScreenHead view="abrir" titulo="Abrir chamado" sub="Descreva o problema técnico. A prioridade é calculada automaticamente." />
      <Card style={{ padding: 20, marginTop: 4 }} cls="col form">
        <div>
          <label className="lab" htmlFor="f-tit">Título</label>
          <input id="f-tit" className="inp" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Vídeo trava durante a teleconsulta" />
        </div>
        <div>
          <span className="lab">Categoria</span>
          <div className="catgrid" role="radiogroup" aria-label="Categoria do chamado">
            {CATS.map((c) => {
              const on = catId === c.id;
              return (
                <button key={c.id} type="button" role="radio" aria-checked={on} className={"catopt" + (on ? " on" : "")} onClick={() => setCatId(c.id)}>
                  <Icon n={c.icon} s={17} c={on ? T.blueLt : T.muted} />
                  <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.nome}</div><div className="foot" style={{ margin: 0 }}>SLA {c.sla}h{c.critico ? " · impacto clínico" : ""}</div></div>
                  {on && <Icon n="check" s={16} c={T.blueLt} />}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="lab" htmlFor="f-desc">Descrição</label>
          <textarea id="f-desc" className="inp" rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="O que está acontecendo, quando começou e se afeta um atendimento em andamento." />
        </div>
        <label className={"impacto" + (impacto ? " on" : "")}>
          <input type="checkbox" checked={impacto} onChange={(e) => setImpacto(e.target.checked)} />
          <div><div style={{ fontSize: 13.5, fontWeight: 600 }}>Está impactando um atendimento clínico agora</div><div className="sub" style={{ fontSize: 12 }}>Chamados com impacto clínico recebem prioridade elevada.</div></div>
        </label>
        <div className="priobox">
          <span className="row sub" style={{ gap: 8 }}><Icon n="alert" s={16} c={PRIO[prio]} /> Prioridade calculada</span>
          <span className="row" style={{ gap: 8 }}><Badge c={PRIO[prio]} solid>{prio}</Badge><span className="foot" style={{ margin: 0 }}>· prazo SLA {cat.sla}h</span></span>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Btn color={T.rust} disabled={!ok} onClick={() => onCreate({ titulo, descricao, catId, impacto })}><Icon n="send" s={15} /> Abrir chamado</Btn>
          <Btn kind="ghost" onClick={onCancel}>Cancelar</Btn>
          {!ok && <span className="foot" style={{ margin: 0, alignSelf: "center" }}>Preencha título e descrição.</span>}
        </div>
      </Card>
    </div>
  );
}
