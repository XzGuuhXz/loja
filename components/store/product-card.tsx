import Link from "next/link";
import { AddToCart } from "@/components/cart/add-to-cart";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    stock: number;
    category: { name: string };
    images: { url: string; alt: string | null }[];
    comparePrice?: number | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const discount = product.comparePrice && product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60">
      <Link href={`/produtos/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {image ? <img src={image.url} alt={image.alt ?? product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-5xl font-black text-indigo-200">NV</div>}
          {discount > 0 && <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">-{discount}%</span>}
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{product.category.name}</p>
        <Link href={`/produtos/${product.slug}`}><h2 className="mt-2 line-clamp-2 min-h-12 font-[family-name:var(--font-jakarta)] font-extrabold leading-6 transition group-hover:text-indigo-600">{product.name}</h2></Link>
        <div className="mt-3 flex items-end gap-2"><p className="text-xl font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}</p>{product.comparePrice && product.comparePrice > product.price && <p className="text-xs text-slate-400 line-through">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.comparePrice)}</p>}</div>
        <div className="mt-4"><AddToCart product={{ id: product.id, slug: product.slug, name: product.name, price: product.price, stock: product.stock, imageUrl: image?.url }} /></div>
      </div>
    </article>
  );
}
