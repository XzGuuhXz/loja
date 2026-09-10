import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2"><p className="font-[family-name:var(--font-jakarta)] text-xl font-extrabold">Nova<span className="text-indigo-600">Vitrine</span></p><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Uma experiência de compra simples, segura e feita para encontrar tudo o que você precisa em um só lugar.</p></div>
        <div><h2 className="text-sm font-bold">Loja</h2><div className="mt-4 grid gap-3 text-sm text-slate-500"><Link href="/produtos" className="hover:text-indigo-600">Produtos</Link><Link href="/categorias" className="hover:text-indigo-600">Categorias</Link><Link href="/ofertas" className="hover:text-indigo-600">Ofertas</Link><Link href="/contato" className="hover:text-indigo-600">Contato</Link></div></div>
        <div><h2 className="text-sm font-bold">Atendimento</h2><div className="mt-4 grid gap-3 text-sm text-slate-500"><Link href="/sobre" className="hover:text-indigo-600">Sobre a NovaVitrine</Link><Link href="/conta" className="hover:text-indigo-600">Minha conta</Link><Link href="/carrinho" className="hover:text-indigo-600">Carrinho</Link></div></div>
      </div>
      <div className="border-t border-slate-100"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-400 sm:px-6 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} NovaVitrine. Todos os direitos reservados.</span><span>Compra segura · Atendimento · Envio para todo o Brasil</span></div></div>
    </footer>
  );
}
