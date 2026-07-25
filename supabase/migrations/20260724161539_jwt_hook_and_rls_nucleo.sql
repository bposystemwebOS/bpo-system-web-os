-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MIGRATION: jwt_hook_and_rls_nucleo
-- DESCRIÇÃO: Helpers de JWT, hook de custom claims, e RLS nas tabelas núcleo.
-- ============================================================================

-- 1. Helpers para ler claims do JWT sem repetir a expressão em cada policy
create or replace function auth_bpo_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'bpo_id', '')::uuid
$$;

create or replace function auth_role()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role', '')
$$;

-- 2. Resolve os clientes autorizados ao operador logado (SECURITY DEFINER
--    para nao re-disparar RLS de operator_client_access)
create or replace function get_authorized_clients()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select client_id
  from operator_client_access
  where user_id = auth.uid()
$$;

-- 3. Custom Access Token Hook: injeta bpo_id e role no app_metadata do JWT
create or replace function custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  claims jsonb;
  user_bpo_id uuid;
  user_role text;
begin
  select bpo_id, role into user_bpo_id, user_role
  from public.user_profiles
  where id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if user_bpo_id is not null then
    claims := jsonb_set(claims, '{app_metadata,bpo_id}', to_jsonb(user_bpo_id));
    claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

-- 4. RLS nas quatro tabelas nucleo (nenhuma fica sem policy)
alter table bpo_tenants enable row level security;
alter table bpo_clients enable row level security;
alter table user_profiles enable row level security;
alter table operator_client_access enable row level security;

create policy "tenant_isolation" on bpo_tenants
for select to authenticated
using (id = auth_bpo_id());

create policy "bpo_isolation_and_client_access" on bpo_clients
for all to authenticated
using (
  bpo_id = auth_bpo_id()
  and (auth_role() = 'admin' or id in (select get_authorized_clients()))
)
with check (bpo_id = auth_bpo_id());

create policy "profiles_tenant_isolation" on user_profiles
for select to authenticated
using (
  bpo_id = auth_bpo_id()
  and (auth_role() = 'admin' or id = auth.uid())
);

create policy "operator_access_tenant_isolation" on operator_client_access
for select to authenticated
using (
  exists (
    select 1 from user_profiles up
    where up.id = operator_client_access.user_id
    and up.bpo_id = auth_bpo_id()
  )
  and (auth_role() = 'admin' or user_id = auth.uid())
);
