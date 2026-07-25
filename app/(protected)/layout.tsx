// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Portal Protegido / Layout
// ARQUIVO: app/(protected)/layout.tsx
// DESCRICAO: Layout da area autenticada — header com tenant, usuario e logout.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/actions/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, role, bpo_tenants(name)")
    .eq("id", user.id)
    .single();

  const tenantName =
    (profile?.bpo_tenants as { name?: string } | null)?.name ?? "Plataforma BPO";
  const userName = profile?.full_name ?? user.email;
  const userRole = profile?.role ?? "operator";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Plataforma BPO</p>
          <h1 className="text-lg font-semibold">{tenantName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="font-medium">{userName}</p>
            <p className="text-gray-500 capitalize">{userRole}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
