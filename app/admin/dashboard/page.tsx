import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const money=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

export default async function AdminDashboardPage(){
 const session=await auth();
 if(!session?.user || !["ADMIN","SUPER_ADMIN"].includes(session.user.role)) redirect("/admin/login");
 const [products,categories,users,orders,paid] = await Promise.all([
  prisma.product.count(), prisma.category.count(), prisma.user.count(), prisma.order.count(),
  prisma.order.aggregate({where:{paymentStatus:"APPROVED"},_sum:{total:true}})
 ]);
 const recent=await prisma.order.findMany({include:{user:true},orderBy:{createdAt:"desc"},take:8});
 return <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950"><div className="mx-auto max-w-7xl"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">NovaVitrine</p><h1 className="mt-2 text-3xl font-extrabold">Painel administrativo</h1><p className="mt-2 text-slate-500">Visão geral da operação da loja.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Produtos",products,"/admin/produtos"],["Categorias",categories,"/admin/categorias"],["Usuários",users,"/admin/usuarios"],["Pedidos",orders,"/admin/pedidos"]].map(([label,value,href])=><Link key={String(label)} href={String(href)} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-300"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></Link>)}</div><section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Faturamento aprovado</p><p className="mt-2 text-3xl font-black">{money(Number(paid._sum.total??0))}</p></section><section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white"><div className="flex items-center justify-between p-6"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Operação</p><h2 className="mt-1 text-xl font-extrabold">Pedidos recentes</h2></div><Link href="/admin/pedidos" className="text-sm font-bold text-indigo-600">Ver todos</Link></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Pedido</th><th className="p-4">Cliente</th><th className="p-4">Data</th><th className="p-4">Status</th><th className="p-4">Total</th></tr></thead><tbody>{recent.map(o=><tr key={o.id} className="border-t border-slate-100"><td className="p-4 font-bold">#{o.id.slice(-8).toUpperCase()}</td><td className="p-4">{o.user.email}</td><td className="p-4">{o.createdAt.toLocaleDateString("pt-BR")}</td><td className="p-4">{o.status}</td><td className="p-4 font-bold">{money(Number(o.total))}</td></tr>)}</tbody></table></div></section></div></main>;
}
