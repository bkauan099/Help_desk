import { userById } from "./usuarios.js";

// Helpers de interação (histórico do chamado).
const hAgo = (h) => new Date(Date.now() - h * 3600000);
export const sys = (m, at) => ({ tipo: "sys", mensagem: m, data: at || new Date() });
export const msg = (uid, t, at) => {
  const u = userById(uid);
  return { tipo: "msg", autorId: uid, autorNome: u.nome, perfil: u.perfil, mensagem: t, data: at || new Date() };
};

// Chamados-semente (simulam o banco de dados).
export const SEED = [
  { id: "t1", protocolo: "MPD-1001", titulo: "Vídeo trava durante teleconsulta de cardiologia",
    descricao: "Durante o atendimento remoto, o vídeo do paciente congela a cada 30 segundos e o áudio fica dessincronizado. Preciso concluir a consulta ainda hoje.",
    catId: "c1", prioridade: "Crítica", status: "Em atendimento", impacto: true, solicitanteId: "u1", atendenteId: "u3", criadoEm: hAgo(1.2),
    interacoes: [sys("Chamado aberto", hAgo(1.2)), msg("u1", "A consulta está em andamento, é urgente.", hAgo(1.1)), sys("Chamado assumido por Rafael Souza", hAgo(1.0)), msg("u3", "Estou verificando a largura de banda da sala. Pode reabrir pelo link que enviei?", hAgo(0.9))] },
  { id: "t2", protocolo: "MPD-1002", titulo: "Não consigo autenticar no portal do médico",
    descricao: "Ao inserir usuário e senha, o sistema retorna 'credenciais inválidas', mas a senha está correta.",
    catId: "c2", prioridade: "Média", status: "Aberto", impacto: false, solicitanteId: "u2", atendenteId: null, criadoEm: hAgo(5),
    interacoes: [sys("Chamado aberto", hAgo(5))] },
  { id: "t3", protocolo: "MPD-1003", titulo: "Prescrição eletrônica não é assinada digitalmente",
    descricao: "Ao finalizar a prescrição, o certificado digital não é reconhecido e o documento não pode ser emitido ao paciente.",
    catId: "c3", prioridade: "Alta", status: "Aberto", impacto: true, solicitanteId: "u1", atendenteId: null, criadoEm: hAgo(4),
    interacoes: [sys("Chamado aberto", hAgo(4))] },
  { id: "t4", protocolo: "MPD-1004", titulo: "Exames não aparecem no prontuário integrado",
    descricao: "Os resultados laboratoriais lançados pelo laboratório não estão sincronizando com o prontuário do paciente.",
    catId: "c4", prioridade: "Baixa", status: "Resolvido", impacto: false, solicitanteId: "u2", atendenteId: "u4", criadoEm: hAgo(26), resolvidoEm: hAgo(20),
    interacoes: [sys("Chamado aberto", hAgo(26)), sys("Chamado assumido por Beatriz Lima", hAgo(24)), msg("u4", "Havia uma fila travada na integração. Reprocessei os registros e os exames já aparecem.", hAgo(20)), sys("Status alterado para Resolvido", hAgo(20))] },
  { id: "t5", protocolo: "MPD-1005", titulo: "Webcam da sala 3 não é reconhecida",
    descricao: "O computador da sala de teleconsulta 3 não detecta a webcam externa.",
    catId: "c5", prioridade: "Baixa", status: "Fechado", impacto: false, solicitanteId: "u1", atendenteId: "u3", criadoEm: hAgo(50), resolvidoEm: hAgo(45), fechadoEm: hAgo(43),
    interacoes: [sys("Chamado aberto", hAgo(50)), sys("Chamado assumido por Rafael Souza", hAgo(48)), msg("u3", "Driver reinstalado e cabo trocado. Webcam operando normalmente.", hAgo(45)), sys("Status alterado para Resolvido", hAgo(45)), sys("Status alterado para Fechado", hAgo(43))],
    avaliacao: { nota: 5, comentario: "Atendimento rápido, resolveram antes do próximo turno.", data: hAgo(43) } },
  { id: "t6", protocolo: "MPD-1006", titulo: "Sem áudio ao iniciar teleconsulta pediátrica",
    descricao: "O paciente não escuta o médico ao entrar na sala; o microfone aparece ativo nas configurações.",
    catId: "c1", prioridade: "Crítica", status: "Aberto", impacto: true, solicitanteId: "u2", atendenteId: null, criadoEm: hAgo(0.4),
    interacoes: [sys("Chamado aberto", hAgo(0.4))] },
  { id: "t7", protocolo: "MPD-1007", titulo: "Solicitação de novo acesso para residente",
    descricao: "Preciso liberar acesso ao módulo de teleconsulta para um médico residente que iniciou esta semana.",
    catId: "c6", prioridade: "Baixa", status: "Aguardando", impacto: false, solicitanteId: "u1", atendenteId: "u4", criadoEm: hAgo(9),
    interacoes: [sys("Chamado aberto", hAgo(9)), sys("Chamado assumido por Beatriz Lima", hAgo(8)), msg("u4", "Preciso do CPF e do CRM do residente para criar o cadastro.", hAgo(7.5)), sys("Status alterado para Aguardando", hAgo(7.5))] },
];
