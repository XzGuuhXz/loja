"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/actions/favorites";

export function FavoriteButton({ productId, initialFavorited = false }: { productId: string; initialFavorited?: boolean }) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);
    const result = await toggleFavorite(productId);
    if (result.requiresLogin) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    } else if (result.success) {
      setFavorited(Boolean(result.favorited));
    }
    setPending(false);
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"} aria-pressed={favorited} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60">
      <Heart className="h-5 w-5" fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
