'use client';

import { useEffect, useState } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

export function Badge({ variant = 'info', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return <span className={`loja-badge loja-badge-${variant}`}>{children}</span>;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`loja-skeleton block rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="loja-card overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <section className="empty-state" role="status">
      <div aria-hidden="true">✦</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
}

export function Toast({ message, kind = 'success', onClose }: { message: string; kind?: 'success' | 'error' | 'warning'; onClose?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  const variant = kind === 'success' ? 'success' : kind === 'warning' ? 'warning' : 'danger';

  return (
    <div className="loja-toast fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-2xl" role="status">
      <Badge variant={variant}>{kind === 'success' ? 'OK' : kind === 'warning' ? 'ATENÇÃO' : 'ERRO'}</Badge>
      <span className="text-sm text-zinc-800">{message}</span>
      <button type="button" className="ml-auto text-zinc-400 hover:text-zinc-950" onClick={() => { setVisible(false); onClose?.(); }} aria-label="Fechar notificação">×</button>
    </div>
  );
}

export function CheckoutSteps({ currentStep, steps = ['Carrinho', 'Dados', 'Pagamento', 'Confirmação'] }: { currentStep: number; steps?: string[] }) {
  return (
    <nav aria-label="Etapas do checkout" className="mb-8">
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <div key={step} className="min-w-0 flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${index <= currentStep ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
            <span className={`mt-2 block truncate text-[10px] font-bold ${index <= currentStep ? 'text-zinc-950' : 'text-zinc-400'}`}>{step}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
