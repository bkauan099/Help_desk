# Relatório da Sprint — S1 (Protótipo)

**UFMA · CCET · Engenharia da Computação**

**Disciplina:** Desenvolvimento de Sistemas Web (EECP0036) · Turma 24N1 · 2026.2

**Prof.:** Renan Sousa Freire

**Projeto:** MP Desk — Help Desk para Telemedicina Hospitalar

**Integrantes:** Bruno Kauan Rodrigues Silva, Cleila Monteiro Dutra Galiza, Dorivan Cunha de Morais, Eduardo Dos Santos Oliveira, Herick Vinicius Pinheiro da Conceição e Juan Pablo Furtado Mondego Macedo

* **Link do repositório:** https://github.com/bkauan099/help_desk

* **Commit ou tag desta entrega:** Relatorio da Sprint - S1

## 1. PLANEJADO E FEITO

> *Nota: Na S1 (Protótipo navegável em React + Vite), as 8 telas cobrem visualmente e de forma simulada todos os requisitos funcionais essenciais (RF01 a RF07) para validação de fluxo.*

| RF | Descrição curta | Prioridade | Responsável (nome) | Planejado | Feito? | 
| ----- | ----- | ----- | ----- | ----- | ----- | 
| RF01 | Autenticação de usuários | essencial | Bruno Kauan Rodrigues Silva | sim | sim (protótipo) | 
| RF02 | Cadastro de usuários | essencial | Eduardo dos Santos Oliveira | sim | sim | 
| RF03 | Abertura de chamado | essencial | Bruno Kauan Rodrigues Silva | sim | sim (protótipo) | 
| RF04 | Categorização e priorização (SLA) | essencial | Herick Vinicius Pinheiro da Conceição | sim | sim (protótipo) | 
| RF05 | Fila de chamadas e Atribuição a atendente | essencial | Eduardo dos Santos Oliveira | sim | sim (protótipo) | 
| RF06 | Acompanhamento de status | essencial | Herick Vinicius Pinheiro da Conceição | sim | sim (protótipo) | 
| RF07 | Comunicação no chamado | essencial | Herick Vinicius Pinheiro da Conceição | sim | sim (protótipo) | 
| RF09 | Avaliação do atendimento | importante | Bruno Kauan Rodrigues Silva | sim | sim (protótipo) | 
| RF11 | Base de conhecimento (FAQ) | importante | Eduardo Dos Santos Oliveira | sim | sim (protótipo) | 

## 2. ROTEIRO DE TESTE (UM POR RF ENTREGUE)

| RF | Passos | Resultado esperado | Resultado obtido | 
| ----- | ----- | ----- | ----- | 
| RF01 | Na tela de Login, selecionar o perfil "Atendente" e clicar em "Entrar" | O sistema autentica de forma simulada direcionando para a visão do perfil | ok | 
| RF02 | Na tela de Login, selecionar o perfil "Administrador" e clicar em "Entrar"; depois acessar a aba "Gestão" | O sistema permite listar/cadastrar usuários | ok | 
| RF03 | Acessar "+ Abrir chamado", preencher título, categoria, descrição, anexar arquivo e clicar em "Abrir chamado" | O formulário valida os campos obrigatórios e registra o chamado na fila de demonstração | ok | 
| RF04 | Na tela "Abrir chamado", selecionar "Áudio/Vídeo na teleconsulta" e marcar "Está impactando um atendimento clínico agora" | A prioridade é calculada automaticamente como elevada/crítica com prazo de SLA correspondente (2h) | ok | 
| RF05 | Abrir o detalhe do chamado `MPD-1001` e selecionar outro profissional em "Atribuir a outro atendente" | O responsável pelo chamado é atualizado e registrado no histórico | ok | 
| RF06 | Acessar "Painel" e "Chamados", filtrar pela aba "Em atendimento" e buscar por `MPD-1001` | Os contadores exibem o resumo por status e a tabela filtra corretamente o chamado pesquisado | ok | 
| RF07 | No detalhe do chamado `MPD-1001`, digitar uma resposta no campo "Escreva uma mensagem" e enviar | A mensagem aparece na linha do tempo do histórico com identificação do autor e horário | ok | 
| RF09 | Abrir o detalhe do chamado `MPD-1001`, alterar o status para concluído/resolvido e realizar a avaliação do chamado | O formulário/opção de avaliação por estrelas fica disponível e reflete na média de satisfação (5.0) | ok | 
| RF11 | Acessar "Base de conhecimento" e digitar "áudio" ou "vídeo" no campo "Buscar artigo" | A lista filtra e exibe os artigos de autoajuda correspondentes antes da abertura de chamado | ok | 

## 3. O QUE A EQUIPE APRENDEU

Na S1, estruturamos o protótipo navegável completo em React + Vite com 8 telas cobrindo todos os RFs essenciais e indicadores de SLA, validando as diferenças de permissão entre Solicitante, Atendente e Administrador. O maior desafio foi modelar a regra de cálculo automático de prioridade/SLA vinculada ao impacto clínico na teleconsulta. Para a S2, fica a verificação de usuabilidade e acessibilidade do sistema, além dos outros RFs não implementados neste sprint com critérios de aceite validados.

## 4. USO DE IA

Ferramentas utilizadas: Gemini/ ChatGPT / Claude

O que foi pedido: pedimos auxílio para estruturar os dados fictícios (mock) dos chamados hospitalares e componentes de layout em React; revisamos os textos médicos, ajustamos os cálculos de prazo de SLA e adaptamos os estados de navegação para refletir os 3 perfis de usuário. Alem disso, utilizamos as ferramentas para auxilio nas confecção dos artefatos de sprint apresentado.