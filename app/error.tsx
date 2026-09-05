'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-900">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Loja</p>
        <h1 className="mt-2 text-2xl font-bold">Não foi possível carregar a página</h1>
        <p className="mt-3 text-slate-600">Ocorreu um erro inesperado no servidor. Tente novamente.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
