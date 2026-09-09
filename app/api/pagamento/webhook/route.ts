import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit, requestClientKey } from '@/lib/security/rate-limit';

const MERCADO_TIMEOUT_MS = 5000;

function validSignature(signature: string | null, requestId: string | null, dataId: string | null, secret: string) {
  if (!signature || !requestId || !dataId) return false;
  const values = Object.fromEntries(signature.split(',').map((part) => {
    const [key, ...rest] = part.trim().split('=');
    return [key, rest.join('=')];
  }));
  const ts = values.ts;
  const v1 = values.v1;
  if (!ts || !v1) return false;
  const rawTimestamp = Number(ts);
  const timestamp = rawTimestamp > 1e12 ? rawTimestamp / 1000 : rawTimestamp;
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(v1, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

async function fetchPayment(paymentId: string, token: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MERCADO_TIMEOUT_MS);
  try {
    return await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!secret || !token) return NextResponse.json({ error: 'Webhook não configurado.' }, { status: 503 });

  const limited = await rateLimit({ key: requestClientKey(request, 'mercadopago-webhook'), limit: 60, windowSeconds: 60 });
  if (!limited.allowed) return NextResponse.json({ error: 'Muitas requisições.' }, { status: 429 });

  const url = new URL(request.url);
  const dataId = url.searchParams.get('data.id');
  const requestId = request.headers.get('x-request-id');
  const signature = request.headers.get('x-signature');
  if (!validSignature(signature, requestId, dataId, secret)) return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 });

  let body: { type?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  if (body.type !== 'payment' || !dataId || !requestId) return NextResponse.json({ ok: true });

  const admin = createAdminClient();
  const eventKey = `payment:${dataId}:request:${requestId}`;
  const { data: claimed, error: claimError } = await admin
    .from('payment_webhook_events')
    .insert({ event_key: eventKey, payment_id: dataId, event_type: body.type })
    .select('event_key')
    .maybeSingle();

  if (claimError) {
    if (claimError.code === '23505') return NextResponse.json({ ok: true });
    return NextResponse.json({ error: 'Evento não pôde ser registrado.' }, { status: 503 });
  }
  if (!claimed) return NextResponse.json({ ok: true });

  let paymentResponse: Response;
  try {
    paymentResponse = await fetchPayment(dataId, token);
  } catch {
    await admin.from('payment_webhook_events').delete().eq('event_key', eventKey);
    return NextResponse.json({ error: 'Mercado Pago indisponível.' }, { status: 503 });
  }

  if (!paymentResponse.ok) {
    await admin.from('payment_webhook_events').delete().eq('event_key', eventKey);
    return NextResponse.json({ error: 'Pagamento não encontrado.' }, { status: paymentResponse.status >= 500 ? 503 : 502 });
  }

  const payment = await paymentResponse.json() as {
    id?: number | string;
    status?: string;
    external_reference?: string;
    transaction_amount?: number;
    currency_id?: string;
  };
  if (!payment.external_reference || !payment.status) return NextResponse.json({ ok: true });

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id,total,status')
    .eq('id', payment.external_reference)
    .maybeSingle();
  if (orderError || !order) return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 });

  if (payment.currency_id !== 'BRL' || Math.abs(Number(payment.transaction_amount) - Number(order.total)) > 0.01) {
    return NextResponse.json({ error: 'Valor ou moeda do pagamento não conferem.' }, { status: 409 });
  }

  const { error } = await admin.rpc('sync_payment_status', {
    p_order_id: payment.external_reference,
    p_payment_id: String(payment.id ?? dataId),
    p_payment_status: payment.status,
  });

  if (error) {
    await admin.from('payment_webhook_events').delete().eq('event_key', eventKey);
    return NextResponse.json({ error: 'Não foi possível sincronizar o pedido.' }, { status: 503 });
  }

  await admin.from('payment_webhook_events').update({ processed_at: new Date().toISOString() }).eq('event_key', eventKey);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
}
