-- Schema do Postgres (Neon) que substitui as colecoes do Firestore.
-- Idempotente: `npm run migrate` pode rodar quantas vezes for preciso.
-- Os ids sao uuid em texto, como eram os ids automaticos do Firestore para o
-- frontend: strings opacas.

-- colecao `user`. userType: 0 ADMIN, 1 MENTOR, 2 MENTORADO, 3 AMBOS.
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password text,
  name text,
  cpf text,
  phone text,
  linkedin text,
  image text,
  areas text[] NOT NULL DEFAULT '{}',
  user_type smallint NOT NULL,
  birth_date text,
  registration text,
  password_requirement_expiration timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- O cpf e a chave de relacionamento que o codigo usa (mentoria.cpf,
-- mentoradoId), mas nunca foi unico no Firestore: indice sem UNIQUE.
CREATE INDEX IF NOT EXISTS users_cpf_idx ON users (cpf);

-- colecao `mentoria`. dateTime e mentoringOption sao estruturas aninhadas que
-- o codigo le e regrava inteiras, entao ficam em jsonb.
CREATE TABLE IF NOT EXISTS mentorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf text NOT NULL,
  image text,
  title text,
  description text,
  knowledge_area text,
  mentoring_option jsonb NOT NULL DEFAULT '[]',
  flag_disable boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  date_time jsonb NOT NULL DEFAULT '[]',
  mentoring_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mentorias_cpf_idx ON mentorias (cpf);

-- colecao `area_conhecimento`
CREATE TABLE IF NOT EXISTS areas_conhecimento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);
