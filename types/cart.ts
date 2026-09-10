export type CartItem = { productId: string; slug: string; name: string; price: number; quantity: number; stock: number; imageUrl?: string; };
export type CartTotals = { subtotal: number; shipping: number; total: number; };
