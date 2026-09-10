"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const result = await registerUser({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (result.success) {
      router.push("/login?registered=1");
    } else {
      setMessage(result.message);
    }

    setPending(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <Link href="/" className="text-sm font-bold text-indigo-600">
          ← NovaVitrine
        </Link>
        <h1 className="mt-8 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold">
          Criar conta
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Comece a comprar na NovaVitrine.
        </p>

        <form action={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold">
            Nome
            <input
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

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
              autoComplete="new-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-semibold">
            Confirmar senha
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
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
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-50"
          >
            {pending ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já possui conta?{" "}
          <Link href="/login" className="font-bold text-indigo-600">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
