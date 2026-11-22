// Converte linhas do banco para o formato que o front-end já usa (camelCase).
const { situacaoSla } = require("./sla");

function mapChamado(r) {
  return {
    id: r.id,
    protocolo: r.protocolo,
    titulo: r.titulo,
    descricao: r.descricao,
    catId: r.categoria_id,
    prioridade: r.prioridade,
    status: r.status,
    impacto: r.impacto_clinico,
    solicitanteId: r.solicitante_id,
    atendenteId: r.atendente_id,
    criadoEm: r.criado_em,
    resolvidoEm: r.resolvido_em,
    fechadoEm: r.fechado_em,
    prazoResposta: r.prazo_resposta,
    prazoResolucao: r.prazo_resolucao,
    sla: situacaoSla(r),
    avaliacao: r.nota ? { nota: r.nota, comentario: r.comentario_aval, data: r.avaliado_em } : null,
  };
}

const mapInteracao = (r) => (r.tipo === "sys"
  ? { tipo: "sys", mensagem: r.mensagem, data: r.criado_em }
  : { tipo: "msg", autorId: r.autor_id, autorNome: r.autor_nome, perfil: r.autor_perfil, mensagem: r.mensagem, data: r.criado_em });

const mapAnexo = (r) => ({ id: r.id, name: r.nome_arquivo, size: r.tamanho, mime: r.tipo_mime, url: `/uploads/${r.caminho}` });

const mapUsuario = (r) => ({ id: r.id, nome: r.nome, email: r.email, perfil: r.perfil, cargo: r.cargo, especialidade: r.especialidade, ativo: r.ativo });

module.exports = { mapChamado, mapInteracao, mapAnexo, mapUsuario };
