import { createClient } from '@/lib/supabase/server';

function money(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default async function Admin() {
  const s = await createClient();
  const [{ data: products }, { data: orders }, { data: categories }] = await Promise.all([
    s.from('products').select('id,name,price,stock,active').order('created_at', { ascending: false }),
    s.from('orders').select('id,status,total,created_at').order('created_at', { ascending: false }),
    s.from('categories').select('id,name').order('name'),
  ]);

  const revenue = orders?.filter((o) => ['paid', 'approved', 'completed'].includes(String(o.status).toLowerCase())).reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
  const lowStock = products?.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5).length ?? 0;
  const outOfStock = products?.filter((p) => Number(p.stock) <= 0).length ?? 0;

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-emerald-400">Operação da loja</p>
          <h1 className="text-3xl font-black tracking-[-.04em] text-white sm:text-4xl">Visão geral</h1>
          <p className="mt-2 text-sm text-zinc-500">Controle produtos, estoque e pedidos em um só lugar.</p>
        </div>
        <a href="/" className="loja-btn border border-zinc-700 text-zinc-200 hover:bg-zinc-800">Abrir loja ↗</a>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicadores">
        <div className="admin-kpi"><div className="admin-kpi-label">Receita registrada</div><div className="admin-kpi-value">{money(revenue)}</div></div>
        <div className="admin-kpi"><div className="admin-kpi-label">Produtos</div><div className="admin-kpi-value">{products?.length ?? 0}</div></div>
        <div className="admin-kpi"><div className="admin-kpi-label">Pedidos</div><div className="admin-kpi-value">{orders?.length ?? 0}</div></div>
        <div className="admin-kpi"><div className="admin-kpi-label">Estoque crítico</div><div className="admin-kpi-value text-amber-400">{lowStock + outOfStock}</div></div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section className="loja-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 p-4">
            <div><h2 className="font-bold text-white">Produtos</h2><p className="mt-1 text-xs text-zinc-500">Visão rápida do catálogo.</p></div>
            <a href="/admin/produtos" className="text-xs font-bold text-emerald-400">Gerenciar →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table text-sm"><thead><tr><th>Produto</th><th>Preço</th><th>Estoque</th><th>Status</th></tr></thead><tbody>
              {products?.slice(0, 12).map((p) => <tr key={p.id}><td className="font-semibold text-zinc-200">{p.name}</td><td className="text-zinc-400">{money(p.price)}</td><td className={Number(p.stock) <= 5 ? 'font-bold text-amber-400' : 'text-zinc-400'}>{p.stock}</td><td><span className={`loja-badge ${p.active ? 'loja-badge-success' : 'loja-badge-danger'}`}>{p.active ? 'Ativo' : 'Inativo'}</span></td></tr>)}
            </tbody></table>
          </div>
        </section>

        <section className="loja-card overflow-hidden">
          <div className="border-b border-zinc-800 p-4"><h2 className="font-bold text-white">Pedidos recentes</h2><p className="mt-1 text-xs text-zinc-500">Últimas movimentações.</p></div>
          <ul className="divide-y divide-zinc-800">{orders?.slice(0, 10).map((o) => <li key={o.id} className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><div className="truncate font-mono text-xs text-zinc-300">#{o.id.slice(0, 8)}</div><div className="mt-1 text-[11px] text-zinc-500">{new Date(o.created_at).toLocaleDateString('pt-BR')}</div></div><div className="text-right"><div className="text-sm font-bold text-zinc-200">{money(o.total)}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400">{o.status}</div></div></li>)}</ul>
        </section>
      </div>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="admin-kpi"><div className="admin-kpi-label">Categorias</div><div className="admin-kpi-value">{categories?.length ?? 0}</div></div>
        <div className="admin-kpi"><div className="admin-kpi-label">Sem estoque</div><div className="admin-kpi-value text-red-400">{outOfStock}</div></div>
      </section>
    </main>
  );
}
