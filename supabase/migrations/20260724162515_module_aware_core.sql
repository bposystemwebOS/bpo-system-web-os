-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MIGRATION: module_aware_core
-- DESCRIÇÃO: Catálogo de módulos, diagnóstico, proposta e habilitação por cliente.
-- ============================================================================

-- 1. Catálogo global de módulos (compartilhado entre todos os tenants)
create table if not exists module_catalog (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  default_kpis jsonb not null default '[]'::jsonb,
  default_sla jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 2. Diagnostico tecnico por cliente (o "inventario", estruturado por departamento)
create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  bpo_id uuid not null references bpo_tenants(id) on delete cascade,
  client_id uuid not null references bpo_clients(id) on delete cascade,
  department text not null,
  findings text,
  recommended_modules text[] not null default '{}',
  created_by uuid references user_profiles(id),
  created_at timestamptz not null default now()
);

-- 3. Proposta comercial gerada a partir de um diagnostico
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  bpo_id uuid not null references bpo_tenants(id) on delete cascade,
  client_id uuid not null references bpo_clients(id) on delete cascade,
  diagnostic_id uuid references diagnostics(id) on delete set null,
  modules text[] not null default '{}',
  pricing jsonb not null default '{}'::jsonb,
  sla_terms jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','sent','approved','rejected')),
  created_by uuid references user_profiles(id),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  approved_at timestamptz
);

-- 4. Habilitacao de modulo por cliente (liga o operador ao que ele pode operar)
create table if not exists client_modules (
  id uuid primary key default gen_random_uuid(),
  bpo_id uuid not null references bpo_tenants(id) on delete cascade,
  client_id uuid not null references bpo_clients(id) on delete cascade,
  module_key text not null references module_catalog(key),
  status text not null default 'diagnosticado' check (status in ('diagnosticado','proposto','ativo','suspenso','encerrado')),
  sla jsonb not null default '{}'::jsonb,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (client_id, module_key)
);

-- Indices de apoio ao filtro de RLS
create index if not exists idx_diagnostics_bpo_id on diagnostics(bpo_id);
create index if not exists idx_diagnostics_client_id on diagnostics(client_id);
create index if not exists idx_proposals_bpo_id on proposals(bpo_id);
create index if not exists idx_proposals_client_id on proposals(client_id);
create index if not exists idx_client_modules_bpo_id on client_modules(bpo_id);
create index if not exists idx_client_modules_client_id on client_modules(client_id);

-- RLS: module_catalog e leitura livre para autenticados, escrita reservada ao service role
alter table module_catalog enable row level security;

create policy "module_catalog_read_all" on module_catalog
for select to authenticated
using (true);

-- RLS: diagnostics, proposals e client_modules seguem a trava dupla ja validada
alter table diagnostics enable row level security;
alter table proposals enable row level security;
alter table client_modules enable row level security;

create policy "diagnostics_isolation" on diagnostics
for all to authenticated
using (
  bpo_id = auth_bpo_id()
  and (auth_role() = 'admin' or client_id in (select get_authorized_clients()))
)
with check (bpo_id = auth_bpo_id());

create policy "proposals_isolation" on proposals
for all to authenticated
using (
  bpo_id = auth_bpo_id()
  and (auth_role() = 'admin' or client_id in (select get_authorized_clients()))
)
with check (bpo_id = auth_bpo_id());

create policy "client_modules_isolation" on client_modules
for all to authenticated
using (
  bpo_id = auth_bpo_id()
  and (auth_role() = 'admin' or client_id in (select get_authorized_clients()))
)
with check (bpo_id = auth_bpo_id());
