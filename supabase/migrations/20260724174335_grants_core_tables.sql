-- ============================================================================
-- PROJETO: bpo-system-web-os
-- MODULO: Nucleo / Grants
-- DESCRICAO: Concede privilegios de tabela (GRANT) para anon/authenticated/service_role
--            no schema public. RLS continua controlando a autorizacao logica; GRANT eh
--            o pre-requisito de acesso a nivel de Postgres, que estava ausente.
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
