// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Diagnostico / Formulario
// ARQUIVO: components/diagnostics/DiagnosticForm.tsx
// DESCRICAO: Formulario estruturado (pilar + achados) para registrar um novo
//            diagnostico de um cliente. Client component, chama createDiagnostic.
// ============================================================================
"use client";

import { useState, useTransition } from "react";
import { createDiagnostic } from "@/actions/diagnostics";

const PILARES = [
  { key: "ti", label: "BPO de TI" },
  { key: "financeiro", label: "BPO Financeiro" },
  { key: "rh", label: "BPO de RH" },
  { key: "atendimento", label: "BPO Atendimento/Comercial" },
];

export function DiagnosticForm({ clientId }: { clientId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createDiagnostic(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-4">
      <input type="hidden" name="clientId" value={clientId} />

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Pilar
        </label>
        <select
          id="department"
          name="department"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {PILARES.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-1">
          Achados do diagnostico
        </label>
        <textarea
          id="findings"
          name="findings"
          required
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600" role="status">
          Diagnostico registrado.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "Registrar diagnostico"}
      </button>
    </form>
  );
}
