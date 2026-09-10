import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string; min?: string; max?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(Number.isFinite(min) ? { price: { gte: min } } : {}),
      ...(Number.isFinite(max) ? { price: { lte: max } } : {}),
    },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-bold text-indigo-600">← NovaVitrine</Link>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Catálogo</p><h1 className="mt-1 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold">Produtos</h1></div>
          <span className="text-sm text-slate-500">{products.length} produto(s)</span>
        </div>

        <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Buscar produto..." className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 md:col-span-2" />
          <select name="category" defaultValue={params.category ?? ""} className="rounded-xl border border-slate-300 px-4 py-3"><option value="">Todas as categorias</option>{categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
          <div className="flex gap-2"><input name="min" defaultValue={params.min} type="number" min="0" step="0.01" placeholder="Mín." className="w-full rounded-xl border border-slate-300 px-3 py-3" /><input name="max" defaultValue={params.max} type="number" min="0" step="0.01" placeholder="Máx." className="w-full rounded-xl border border-slate-300 px-3 py-3" /></div>
          <button className="rounded-xl bg-slate-950 px-4 py-3 font-bold text-white md:col-span-4">Filtrar</button>
        </form>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(product => <Link key={product.id} href={`/produtos/${product.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <div className="grid aspect-square place-items-center bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-4xl font-black text-indigo-200">NV</div>
            <div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{product.category.name}</p><h2 className="mt-2 font-[family-name:var(--font-jakarta)] font-extrabold group-hover:text-indigo-600">{product.name}</h2><p className="mt-3 text-xl font-black">R$ {Number(product.price).toFixed(2).replace(".", ",")}</p></div>
          </Link>)}
        </section>
        {products.length === 0 && <div className="mt-8 rounded-2xl bg-white p-12 text-center text-slate-500">Nenhum produto encontrado.</div>}
      </div>
    </main>
  );
}
