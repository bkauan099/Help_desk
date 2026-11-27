import { useState, useMemo } from "react";
import Icon from "../components/Icon.jsx";
import { selo } from "../data/requisitos";

// Base de conhecimento (RF10) — conteúdo de referência; busca local (RF11).
const ARTIGOS = [
  { id: 1, titulo: "Vídeo trava ou dessincroniza na teleconsulta", categoria: "Áudio/Vídeo",
    resumo: "Passos rápidos quando a imagem congela ou o áudio atrasa.",
    conteudo: "1) Feche outros apps que usam a câmera. 2) Teste a banda em fast.com (ideal ≥ 5 Mbps de upload). 3) Reduza a resolução para 720p nas configurações da sala. 4) Reabra pelo link da consulta. Se houver impacto clínico (consulta em andamento), abra o chamado marcando 'impacto clínico' para prioridade Crítica." },
  { id: 2, titulo: "Credenciais inválidas no portal do médico", categoria: "Acesso",
    resumo: "O login retorna erro mesmo com a senha correta.",
    conteudo: "1) Confirme o e-mail institucional completo. 2) Limpe o cache ou use uma janela anônima. 3) Verifique se o Caps Lock está ativo. 4) Se persistir, o administrador deve conferir se o usuário está ativo (usuário desativado não entra)." },
  { id: 3, titulo: "Certificado digital não assina a prescrição", categoria: "Prescrição",
    resumo: "A assinatura digital falha ao finalizar a prescrição eletrônica.",
    conteudo: "1) Verifique se o token/certificado A3 está conectado. 2) Confira a validade do certificado. 3) Reinstale o driver do dispositivo. 4) Teste em outro navegador homologado." },
  { id: 4, titulo: "Webcam/periférico não é reconhecido", categoria: "Equipamento",
    resumo: "O computador não detecta a câmera ou o microfone externo.",
    conteudo: "1) Troque de porta USB. 2) Verifique as permissões de câmera/microfone do navegador. 3) Reinstale o driver. 4) Teste o periférico em outra máquina para isolar o defeito." },
  { id: 5, titulo: "Como funcionam as prioridades e o SLA", categoria: "Processo",
    resumo: "Entenda como a prioridade e os prazos são definidos (RF04).",
    conteudo: "A prioridade é calculada pela categoria e pelo impacto clínico. Com impacto clínico: Crítica (resposta em 15 min, resolução em 2 h) ou Alta (30 min/4 h). Sem impacto: Média (60 min/8 h) ou Baixa (240 min/24 h). O prazo começa a contar na abertura do chamado." },
];

export default function Base() {
  const [q, setQ] = useState("");
  const [aberto, setAberto] = useState(null);

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ARTIGOS;
    return ARTIGOS.filter((a) => (a.titulo + " " + a.conteudo + " " + a.categoria).toLowerCase().includes(t));
  }, [q]);

  return (
    <>
      <div className="pagehead">
        <div><h1>Base de conhecimento</h1><p>Soluções e procedimentos para os problemas mais comuns.</p></div>
      </div>

      <div className="card pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="search" size={18} />
          <input placeholder="Buscar por título ou palavra-chave…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {lista.map((a) => (
          <div className="card pad" key={a.id} style={{ cursor: "pointer" }} onClick={() => setAberto(aberto === a.id ? null : a.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <strong style={{ color: "#163a52" }}>{a.titulo}</strong>
              <span className="badge st-andamento">{a.categoria}</span>
            </div>
            <p style={{ margin: "6px 0 0", color: "#475569", whiteSpace: "pre-line" }}>
              {aberto === a.id ? a.conteudo : a.resumo}
            </p>
          </div>
        ))}
        {lista.length === 0 && <div className="empty">Nenhum artigo encontrado.</div>}
      </div>

      <div className="selo">{selo("base").map((s) => <span key={s}>{s}</span>)}</div>
    </>
  );
}
