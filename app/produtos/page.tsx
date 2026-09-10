import Link from "next/link";
import { StoreShell } from "@/components/store/store-shell";
import { ProductCard } from "@/components/store/product-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
type SearchParams = Promise<{ q?: string; category?: string; min?: string; max?: string }>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;
  const products = await prisma.product.findMany({ where: { isActive: true, ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}), ...(params.category ? { category: { slug: params.category } } : {}), ...(Number.isFinite(min) ? { price: { gte: min } } : {}), ...(Number.isFinite(max) ? { price: { lte: max } } : {}) }, include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } }, orderBy: { createdAt: "desc" } });
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return <StoreShell><main className="min-h-[70vh] bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Catálogo</p><h1 className="mt-1 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold sm:text-4xl">Produtos</h1><p className="mt-2 text-sm text-slate-500">Encontre o produto ideal para você.</p></div><span className="text-sm font-semibold text-slate-500">{products.length} produto(s)</span></div>
  <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"><input name="q" defaultValue={q} placeholder="Buscar produto..." className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white md:col-span-2" /><select name="category" defaultValue={params.category ?? ""} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Todas as categorias</option>{categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select><div className="flex gap-2"><input name="min" defaultValue={params.min} type="number" min="0" step="0.01" placeholder="Mín." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" /><input name="max" defaultValue={params.max} type="number" min="0" step="0.01" placeholder="Máx." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" /></div><button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 md:col-span-4">Aplicar filtros</button></form>
  {products.length > 0 ? <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} product={{ ...p, price: Number(p.price), comparePrice: p.comparePrice == null ? null : Number(p.comparePrice) }} />)}</section> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center"><p className="font-bold">Nenhum produto encontrado</p><p className="mt-2 text-sm text-slate-500">Tente mudar os filtros ou pesquisar por outro termo.</p><Link href="/produtos" className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Limpar filtros</Link></div>}</div></main></StoreShell>;
}
