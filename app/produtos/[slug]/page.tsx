import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true } });
  return product ? { title: product.name, description: product.description } : { title: "Produto não encontrado" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true, images: { orderBy: { position: "asc" } } } });
  if (!product || !product.isActive) notFound();

  const price = Number(product.price).toFixed(2).replace(".", ",");
  return <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950"><div className="mx-auto max-w-6xl"><Link href="/produtos" className="text-sm font-bold text-indigo-600">← Voltar para produtos</Link><div className="mt-8 grid gap-10 lg:grid-cols-2"><div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-7xl font-black text-indigo-200">NV</div><section className="py-4"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">{product.category.name}</p><h1 className="mt-3 font-[family-name:var(--font-jakarta)] text-4xl font-extrabold">{product.name}</h1><p className="mt-6 text-3xl font-black">R$ {price}</p><p className="mt-6 leading-7 text-slate-600">{product.description}</p><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Estoque disponível</p><p className="mt-1 font-bold">{product.stock} unidade(s)</p><button className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white">Adicionar ao carrinho</button></div><p className="mt-4 text-xs text-slate-400">SKU: {product.sku}</p></section></div></div></main>;
}
