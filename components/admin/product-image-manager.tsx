"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProductImage, deleteProductImage, setPrimaryProductImage } from "@/actions/catalog";

type Image = { id: string; url: string; alt: string | null; position: number };

export function ProductImageManager({ productId, images }: { productId: string; images: Image[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function add(formData: FormData) {
    setPending(true); setMessage("");
    const result = await addProductImage(productId, { url: formData.get("url"), alt: formData.get("alt") });
    if (result.success) { formData.set("url", ""); formData.set("alt", ""); router.refresh(); }
    else setMessage(result.message ?? "Não foi possível adicionar a imagem.");
    setPending(false);
  }

  async function remove(id: string) {
    if (pending) return; setPending(true); setMessage("");
    const result = await deleteProductImage(id);
    if (result.success) router.refresh(); else setMessage(result.message ?? "Não foi possível remover a imagem.");
    setPending(false);
  }

  async function primary(id: string) {
    if (pending) return; setPending(true); setMessage("");
    const result = await setPrimaryProductImage(id);
    if (result.success) router.refresh(); else setMessage(result.message ?? "Não foi possível definir a imagem principal.");
    setPending(false);
  }

  return <section className="mt-8 border-t border-slate-200 pt-8"><h2 className="text-xl font-extrabold">Imagens do produto</h2><p className="mt-1 text-sm text-slate-500">Adicione URLs de imagens. A primeira posição é usada como imagem principal.</p><form action={add} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input name="url" type="url" required placeholder="https://.../produto.jpg" className="rounded-xl border p-3 text-sm" /><input name="alt" placeholder="Texto alternativo" className="rounded-xl border p-3 text-sm" /><button disabled={pending} className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Adicionar</button></form>{message&&<p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-2">{images.map((image,index)=><div key={image.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3"><img src={image.url} alt={image.alt ?? ""} className="h-24 w-24 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{image.alt || "Sem alt text"}</p><p className="text-xs text-slate-400">Posição {index + 1}</p><div className="mt-3 flex gap-2">{index !== 0 && <button type="button" disabled={pending} onClick={()=>primary(image.id)} className="rounded-lg border px-3 py-2 text-xs font-bold">Tornar principal</button>}<button type="button" disabled={pending} onClick={()=>remove(image.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600">Excluir</button></div></div></div>)}{images.length===0&&<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 sm:col-span-2">Nenhuma imagem cadastrada.</p>}</div></section>;
}
