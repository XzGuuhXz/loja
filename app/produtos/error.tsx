"use client";

export default function ProductsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-6 text-center"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Catálogo</p><h1 className="mt-2 text-2xl font-extrabold">Não foi possível carregar os produtos</h1><p className="mt-2 text-sm text-slate-500">Tente novamente. Nenhum detalhe interno do servidor é exibido.</p><button onClick={() => reset()} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Tentar novamente</button></div></main>;
}
