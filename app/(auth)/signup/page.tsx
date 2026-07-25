// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Auth / Signup
// ARQUIVO: app/(auth)/signup/page.tsx
// DESCRICAO: Pagina de onboarding - cria o primeiro tenant + admin.
// ============================================================================

import { OnboardingForm } from "@/components/auth/OnboardingForm";

export const metadata = {
  title: "Onboarding | bpo-system-web-os",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Provisionar plataforma BPO</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Crie o tenant e o usuario administrador inicial.
        </p>
        <OnboardingForm />
      </div>
    </main>
  );
}
