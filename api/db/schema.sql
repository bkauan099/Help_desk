-- ============================================================
--  MP Desk — esquema funcional (RF01–RF07)
--  6 tabelas: Usuario, Categoria, RegraSLA, Chamado, Interacao, Anexo
-- ============================================================

DROP TABLE IF EXISTS kb_artigos  CASCADE;
DROP TABLE IF EXISTS anexos      CASCADE;
DROP TABLE IF EXISTS interacoes  CASCADE;
DROP TABLE IF EXISTS chamados    CASCADE;
DROP TABLE IF EXISTS regras_sla  CASCADE;
DROP TABLE IF EXISTS categorias  CASCADE;
DROP TABLE IF EXISTS usuarios    CASCADE;

-- ---------- Usuario (RF01, RF02) ----------
CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  senha_hash    TEXT NOT NULL,
  perfil        TEXT NOT NULL CHECK (perfil IN ('solicitante','atendente','admin')),
  cargo         TEXT,
  especialidade TEXT,                       -- usado na atribuição automática (RF05)
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Categoria (RF03, RF13) ----------
CREATE TABLE categorias (
  id            SERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  critico       BOOLEAN NOT NULL DEFAULT FALSE,   -- impacto clínico potencial
  especialidade TEXT,                              -- casa com a do atendente (RF05)
  icon          TEXT DEFAULT 'tag',
  ativo         BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------- RegraSLA (RF04) ----------
-- Define, por prioridade, o prazo da 1ª resposta e o da resolução.
CREATE TABLE regras_sla (
  id                   SERIAL PRIMARY KEY,
  prioridade           TEXT NOT NULL UNIQUE CHECK (prioridade IN ('Crítica','Alta','Média','Baixa')),
  primeira_resposta_min INTEGER NOT NULL,
  resolucao_horas       INTEGER NOT NULL
);

-- ---------- Chamado (RF03–RF06, RF09) ----------
CREATE TABLE chamados (
  id              SERIAL PRIMARY KEY,
  protocolo       TEXT NOT NULL UNIQUE,            -- MPD-AAAA-NNNNN
  titulo          TEXT NOT NULL,
  descricao       TEXT NOT NULL,
  categoria_id    INTEGER NOT NULL REFERENCES categorias(id),
  prioridade      TEXT NOT NULL CHECK (prioridade IN ('Crítica','Alta','Média','Baixa')),
  status          TEXT NOT NULL DEFAULT 'Aberto'
                    CHECK (status IN ('Aberto','Em atendimento','Aguardando','Resolvido','Fechado')),
  impacto_clinico BOOLEAN NOT NULL DEFAULT FALSE,
  solicitante_id  INTEGER NOT NULL REFERENCES usuarios(id),
  atendente_id    INTEGER REFERENCES usuarios(id),
  prazo_resposta  TIMESTAMPTZ,                     -- prazo da 1ª resposta (RF04)
  prazo_resolucao TIMESTAMPTZ,                     -- prazo de resolução (RF04)
  primeira_resposta_em TIMESTAMPTZ,                -- quando o suporte respondeu (RF05)
  nota            INTEGER CHECK (nota BETWEEN 1 AND 5),  -- avaliação (RF09)
  comentario_aval TEXT,
  avaliado_em     TIMESTAMPTZ,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolvido_em    TIMESTAMPTZ,
  fechado_em      TIMESTAMPTZ
);
CREATE INDEX idx_chamados_status      ON chamados(status);
CREATE INDEX idx_chamados_solicitante ON chamados(solicitante_id);
CREATE INDEX idx_chamados_atendente   ON chamados(atendente_id);

-- ---------- Interacao (RF06 histórico, RF07 mensagens) ----------
CREATE TABLE interacoes (
  id          SERIAL PRIMARY KEY,
  chamado_id  INTEGER NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
  autor_id    INTEGER REFERENCES usuarios(id),      -- NULL = evento do sistema
  tipo        TEXT NOT NULL CHECK (tipo IN ('msg','sys')),
  mensagem    TEXT NOT NULL,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_interacoes_chamado ON interacoes(chamado_id);

-- ---------- Anexo (RF03) ----------
CREATE TABLE anexos (
  id            SERIAL PRIMARY KEY,
  chamado_id    INTEGER NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
  nome_arquivo  TEXT NOT NULL,
  caminho       TEXT NOT NULL,
  tipo_mime     TEXT NOT NULL,
  tamanho       INTEGER NOT NULL,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Artigo da base de conhecimento (RF10) ----------
-- Atendentes publicam artigos por categoria; qualquer usuário busca por palavra-chave.
CREATE TABLE kb_artigos (
  id         SERIAL PRIMARY KEY,
  categoria  TEXT NOT NULL,
  titulo     TEXT NOT NULL,
  conteudo   TEXT NOT NULL,
  autor_id   INTEGER REFERENCES usuarios(id),
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_kb_titulo ON kb_artigos(titulo);

-- Sequência anual do protocolo é resolvida na aplicação (db/seed e rota de criação).
