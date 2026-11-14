# PRD — MP Desk (Help Desk para Telemedicina Hospitalar)

**Documento de Requisitos do Produto — versão 2.0**

> Consolida o PRD1 e o alinha ao protótipo navegável. Ajuste os campos entre
> `«...»` com os dados oficiais da equipe antes de entregar.

| Campo | Valor |
|---|---|
| Projeto | MP Desk — Help Desk para Telemedicina Hospitalar |
| Disciplina | «disciplina / turma» |
| Professor | «nome do professor» |
| Versão | 2.0 |
| Data | «data de entrega» |
| Repositório | «link do GitHub» |
| Protótipo navegável | «link do artefato / GitHub Pages» |

### Equipe

| Integrante | Matrícula | Função principal |
|---|---|---|
| Bruno Kauan Rodrigues Silva | «matrícula» | «ex.: front-end / base do projeto» |
| Herick Vinícius | «matrícula» | «ex.: requisitos / PRD» |
| «Integrante 3» | «matrícula» | «ex.: telas de fluxo» |
| «Integrante 4» | «matrícula» | «ex.: dados / regras» |

---

## 1. Visão geral

O **MP Desk** é um sistema web de *help desk* (central de chamados) voltado ao
**suporte técnico das teleconsultas hospitalares**. Médicos e equipe de
enfermagem abrem chamados quando enfrentam problemas técnicos durante o
atendimento remoto (áudio/vídeo, acesso, prescrição eletrônica, integração com
o prontuário); a equipe de TI recebe, prioriza, atende e resolve esses
chamados, com prazos de atendimento (SLA) proporcionais ao impacto clínico.

## 2. Problema e justificativa

Durante uma teleconsulta, uma falha técnica não é só um inconveniente: ela
**interrompe um atendimento de saúde em andamento**. Hoje esses pedidos de
suporte chegam por canais informais (telefone, mensagens), sem registro,
sem priorização por urgência clínica e sem forma de acompanhar a resolução.
O MP Desk centraliza esses chamados, **prioriza automaticamente** os que
afetam um atendimento em curso e dá visibilidade do andamento para todas as
partes.

## 3. Objetivos

- Centralizar a abertura e o acompanhamento dos chamados de suporte.
- Priorizar por impacto clínico, com prazos de SLA por categoria.
- Reduzir o tempo de resolução de incidentes que afetam teleconsultas.
- Registrar histórico e satisfação para melhoria contínua do suporte.

### Fora de escopo (nesta entrega)

- Integração real com a plataforma de telemedicina e com o prontuário.
- Back-end em produção (o protótipo usa dados de demonstração em memória).
- Aplicativo móvel nativo.

## 4. Personas / perfis de usuário

| Perfil | Quem é | Faz no sistema |
|---|---|---|
| **Solicitante** | Médico(a) ou equipe de enfermagem | Abre chamados, acompanha o status, conversa com o suporte e avalia o atendimento |
| **Atendente** | Técnico(a) de TI (N1/N2) | Assume chamados, responde, altera o status e resolve |
| **Administrador** | Coordenação de TI | Vê indicadores, gere usuários e categorias de SLA |

## 5. Requisitos Funcionais (RF)

> **Nota de versão:** no PRD1 a lista pulava do RF01 para o RF03 (o RF02 não
> aparecia). No PRD2 o **RF02 — Abertura de chamado** foi reinserido e a
> numeração ficou contínua (RF01 a RF08). Confira se a numeração oficial da
> equipe segue esta ordem.

| ID | Requisito | Descrição | Prioridade | Tela(s) |
|---|---|---|---|---|
| **RF01** | Autenticação e cadastro de usuários | Permitir login e identificação por perfil (solicitante, atendente, administrador), com acesso adequado a cada um. | Alta | Login, Gestão |
| **RF02** | Abertura de chamado | Registrar um novo chamado com título, descrição, categoria e indicação de impacto clínico, gerando um número de protocolo. | Alta | Abrir chamado |
| **RF03** | Categorização e priorização (SLA) | Classificar o chamado por categoria e calcular automaticamente a prioridade e o prazo de SLA, elevando a prioridade quando há impacto clínico. | Alta | Abrir chamado, Gestão |
| **RF04** | Atribuição a atendente | Permitir que um atendente assuma o chamado, tornando-se responsável por ele. | Média | Detalhe do chamado |
| **RF05** | Acompanhamento de status | Exibir e atualizar o status (Aberto, Em atendimento, Aguardando, Resolvido, Fechado) e permitir acompanhar a fila e o histórico. | Alta | Painel, Fila de chamados, Detalhe do chamado |
| **RF06** | Comunicação no chamado | Troca de mensagens entre solicitante e atendente dentro do chamado, com autor e data/hora. | Média | Detalhe do chamado |
| **RF07** | Avaliação do atendimento | Após o encerramento, permitir que o solicitante avalie o atendimento (nota de 1 a 5 e comentário). | Baixa | Detalhe do chamado |
| **RF08** | Base de conhecimento (FAQ) | Disponibilizar artigos de autoajuda pesquisáveis para os problemas mais comuns. | Média | Base de conhecimento |

## 6. Requisitos Não Funcionais (RNF)

| ID | Requisito | Descrição | Prioridade |
|---|---|---|---|
| **RNF01** | Segurança e privacidade (LGPD) | Dados em trânsito sob HTTPS/TLS e controle de acesso por perfil; tratamento de dados sensíveis de saúde conforme a LGPD. | Alta |
| **RNF02** | Disponibilidade | Operação contínua (24×7), por dar suporte a atendimentos hospitalares. | Alta |
| **RNF03** | Desempenho | Respostas das telas/consultas em menos de 2 s em uso normal. | Média |
| **RNF04** | Usabilidade e acessibilidade | Interface responsiva e acessível (ver seção 9). | Média |
| **RNF05** | Escalabilidade e manutenibilidade | Código modular e arquitetura que suporte crescimento de usuários/hospitais. | Média |

## 7. Regras de negócio

- **RN01** — Apenas usuários autenticados podem abrir chamados.
- **RN02** — Chamado com **impacto clínico** recebe prioridade elevada (e menor prazo de SLA).
- **RN03** — Somente atendente/administrador altera o status do chamado.
- **RN04** — A avaliação só é permitida após o chamado ser Resolvido ou Fechado.
- **RN05** — Todo chamado deve ter categoria e prioridade definidas na abertura.
- **RN06** — As transições de status seguem um fluxo definido (ver seção 8).

## 8. Inventário de telas e fluxos essenciais

O protótipo tem **8 telas/estados navegáveis** (7 essenciais ligadas a RFs +
Relatórios de gestão). Cada tela exibe, no topo, o selo dos RFs que atende.

| # | Tela | Essencial? | RFs |
|---|---|---|---|
| 1 | Login | Sim | RF01 |
| 2 | Painel | Sim | RF05 |
| 3 | Fila de chamados | Sim | RF05 |
| 4 | Abrir chamado | Sim | RF02, RF03 |
| 5 | Detalhe do chamado | Sim | RF04, RF05, RF06, RF07 |
| 6 | Base de conhecimento | Sim | RF08 |
| 7 | Relatórios de SLA | Apoio (gestão) | — |
| 8 | Gestão | Sim | RF01, RF03 |

**Fluxo principal — abrir e resolver um chamado:**

1. Solicitante faz login (RF01) e clica em *Abrir chamado*.
2. Preenche título, categoria e descrição; marca impacto clínico se houver (RF02).
3. O sistema calcula prioridade e prazo de SLA e gera o protocolo (RF03).
4. O chamado entra na fila; um atendente o assume (RF04).
5. Solicitante e atendente trocam mensagens (RF06); o status evolui (RF05).
6. O atendente marca como Resolvido e depois Fechado (RF05).
7. O solicitante avalia o atendimento (RF07).

**Transições de status válidas:**
`Aberto → Em atendimento → {Aguardando ↔ Em atendimento} → Resolvido → Fechado`.

## 9. Matriz de rastreabilidade (RF × Tela)

Garante que **nenhum requisito essencial fica sem tela**.

| RF | Atendido nas telas |
|---|---|
| RF01 | Login · Gestão |
| RF02 | Abrir chamado |
| RF03 | Abrir chamado · Gestão |
| RF04 | Detalhe do chamado |
| RF05 | Painel · Fila de chamados · Detalhe do chamado |
| RF06 | Detalhe do chamado |
| RF07 | Detalhe do chamado |
| RF08 | Base de conhecimento |

## 10. Checklist 7.1 — Responsivo e acessível

Ver `docs/CHECKLIST-7.1.md` para a lista verificável item a item.
Resumo do que o protótipo já atende: layout responsivo (desktop/tablet/celular)
sem rolagem horizontal; navegação por teclado com foco visível; marcos
semânticos (`nav`, `main`, `header`); rótulos em todos os campos; `aria-*` em
abas, itens de navegação e acordeões; contraste adequado; respeito a
*reduzir movimento*; e idioma `pt-BR`.

## 11. Priorização (visão geral)

- **Essencial (Must):** RF01, RF02, RF03, RF05.
- **Importante (Should):** RF04, RF06, RF08.
- **Desejável (Could):** RF07 e os relatórios de gestão.

## 12. Métricas de sucesso

- % de chamados resolvidos dentro do SLA (meta inicial: ≥ 85%).
- Tempo médio de resolução por categoria.
- Satisfação média do atendimento (nota de 1 a 5).

## 13. Histórico de versões

| Versão | Data | Mudanças |
|---|---|---|
| 1.0 | «data» | Primeira versão do PRD. |
| 2.0 | «data» | Reinserção do **RF02** (numeração contínua RF01–RF08); inventário das 8 telas; matriz de rastreabilidade RF × Tela; checklist 7.1; alinhamento ao protótipo navegável. |
