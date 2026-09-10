import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StoreShell } from "@/components/store/store-shell";
import { ProductCard } from "@/components/store/product-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true, isFeatured: true }, include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, take: 6 }),
  ]);

  return <StoreShell>
    <main className="bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-indigo-200">Nova experiência de compra</span>
            <h1 className="mt-6 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">Tudo o que você procura, em um só lugar.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Produtos selecionados, preços especiais e uma experiência simples do primeiro clique ao pedido entregue.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/produtos" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold transition hover:bg-indigo-400">Explorar produtos <ArrowRight className="size-4" /></Link><Link href="/ofertas" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold transition hover:bg-white/10">Ver ofertas</Link></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-3 sm:px-6">
        {[[Truck, "Envio para todo o Brasil", "Acompanhe seu pedido com tranquilidade."], [ShieldCheck, "Compra segura", "Seus dados protegidos em cada etapa."], [Headphones, "Atendimento", "Estamos aqui quando você precisar."]].map(([Icon, title, text]) => <div key={String(title)} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"><Icon className="size-6 shrink-0 text-indigo-600" /><div><h2 className="text-sm font-bold">{String(title)}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{String(text)}</p></div></div>)}
      </section>

      {categories.length > 0 && <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Explore</p><h2 className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl font-extrabold">Categorias</h2></div><Link href="/categorias" className="text-sm font-bold text-indigo-600">Ver todas</Link></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map(c => <Link key={c.id} href={`/produtos?category=${c.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-indigo-50 font-black text-indigo-600">{c.name.charAt(0).toUpperCase()}</span><p className="mt-3 text-sm font-bold">{c.name}</p></Link>)}</div></section>}

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Seleção NovaVitrine</p><h2 className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl font-extrabold sm:text-3xl">Produtos em destaque</h2></div><Link href="/produtos" className="text-sm font-bold text-indigo-600">Ver catálogo</Link></div>{products.length > 0 ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={{ ...p, price: Number(p.price), comparePrice: p.comparePrice == null ? null : Number(p.comparePrice) }} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">Os produtos em destaque aparecerão aqui.</div>}</section>
    </main>
  </StoreShell>;
}
