// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Portal Protegido / Detalhe do Cliente
// ARQUIVO: app/(protected)/dashboard/clientes/[clientId]/page.tsx
// DESCRICAO: Pagina de detalhe de um cliente - tema aplicado (identidade
//            visual) e os 4 cenarios de diagnostico por pilar.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const PILARES = [
  { key: "ti", label: "BPO de TI", stroke: "#0F6E56", fill: "#E1F5EE", text: "#04342C" },
  { key: "financeiro", label: "BPO Financeiro", stroke: "#185FA5", fill: "#E6F1FB", text: "#042C53" },
  { key: "rh", label: "BPO de RH", stroke: "#534AB7", fill: "#EEEDFE", text: "#26215C" },
  { key: "atendimento", label: "BPO Atendimento/Comercial", stroke: "#993C1D", fill: "#FAECE7", text: "#4A1B0C" },
];

function formatCnpj(cnpj: string | null) {
  if (!cnpj || cnpj.length !== 14) return cnpj ?? "-";
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
}

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("bpo_clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (!client) {
    notFound();
  }

  const { data: theme } = await supabase
    .from("client_themes")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();

  const { data: diagnostics } = await supabase
    .from("diagnostics")
    .select("*")
    .eq("client_id", clientId);

  const primaryColor = theme?.primary_color ?? "#1B2A4A";
  const secondaryColor = theme?.secondary_color ?? "#F4F5F8";

  const diagnosticsByDept: Record<string, { findings: string | null }> = Object.fromEntries(
    (diagnostics ?? []).map((d) => [d.department, d])
  );

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="text-sm text-gray-500 hover:underline">
        {"<- Voltar"}
      </Link>

      <div
        className="rounded-lg p-6 border"
        style={{ backgroundColor: secondaryColor, borderColor: primaryColor }}
      >
        <p className="text-sm" style={{ color: primaryColor }}>
          Cliente
        </p>
        <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
          {client.company_name}
        </h1>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">CNPJ</p>
            <p className="font-medium">{formatCnpj(client.cnpj)}</p>
          </div>
          <div>
            <p className="text-gray-500">CNAE</p>
            <p className="font-medium">{client.cnae_descricao ?? "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Municipio/UF</p>
            <p className="font-medium">
              {client.municipio ?? "-"}/{client.uf ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Porte</p>
            <p className="font-medium">{client.porte_receita ?? "-"}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Diagnostico por pilar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PILARES.map((p) => {
            const d = diagnosticsByDept[p.key];
            return (
              <div
                key={p.key}
                className="rounded-lg border p-4"
                style={{ borderColor: p.stroke, backgroundColor: p.fill }}
              >
                <h3 className="font-bold mb-2" style={{ color: p.text }}>
                  {p.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: p.text }}>
                  {d?.findings ?? "Sem diagnostico registrado para este pilar."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
