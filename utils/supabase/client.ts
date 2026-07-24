// ============================================================================
// PROJETO: bpo-system-web-os
// MÓDULO: Supabase / Client (browser)
// ARQUIVO: utils/supabase/client.ts
// DESCRIÇÃO: Cliente Supabase para uso em Client Components.
// ============================================================================

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

