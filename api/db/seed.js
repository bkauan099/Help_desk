// Popula dados de demonstração. Senha de todos: senha123
const bcrypt = require("bcryptjs");
const { pool } = require("../src/db");

const hAgo = (h) => new Date(Date.now() - h * 3600000);

async function main() {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    await c.query("TRUNCATE kb_artigos, anexos, interacoes, chamados, regras_sla, categorias, usuarios RESTART IDENTITY CASCADE");
    const senha = await bcrypt.hash("senha123", 10);

    // Regras de SLA (RF04)
    const regras = [["Crítica", 15, 2], ["Alta", 30, 4], ["Média", 60, 8], ["Baixa", 240, 24]];
    for (const [p, resp, resol] of regras)
      await c.query("INSERT INTO regras_sla (prioridade,primeira_resposta_min,resolucao_horas) VALUES ($1,$2,$3)", [p, resp, resol]);
    const regraDe = Object.fromEntries(regras.map(([p, r, h]) => [p, { r, h }]));

    // Usuários
    const u = {};
    const users = [
      ["Dra. Helena Martins", "helena.martins@hospital.br", "solicitante", "Médica · Cardiologia", null],
      ["Enf. Marcos Vieira", "marcos.vieira@hospital.br", "solicitante", "Enfermagem · UTI", null],
      ["Rafael Souza", "rafael.souza@ti.hospital.br", "atendente", "Suporte N2", "Infraestrutura"],
      ["Beatriz Lima", "beatriz.lima@ti.hospital.br", "atendente", "Suporte N1", "Aplicações"],
      ["Carlos Nunes", "carlos.nunes@ti.hospital.br", "atendente", "Suporte N2", "Integração"],
      ["Coord. TI", "admin@ti.hospital.br", "admin", "Coordenação de TI", null],
    ];
    for (const [nome, email, perfil, cargo, esp] of users) {
      const r = await c.query(
        "INSERT INTO usuarios (nome,email,senha_hash,perfil,cargo,especialidade) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
        [nome, email, senha, perfil, cargo, esp]);
      u[email] = r.rows[0].id;
    }

    // Categorias (RF13)
    const cat = {};
    const cats = [
      ["Áudio/Vídeo na teleconsulta", true, "Infraestrutura", "video"],
      ["Acesso e autenticação", false, "Aplicações", "shield"],
      ["Prescrição eletrônica", true, "Aplicações", "steth"],
      ["Integração / prontuário", false, "Integração", "cpu"],
      ["Equipamento / periférico", false, "Infraestrutura", "monitor"],
      ["Outros", false, "Geral", "tag"],
    ];
    for (const [nome, crit, esp, icon] of cats) {
      const r = await c.query("INSERT INTO categorias (nome,critico,especialidade,icon) VALUES ($1,$2,$3,$4) RETURNING id", [nome, crit, esp, icon]);
      cat[nome] = r.rows[0].id;
    }

    let seq = 0;
    const proto = () => `MPD-${new Date().getFullYear()}-${String(++seq).padStart(5, "0")}`;
    async function chamado(d, inter = [], aval) {
      const base = d.criado;
      const reg = regraDe[d.prioridade];
      const pResp = new Date(base.getTime() + reg.r * 60000);
      const pResol = new Date(base.getTime() + reg.h * 3600000);
      const r = await c.query(
        `INSERT INTO chamados (protocolo,titulo,descricao,categoria_id,prioridade,status,impacto_clinico,
            solicitante_id,atendente_id,prazo_resposta,prazo_resolucao,criado_em,resolvido_em,fechado_em)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
        [proto(), d.titulo, d.descricao, d.cat, d.prioridade, d.status, d.impacto, d.solic, d.atend || null,
         pResp, pResol, base, d.resolvido || null, d.fechado || null]);
      const id = r.rows[0].id;
      for (const it of inter)
        await c.query("INSERT INTO interacoes (chamado_id,autor_id,tipo,mensagem,criado_em) VALUES ($1,$2,$3,$4,$5)",
          [id, it.autor || null, it.tipo, it.msg, it.at]);
      if (aval) await c.query("UPDATE chamados SET nota=$2,comentario_aval=$3,avaliado_em=$4 WHERE id=$1", [id, aval.nota, aval.com, aval.at]);
    }

    const helena = u["helena.martins@hospital.br"], marcos = u["marcos.vieira@hospital.br"];
    const rafael = u["rafael.souza@ti.hospital.br"], bia = u["beatriz.lima@ti.hospital.br"];

    await chamado(
      { titulo: "Vídeo trava durante teleconsulta de cardiologia", descricao: "O vídeo do paciente congela a cada 30s e o áudio dessincroniza. Consulta em andamento.",
        cat: cat["Áudio/Vídeo na teleconsulta"], prioridade: "Crítica", status: "Em atendimento", impacto: true, solic: helena, atend: rafael, criado: hAgo(1.2) },
      [{ tipo: "sys", msg: "Chamado aberto (Crítica)", at: hAgo(1.2) },
       { tipo: "msg", autor: helena, msg: "A consulta está em andamento, é urgente.", at: hAgo(1.1) },
       { tipo: "sys", msg: "Chamado assumido por Rafael Souza", at: hAgo(1.0) },
       { tipo: "msg", autor: rafael, msg: "Verificando a banda da sala. Pode reabrir pelo link?", at: hAgo(0.9) }]);

    await chamado(
      { titulo: "Não consigo autenticar no portal do médico", descricao: "Retorna 'credenciais inválidas', mas a senha está correta.",
        cat: cat["Acesso e autenticação"], prioridade: "Baixa", status: "Aberto", impacto: false, solic: marcos, criado: hAgo(5) },
      [{ tipo: "sys", msg: "Chamado aberto (Baixa)", at: hAgo(5) }]);

    await chamado(
      { titulo: "Prescrição eletrônica não é assinada digitalmente", descricao: "Certificado digital não é reconhecido ao finalizar a prescrição.",
        cat: cat["Prescrição eletrônica"], prioridade: "Alta", status: "Aberto", impacto: true, solic: helena, criado: hAgo(4) },
      [{ tipo: "sys", msg: "Chamado aberto (Alta)", at: hAgo(4) }]);

    await chamado(
      { titulo: "Webcam da sala 3 não é reconhecida", descricao: "O computador não detecta a webcam externa.",
        cat: cat["Equipamento / periférico"], prioridade: "Baixa", status: "Fechado", impacto: false, solic: helena, atend: rafael, criado: hAgo(50), resolvido: hAgo(45), fechado: hAgo(43) },
      [{ tipo: "sys", msg: "Chamado aberto (Baixa)", at: hAgo(50) },
       { tipo: "sys", msg: "Chamado assumido por Rafael Souza", at: hAgo(48) },
       { tipo: "msg", autor: rafael, msg: "Driver reinstalado e cabo trocado. Webcam operando.", at: hAgo(45) },
       { tipo: "sys", msg: "Status alterado para Resolvido por Rafael Souza", at: hAgo(45) },
       { tipo: "sys", msg: "Status alterado para Fechado por Rafael Souza", at: hAgo(43) }],
      { nota: 5, com: "Atendimento rápido, resolveram antes do próximo turno.", at: hAgo(43) });

    // Base de conhecimento (RF10)
    const artigos = [
      ["Áudio/Vídeo", "Vídeo travando ou com atraso na teleconsulta", "Verifique a conexão (ideal ≥ 5 Mbps de upload), feche aplicativos que consomem banda e reabra a sala. Se persistir, reduza a resolução para 720p.", rafael],
      ["Áudio/Vídeo", "Paciente não escuta o médico", "Confirme o microfone selecionado no navegador e a permissão de áudio. Oriente o paciente a verificar o volume e reentrar na sala.", rafael],
      ["Acesso", "Credenciais inválidas mesmo com a senha correta", "A conta pode estar bloqueada após tentativas repetidas. Use 'Esqueci minha senha'. Persistindo, o suporte desbloqueia o usuário.", bia],
      ["Prescrição", "Certificado digital não reconhecido", "Confirme o token/certificado A3 conectado e o driver instalado. Certificados A1 devem estar importados e válidos.", bia],
      ["Integração", "Exames não sincronizam com o prontuário", "A sincronização ocorre a cada 15 min. Se um lote travar, informe o número do pedido para reprocessamento.", rafael],
    ];
    for (const [categoria, titulo, conteudo, autor] of artigos)
      await c.query("INSERT INTO kb_artigos (categoria,titulo,conteudo,autor_id) VALUES ($1,$2,$3,$4)", [categoria, titulo, conteudo, autor]);

    await c.query("COMMIT");
    console.log("Seed concluído. Logins: helena.martins@hospital.br · rafael.souza@ti.hospital.br · admin@ti.hospital.br — senha: senha123");
  } catch (e) { await c.query("ROLLBACK"); throw e; }
  finally { c.release(); await pool.end(); }
}

main().catch((e) => { console.error("Falha no seed:", e); process.exit(1); });
