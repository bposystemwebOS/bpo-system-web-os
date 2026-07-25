// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Portal Protegido / Dashboard
// ARQUIVO: app/(protected)/dashboard/page.tsx
// DESCRICAO: Pagina inicial da area autenticada - visao geral de clientes,
//            cada linha agora leva para a pagina de detalhe do cliente.
// ============================================================================
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("bpo_clients")
    .select("id, company_name, created_at")
    .order("created_at", { ascending: false });

  const clientCount = clients?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Visao geral</h2>
        <p className="text-sm text-gray-500">
          Resumo da operacao da sua plataforma BPO.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Clientes ativos</p>
          <p className="text-2xl font-bold">{clientCount}</p>
        </div>
      </div>

      {clientCount === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="font-medium">Nenhum cliente cadastrado ainda</p>
          <p className="text-sm text-gray-500 mt-1">
            O fluxo de diagnostico e proposta (Fase 2) ainda esta em construcao.
            Assim que estiver pronto, voce podera cadastrar o primeiro cliente por aqui.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 divide-y">
          {clients!.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clientes/${client.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              {client.company_name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
