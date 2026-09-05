import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
}

export async function POST(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: 'Pagamento ainda não está configurado.' }, { status: 503 });

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id,total,status,payment_preference_id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (orderError || !order) return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 });
  if (order.status !== 'pending') return NextResponse.json({ error: 'Este pedido não pode receber pagamento.' }, { status: 409 });
  if (order.payment_preference_id) return NextResponse.json({ preferenceId: order.payment_preference_id });

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_name,unit_price,quantity')
    .eq('order_id', orderId);
  if (itemsError || !items?.length) return NextResponse.json({ error: 'Itens do pedido não encontrados.' }, { status: 400 });

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': orderId
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        title: item.product_name,
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number(item.unit_price)
      })),
      external_reference: orderId,
      notification_url: `${siteUrl()}/api/pagamento/webhook`,
      back_urls: {
        success: `${siteUrl()}/pedidos?pagamento=sucesso`,
        failure: `${siteUrl()}/pedidos?pagamento=falhou`,
        pending: `${siteUrl()}/pedidos?pagamento=pendente`
      },
      auto_return: 'approved'
    })
  });

  if (!response.ok) return NextResponse.json({ error: 'Não foi possível criar o pagamento.' }, { status: 502 });
  const preference = await response.json() as { id?: string; init_point?: string };
  if (!preference.id || !preference.init_point) return NextResponse.json({ error: 'Resposta inválida do gateway.' }, { status: 502 });

  const { error: saveError } = await supabase.rpc('set_payment_preference', {
    p_order_id: orderId,
    p_preference_id: preference.id
  });
  if (saveError) return NextResponse.json({ error: 'Pagamento criado, mas não foi possível registrar o pedido.' }, { status: 500 });

  return NextResponse.json({ preferenceId: preference.id, initPoint: preference.init_point });
}
