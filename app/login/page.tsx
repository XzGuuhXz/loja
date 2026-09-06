'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) setMsg('E-mail ou senha inválidos.');
      else window.location.href = '/';
    } catch {
      setMsg('Modo demonstração: o acesso ao servidor não está configurado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-showcase" aria-label="Sobre a Loja">
          <a className="brand auth-brand" href="/" aria-label="Loja — página inicial">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span>LOJA<span className="brand-dot">.</span></span>
          </a>
          <div className="auth-showcase-copy">
            <p className="eyebrow">BEM-VINDO DE VOLTA</p>
            <h1>Suas melhores escolhas, <em>em um só lugar.</em></h1>
            <p>Entre para acompanhar pedidos, salvar produtos e continuar sua experiência de compra.</p>
          </div>
          <div className="auth-mini-card">
            <span aria-hidden="true">✦</span>
            <div><strong>Uma experiência simples.</strong><small>Feita para você.</small></div>
          </div>
        </section>

        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card-head">
            <p className="eyebrow">MINHA CONTA</p>
            <h2 id="login-title">Entrar</h2>
            <p>Acesse sua conta para continuar.</p>
          </div>

          <form onSubmit={submit} className="form-grid">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" required type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

            <div className="auth-label-row">
              <label htmlFor="password">Senha</label>
              <span>Seguro e protegido</span>
            </div>
            <input id="password" name="password" required type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

            {msg && <p className="auth-message" role="alert">{msg}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'} <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="auth-divider"><span>ou</span></div>
          <p className="auth-footer-text">Ainda não tem uma conta?</p>
          <a className="auth-secondary" href="/cadastro">Criar conta</a>
          <a className="auth-back" href="/">← Voltar para a loja</a>
        </section>
      </div>
    </main>
  );
}
