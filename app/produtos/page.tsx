import Link from "next/link";
import { StoreShell } from "@/components/store/store-shell";
import { ProductCard } from "@/components/store/product-card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
type SearchParams = Promise<{ q?: string; category?: string; min?: string; max?: string; sort?: string; page?: string }>;
const take = 12;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const min = params.min ? Number(params.min) : undefined;
  const max = params.max ? Number(params.max) : undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const sort = ["newest", "price-asc", "price-desc", "name"].includes(params.sort ?? "") ? params.sort : "newest";
  const where = { isActive: true, ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}), ...(params.category ? { category: { slug: params.category } } : {}), ...(Number.isFinite(min) ? { price: { gte: min } } : {}), ...(Number.isFinite(max) ? { price: { lte: max } } : {}) };
  const orderBy = sort === "price-asc" ? { price: "asc" as const } : sort === "price-desc" ? { price: "desc" as const } : sort === "name" ? { name: "asc" as const } : { createdAt: "desc" as const };
  const session = await auth();
  const [products, total, categories, favoriteRows] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } }, orderBy, skip: (page - 1) * take, take }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    session?.user?.id ? prisma.favorite.findMany({ where: { userId: session.user.id }, select: { productId: true } }) : Promise.resolve([]),
  ]);
  const favoriteIds = new Set(favoriteRows.map((favorite) => favorite.productId));
  const totalPages = Math.ceil(total / take);
  const query = new URLSearchParams();
  if (q) query.set("q", q); if (params.category) query.set("category", params.category); if (params.min) query.set("min", params.min); if (params.max) query.set("max", params.max); if (sort !== "newest") query.set("sort", sort);
  const pageUrl = (nextPage: number) => { const copy = new URLSearchParams(query); copy.set("page", String(nextPage)); return `/produtos?${copy.toString()}`; };

  return <StoreShell><main className="min-h-[70vh] bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Catálogo</p><h1 className="mt-1 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold sm:text-4xl">Produtos</h1><p className="mt-2 text-sm text-slate-500">Encontre o produto ideal para você.</p></div><span className="text-sm font-semibold text-slate-500">{total} produto(s)</span></div>
  <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4"><input name="q" defaultValue={q} placeholder="Buscar produto..." className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white md:col-span-2" /><select name="category" defaultValue={params.category ?? ""} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Todas as categorias</option>{categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select><select name="sort" defaultValue={sort} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="newest">Mais recentes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select><div className="flex gap-2"><input name="min" defaultValue={params.min} type="number" min="0" step="0.01" placeholder="Mín." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" /><input name="max" defaultValue={params.max} type="number" min="0" step="0.01" placeholder="Máx." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" /></div><button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 md:col-span-4">Aplicar filtros</button></form>
  {products.length > 0 ? <><section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(p => <ProductCard key={p.id} initialFavorited={favoriteIds.has(p.id)} product={{ ...p, price: Number(p.price), comparePrice: p.comparePrice == null ? null : Number(p.comparePrice) }} />)}</section>{totalPages > 1 && <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginação">{page > 1 && <Link href={pageUrl(page - 1)} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">Anterior</Link>}<span className="px-3 text-sm font-semibold text-slate-500">Página {page} de {totalPages}</span>{page < totalPages && <Link href={pageUrl(page + 1)} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">Próxima</Link>}</nav>}</> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center"><p className="font-bold">Nenhum produto encontrado</p><p className="mt-2 text-sm text-slate-500">Tente mudar os filtros ou pesquisar por outro termo.</p><Link href="/produtos" className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Limpar filtros</Link></div>}</div></main></StoreShell>;
}
