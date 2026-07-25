-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MIGRATION: nucleo_multi_tenant
-- DESCRIÇÃO: Tabelas base do modelo B2B2B (tenant BPO -> clientes -> operadores)
-- ============================================================================

-- 1. Tenants (as empresas de BPO que operam a plataforma)
create table if not exists bpo_tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- 2. Clientes (as empresas atendidas por cada tenant)
create table if not exists bpo_clients (
  id uuid primary key default gen_random_uuid(),
  bpo_id uuid not null references bpo_tenants(id) on delete cascade,
  company_name text not null,
  cnpj text unique,
  created_at timestamptz not null default now()
);

-- 3. Perfis de usuário (operadores do BPO)
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  bpo_id uuid not null references bpo_tenants(id) on delete cascade,
  role text not null default 'operator' check (role in ('admin', 'operator')),
  full_name text,
  created_at timestamptz not null default now()
);

-- 4. Mapeamento operador -> clientes autorizados
create table if not exists operator_client_access (
  user_id uuid not null references user_profiles(id) on delete cascade,
  client_id uuid not null references bpo_clients(id) on delete cascade,
  primary key (user_id, client_id)
);

-- Índices de apoio ao filtro de RLS (bpo_id / client_id em toda leitura)
create index if not exists idx_bpo_clients_bpo_id on bpo_clients(bpo_id);
create index if not exists idx_user_profiles_bpo_id on user_profiles(bpo_id);
create index if not exists idx_operator_client_access_user_id on operator_client_access(user_id);
create index if not exists idx_operator_client_access_client_id on operator_client_access(client_id);
