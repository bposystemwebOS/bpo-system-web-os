// ============================================================================
// PROJETO: bpo-system-web-os
// MÓDULO: Auth / Middleware raiz
// ARQUIVO: middleware.ts
// DESCRIÇÃO: Ponto de entrada obrigatório que renova a sessão Supabase e
//             protege rotas não autenticadas em toda requisição.
// ============================================================================

import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

