"use client";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";

type Props = { product: { id: string; slug: string; name: string; price: number; stock: number; imageUrl?: string } };

export function AddToCart({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const disabled = product.stock <= 0;
  function handleAdd() {
    if (disabled) return;
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }
  return (
    <button type="button" onClick={handleAdd} disabled={disabled}
      className="w-full rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
      {disabled ? "Produto esgotado" : added ? "Adicionado!" : "Adicionar ao carrinho"}
    </button>
  );
}
