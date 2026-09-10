"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartTotals } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => CartTotals;
};

const MAX_QUANTITY = 99;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => set((state) => {
        const existing = state.items.find((entry) => entry.productId === item.productId);
        const requested = Math.max(1, Math.floor(quantity));
        const max = Math.min(item.stock, MAX_QUANTITY);
        if (max <= 0) return state;
        if (!existing) return { items: [...state.items, { ...item, quantity: Math.min(requested, max) }] };
        return { items: state.items.map((entry) => entry.productId === item.productId
          ? { ...entry, ...item, quantity: Math.min(entry.quantity + requested, max) }
          : entry) };
      }),
      removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.flatMap((item) => {
          if (item.productId !== productId) return [item];
          const max = Math.min(item.stock, MAX_QUANTITY);
          const next = Math.floor(quantity);
          if (next <= 0 || max <= 0) return [];
          return [{ ...item, quantity: Math.min(next, max) }];
        }),
      })),
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const subtotal = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal === 0 || subtotal >= 250 ? 0 : 24.9;
        return { subtotal, shipping, total: subtotal + shipping };
      },
    }),
    { name: "novavitrine-cart", version: 1, partialize: (state) => ({ items: state.items }) },
  ),
);
