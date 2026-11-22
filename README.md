# MP Desk — Sprint 2

Versão (Sprint 20 funcional do sistema **Help Desk para Telemedicina Hospitalar**, São **8 telas** funcionais, cada uma indicando os
**requisitos funcionais (RF)** que atende — ligação direta com o PRD.


---

## Tecnologias Utilizadas

* **Front-end:** React, Vite
* **Back-end:** Node.js, Express, WebSocket, autenticação via JWT e upload de arquivos
* **Banco de Dados:** PostgreSQL (modelo relacional com 6 tabelas, scripts de *migration* e *seed*)
* **Infraestrutura e Containerização:** Docker e Docker Compose

---

## Principais Funcionalidades a Disposição Atualmente - Sprint 2 

* **Autenticação e Controle de Acesso (JWT):** Login seguro com perfis distintos (**Solicitante**, **Atendente** e **Administrador**).
* **Abertura de Chamados e Anexos:** Geração automática de protocolo único (`MPD-XXXX`) com suporte ao envio de imagens e documentos PDF.
* **Priorização e SLA Automático:** Cálculo dinâmico de criticidade e prazo de atendimento com base na categoria e no impacto clínico imediato na teleconsulta.
* **Fila de Atendimento e Atribuição:** Listagem com filtros por status, contadores em tempo real e transferência de chamados entre atendentes.
* **Chat em Tempo Real (WebSocket):** Troca instantânea de mensagens dentro do histórico do chamado sem necessidade de recarregar a página.
* **Base de Conhecimento (FAQ):** Consulta e busca de artigos de autoajuda antes ou durante a abertura de chamados.
* **Avaliação e Painel Gerencial:** Avaliação do atendimento concluído (1 a 5 estrelas) e dashboard com métricas de volume, cumprimento de SLA e satisfação.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Docker Compose)
* [Node.js](https://nodejs.org/) (versão 18 ou superior) e `npm`

---

## Como Rodar o Projeto Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/bkauan099/help_desk.git
cd help_desk
```

### 2. Configurar as variáveis de ambiente

Os arquivos `.env` não são versionados por segurança. Crie-os a partir dos arquivos de exemplo na **raiz do projeto** e na pasta **`web/`**:

* **No Linux / macOS / Git Bash:**
  ```bash
  cp .env.example .env
  cp web/.env.example web/.env
  ```

* **No Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  Copy-Item web\.env.example web\.env
  ```

*(Caso utilize o VS Code, você também pode duplicar cada `.env.example` pelo explorador de arquivos e renomeá-los para `.env`.)*

### 3. Subir o Back-end e o Banco de Dados (Docker)

1. Certifique-se de que o **Docker Desktop** esteja aberto e em execução.
2. Na **raiz do projeto (`help_desk/`)**, execute:
   ```bash
   docker compose up --build
   ```
3. Aguarde até que o container do banco de dados inicialize e o log confirme que a API Express está rodando. **Mantenha este terminal aberto.**

### 4. Subir o Front-end (React + Vite)

1. Abra um **segundo terminal** na raiz do projeto.
2. Acesse a pasta `web/`, instale as dependências e inicie o servidor de desenvolvimento:
   ```bash
   cd web
   npm install
   npm run dev
   ```
3. Acesse no navegador o endereço exibido no terminal (por padrão, `http://localhost:5173`).

---

## Como Encerrar a Execução

* Para parar os servidores, pressione **`Ctrl + C`** nos dois terminais.
* Para derrubar e remover os containers do Docker, execute na raiz do projeto:
  ```bash
  docker compose down
  ```

---

## As 8 telas e os RFs que atendem

| Tela | Arquivo | RFs |
|---|---|---|
| Login | `src/screens/Login.jsx` | RF01 |
| Painel | `src/screens/Dashboard.jsx` | RF05 |
| Fila de chamados | `src/screens/TicketList.jsx` | RF05 |
| Abrir chamado | `src/screens/NewTicket.jsx` | RF02, RF03 |
| Detalhe do chamado | `src/screens/TicketDetail.jsx` | RF04, RF05, RF06, RF07 |
| Base de conhecimento | `src/screens/Knowledge.jsx` | RF08 |
| Relatórios de SLA | `src/screens/Reports.jsx` | indicadores (gestão) |
| Gestão | `src/screens/Admin.jsx` | RF01, RF03 |

Cada tela tem endereço próprio por *hash*: `#painel`, `#fila`, `#abrir`,
`#detalhe`, `#base`, `#relatorios`, `#gestao`.

## Estrutura do projeto

```
mpdesk-prototipo/
├── index.html
├── package.json / vite.config.js
├── docs/
│   ├── PRD2.md                 # documento de requisitos (v2)
│   └── CHECKLIST-7.1.md        # responsivo e acessível
└── src/
    ├── main.jsx                # ponto de entrada (monta o React)
    ├── App.jsx                 # shell + navegação por hash + estado dos chamados
    ├── theme.js                # paleta e mapas de status/prioridade
    ├── styles.css              # estilos globais (tema escuro, responsivo)
    ├── assets/logo.jpg
    ├── data/                   # requisitos, usuarios, categorias, chamados, kb
    ├── lib/                    # format (datas) e sla (prioridade/prazos)
    ├── components/             # Icon, ui, charts, TopNav, TicketRow
    └── screens/                # as 8 telas
```
