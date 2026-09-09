import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

const links = [
  ['/', 'Visão geral'],
  ['/admin/produtos', 'Produtos'],
  ['/admin/categorias', 'Categorias'],
  ['/admin/imagens', 'Imagens'],
  ['/admin/pedidos', 'Pedidos'],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="admin-shell">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="admin-sidebar hidden w-60 shrink-0 p-4 md:block">
          <Link href="/admin" className="mb-8 flex items-center gap-2 px-3 py-2 font-black tracking-[.12em]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-sm text-zinc-950">L</span>
            LOJA <span className="text-emerald-400">/</span> ADMIN
          </Link>
          <nav aria-label="Administração" className="space-y-1">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="mt-8 block border-t border-zinc-800 px-3 pt-4 text-xs font-semibold text-zinc-500 hover:text-white">
            ← Voltar para a loja
          </Link>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex gap-3 overflow-x-auto">
              {links.map(([href, label]) => <Link key={href} href={href} className="whitespace-nowrap text-xs font-bold text-zinc-400">{label}</Link>)}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
