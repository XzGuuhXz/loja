import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PayButton from './PayButton';

const labels: Record<string, string> = { pending: 'Aguardando pagamento', paid: 'Pago', processing: 'Em preparação', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' };

export default async function Orders() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect('/login');
  const { data: orders } = await s.from('orders').select('id,status,total,created_at,payment_preference_id,order_items(product_name,unit_price,quantity,line_total)').order('created_at', { ascending: false });

  return <main className="page-shell">
    <style>{`.orders-list{display:grid;gap:14px}.order-card{padding:24px}.order-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:18px;border-bottom:1px solid #ded9d1}.order-label{margin:0 0 5px;color:#a94732;font-size:8px;font-weight:900;letter-spacing:.14em}.order-header b{display:block;font-size:15px;letter-spacing:.02em}.order-header small{display:block;margin-top:5px;color:#938c83;font-size:9px}.order-status{display:inline-flex;padding:7px 10px;border:1px solid #ded9d1;background:#f7f5f1;color:#5d574f;font-size:8px;font-weight:800}.status-paid,.status-delivered{border-color:#cbd9ce;color:#3f6b51;background:#f1f6f2}.status-cancelled{color:#8a4438;background:#f8efed}.order-summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 0}.order-summary span{display:block;color:#8b847b;font-size:9px}.order-summary strong{display:block;margin-top:4px;font-size:20px;letter-spacing:-.03em}.order-items{padding-top:16px;border-top:1px solid #ded9d1}.order-items>p{margin:0 0 9px;color:#8b847b;font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.order-items ul{list-style:none;margin:0;padding:0;display:grid;gap:7px}.order-items li{display:flex;justify-content:space-between;gap:20px;color:#575149;font-size:10px}.order-items li strong{color:#8b847b;font-weight:700}@media(max-width:600px){.order-header{flex-direction:column}.order-status{align-self:flex-start}.order-summary{align-items:flex-start;flex-direction:column}}`}</style>
    <a href="/" className="back-link">← Loja</a>
    <div className="page-title"><p className="eyebrow">MINHA CONTA</p><h1>Meus pedidos</h1></div>
    {orders?.length ? <div className="orders-list">{orders.map((o) => <article key={o.id} className="panel order-card">
      <div className="order-header"><div><p className="order-label">PEDIDO</p><b>{o.id.slice(0, 8)}</b><small>{new Date(o.created_at).toLocaleString('pt-BR')}</small></div><span className={`order-status status-${o.status}`}>{labels[o.status] || o.status}</span></div>
      <div className="order-summary"><div><span>Total</span><strong>R$ {Number(o.total).toFixed(2).replace('.', ',')}</strong></div>{o.status === 'pending' && <PayButton orderId={o.id} />}</div>
      <div className="order-items"><p>Itens do pedido</p><ul>{o.order_items?.map((i: { product_name: string; quantity: number }) => <li key={`${o.id}-${i.product_name}`}><span>{i.product_name}</span><strong>× {i.quantity}</strong></li>)}</ul></div>
    </article>)}</div> : <div className="empty-state"><h2>Nenhum pedido encontrado</h2><p>Seus pedidos aparecerão aqui.</p><a className="primary-btn" href="/#produtos">Comprar produtos →</a></div>}
  </main>;
}
