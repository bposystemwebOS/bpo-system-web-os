// ============================================================================
// PROJETO: bpo-system-web-os
// MODULO: Autenticacao / Login
// ARQUIVO: app/(auth)/login/page.tsx
// DESCRICAO: Pagina publica de login.
// ============================================================================
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | bpo-system-web-os",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Entrar</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Acesse a plataforma BPO com seu e-mail e senha.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
