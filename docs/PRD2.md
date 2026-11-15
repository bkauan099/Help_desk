# PRD — MP Desk (versão 2.0)

**Help Desk para Telemedicina Hospitalar**

*Documento de Requisitos do Produto — v2.0*

| Campo | Valor | 
| ----- | ----- | 
| **Projeto** | MP Desk — Help Desk para Telemedicina Hospitalar | 
| **Disciplina** | Desenvolvimento de Sistemas Web (EECP0036) · Turma 24N12 · 2026.2 | 
| **Professor** | Renan Sousa Freire | 
| **Versão** | 2.0 | 
| **Data** | 15/11/2026 | 
| **Repositório** | https://github.com/bkauan099/help_desk | 
| **Integrantes** | Bruno Kauan Rodrigues Silva, Cleila Monteiro Dutra Galiza, Dorivan Cunha de Morais, Eduardo Dos Santos Oliveira, Herick Vinicius Pinheiro da Conceição e Juan Pablo Furtado Mondego Macedo | 

## 1. VISÃO E PROBLEMA

* **Contexto:** O MP Desk é um sistema web de help desk (central de chamados) voltado ao suporte técnico das teleconsultas hospitalares. Médicos e equipe de enfermagem abrem chamados quando enfrentam falhas técnicas durante o atendimento remoto (áudio/vídeo, acesso, prescrição eletrônica, integração com o prontuário), e a equipe de TI recebe, prioriza, atende e resolve essas ocorrências conforme prazos de SLA proporcionais ao impacto clínico.

* **Problema:** Durante uma teleconsulta, uma falha técnica interrompe um atendimento de saúde em andamento. Hoje esses pedidos de suporte chegam por canais informais (telefone, mensagens), sem registro centralizado, sem priorização automática por urgência clínica e sem visibilidade de acompanhamento da resolução.

* **Proposta de valor:** Centralizar a abertura e o atendimento de chamados de suporte em telemedicina, priorizando automaticamente incidentes com impacto clínico em curso e dando transparência de status e SLA para solicitantes, atendentes e gestores.

### Público-alvo (Personas)

| Persona | Quem é | O que precisa | Como resolve hoje | 
| ----- | ----- | ----- | ----- | 
| **Solicitante** | Médico(a) ou equipe de enfermagem | Abrir chamados rapidamente com evidências (prints), acompanhar o status, conversar com o suporte e avaliar o atendimento | Liga para o ramal da TI ou manda mensagem informal sem número de protocolo | 
| **Atendente** | Técnico(a) de TI (N1/N2) | Visualizar fila ordenada por prioridade/SLA, assumir ou reatribuir chamados, interagir no histórico e registrar soluções na FAQ | Atende por ordem de chegada sem saber qual chamado tem consulta em andamento | 
| **Administrador** | Coordenação de TI | Gerenciar usuários/perfis, configurar categorias e prazos de SLA e acompanhar indicadores de desempenho | Consolida dados manualmente em planilhas sem visão em tempo real | 

## 2. OBJETIVOS E MÉTRICAS

| Objetivo | Como medir | Meta | 
| ----- | ----- | ----- | 
| **Cumprir prazos de atendimento (SLA)** | Percentual de chamados resolvidos dentro do prazo de SLA acordado | $\ge 85\%$ dos chamados dentro do prazo | 
| **Agilizar resposta a incidentes clínicos** | Tempo médio de 1ª resposta e de resolução por categoria e prioridade | 1ª resposta em $\le 15$ min para chamados Críticos | 
| **Aumentar a qualidade do suporte** | Média das notas de avaliação (1 a 5 estrelas) registradas pelos solicitantes | Nota média $\ge 4,5$ | 
| **Garantir rastreabilidade completa** | Percentual de chamados com protocolo único e histórico de transições | $100\%$ dos atendimentos registrados no sistema | 

## 3. ESCOPO

* **Incluído nesta fase (S1 — Protótipo navegável):** Autenticação simulada por perfil; abertura de chamado com anexos; categorização e cálculo automático de prioridade e SLA; fila de chamados; atribuição e reatribuição a atendentes; troca de mensagens; mudança de status; avaliação do atendimento; base de conhecimento (FAQ); indicadores de gestão; administração de usuários e categorias.

* **Fora de escopo nesta fase (Não objetivos da S1):** Integração real com a plataforma externa de telemedicina e com o prontuário eletrônico; back-end em produção (o protótipo S1 utiliza dados de demonstração em memória); aplicativo móvel nativo.

## 4. REQUISITOS FUNCIONAIS (RF)

| ID | Requisito (O sistema deve...) | Prioridade | Critério de aceite (como testar) | 
| ----- | ----- | ----- | ----- | 
| **RF01** | O sistema deve autenticar usuários por e-mail e senha e liberar telas e ações de acordo com o perfil (solicitante, atendente ou administrador). | Essencial | Com credenciais válidas, o usuário entra no painel do seu perfil; com senha errada, aparece “e-mail ou senha inválidos” e nenhuma sessão é criada; um solicitante que acessa uma rota de administrador recebe erro 403. | 
| **RF02** | O sistema deve permitir que o administrador cadastre, edite e desative usuários, definindo perfil, setor, especialidade e CRM (quando médico). | Importante | Usuário desativado não consegue entrar; e-mail já cadastrado é recusado. | 
| **RF03** | O sistema deve permitir que o solicitante abra um chamado com título, descrição, categoria, indicação “consulta em andamento” e até 3 anexos (imagem ou PDF, 5 MB cada), gerando um protocolo único. | Essencial | Formulário válido gera protocolo no formato `MPD-AAAA-NNNNN` e status “Aberto” na tela; com título ou categoria vazios, o envio é bloqueado com mensagem no campo; anexo acima de 5 MB é recusado. | 
| **RF04** | O sistema deve calcular automaticamente a prioridade e os prazos de primeira resposta e de resolução de cada chamado, conforme a tabela da seção 4.1. | Essencial | Chamado com “consulta em andamento” recebe prioridade Crítica e prazo de 1ª resposta igual à abertura + 15 min; chamado de Acesso sem impacto clínico recebe Média (+4 h); testes unitários cobrem as 4 prioridades e a pausa do relógio. | 
| **RF05** | O sistema deve mostrar aos atendentes uma fila ordenada por prioridade e prazo de SLA e permitir atribuir o chamado a si, a outro atendente ou automaticamente (por especialidade e menor carga). | Essencial | Um chamado Crítico novo aparece no topo da fila; ao ser atribuído, mostra o responsável e o status “Em atendimento”; a atribuição automática escolhe o atendente da especialidade com menos chamados abertos. | 
| **RF06** | O sistema deve registrar cada mudança de status (Aberto, Em atendimento, Aguardando solicitante, Resolvido, Fechado) com data, hora e autor, e só permitir que atendentes e administradores alterem o status. | Essencial | Após cada mudança, o histórico do chamado mostra a nova linha; o solicitante não vê o botão de alterar status e a API devolve 403 se ele tentar. | 
| **RF07** | O sistema deve permitir a troca de mensagens entre solicitante e atendente dentro do chamado, registrando autor, data e hora. | Essencial | A mensagem enviada aparece para o outro participante sem recarregar a página (em até 2 s) e continua no histórico após novo login. | 
| **RF08** | O sistema deve notificar em tempo real novos chamados, mudanças de status, novas mensagens e chamados que atingiram 80% do prazo de SLA. | Importante | Com dois navegadores abertos, a ação em um gera o aviso no outro; um chamado de teste com prazo curto gera alerta ao atingir 80%. | 
| **RF09** | O sistema deve permitir que o solicitante avalie o chamado fechado com nota de 1 a 5 e comentário opcional, uma única vez. | Importante | O botão “Avaliar” só aparece em chamados “Fechado”; uma segunda avaliação é recusada. | 
| **RF10** | O sistema deve permitir que atendentes publiquem artigos na base de conhecimento, por categoria, e que qualquer usuário os busque por palavra-chave. | Importante | Artigo publicado aparece na busca por um termo do título; rascunho não aparece para solicitantes. | 
| **RF11** | O sistema deve sugerir artigos da base de conhecimento relacionados ao título digitado durante a abertura do chamado. | Desejável | Ao digitar “câmera” no título, aparecem artigos da categoria Áudio/vídeo. | 
| **RF12** | O sistema deve exibir ao administrador um dashboard com chamados por status, categoria e prioridade, percentual dentro do SLA, tempos médios de primeira resposta e de resolução e nota média, com filtro por período. | Importante | Os números do dashboard conferem com uma contagem manual na massa de testes. | 
| **RF13** | O sistema deve permitir que o administrador cadastre categorias e altere os prazos de SLA de cada prioridade. | Desejável | O novo prazo vale para os chamados abertos depois da alteração. | 
| **RF14** | O sistema deve permitir que o solicitante reabra um chamado “Resolvido” em até 48 h e fechar automaticamente os chamados sem resposta após esse prazo. | Desejável | A reabertura volta o status para “Em atendimento” com o mesmo atendente; o job fecha chamados resolvidos há mais de 48 h. | 

### 

## 5. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Qualidade | Requisito (mensurável) | Como verificar | 
| ----- | ----- | ----- | ----- | 
| **RNF01** | Desempenho | Painel, fila e tela do chamado carregam em até 2 s, e a API responde em até 500 ms em 95% das requisições, com 50 usuários simultâneos. | Lighthouse (Performance $\ge 80$) e teste de carga simples (k6 ou autocannon). | 
| **RNF02** | Tempo real | Mensagens e notificações chegam em até 2 s; se a conexão WebSocket cair, a SPA reconecta sozinha em até 10 s. | Teste com dois navegadores e queda forçada do servidor. | 
| **RNF03** | Usabilidade | Abrir chamado em até 3 cliques a partir do painel; nota SUS $\ge 70$ no teste com 5 usuários; mensagens de erro em português dizendo o que corrigir. | Questionário SUS aplicado após o teste de usabilidade. | 
| **RNF04** | Acessibilidade | Cumpre o checklist da seção 7.1 das Especificações: contraste de pelo menos 4,5:1 no texto comum; cada campo com label ligado; uso completo pelo teclado, com foco visível; texto alternativo nas imagens que informam; funciona em tela de celular e de computador. Além disso: prioridade e status indicados por texto ou ícone, não só por cor, e HTML semântico (`header`, `nav`, `main`) com idioma `pt-BR` declarado. | Checklist 7.1 aplicado a cada tela em todas as entregas; Lighthouse Accessibility $\ge 90$; navegação manual só com teclado. | 
| **RNF05** | Compatibilidade | Funciona nas duas últimas versões de Chrome, Firefox, Edge e Safari, com layout responsivo de 360 px (celular) a 1920 px. | Teste manual nos navegadores e no modo dispositivo do DevTools (360, 768 e 1366 px). | 
| **RNF06** | Privacidade (LGPD) | Guarda apenas: nome, e-mail, perfil, setor, especialidade e CRM (médicos), para identificar o solicitante, controlar o acesso e encaminhar o chamado; a senha só como hash bcrypt; e o conteúdo de chamados, mensagens e anexos, para resolver e auditar o atendimento. Não guarda dados clínicos de pacientes, e o formulário avisa para não anexar telas com esses dados. Tudo trafega por HTTPS e as ações sobre chamados ficam em log de auditoria. | Revisão do esquema do banco (nenhuma coluna fora da lista) e inspeção das requisições no DevTools (HTTPS; senha nunca aparece nas respostas da API). | 
| **RNF07** | Segurança | Token JWT com expiração de 8 h; autorização conferida no back-end em toda rota; no máximo 5 tentativas de login por minuto por IP; entradas validadas no servidor; nenhuma chave ou senha no repositório nem no histórico (segredos só em `.env`, fora do Git); texto vindo de usuários ou da API exibido como texto (`textContent` / escape padrão do React, sem `innerHTML`). | Testes de API (Jest + Supertest) com token expirado, perfil errado e dados inválidos; busca por segredos no histórico do Git antes de cada entrega. | 
| **RNF08** | Robustez | Entrada vazia ou inválida e falha de rede ou da API mostram mensagem clara ao usuário, sem tela em branco e sem erros no console. | Roteiro de teste com campos vazios, API desligada e rede desativada no DevTools. | 
| **RNF09** | Manutenibilidade | Código organizado em módulos (rotas, controllers, services), API documentada em OpenAPI/Swagger, ESLint e Prettier, e ambiente que sobe com um único comando (Docker Compose). | Um integrante que não escreveu o código consegue rodar o projeto seguindo só o README. | 

## 6. HISTÓRIAS DE USUÁRIO

| História | Critério de aceite | RF | 
| ----- | ----- | ----- | 
| Como médico(a), quero fazer login com meu e-mail institucional e acessar apenas as funções do meu perfil, para manter a segurança dos dados. | Login válido abre o painel do solicitante; acesso a rotas administrativas retorna erro 403. | RF01 | 
| Como administrador, quero cadastrar e desativar usuários informando setor, especialidade e CRM, para controlar quem acessa o suporte. | Usuário desativado tem login bloqueado; e-mail duplicado é recusado. | RF02 | 
| Como médico(a) em teleconsulta, quero abrir um chamado com anexos e marcar “consulta em andamento”, para receber atendimento imediato. | Gera protocolo `MPD-AAAA-NNNNN`, valida anexos até 5 MB e define prioridade Crítica (1ª resposta em 15 min). | RF03, RF04 | 
| Como atendente de TI, quero ver a fila ordenada por prioridade/SLA e usar atribuição automática, para atender primeiro os casos mais graves. | Chamados Críticos ficam no topo; atribuição automática seleciona o técnico da especialidade com menor carga. | RF05 | 
| Como atendente de TI, quero atualizar o status do chamado e trocar mensagens em tempo real com o solicitante, para resolver o problema rapidamente. | Histórico grava autor/data/hora; mensagem aparece sem recarregar a página em até 2 s. | RF06, RF07 | 
| Como atendente de TI, quero receber alertas quando um chamado atingir 80% do prazo de SLA, para evitar estouro de prazo. | Alerta em tempo real é disparado automaticamente ao atingir 80% do tempo limite. | RF08 | 
| Como solicitante, quero avaliar o atendimento após o fechamento e poder reabrir em até 48 h caso o problema volte, para garantir a solução definitiva. | Avaliação única disponível apenas em `Fechado`; reabertura em `Resolvido` dentro de 48 h retorna para `Em atendimento`. | RF09, RF14 | 
| Como solicitante, quero ver sugestões de artigos da FAQ enquanto digito o título do chamado, para resolver problemas simples sem esperar suporte. | Ao digitar termo correspondente (ex.: “câmera”), artigos publicados da categoria são exibidos. | RF10, RF11 | 

## 7. FLUXOS PRINCIPAIS

* **Fluxo 1 · Abertura e Priorização:** `Login (RF01)` → `+ Abrir chamado (RF03)` → preencher título (visualizando sugestões da FAQ — `RF11`), categoria, descrição, anexos (até 3 arquivos de 5 MB) e marcar “consulta em andamento” → sistema calcula prioridade e prazos de SLA (`RF04`) → gera protocolo `MPD-AAAA-NNNNN` com status `Aberto`.

* **Fluxo 2 · Triagem, Atendimento e Comunicação:** `Fila de chamados (RF05)` (ordenada por prioridade e SLA) → atendente assume ou sistema atribui automaticamente por especialidade/menor carga → status muda para `Em atendimento` com registro no histórico (`RF06`) → troca de mensagens em tempo real (`RF07`) + alertas de 80% do SLA (`RF08`).

* **Fluxo 3 · Encerramento, Reabertura e Avaliação:** Atendente marca como `Resolvido` (`RF06`) → solicitante pode reabrir em até 48 h voltando para `Em atendimento`, ou o sistema fecha automaticamente após 48 h (`RF14`) → com status `Fechado`, solicitante registra avaliação única de 1 a 5 estrelas (`RF09`) → métricas atualizam o `Dashboard (RF12)`.

## 8. DADOS

Estrutura detalhada das entidades de dados e armazenamento do MP Desk:

| Entidade | Campos | Onde fica | 
| ----- | ----- | ----- | 
| **Usuario** | `id`, `nome`, `email` (único), `senha_hash`, `perfil` (`solicitante` | `atendente` | 
| **Categoria** | `id`, `nome`, `descricao`, `prioridade_padrao`, `ativa` | PostgreSQL | 
| **RegraSLA** | `prioridade` (`crítica` | `alta` | 
| **Chamado** | `id`, `protocolo` (único), `titulo`, `descricao`, `categoria_id`, `solicitante_id`, `atendente_id`, `consulta_em_andamento`, `prioridade`, `status`, `prazo_primeira_resposta`, `prazo_resolucao`, `primeira_resposta_em`, `aberto_em`, `resolvido_em`, `fechado_em` | PostgreSQL | 
| **Interacao (mensagem)** | `id`, `chamado_id`, `autor_id`, `mensagem`, `criado_em` | PostgreSQL | 
| **Anexo** | `id`, `chamado_id`, `interacao_id` (opcional), `nome_original`, `tipo_mime`, `tamanho_bytes`, `caminho`, `enviado_em` | Arquivo no volume `uploads/`; metadados no PostgreSQL | 

## 9. ARQUITETURA, TELAS E RASTREABILIDADE

### 9.1. Arquitetura e Tecnologias

* **Front-end:** Aplicação Single Page Application (SPA) desenvolvida em **React + Vite**, com tema institucional (paleta PET-Saúde), roteamento protegido por perfil e componentes modulares.

* **Back-end e Tempo Real (S2/S3):** API REST documentada em OpenAPI/Swagger, autenticação por token JWT (expiração de 8h), controle de acesso por perfil (RBAC), comunicação em tempo real via WebSockets para chat e notificações de SLA, e job agendado para fechamento automático após 48h. Organizado em módulos (rotas, controllers, services) e conteinerizados via Docker Compose.

### 9.2. Inventário das 8 Telas e Matriz de Rastreabilidade ($RF \times Tela$)

| \# | Tela | Essencial? | Requisitos Atendidos | 
| ----- | ----- | ----- | ----- | 
| **1** | Login | Sim | RF01 | 
| **2** | Painel (Visão Geral / Dashboard) | Sim | RF05 | 
| **3** | Fila de chamados | Sim | RF05 | 
| **4** | Abrir chamado | Sim | RF03, RF04, RF11 | 
| **5** | Detalhe do chamado | Sim | RF05, RF06, RF07, RF09 | 
| **6** | Base de conhecimento (FAQ) | Sim | RF11 | 
| **7** | Relatórios de SLA | Apoio (gestão) | RF12 | 
| **8** | Gestão (Usuários e Categorias/SLA) | Sim | RF01, RF02 | 

## 10. PLANO DE SPRINTS

O projeto possui **6 Requisitos Funcionais Essenciais** (`RF01`, `RF03`, `RF04`, `RF05`, `RF06`, `RF07`), **5 Importantes** (`RF02`, `RF08`, `RF09`, `RF10`, `RF12`) e **3 Desejáveis** (`RF11`, `RF13`, `RF14`).

* **Meta mínima S2:** $25\%$ dos essenciais $= 2$ RFs funcionais validados.

* **Meta mínima S3:** $60\%$ dos essenciais $= 4$ RFs funcionais validados.

* **Entrega Final:** $100\%$ dos essenciais ($6/6$) + importantes e desejáveis.

| Sprint | Escopo / RFs Planejados | Responsáveis | 
| ----- | ----- | ----- | 
| **S1 (Protótipo)** | Protótipo navegável em React + Vite com as 8 telas e fluxo simulado completo | Bruno Kauan, Eduardo Dos Santos, Herick Vinicius | 
| **S2** | **RF01** (Autenticação/RBAC), **RF03** (Abertura com protocolo/anexos) e **RF04** (Cálculo automático de prioridade e SLA) + **RF02** (Gestão de usuários) | Bruno Kauan, Herick Vinicius, Eduardo Dos Santos | 
| **S3** | **RF05** (Fila ordenada e atribuição automática), **RF06** (Histórico de status) e **RF07** (Chat em tempo real) + **RF08** (Notificações SLA) | Cleila Monteiro, Dorivan Cunha, Juan Pablo | 
| **Entrega Final** | **RF09** (Avaliação), **RF10** (FAQ), **RF12** (Dashboard SLA) e desejáveis (**RF11**, **RF13**, **RF14**) + testes de acessibilidade | Toda a equipe | 

## 11. RISCOS E DEPENDÊNCIAS

| Risco | Mitigação / O que faremos | 
| ----- | ----- | 
| **Divergência no cálculo de prazos de SLA e pausa do relógio** | Centralizar a regra de cálculo em módulo isolado e cobrir as 4 prioridades e cenários de pausa com testes unitários automatizados (RF04). | 
| **Falha ou lentidão na entrega de mensagens e alertas em tempo real** | Implementar conexão via WebSocket/SSE com fallback de reconexão automática e validar latência $\le 2\text{ s}$ entre dois navegadores (RF07, RF08). | 
| **Upload de arquivos inválidos ou acima do limite (5 MB)** | Validar extensão (imagem/PDF) e tamanho tanto no front-end quanto na API antes do armazenamento (RF03). | 
| **Conflitos de merge no Git perto do prazo de entrega** | Dividir tarefas por módulos/arquivos independentes, realizar `git pull` antes de iniciar alterações e manter commits pequenos e frequentes. | 

## 12. EQUIPE E HISTÓRICO DE VERSÕES

### Divisão da Equipe

* **Bruno Kauan Rodrigues Silva:** Arquitetura inicial, configuração do projeto, estilização global (paleta PET-Saúde) e autenticação.

* **Herick Vinicius Pinheiro da Conceição:** Modelagem de dados, regras de negócio (cálculo de SLA/prioridade), componentes compartilhados e documentação.

* **Eduardo Dos Santos Oliveira:** Implementação das interfaces de usuário, telas de gestão, relatórios e fluxos de atendimento.

* **Cleila Monteiro Dutra Galiza, Dorivan Cunha de Morais e Juan Pablo Furtado Mondego Macedo:** Desenvolvimento de funcionalidades back-end/front-end, testes de critérios de aceite, usabilidade e acessibilidade.

### Histórico de Mudanças

| Versão | Data | Mudanças | 
| ----- | ----- | ----- | 
| **1.0** | 07/11/2026 | Primeira versão do PRD com escopo inicial e requisitos preliminares do sistema MP Desk. | 
| **2.0** | 15/11/2026 | Consolidação completa dos **14 Requisitos Funcionais (RF01 a RF14)**, dos **9 Requisitos Não Funcionais (RNF01 a RNF09)**, especificação do modelo de dados PostgreSQL e diretrizes de arquitetura/Docker. | 
