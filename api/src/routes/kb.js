// RF10/RF11 — base de conhecimento (FAQ) com busca.
// Complementar: mantida como conteúdo estático (não usa as 6 tabelas essenciais).
const express = require("express");
const { autenticar } = require("../mw/auth");

const router = express.Router();
router.use(autenticar);

const ARTIGOS = [
  { id: "k1", cat: "Áudio/Vídeo", titulo: "Vídeo travando ou com atraso na teleconsulta",
    conteudo: "Verifique a conexão (ideal ≥ 5 Mbps de upload), feche aplicativos que consomem banda e reabra a sala. Se persistir, reduza a resolução para 720p." },
  { id: "k2", cat: "Áudio/Vídeo", titulo: "Paciente não escuta o médico",
    conteudo: "Confirme o microfone selecionado no navegador e a permissão de áudio. Oriente o paciente a verificar o volume e reentrar na sala." },
  { id: "k3", cat: "Acesso", titulo: "Credenciais inválidas mesmo com a senha correta",
    conteudo: "A conta pode estar bloqueada após tentativas repetidas. Use 'Esqueci minha senha'. Persistindo, o suporte desbloqueia o usuário." },
  { id: "k4", cat: "Prescrição", titulo: "Certificado digital não reconhecido",
    conteudo: "Confirme o token/certificado A3 conectado e o driver instalado. Certificados A1 devem estar importados e válidos." },
  { id: "k5", cat: "Integração", titulo: "Exames não sincronizam com o prontuário",
    conteudo: "A sincronização ocorre a cada 15 min. Se um lote travar, informe o número do pedido para reprocessamento." },
];

router.get("/", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const lista = q ? ARTIGOS.filter((a) => `${a.titulo} ${a.conteudo} ${a.cat}`.toLowerCase().includes(q)) : ARTIGOS;
  res.json(lista);
});

module.exports = router;
