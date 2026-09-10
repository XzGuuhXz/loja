import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) redirect("/admin/login");
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
  return <main className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-5xl"><Link href="/admin/produtos" className="text-sm font-bold text-indigo-600">← Admin</Link><h1 className="mt-5 text-3xl font-extrabold">Categorias</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(c=><article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">{c.name}</h2><p className="mt-1 text-sm text-slate-500">/{c.slug}</p><p className="mt-4 text-sm font-semibold">{c._count.products} produto(s)</p></article>)}</div></div></main>;
}
