"use client";

import { useState } from "react";
import { authenticateAdmin } from "@/actions/auth";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const result = await authenticateAdmin({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      setMessage(result.message);
    }

    setPending(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <span className="inline-flex rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white">
          NovaVitrine Admin
        </span>

        <h1 className="mt-6 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold">
          Acesso administrativo
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Entre com uma conta que possua permissão administrativa.
        </p>

        <form action={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold">
            E-mail
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-semibold">
            Senha
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          {message && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-50"
          >
            {pending ? "Autenticando..." : "Entrar no painel"}
          </button>
        </form>

        <a href="/" className="mt-6 block text-center text-sm font-bold text-indigo-600">
          Voltar para a loja
        </a>
      </section>
    </main>
  );
}
