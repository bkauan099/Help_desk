import React, { useState, useRef, useEffect } from "react";
import { T, STATUS, PRIO } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, Btn, Badge, Avatar, Meta, ScreenHead } from "../components/ui.jsx";
import { catById } from "../data/categorias.js";
import { userById } from "../data/usuarios.js";
import { slaInfo } from "../lib/sla.js";
import { fmt } from "../lib/format.js";

// Balão de mensagem do histórico.
function Bubble({ it, mine }) {
  const u = userById(it.autorId);
  const staff = it.perfil !== "solicitante";
  return (
    <div className={"bubble" + (mine ? " mine" : "")}>
      <Avatar u={u} size={30} />
      <div style={{ maxWidth: "78%" }}>
        <div className="brow"><span style={{ fontSize: 12.5, fontWeight: 700 }}>{u.nome.split(" ").slice(0, 2).join(" ")}</span><span className="foot" style={{ margin: 0 }}>{fmt(it.data)}</span>{staff && <Badge c={T.teal}>suporte</Badge>}</div>
        <div className="btext">{it.mensagem}</div>
      </div>
    </div>
  );
}

// Tela Detalhe do chamado — RF04 (atribuição), RF05 (status), RF06 (chat), RF07 (avaliação).
export function TicketDetail({ t, user, isStaff, go, addMsg, setStatus, assume, avaliar }) {
  const [texto, setTexto] = useState("");
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [com, setCom] = useState("");
  const scRef = useRef(null);
  const cat = catById(t.catId), sla = slaInfo(t), sol = userById(t.solicitanteId), at = t.atendenteId ? userById(t.atendenteId) : null;
  const encerrado = t.status === "Fechado";
  const podeAvaliar = !isStaff && t.solicitanteId === user.id && ["Resolvido", "Fechado"].includes(t.status) && !t.avaliacao;

  useEffect(() => { if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight; }, [t.interacoes.length]);

  const next = [];
  if (isStaff) {
    if (t.status === "Aberto") next.push("Em atendimento");
    if (t.status === "Em atendimento") next.push("Aguardando", "Resolvido");
    if (t.status === "Aguardando") next.push("Em atendimento", "Resolvido");
    if (t.status === "Resolvido") next.push("Fechado", "Em atendimento");
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <button className="voltar" onClick={() => go("fila")}><Icon n="back" s={16} /> Voltar para os chamados</button>
      <ScreenHead view="detalhe" titulo={t.titulo} sub={null}
        right={<span className="slabig" style={{ color: sla.c, background: sla.c + "1c", borderColor: sla.c + "44" }}><Icon n="timer" s={15} c={sla.c} /> {sla.label}</span>} />
      <div className="row" style={{ gap: 8, marginTop: -8 }}><span className="proto">{t.protocolo}</span><Badge c={STATUS[t.status].c}>{t.status}</Badge><Badge c={PRIO[t.prioridade]} solid>{t.prioridade}</Badge></div>

      <div className="grid-detail">
        <div className="col" style={{ gap: 16 }}>
          <Card style={{ padding: 16 }}><span className="lab">Descrição do problema</span><p className="desc">{t.descricao}</p></Card>
          <Card cls="chat">
            <div className="chat-head">Histórico e mensagens</div>
            <div className="chat-body" ref={scRef}>
              {t.interacoes.map((it, i) => it.tipo === "sys"
                ? <div key={i} className="sysmsg"><Icon n="activity" s={12} c={T.dim} /> {it.mensagem} · {fmt(it.data)}</div>
                : <Bubble key={i} it={it} mine={it.autorId === user.id} />)}
            </div>
            {!encerrado
              ? <div className="chat-input"><input value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && texto.trim()) { addMsg(t.id, texto); setTexto(""); } }} placeholder="Escreva uma mensagem" aria-label="Mensagem" /><Btn color={T.blue} disabled={!texto.trim()} onClick={() => { addMsg(t.id, texto); setTexto(""); }} aria-label="Enviar"><Icon n="send" s={15} /></Btn></div>
              : <div className="chat-closed">Chamado encerrado — mensagens desativadas.</div>}
          </Card>

          {podeAvaliar && (
            <Card style={{ padding: 16, borderColor: T.amber + "66" }}>
              <div className="row" style={{ gap: 8, marginBottom: 4 }}><Icon n="star" s={17} c={T.amber} fill={T.amber} /><b style={{ fontSize: 14 }}>Avalie o atendimento</b></div>
              <p className="sub" style={{ margin: "0 0 12px", fontSize: 13 }}>Seu retorno ajuda a melhorar o suporte à telemedicina.</p>
              <div className="row" style={{ gap: 6, marginBottom: 12 }}>{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" className="starbtn" aria-label={`${n} estrela(s)`} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setNota(n)}><Icon n="star" s={26} c={T.amber} fill={(hover || nota) >= n ? T.amber : "transparent"} /></button>)}</div>
              <textarea className="inp" rows={2} value={com} onChange={(e) => setCom(e.target.value)} placeholder="Comentário (opcional)" aria-label="Comentário da avaliação" style={{ marginBottom: 12 }} />
              <Btn color={T.amber} disabled={!nota} onClick={() => avaliar(t.id, nota, com)}>Enviar avaliação</Btn>
            </Card>
          )}
          {t.avaliacao && (
            <Card style={{ padding: 16 }}>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}><b style={{ fontSize: 14 }}>Avaliação do solicitante</b><span className="row" style={{ gap: 2 }}>{[1, 2, 3, 4, 5].map((n) => <Icon key={n} n="star" s={15} c={T.amber} fill={t.avaliacao.nota >= n ? T.amber : "transparent"} />)}</span></div>
              {t.avaliacao.comentario && <p className="quote">“{t.avaliacao.comentario}”</p>}
            </Card>
          )}
        </div>

        <div className="col" style={{ gap: 16 }}>
          <Card style={{ padding: 16 }} cls="col meta">
            <Meta label="Categoria" i={cat.icon}>{cat.nome}</Meta>
            <Meta label="Solicitante"><span className="row" style={{ gap: 8 }}><Avatar u={sol} size={26} />{sol.nome}</span></Meta>
            <Meta label="Atendente">{at ? <span className="row" style={{ gap: 8 }}><Avatar u={at} size={26} />{at.nome}</span> : <span className="sub">Ainda não atribuído</span>}</Meta>
            <Meta label="Aberto em" i="clock">{fmt(t.criadoEm)}</Meta>
            <Meta label="Prazo (SLA)" i="timer"><span style={{ color: sla.c, fontWeight: 600 }}>{fmt(sla.dl)}</span></Meta>
          </Card>
          {isStaff && !encerrado && (
            <Card style={{ padding: 16 }} cls="col">
              <b style={{ fontSize: 14 }}>Ações do atendente</b>
              {!t.atendenteId && <Btn color={T.teal} full onClick={() => assume(t.id)}><Icon n="user" s={15} /> Assumir chamado</Btn>}
              {next.map((ns) => <Btn key={ns} full kind={ns === "Resolvido" ? "solid" : "soft"} color={STATUS[ns].c} onClick={() => setStatus(t.id, ns)}><Icon n={STATUS[ns].i} s={15} /> {ns === "Fechado" ? "Fechar chamado" : ns === "Resolvido" ? "Marcar como resolvido" : `Mover para ${ns}`}</Btn>)}
            </Card>
          )}
          {isStaff && encerrado && <Card style={{ padding: 16, textAlign: "center" }}><Icon n="check" s={26} c={T.green} /><div className="sub" style={{ marginTop: 6 }}>Chamado encerrado</div></Card>}
        </div>
      </div>
    </div>
  );
}
