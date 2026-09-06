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
    <a href="/" className="back-link">← Loja</a>
    <div className="page-title"><p className="eyebrow">MINHA CONTA</p><h1>Meus pedidos</h1></div>
    {orders?.length ? <div className="orders-list">{orders.map((o) => <article key={o.id} className="panel order-card">
      <div className="order-header"><div><p className="order-label">PEDIDO</p><b>{o.id.slice(0, 8)}</b><small>{new Date(o.created_at).toLocaleString('pt-BR')}</small></div><span className={`order-status status-${o.status}`}>{labels[o.status] || o.status}</span></div>
      <div className="order-summary"><div><span>Total</span><strong>R$ {Number(o.total).toFixed(2).replace('.', ',')}</strong></div>{o.status === 'pending' && <PayButton orderId={o.id} />}</div>
      <div className="order-items"><p>Itens do pedido</p><ul>{o.order_items?.map((i: { product_name: string; quantity: number }) => <li key={`${o.id}-${i.product_name}`}><span>{i.product_name}</span><strong>× {i.quantity}</strong></li>)}</ul></div>
    </article>)}</div> : <div className="empty-state"><h2>Nenhum pedido encontrado</h2><p>Seus pedidos aparecerão aqui.</p><a className="primary-btn" href="/#produtos">Comprar produtos →</a></div>}
  </main>;
}
