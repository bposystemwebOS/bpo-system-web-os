-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MIGRATION: extensao_receita_e_temas
-- DESCRICAO: Extensao de bpo_clients com dados da Receita Federal (CNPJ/CNAE)
--            e nova tabela client_themes para identidade visual por cliente.
-- ============================================================================

-- 1. Extensao de bpo_clients com dados cadastrais da Receita Federal
alter table bpo_clients
  add column if not exists cnae_principal text,
  add column if not exists cnae_descricao text,
  add column if not exists porte_receita text,
  add column if not exists situacao_cadastral text,
  add column if not exists municipio text,
  add column if not exists uf text,
  add column if not exists data_abertura date,
  add column if not exists natureza_juridica text,
  add column if not exists dados_receita_raw jsonb;

-- 2. Identidade visual por cliente (branding do portal)
create table if not exists client_themes (
  id uuid primary key default gen_random_uuid(),
  bpo_id uuid not null references bpo_tenants(id) on delete cascade,
  client_id uuid not null unique references bpo_clients(id) on delete cascade,
  primary_color text,
  secondary_color text,
  logo_url text,
  font_family text,
  created_at timestamptz not null default now()
);

create index if not exists idx_client_themes_bpo_id on client_themes(bpo_id);
create index if not exists idx_client_themes_client_id on client_themes(client_id);

alter table client_themes enable row level security;

create policy "client_themes_isolation" on client_themes
for all to authenticated
using (
  bpo_id = auth_bpo_id()
  and (auth_role() = 'admin' or client_id in (select get_authorized_clients()))
)
with check (bpo_id = auth_bpo_id());
