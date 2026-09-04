'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const checkoutSchema=z.object({items:z.array(z.object({product_id:z.string().uuid(),quantity:z.number().int().min(1).max(100)})).min(1).max(100),address:z.object({recipient_name:z.string().min(2).max(120),street:z.string().min(1).max(160),number:z.string().min(1).max(20),complement:z.string().max(120).optional(),neighborhood:z.string().min(1).max(120),city:z.string().min(1).max(120),state:z.string().length(2),postal_code:z.string().min(8).max(12)})});
export async function checkout(input:unknown){const parsed=checkoutSchema.safeParse(input);if(!parsed.success) return {error:'Dados inválidos.'};const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return {error:'Faça login para finalizar.'};const {data,error}=await supabase.rpc('checkout',{p_items:parsed.data.items,p_shipping_address:parsed.data.address});if(error)return {error:'Não foi possível finalizar o pedido.'};return {orderId:data as string};}
export async function signOut(){const supabase=await createClient();await supabase.auth.signOut();redirect('/');}