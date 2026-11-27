import { useEffect, useState, useCallback, useRef } from "react";
import { api, setToken } from "./services/api";
import { conectarWs } from "./services/ws";
import { setUsers } from "./data/usuarios";
import { setCats } from "./data/categorias";
import { pctSla } from "./lib/sla";
import TopNav from "./components/TopNav.jsx";
import Login from "./screens/Login.jsx";
import Painel from "./screens/Painel.jsx";
import Chamados from "./screens/Chamados.jsx";
import NovoChamado from "./screens/NovoChamado.jsx";
import Detalhe from "./screens/Detalhe.jsx";
import Base from "./screens/Base.jsx";
import Relatorios from "./screens/Relatorios.jsx";
import Gestao from "./screens/Gestao.jsx";

const CORES = ["#1498b4", "#e8622a", "#163a52"];
const iniciais = (n) => (n || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const normUser = (u) => ({ ...u, ini: iniciais(u.nome), cor: CORES[(u.id || 0) % CORES.length] });

export default function App() {
  const [user, setUser] = useState(null);
  const [tickets, setTk] = useState([]);
  const [view, setView] = useState("painel");
  const [sel, setSel] = useState(null);
  const [pronto, setPronto] = useState(false);
  const [bootando, setBootando] = useState(true);
  const [notifs, setNotifs] = useState([]); // RF08

  const go = (v, id = null) => { setSel(id); setView(v); };

  const upsert = useCallback((ch) => setTk((ts) => {
    const i = ts.findIndex((t) => t.id === ch.id);
    if (i < 0) return [ch, ...ts];
    const n = [...ts]; n[i] = { ...n[i], ...ch }; return n;
  }), []);

  // ---- notificações (RF08) ----
  const ticketsRef = useRef(tickets); ticketsRef.current = tickets;
  const notifId = useRef(1);
  const slaAvisado = useRef(new Set());
  const notificar = useCallback((icon, cor, titulo, texto, ticketId) => {
    setNotifs((ns) => [{ id: "n" + (notifId.current++), icon, cor, titulo, texto, ticketId, data: new Date(), lida: false }, ...ns].slice(0, 30));
  }, []);
  const abrirNotif = (n) => {
    setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, lida: true } : x)));
    if (n.ticketId) go("detalhe", n.ticketId);
  };
  const lerTodas = () => setNotifs((ns) => ns.map((x) => ({ ...x, lida: true })));

  const carregarCatalogos = useCallback(async () => {
    const [cats, uss, chs] = await Promise.all([api.categorias(), api.usuarios(), api.listarChamados()]);
    setCats(cats); setUsers(uss); setTk(chs); setPronto(true);
  }, []);

  // sessão salva
  useEffect(() => {
    (async () => {
      try { const me = await api.me(); setUser(normUser(me)); await carregarCatalogos(); }
      catch { setToken(null); }
      finally { setBootando(false); }
    })();
  }, [carregarCatalogos]);

  // WebSocket (RF07) + atualizações de chamado (RF05/RF06) + notificações (RF08)
  useEffect(() => {
    if (!user) return;
    return conectarWs((ev) => {
      if (ev.tipo === "nova_mensagem") {
        if (ev.interacao && ev.interacao.autorId === user.id) return; // a minha já foi anexada
        setTk((ts) => ts.map((t) => t.id === ev.chamadoId
          ? { ...t, interacoes: [...(t.interacoes || []), ev.interacao] } : t));
        const t = ticketsRef.current.find((x) => x.id === ev.chamadoId);
        notificar("activity", "#3f7cb4", "Nova mensagem", `${t ? t.protocolo : "Chamado"} · ${ev.interacao.autorNome || ""}`, ev.chamadoId);
      } else if (ev.tipo === "chamado_criado") {
        upsert(ev.chamado);
        if (user.perfil !== "solicitante") notificar("inbox", "#1498b4", "Novo chamado", `${ev.chamado.protocolo} · ${ev.chamado.titulo}`, ev.chamado.id);
      } else if (ev.tipo === "chamado_atualizado") {
        upsert(ev.chamado);
        notificar("activity", "#1498b4", "Chamado atualizado", `${ev.chamado.protocolo} → ${ev.chamado.status}`, ev.chamado.id);
      }
    });
  }, [user, upsert, notificar]);

  // RF08 — aviso quando um chamado atinge 80% do prazo de SLA
  useEffect(() => {
    if (!user) return;
    const iv = setInterval(() => {
      for (const t of ticketsRef.current) {
        const aberto = !["Resolvido", "Fechado"].includes(t.status);
        if (aberto && !slaAvisado.current.has(t.id) && pctSla(t) >= 0.8) {
          slaAvisado.current.add(t.id);
          notificar("alert", "#e0a32e", "SLA em 80%", `${t.protocolo} atingiu 80% do prazo`, t.id);
        }
      }
    }, 15000);
    return () => clearInterval(iv);
  }, [user, notificar]);

  // detalhe: busca interações/anexos completos
  useEffect(() => {
    if (view !== "detalhe" || !sel) return;
    api.chamado(sel).then(upsert).catch(() => {});
  }, [view, sel, upsert]);

  async function aoLogar({ token, usuario }) {
    setToken(token); setUser(normUser(usuario)); await carregarCatalogos(); go("painel");
  }
  function sair() { setToken(null); setUser(null); setTk([]); setPronto(false); setView("painel"); setNotifs([]); }

  // ---- ações ----
  async function criar(d) { // RF03
    const fd = new FormData();
    fd.append("titulo", d.titulo);
    fd.append("descricao", d.descricao);
    fd.append("categoria_id", d.catId);
    fd.append("impacto_clinico", d.impacto ? "true" : "false");
    (d.anexos || []).forEach((f) => fd.append("anexos", f));
    const ch = await api.abrirChamado(fd);
    upsert(ch); go("detalhe", ch.id);
  }
  async function enviarMsg(id, texto) { // RF07
    const it = await api.enviarMensagem(id, texto);
    setTk((ts) => ts.map((t) => t.id === id ? { ...t, interacoes: [...(t.interacoes || []), it] } : t));
  }
  const assumir = (id) => api.assumir(id).then(upsert);
  const reatribuir = (id, aid) => api.atribuir(id, aid).then(upsert); // RF05
  const mudarStatus = (id, s) => api.mudarStatus(id, s).then(upsert); // RF06
  const avaliar = (id, n, c) => api.avaliar(id, n, c).then(upsert);   // RF09
  const reabrir = (id) => api.reabrir(id).then(upsert);               // RF14

  if (bootando) return <div className="loading">Carregando…</div>;
  if (!user) return <Login onLogin={aoLogar} />;

  const atual = sel ? tickets.find((t) => t.id === sel) : null;
  const ehStaff = user.perfil === "atendente" || user.perfil === "admin";
  const isAdmin = user.perfil === "admin";

  return (
    <>
      <TopNav user={user} view={view} go={go} sair={sair}
        notifs={notifs} onAbrirNotif={abrirNotif} onLerTodas={lerTodas} />
      <main className="wrap">
        {!pronto ? <div className="loading">Carregando dados…</div> : (
          <>
            {view === "painel" && <Painel user={user} tickets={tickets} go={go} ehStaff={ehStaff} />}
            {view === "chamados" && <Chamados tickets={tickets} go={go} />}
            {view === "novo" && <NovoChamado onCreate={criar} voltar={() => go("chamados")} />}
            {view === "detalhe" && (
              <Detalhe t={atual} user={user} ehStaff={ehStaff} voltar={() => go("chamados")}
                enviarMsg={enviarMsg} assumir={assumir} reatribuir={reatribuir}
                mudarStatus={mudarStatus} avaliar={avaliar} reabrir={reabrir} />
            )}
            {view === "base" && <Base isStaff={ehStaff} />}
            {view === "relatorios" && isAdmin && <Relatorios />}
            {view === "gestao" && isAdmin && <Gestao />}
          </>
        )}
      </main>
    </>
  );
}
