import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/actions/catalog";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) redirect("/admin/login");
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return <main className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-7xl"><div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Admin</p><h1 className="mt-1 text-3xl font-extrabold">Produtos</h1></div><Link href="/admin/produtos/novo" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Novo produto</Link></div><div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Produto</th><th className="p-4">Categoria</th><th className="p-4">Preço</th><th className="p-4">Estoque</th><th className="p-4">Status</th></tr></thead><tbody>{products.map(p=><tr key={p.id} className="border-t border-slate-100"><td className="p-4 font-bold">{p.name}</td><td className="p-4">{p.category.name}</td><td className="p-4">R$ {Number(p.price).toFixed(2).replace(".", ",")}</td><td className="p-4">{p.stock}</td><td className="p-4">{p.isActive ? "Ativo" : "Inativo"}</td></tr>)}</tbody></table></div></div></main>;
}
