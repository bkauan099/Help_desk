import { useState } from "react";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (carregando) return;
    setErro(""); setCarregando(true);
    try {
      const r = await api.login(email.trim(), senha);
      onLogin(r); // { token, usuario }
    } catch (e) {
      setErro(e.message || "Não foi possível entrar");
    } finally {
      setCarregando(false);
    }
  }
  const noEnter = (e) => { if (e.key === "Enter") entrar(); };
  const demo = (em) => { setEmail(em); setSenha("senha123"); setErro(""); };

  return (
    <div className="login-wrap">
      <div className="login">
        <div className="logo">
          <span className="dot">MP</span>
          <div><h2>MP Desk</h2></div>
        </div>
        <p className="sub">Help Desk para Telemedicina Hospitalar</p>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="username" placeholder="voce@hospital.br"
            value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={noEnter} />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" autoComplete="current-password" placeholder="••••••••"
            value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={noEnter} />
        </div>
        {erro && <p className="erro" role="alert">{erro}</p>}

        <button type="button" className="btn" onClick={entrar} disabled={carregando}>
          {carregando ? "Entrando…" : "Entrar"}
        </button>

        <div className="demo">
          <span>Contas de teste (senha <strong>senha123</strong>):</span>
          <div className="row">
            <button type="button" className="btn sec sm" onClick={() => demo("helena.martins@hospital.br")}>Solicitante</button>
            <button type="button" className="btn sec sm" onClick={() => demo("rafael.souza@ti.hospital.br")}>Atendente</button>
            <button type="button" className="btn sec sm" onClick={() => demo("admin@ti.hospital.br")}>Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
