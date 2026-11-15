import React, { useState } from "react";
import { T } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Card, Btn, Badge, Avatar, ScreenHead } from "../components/ui.jsx";
import { USERS, addUser } from "../data/usuarios.js";
import { CATS, addCat } from "../data/categorias.js";

const perfilCor = { solicitante: T.rust, atendente: T.teal, admin: T.amber };

function AdminUsuarios({ bump }) {
  const [nome, setNome] = useState(""); const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("solicitante"); const [cargo, setCargo] = useState("");
  const submit = () => { if (nome.trim().length < 3 || !email.includes("@")) return; addUser(nome, email, perfil, cargo); setNome(""); setEmail(""); setCargo(""); setPerfil("solicitante"); bump(); };
  return (
    <div className="grid-admin">
      <Card cls="list">
        <div className="list-head"><div className="ctit" style={{ margin: 0 }}>Usuários cadastrados ({USERS.length})</div></div>
        {USERS.map((u) => <div key={u.id} className="arow"><Avatar u={u} size={36} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{u.nome}</div><div className="foot" style={{ margin: 0 }}>{u.cargo}</div></div><Badge c={perfilCor[u.perfil]}>{u.perfil}</Badge></div>)}
      </Card>
      <Card style={{ padding: 16 }} cls="col form">
        <div className="row" style={{ gap: 8, fontWeight: 700, fontSize: 14 }}><Icon n="user" s={16} c={T.teal} /> Novo usuário</div>
        <div><label className="lab" htmlFor="a-nome">Nome</label><input id="a-nome" className="inp" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" /></div>
        <div><label className="lab" htmlFor="a-email">E-mail</label><input id="a-email" className="inp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@hospital.br" /></div>
        <div><label className="lab" htmlFor="a-perfil">Perfil</label><select id="a-perfil" className="inp" value={perfil} onChange={(e) => setPerfil(e.target.value)}><option value="solicitante">Solicitante</option><option value="atendente">Atendente</option><option value="admin">Administrador</option></select></div>
        <div><label className="lab" htmlFor="a-cargo">Cargo / setor</label><input id="a-cargo" className="inp" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex.: Médico · Pediatria" /></div>
        <Btn color={T.teal} full disabled={nome.trim().length < 3 || !email.includes("@")} onClick={submit}><Icon n="plus" s={15} /> Cadastrar usuário</Btn>
      </Card>
    </div>
  );
}

function AdminCategorias({ bump }) {
  const [nome, setNome] = useState(""); const [sla, setSla] = useState(4); const [crit, setCrit] = useState(false);
  const submit = () => { if (nome.trim().length < 3) return; addCat(nome, sla, crit); setNome(""); setSla(4); setCrit(false); bump(); };
  return (
    <div className="grid-admin">
      <Card cls="list">
        <div className="list-head"><div className="ctit" style={{ margin: 0 }}>Categorias e SLA ({CATS.length})</div></div>
        {CATS.map((c) => <div key={c.id} className="arow"><span className="catico"><Icon n={c.icon} s={16} c={T.blueLt} /></span><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.nome}</div><div className="foot" style={{ margin: 0 }}>Prazo de SLA: {c.sla} horas</div></div>{c.critico && <Badge c={T.rust}>impacto clínico</Badge>}</div>)}
      </Card>
      <Card style={{ padding: 16 }} cls="col form">
        <div className="row" style={{ gap: 8, fontWeight: 700, fontSize: 14 }}><Icon n="layers" s={16} c={T.blue} /> Nova categoria</div>
        <div><label className="lab" htmlFor="c-nome">Nome</label><input id="c-nome" className="inp" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Rede / conectividade" /></div>
        <div><label className="lab" htmlFor="c-sla">Prazo de SLA (horas)</label><input id="c-sla" className="inp" type="number" min="1" value={sla} onChange={(e) => setSla(e.target.value)} /></div>
        <label className={"impacto" + (crit ? " on" : "")}><input type="checkbox" checked={crit} onChange={(e) => setCrit(e.target.checked)} /><span style={{ fontSize: 13, fontWeight: 600 }}>Categoria com impacto clínico</span></label>
        <Btn color={T.blue} full disabled={nome.trim().length < 3} onClick={submit}><Icon n="plus" s={15} /> Criar categoria</Btn>
      </Card>
    </div>
  );
}

// Tela Gestão — RF01 (cadastro de usuários) e RF03 (categorias/SLA).
export function Admin() {
  const [aba, setAba] = useState("usuarios");
  const [, force] = useState(0);
  const bump = () => force((x) => x + 1);
  return (
    <div className="col" style={{ gap: 16 }}>
      <ScreenHead view="gestao" titulo="Gestão" sub="Administre usuários e categorias de atendimento." />
      <div className="tabs">
        {[["usuarios", "Usuários", "users"], ["categorias", "Categorias", "layers"]].map(([k, l, ic]) =>
          <button key={k} className={"chip" + (aba === k ? " on" : "")} onClick={() => setAba(k)}><Icon n={ic} s={15} /> {l}</button>)}
      </div>
      {aba === "usuarios" ? <AdminUsuarios bump={bump} /> : <AdminCategorias bump={bump} />}
    </div>
  );
}
