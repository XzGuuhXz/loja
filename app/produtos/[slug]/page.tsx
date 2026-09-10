import { notFound } from "next/navigation";
import Link from "next/link";
import { StoreShell } from "@/components/store/store-shell";
import { AddToCart } from "@/components/cart/add-to-cart";
import { FavoriteButton } from "@/components/store/favorite-button";
import { ProductGallery } from "@/components/store/product-gallery";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const p = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true } }); return p ? { title: p.name, description: p.description } : { title: "Produto não encontrado" }; }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug }, include: { category: true, images: { orderBy: { position: "asc" } } } });
  if (!p || !p.isActive) notFound();
  const session = await auth();
  const favorite = session?.user?.id ? await prisma.favorite.findUnique({ where: { userId_productId: { userId: session.user.id, productId: p.id } }, select: { id: true } }) : null;
  const price = Number(p.price);
  const comparePrice = p.comparePrice == null ? null : Number(p.comparePrice);
  return <StoreShell><main className="min-h-[70vh] bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/produtos" className="text-sm font-bold text-indigo-600">← Voltar para produtos</Link><div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14"><ProductGallery name={p.name} images={p.images} /><section className="py-2 lg:py-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">{p.category.name}</p><h1 className="mt-3 font-[family-name:var(--font-jakarta)] text-3xl font-extrabold tracking-tight sm:text-5xl">{p.name}</h1></div><FavoriteButton productId={p.id} initialFavorited={Boolean(favorite)} /></div><div className="mt-6 flex items-end gap-3"><p className="text-3xl font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)}</p>{comparePrice && comparePrice > price && <p className="text-sm text-slate-400 line-through">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(comparePrice)}</p>}</div><p className="mt-6 leading-7 text-slate-600">{p.description}</p><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">Estoque disponível</span><span className={`text-sm font-bold ${p.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>{p.stock > 0 ? `${p.stock} unidade(s)` : "Esgotado"}</span></div><div className="mt-5"><AddToCart product={{ id: p.id, slug: p.slug, name: p.name, price, stock: p.stock, imageUrl: p.images[0]?.url }} /></div></div><p className="mt-4 text-xs text-slate-400">SKU: {p.sku}</p></section></div></div></main></StoreShell>;
}
