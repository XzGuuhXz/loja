"use client";

import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export function StoreHeader() {
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-18 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-indigo-500/10">N</span>
            <span className="font-[family-name:var(--font-jakarta)] text-lg font-extrabold tracking-tight">Nova<span className="text-indigo-600">Vitrine</span></span>
          </Link>

          <form action="/produtos" className="ml-auto hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input name="q" placeholder="O que você está procurando?" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white" />
            </div>
          </form>

          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">
            <Link href="/produtos" className="transition hover:text-indigo-600">Produtos</Link>
            <Link href="/categorias" className="transition hover:text-indigo-600">Categorias</Link>
            <Link href="/ofertas" className="transition hover:text-indigo-600">Ofertas</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link href="/conta" aria-label="Minha conta" className="grid size-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"><UserRound className="size-5" /></Link>
            <Link href="/carrinho" aria-label="Carrinho" className="relative grid size-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600">
              <ShoppingBag className="size-5" />
              {count > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">{count > 99 ? "99+" : count}</span>}
            </Link>
          </div>
        </div>
        <form action="/produtos" className="pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input name="q" placeholder="Buscar produtos..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white" />
          </div>
        </form>
      </div>
    </header>
  );
}
