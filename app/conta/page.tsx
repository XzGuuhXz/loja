import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Minha conta
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold">
          Olá, {session.user.name ?? "cliente"}!
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <span className="text-sm text-slate-500">E-mail</span>
            <p className="mt-2 font-bold">{session.user.email}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <span className="text-sm text-slate-500">Perfil</span>
            <p className="mt-2 font-bold">{session.user.role}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <span className="text-sm text-slate-500">Sessão</span>
            <p className="mt-2 font-bold">Ativa</p>
          </div>
        </div>
      </section>
    </main>
  );
}
