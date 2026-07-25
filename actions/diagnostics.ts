// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Diagnostico / Server Actions
// ARQUIVO: actions/diagnostics.ts
// DESCRICAO: Server Action para registrar um novo diagnostico por pilar.
// ============================================================================
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDiagnostic(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  const department = formData.get("department") as string;
  const findings = formData.get("findings") as string;

  if (!clientId || !department || !findings) {
    return { error: "Preencha o pilar e os achados do diagnostico." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessao expirada. Faca login novamente." };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("bpo_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "Perfil de usuario nao encontrado." };
  }

  const { error } = await supabase.from("diagnostics").insert({
    bpo_id: profile.bpo_id,
    client_id: clientId,
    department,
    findings,
    recommended_modules: [department],
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/clientes/${clientId}`);
  return { success: true };
}
