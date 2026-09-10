import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImageManager } from "@/components/admin/product-image-manager";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) redirect("/admin/login");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } } } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  return <main className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-3xl"><Link href="/admin/produtos" className="text-sm font-bold text-indigo-600">← Produtos</Link><div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Administração</p><h1 className="mt-2 text-3xl font-extrabold">Editar produto</h1><ProductForm categories={categories} product={{ ...product, price: Number(product.price), comparePrice: product.comparePrice === null ? null : Number(product.comparePrice) }} /><ProductImageManager productId={product.id} images={product.images} /></div></div></main>;
}
