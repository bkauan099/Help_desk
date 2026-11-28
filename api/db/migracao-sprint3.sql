-- Migração da Sprint 3 — adiciona a base de conhecimento persistida (RF10)
-- sem apagar os dados já existentes. Rode uma vez no banco:
--   docker compose exec -T db psql -U mpdesk -d mpdesk < api/db/migracao-sprint3.sql
-- (ou cole o conteúdo no seu cliente SQL conectado ao banco mpdesk).

CREATE TABLE IF NOT EXISTS kb_artigos (
  id         SERIAL PRIMARY KEY,
  categoria  TEXT NOT NULL,
  titulo     TEXT NOT NULL,
  conteudo   TEXT NOT NULL,
  autor_id   INTEGER REFERENCES usuarios(id),
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kb_titulo ON kb_artigos(titulo);

-- Artigos iniciais (só insere se a tabela estiver vazia).
INSERT INTO kb_artigos (categoria, titulo, conteudo)
SELECT * FROM (VALUES
  ('Áudio/Vídeo', 'Vídeo travando ou com atraso na teleconsulta', 'Verifique a conexão (ideal ≥ 5 Mbps de upload), feche aplicativos que consomem banda e reabra a sala. Se persistir, reduza a resolução para 720p.'),
  ('Acesso', 'Credenciais inválidas mesmo com a senha correta', 'A conta pode estar bloqueada após tentativas repetidas. Use ''Esqueci minha senha''. Persistindo, o suporte desbloqueia o usuário.'),
  ('Prescrição', 'Certificado digital não reconhecido', 'Confirme o token/certificado A3 conectado e o driver instalado. Certificados A1 devem estar importados e válidos.')
) AS v(categoria, titulo, conteudo)
WHERE NOT EXISTS (SELECT 1 FROM kb_artigos);
