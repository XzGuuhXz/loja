import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function validSignature(signature:string|null,requestId:string|null,dataId:string|null,secret:string){
  if(!signature||!requestId||!dataId)return false;
  const values=Object.fromEntries(signature.split(',').map(part=>{const [key,...rest]=part.trim().split('=');return [key,rest.join('=')]}));
  const ts=values.ts,v1=values.v1;if(!ts||!v1)return false;
  const timestamp=Number(ts);if(!Number.isFinite(timestamp)||Math.abs(Date.now()/1000-timestamp)>300)return false;
  const manifest=`id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected=createHmac('sha256',secret).update(manifest).digest('hex');
  const a=Buffer.from(expected,'utf8'),b=Buffer.from(v1,'utf8');return a.length===b.length&&timingSafeEqual(a,b);
}

export async function POST(request:Request){
  const secret=process.env.MERCADOPAGO_WEBHOOK_SECRET,token=process.env.MERCADOPAGO_ACCESS_TOKEN;
  if(!secret||!token)return NextResponse.json({error:'Webhook não configurado.'},{status:503});
  const url=new URL(request.url),dataId=url.searchParams.get('data.id');
  if(!validSignature(request.headers.get('x-signature'),request.headers.get('x-request-id'),dataId,secret))return NextResponse.json({error:'Assinatura inválida.'},{status:401});
  let body:{type?:string}={};try{body=await request.json()}catch{return NextResponse.json({ok:true})}
  if(body.type!=='payment'||!dataId)return NextResponse.json({ok:true});
  const paymentResponse=await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!paymentResponse.ok)return NextResponse.json({error:'Pagamento não encontrado.'},{status:502});
  const payment=await paymentResponse.json() as {id?:number|string;status?:string;external_reference?:string;transaction_amount?:number;currency_id?:string};
  if(!payment.external_reference||!payment.status)return NextResponse.json({ok:true});
  const admin=createAdminClient();
  const {data:order,error:orderError}=await admin.from('orders').select('id,total,status').eq('id',payment.external_reference).maybeSingle();
  if(orderError||!order)return NextResponse.json({error:'Pedido não encontrado.'},{status:404});
  if(payment.currency_id!=='BRL'||Math.abs(Number(payment.transaction_amount)-Number(order.total))>0.01)return NextResponse.json({error:'Valor ou moeda do pagamento não conferem.'},{status:409});
  const {error}=await admin.rpc('sync_payment_status',{p_order_id:payment.external_reference,p_payment_id:String(payment.id??dataId),p_payment_status:payment.status});
  if(error)return NextResponse.json({error:'Não foi possível sincronizar o pedido.'},{status:500});
  return NextResponse.json({ok:true});
}

export async function GET(request:Request){return POST(request)}
