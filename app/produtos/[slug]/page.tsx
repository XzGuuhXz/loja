import { notFound } from "next/navigation";
import Link from "next/link";
import { StoreShell } from "@/components/store/store-shell";
import { AddToCart } from "@/components/cart/add-to-cart";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const p = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true } }); return p ? { title: p.name, description: p.description } : { title: "Produto não encontrado" }; }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug }, include: { category: true, images: { orderBy: { position: "asc" } } } });
  if (!p || !p.isActive) notFound();
  const price = Number(p.price);
  const image = p.images[0];
  const comparePrice = p.comparePrice == null ? null : Number(p.comparePrice);
  return <StoreShell><main className="min-h-[70vh] bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/produtos" className="text-sm font-bold text-indigo-600">← Voltar para produtos</Link><div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14"><div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">{image ? <img src={image.url} alt={image.alt ?? p.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-8xl font-black text-indigo-200">NV</div>}</div><section className="py-2 lg:py-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">{p.category.name}</p><h1 className="mt-3 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-tight sm:text-5xl">{p.name}</h1><div className="mt-6 flex items-end gap-3"><p className="text-3xl font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}</p>{comparePrice && comparePrice > price && <p className="text-sm text-slate-400 line-through">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(comparePrice)}</p>}</div><p className="mt-6 leading-7 text-slate-600">{p.description}</p><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Estoque disponível</span><span className={`text-sm font-bold ${p.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>{p.stock > 0 ? `${p.stock} unidade(s)` : "Esgotado"}</span></div><div className="mt-5"><AddToCart product={{ id: p.id, slug: p.slug, name: p.name, price, stock: p.stock, imageUrl: image?.url }} /></div></div><p className="mt-4 text-xs text-slate-400">SKU: {p.sku}</p></section></div></div></main></StoreShell>;
}
