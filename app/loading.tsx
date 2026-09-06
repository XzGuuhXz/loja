export default function Loading() {
  return (
    <main className="page-shell" aria-busy="true" aria-live="polite">
      <div className="loading-state">
        <span className="loading-spinner" aria-hidden="true" />
        <p>Carregando a Loja…</p>
      </div>
    </main>
  );
}
