import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage(){const session=await auth();if(!session?.user||!["ADMIN","SUPER_ADMIN"].includes(session.user.role))redirect("/admin/login");const categories=await prisma.category.findMany({where:{isActive:true},select:{id:true,name:true},orderBy:{name:"asc"}});return <main className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-3xl"><Link href="/admin/produtos" className="text-sm font-bold text-indigo-600">← Produtos</Link><div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8"><h1 className="text-3xl font-extrabold">Novo produto</h1>{categories.length===0?<p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">Crie uma categoria antes de cadastrar produtos.</p>:<ProductForm categories={categories}/>}</div></div></main>}
