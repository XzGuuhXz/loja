import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StoreShell } from "@/components/store/store-shell";
import { ProductCard } from "@/components/store/product-card";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/conta/favoritos");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id, product: { isActive: true } },
    include: { product: { include: { category: true, images: { orderBy: { position: "asc" } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <StoreShell>
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-600">Minha conta</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Meus favoritos</h1>
          {favorites.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-lg font-bold">Sua lista está vazia.</p>
              <p className="mt-2 text-sm text-slate-500">Clique no coração de um produto para guardá-lo aqui.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {favorites.map(({ product }) => (
                <ProductCard key={product.id} product={{ ...product, price: Number(product.price), comparePrice: product.comparePrice === null ? null : Number(product.comparePrice) }} initialFavorited />
              ))}
            </div>
          )}
        </div>
      </main>
    </StoreShell>
  );
}
