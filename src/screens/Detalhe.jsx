import { useState, useRef, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import { PrioBadge, StatusBadge, Avatar } from "../components/Badge.jsx";
import { api } from "../services/api";
import { userById, atendentes } from "../data/usuarios";
import { catById } from "../data/categorias";
import { dataHora, slaInfo } from "../lib/format";
import { selo } from "../data/requisitos";

const STATUS_OPCOES = ["Em atendimento", "Aguardando solicitante", "Resolvido", "Fechado"];
const origem = api.base.replace(/\/api$/, "");

export default function Detalhe({ t, user, ehStaff, voltar, enviarMsg, assumir, reatribuir, mudarStatus, avaliar }) {
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [nota, setNota] = useState(0);
  const [coment, setComent] = useState("");
  const fim = useRef(null);

  useEffect(() => { fim.current?.scrollIntoView({ behavior: "smooth" }); }, [t?.interacoes?.length]);

  if (!t) return <div className="loading">Carregando chamado…</div>;

  const solic = userById(t.solicitanteId);
  const atend = t.atendenteId ? userById(t.atendenteId) : null;
  const sla = slaInfo(t);
  const encerrado = t.status === "Fechado";
  const souSolic = t.solicitanteId === user.id;

  async function acao(fn) { setErro(""); try { await fn(); } catch (e) { setErro(e.message); } }
  async function enviar() {
    const m = texto.trim(); if (!m) return;
    setTexto(""); setErro("");
    try { await enviarMsg(t.id, m); } catch (e) { setErro(e.message); setTexto(m); }
  }

  return (
    <>
      <div className="pagehead">
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>{t.titulo} <PrioBadge p={t.prioridade} /></h1>
          <p><span className="proto">{t.protocolo}</span> · {catById(t.catId).nome} · aberto por {solic.nome}</p>
        </div>
        <button className="btn sec" onClick={voltar}>Voltar</button>
      </div>

      <div className="detail">
        <div className="card pad">
          <p style={{ marginTop: 0, color: "#334155" }}>{t.descricao}</p>

          {t.anexos?.length > 0 && (
            <div style={{ margin: "4px 0 14px" }}>
              {t.anexos.map((a) => (
                <a className="anexo" key={a.id || a.nome} href={origem + a.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                  <Icon name="clip" size={14} /><span style={{ flex: 1 }}>{a.nome}</span>
                  <span style={{ color: "#64748b" }}>abrir</span>
                </a>
              ))}
            </div>
          )}

          <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "6px 0 14px" }} />

          <div className="thread">
            {(t.interacoes || []).map((it, i) => {
              if (it.tipo === "sys") return <div className="msg sys" key={i}>{it.mensagem} · {dataHora(it.data)}</div>;
              const mine = it.autorId === user.id;
              return (
                <div className={`msg ${mine ? "mine" : "theirs"}`} key={i}>
                  <div className="meta">{mine ? "Você" : (it.autorNome || "—")} · {dataHora(it.data)}</div>
                  {it.mensagem}
                </div>
              );
            })}
            {(t.interacoes || []).filter((x) => x.tipo === "msg").length === 0 && (
              <div className="empty" style={{ padding: 20 }}>Nenhuma mensagem ainda.</div>
            )}
            <div ref={fim} />
          </div>

          {!encerrado && (
            <div className="composer">
              <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva uma mensagem…"
                onKeyDown={(e) => { if (e.key === "Enter") enviar(); }} />
              <button className="btn" onClick={enviar}><Icon name="send" size={16} /> Enviar</button>
            </div>
          )}
          {erro && <p style={{ color: "#b4301a", fontSize: 12.5, fontWeight: 600, marginTop: 8 }} role="alert">{erro}</p>}

          {/* Avaliação (RF09) */}
          {souSolic && ["Resolvido", "Fechado"].includes(t.status) && (
            <div className="prev" style={{ marginTop: 16 }}>
              {t.avaliacao ? (
                <div>Você avaliou: <strong>{"★".repeat(t.avaliacao.nota)}{"☆".repeat(5 - t.avaliacao.nota)}</strong>
                  {t.avaliacao.comentario && <div style={{ color: "#64748b", marginTop: 4 }}>“{t.avaliacao.comentario}”</div>}</div>
              ) : (
                <div>
                  <label>Avalie o atendimento</label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setNota(n)} title={`${n} estrela(s)`}
                        style={{ color: n <= nota ? "#e8a400" : "#cbd5e1", fontSize: 24, lineHeight: 1 }}>
                        {n <= nota ? "★" : "☆"}
                      </button>
                    ))}
                    <span style={{ marginLeft: 8, color: "#64748b" }}>{nota ? `${nota}/5` : ""}</span>
                  </div>
                  <textarea rows={2} style={{ marginTop: 8 }} placeholder="Comentário (opcional)" value={coment} onChange={(e) => setComent(e.target.value)} />
                  <button className="btn orange sm" style={{ marginTop: 8 }} disabled={!nota}
                    onClick={() => acao(() => avaliar(t.id, nota, coment.trim()))}>Enviar avaliação</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lateral */}
        <div className="card side">
          <div className="bloco"><div className="k">Status</div><div className="vv"><StatusBadge s={t.status} /></div></div>
          <div className="bloco"><div className="k">SLA de resolução</div>
            <div className="vv" style={{ color: sla.estado === "ruim" ? "#d4391f" : sla.estado === "alerta" ? "#d98a04" : "#1f9d57" }}>{sla.txt}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>prazo: {dataHora(t.prazoResolucao)}</div></div>
          <div className="bloco"><div className="k">Solicitante</div>
            <div className="vv row-usr" style={{ marginTop: 4 }}><Avatar u={solic} size={28} /> {solic.nome}</div></div>
          <div className="bloco"><div className="k">Responsável</div>
            <div className="vv row-usr" style={{ marginTop: 4 }}>
              {atend ? <><Avatar u={atend} size={28} /> {atend.nome}</> : <span style={{ color: "#94a3b8" }}>não atribuído</span>}</div></div>

          {ehStaff && !encerrado && (
            <div className="bloco" style={{ display: "grid", gap: 10 }}>
              {!t.atendenteId && <button className="btn" onClick={() => acao(() => assumir(t.id))}>Assumir chamado</button>}
              <div>
                <label>Atribuir a (RF05)</label>
                <select value={t.atendenteId || ""} onChange={(e) => acao(() => reatribuir(t.id, Number(e.target.value)))}>
                  <option value="" disabled>Escolher atendente…</option>
                  {atendentes().map((a) => <option key={a.id} value={a.id}>{a.nome} · {a.especialidade || "geral"}</option>)}
                </select>
              </div>
              <div>
                <label>Mudar status (RF06)</label>
                <select value="" onChange={(e) => { const v = e.target.value; if (v) acao(() => mudarStatus(t.id, v)); }}>
                  <option value="">Selecionar…</option>
                  {STATUS_OPCOES.filter((s) => s !== t.status).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="selo">{selo("detalhe").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
