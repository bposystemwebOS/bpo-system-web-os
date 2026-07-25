// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Onboarding / Server Action
// ARQUIVO: actions/onboarding.ts
// DESCRICAO: Chama a Edge Function onboard-bpo para criar o primeiro tenant.
// ============================================================================
"use server";

export async function processBpoOnboarding(formData: FormData) {
  const bpoName = formData.get("bpoName") as string;
  const adminName = formData.get("adminName") as string;
  const adminEmail = formData.get("adminEmail") as string;
  const password = formData.get("password") as string;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/onboard-bpo`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bpoName, adminName, adminEmail, password }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Falha no provisionamento do BPO.");
  }

  return result;
}
