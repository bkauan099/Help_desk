# Relatório da Sprint — S2 (Integração Full-Stack e API)

**UFMA · CCET · Engenharia da Computação**

**Disciplina:** Desenvolvimento de Sistemas Web (EECP0036) · Turma 24N1 · 2026.2

**Prof.:** Renan Sousa Freire

**Projeto:** MP Desk — Help Desk para Telemedicina Hospitalar

**Integrantes:** Bruno Kauan Rodrigues Silva, Cleila Monteiro Dutra Galiza, Dorivan Cunha de Morais, Eduardo Dos Santos Oliveira, Herick Vinicius Pinheiro da Conceição e Juan Pablo Furtado Mondego Macedo

* **Link do repositório:** https://github.com/bkauan099/help_desk
* **Commit ou tag desta entrega:** Relatorio da Sprint - S2

## 1. PLANEJADO E FEITO

> *Nota: Na S2, o protótipo da S1 evoluiu para uma aplicação full-stack funcional e containerizada (Docker Compose), integrando o front-end em React + Vite a uma API REST em Node.js/Express, banco de dados relacional (6 tabelas com migrations e seed), autenticação via JWT, upload de anexos e comunicação em tempo real via WebSocket, cobrindo os requisitos funcionais (RF01-RF07, RF09, RF11-RF13).*

| RF | Descrição curta | Prioridade | Responsável (nome) | Planejado | Feito? |
| :--- | :--- | :--- | :--- | :---: | :---: |
| RF01 | Autenticação de usuários e controle de acesso por perfil | essencial | Bruno Kauan Rodrigues Silva | sim | sim |
| RF02 | Cadastro e gestão de usuários | essencial | Eduardo dos Santos Oliveira | sim | sim |
| RF03 | Abertura de chamado com geração automática de protocolo | essencial | Bruno Kauan Rodrigues Silva | sim | sim |
| RF04 | Categorização e priorização automática (cálculo de SLA) | essencial | Herick Vinicius Pinheiro da Conceição | sim | sim |
| RF05 | Fila de chamados e atribuição a atendente | essencial | Eduardo dos Santos Oliveira | sim | sim |
| RF06 | Acompanhamento de status e histórico do chamado | essencial | Herick Vinicius Pinheiro da Conceição | sim | sim |
| RF07 | Comunicação em tempo real no chamado | essencial | Herick Vinicius Pinheiro da Conceição | sim | sim |
| RF09 | Avaliação do atendimento e cálculo de satisfação | importante | Bruno Kauan Rodrigues Silva | sim | sim |
| RF11 | Base de conhecimento (FAQ / artigos de autoajuda) | importante | Cleila Monteiro Dutra Galiza | sim | sim |
| RF12 | Painel de indicadores e relatórios gerenciais (Dashboard) | importante | Juan Pablo Furtado Mondego Macedo | sim | sim |
| RF13 | Gestão de Categorias | desejável | Juan Pablo Furtado Mondego Macedo | sim | sim |

## 2. ROTEIRO DE TESTE (UM POR RF ENTREGUE)

| RF | Passos | Resultado esperado | Resultado obtido |
| :--- | :--- | :--- | :---: |
| RF01 | Na tela de Login, inserir credenciais válidas de um perfil (Solicitante, Atendente ou Administrador) e clicar em "Entrar" | A API valida o usuário, retorna o token JWT e redireciona para o painel correspondente às permissões do perfil | ok |
| RF02 | Logado como Administrador, acessar a aba "Gestão", preencher os dados de um novo usuário e salvar | O novo usuário é persistido no banco de dados via API e exibido na listagem | ok |
| RF03 | Acessar "+ Abrir chamado", preencher título, categoria, descrição e clicar em "Abrir chamado" | A API registra o chamado no banco, gera um código de protocolo único (ex.: `MPD-XXXX`) e exibe na fila | ok |
| RF04 | Na tela "Abrir chamado", selecionar "Áudio/Vídeo na teleconsulta" e marcar "Está impactando um atendimento clínico agora" | O back-end calcula automaticamente a prioridade crítica e define o prazo de SLA correspondente (2h) | ok |
| RF05 | Na fila de chamados, abrir um ticket e selecionar um profissional em "Atribuir a outro atendente" | O atendente responsável é atualizado no banco de dados e o evento é registrado no histórico | ok |
| RF06 | Acessar "Painel" e "Chamados", filtrar por status (ex.: "Em atendimento") e pesquisar pelo número de protocolo | A API retorna os contadores atualizados e filtra os chamados persistidos conforme os critérios | ok |
| RF07 | Abrir um chamado em duas abas/sessões diferentes (Solicitante e Atendente) e enviar uma mensagem no chat | A mensagem é salva no banco e entregue instantaneamente na outra sessão via WebSocket sem recarregar a página | ok |
| RF08 | Ao abrir ou responder um chamado, anexar um arquivo de imagem/PDF e enviar | O arquivo é armazenado no diretório de uploads da API e fica disponível para download/visualização no chamado | ok |
| RF09 | Alterar o status de um chamado para concluído/resolvido e enviar a nota de avaliação (1 a 5 estrelas) | A avaliação é gravada no banco de dados e atualiza o indicador médio de satisfação no dashboard | ok |
| RF11 | Acessar "Base de conhecimento" e pesquisar por termos como "áudio" ou "vídeo" | A API consulta os artigos cadastrados e filtra as soluções de autoajuda correspondentes | ok |
| RF12 | Acessar a tela "Painel" (Dashboard) com chamados registrados em diferentes status e prioridades | Os gráficos e indicadores exibem métricas reais agregadas do banco (volume por status, SLA cumprido e satisfação) | ok |
| RF13 | Com a fila de chamados aberta, registrar um novo chamado ou alterar o status em outra sessão | A lista e os contadores são atualizados automaticamente em tempo real via eventos WebSocket | ok |

## 3. O QUE A EQUIPE APRENDEU

Na S2, consolidamos a arquitetura full-stack do MP Desk integrando o front-end em React + Vite com o back-end em Node.js/Express, banco de dados relacional (com scripts de *migration* e *seed*) e orquestração via Docker Compose. Os principais aprendizados envolveram a implementação de autenticação baseada em tokens JWT com controle de acesso por perfil, upload de arquivos no servidor, comunicação bidirecional em tempo real com WebSockets para o chat e atualizações da fila, além da organização do fluxo colaborativo de versionamento e integração de código em equipe no Git/GitHub.

## 4. USO DE IA

Ferramentas utilizadas: Gemini / ChatGPT / Claude

O que foi pedido: utilizamos as ferramentas de IA como apoio na estruturação das rotas da API REST em Express, modelagem do esquema relacional (6 tabelas) e scripts de *seed*, configuração do ambiente Docker Compose e integração do cliente WebSocket no front-end. Também utilizamos para revisar regras de negócio de SLA, validar fluxos de integração, em suma, utilizamos as ferramentas para tornar o prototipo funcional e estruturar a documentação e o roteiro de testes desta sprint.