// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Onboarding / Formulario
// ARQUIVO: components/auth/OnboardingForm.tsx
// DESCRICAO: Formulario de criacao do primeiro tenant + admin.
// ============================================================================
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { processBpoOnboarding } from "@/actions/onboarding";

export function OnboardingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setFeedback(null);
      try {
        await processBpoOnboarding(formData);
        setFeedback({ type: "success", message: "Ambiente provisionado com sucesso! Redirecionando..." });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        setFeedback({
          type: "error",
          message: error instanceof Error ? error.message : "Falha ao processar o cadastro.",
        });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md mx-auto">
      {feedback && (
        <div
          className={`p-4 rounded-md text-sm font-medium ${
            feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Nome da empresa (BPO)</label>
        <input
          name="bpoName"
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Ex: Cyber BPO Assessoria"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Nome do administrador</label>
        <input
          name="adminName"
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Joaquim Coelho"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">E-mail corporativo</label>
        <input
          name="adminEmail"
          type="email"
          required
          className="w-full px-3 py-2 border rounded-md"
          placeholder="admin@empresa.com"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Senha</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-black text-white font-medium rounded-md disabled:opacity-50"
      >
        {isPending ? "Provisionando..." : "Criar plataforma BPO"}
      </button>
    </form>
  );
}
