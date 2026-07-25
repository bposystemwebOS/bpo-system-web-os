-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MIGRATION: onboarding_trigger
-- DESCRIÇÃO: Cria o user_profiles automaticamente ao surgir um novo auth.users,
--             lendo bpo_id/role/full_name do metadata (Edge Function de onboarding
--             ou convite de operador preenchem esse metadata antes da criacao).
-- ============================================================================

create or replace function handle_new_bpo_admin()
returns trigger
language plpgsql
security definer
as $$
declare
  meta_bpo_id uuid;
begin
  meta_bpo_id := (new.raw_user_meta_data->>'bpo_id')::uuid;

  if meta_bpo_id is not null then
    insert into public.user_profiles (id, bpo_id, role, full_name)
    values (
      new.id,
      meta_bpo_id,
      coalesce(new.raw_user_meta_data->>'role', 'operator'),
      new.raw_user_meta_data->>'full_name'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_bpo_admin();
