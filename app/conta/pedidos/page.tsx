import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const statusLabels: Record<string, string> = { PENDING: "Aguardando pagamento", PAID: "Pago", PROCESSING: "Em preparação", SHIPPED: "Enviado", DELIVERED: "Entregue", CANCELLED: "Cancelado" };
const paymentLabels: Record<string, string> = { PIX: "PIX", CARD: "Cartão", BOLETO: "Boleto" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
  return <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950"><div className="mx-auto max-w-5xl"><Link href="/conta" className="text-sm font-bold text-indigo-600">← Minha conta</Link><div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Histórico</p><h1 className="mt-2 text-3xl font-extrabold">Meus pedidos</h1>{orders.length === 0 ? <div className="mt-8 rounded-2xl bg-slate-50 p-8 text-center"><p className="font-bold">Nenhum pedido encontrado.</p><Link href="/produtos" className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Ver produtos</Link></div> : <div className="mt-6 divide-y divide-slate-200">{orders.map(order => <article key={order.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">Pedido #{order.id.slice(-8).toUpperCase()}</p><p className="mt-1 text-sm text-slate-500">{order.createdAt.toLocaleString("pt-BR")} · {order.items.length} item(ns)</p><p className="mt-2 text-sm text-slate-600">{statusLabels[order.status]} · {paymentLabels[order.paymentMethod]}</p></div><div className="flex items-center justify-between gap-5"><strong>{money(Number(order.total))}</strong><Link href={`/conta/pedidos/${order.id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:border-indigo-300 hover:text-indigo-600">Detalhes</Link></div></article>)}</div>}</div></div></main>;
}
