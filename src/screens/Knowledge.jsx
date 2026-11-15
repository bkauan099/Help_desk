import React, { useState } from "react";
import { T } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, ScreenHead } from "../components/ui.jsx";
import { KB } from "../data/kb.js";

// Tela Base de conhecimento — RF08 (FAQ pesquisável).
export function Knowledge() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const list = KB.filter((a) => `${a.titulo} ${a.conteudo} ${a.cat}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="col" style={{ gap: 16, maxWidth: 780 }}>
      <ScreenHead view="base" titulo="Base de conhecimento" sub="Soluções rápidas para os problemas mais comuns antes de abrir um chamado." />
      <div className="searchbox big"><Icon n="search" s={17} c={T.dim} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar artigo" aria-label="Buscar artigo" /></div>
      <div className="col" style={{ gap: 10 }}>
        {list.length === 0 && <div className="sub" style={{ textAlign: "center", padding: 20 }}>Nenhum artigo encontrado para “{q}”.</div>}
        {list.map((a) => {
          const on = open === a.id;
          return (
            <Card key={a.id} cls="kb">
              <button className="kb-head" aria-expanded={on} onClick={() => setOpen(on ? null : a.id)}>
                <span className="kb-dot" />
                <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontWeight: 600, fontSize: 14.5 }}>{a.titulo}</div><div className="foot" style={{ margin: "2px 0 0" }}>{a.cat}</div></div>
                <Icon n="chevron" s={18} c={T.dim} style={{ transform: on ? "rotate(90deg)" : "none", transition: "transform .18s" }} />
              </button>
              {on && <div className="kb-body">{a.conteudo}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
