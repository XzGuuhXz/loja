"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct } from "@/actions/catalog";

export default function NewProductPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true); setMessage("");
    const result = await createProduct({ categoryId: formData.get("categoryId"), name: formData.get("name"), slug: formData.get("slug"), description: formData.get("description"), sku: formData.get("sku"), price: formData.get("price"), comparePrice: formData.get("comparePrice"), stock: formData.get("stock"), isFeatured: formData.get("isFeatured") === "on" });
    if (result.success) router.push("/admin/produtos"); else setMessage(result.message);
    setPending(false);
  }
  return <main className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-3xl"><Link href="/admin/produtos" className="text-sm font-bold text-indigo-600">← Produtos</Link><div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8"><h1 className="text-3xl font-extrabold">Novo produto</h1><form action={submit} className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold sm:col-span-2">Categoria<input name="categoryId" required placeholder="ID da categoria" className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">Nome<input name="name" required className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">Slug<input name="slug" required placeholder="produto-exemplo" className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">SKU<input name="sku" required className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">Preço<input name="price" required type="number" step="0.01" min="0" className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">Preço anterior<input name="comparePrice" type="number" step="0.01" min="0" className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">Estoque<input name="stock" required type="number" min="0" className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold sm:col-span-2">Descrição<textarea name="description" required minLength={10} rows={5} className="mt-2 w-full rounded-xl border p-3" /></label><label className="flex items-center gap-2 text-sm font-semibold"><input name="isFeatured" type="checkbox" /> Produto em destaque</label>{message && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 sm:col-span-2">{message}</p>}<button disabled={pending} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50 sm:col-span-2">{pending ? "Salvando..." : "Criar produto"}</button></form></div></div></main>;
}
