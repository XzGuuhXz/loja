'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { rateLimit } from '@/lib/security/rate-limit';

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().min(1).max(20),
    }),
  ).min(1).max(50),
  address: z.object({
    recipient_name: z.string().trim().min(2).max(120),
    street: z.string().trim().min(1).max(160),
    number: z.string().trim().min(1).max(20),
    complement: z.string().trim().max(120).optional(),
    neighborhood: z.string().trim().min(1).max(120),
    city: z.string().trim().min(1).max(120),
    state: z.string().trim().toUpperCase().length(2),
    postal_code: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP inválido.'),
  }),
});

export async function checkout(input: unknown) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { error: 'Dados inválidos.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Faça login para finalizar.' };

  const limited = await rateLimit({ key: `checkout:${user.id}`, limit: 10, windowSeconds: 60 });
  if (!limited.allowed) return { error: 'Muitas tentativas. Aguarde um momento.' };

  // Price, stock, ownership and order total are intentionally NOT accepted from the browser.
  // The database checkout RPC is the final authority and must re-read current product data
  // inside its transaction before creating the order.
  const { data, error } = await supabase.rpc('checkout', {
    p_items: parsed.data.items,
    p_shipping_address: parsed.data.address,
  });

  if (error) return { error: 'Não foi possível finalizar o pedido.' };
  return { orderId: data as string };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
