// Artigos da base de conhecimento (RF08).
export const KB = [
  { id: "k1", cat: "Áudio/Vídeo", titulo: "Vídeo travando ou com atraso na teleconsulta",
    conteudo: "Verifique a conexão (ideal ≥ 5 Mbps de upload), feche aplicativos que consomem banda e reabra a sala virtual. Se persistir, reduza a resolução da câmera para 720p nas configurações da sala." },
  { id: "k2", cat: "Áudio/Vídeo", titulo: "Paciente não escuta o médico",
    conteudo: "Confirme se o microfone correto está selecionado no navegador e se a permissão de áudio foi concedida. Oriente o paciente a verificar o volume do dispositivo e a sair/entrar novamente na sala." },
  { id: "k3", cat: "Acesso", titulo: "Credenciais inválidas mesmo com a senha correta",
    conteudo: "A conta pode estar bloqueada após tentativas repetidas. Use 'Esqueci minha senha' para redefinir. Persistindo, o suporte pode desbloquear o usuário e forçar nova senha no primeiro acesso." },
  { id: "k4", cat: "Prescrição", titulo: "Certificado digital não reconhecido",
    conteudo: "Confirme se o token/certificado A3 está conectado e se o driver está instalado. Feche o navegador, reconecte o dispositivo e tente novamente. Certificados A1 devem estar importados e dentro da validade." },
  { id: "k5", cat: "Integração", titulo: "Exames não sincronizam com o prontuário",
    conteudo: "A sincronização ocorre a cada 15 minutos. Se um lote travar, o suporte reprocessa a fila de integração. Informe o número do pedido e o horário aproximado do lançamento." },
];
