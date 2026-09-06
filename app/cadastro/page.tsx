'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg('');
    if (password.length < 8) { setMsg('A senha deve ter pelo menos 8 caracteres.'); return; }
    setLoading(true);
    const { error } = await createClient().auth.signUp({ email, password, options: { data: { full_name: name } } });
    setLoading(false);
    if (error) setMsg('Não foi possível criar a conta.');
    else setMsg('Conta criada. Verifique seu e-mail para confirmar o cadastro.');
  }

  return (
    <main className="auth-page">
      <style>{` .auth-page{min-height:100vh;display:grid;place-items:center;padding:28px;background:#f6f4ef}.register-shell{width:min(920px,100%);display:grid;grid-template-columns:.9fr 1.1fr;background:#fff;border:1px solid #ded9d1;box-shadow:0 20px 60px rgba(35,29,24,.08)}.register-aside{padding:52px;background:#171513;color:#fff;display:flex;flex-direction:column;justify-content:space-between;min-height:560px}.register-brand{font-weight:900;letter-spacing:.13em}.register-brand span{color:#a94732}.register-aside h1{font-size:48px;line-height:.98;letter-spacing:-.055em;margin:0 0 18px}.register-aside p{max-width:300px;color:#b8b1a9;font-size:12px;line-height:1.7}.register-note{padding-top:20px;border-top:1px solid #ffffff22;color:#aaa29a;font-size:9px;line-height:1.6}.register-card{padding:52px}.register-card .eyebrow{margin-bottom:12px}.register-card h2{margin:0 0 8px;font-size:32px;letter-spacing:-.045em}.register-subtitle{margin:0 0 30px;color:#716c65;font-size:11px;line-height:1.6}.register-form{display:grid;gap:16px}.register-form label{display:grid;gap:7px;color:#5f5a53;font-size:10px;font-weight:800}.register-form input{width:100%;padding:13px 12px;border:1px solid #ded9d1;background:#fff;outline:0;font-size:12px}.register-form input:focus{border-color:#a94732;box-shadow:0 0 0 3px rgba(169,71,50,.1)}.register-submit{width:100%;margin-top:5px;padding:14px;border:1px solid #171513;background:#171513;color:#fff;font-size:11px;font-weight:800}.register-submit:hover{background:#a94732;border-color:#a94732}.register-submit:disabled{opacity:.55}.register-message{padding:12px;border-left:2px solid #a94732;background:#f2ece7;color:#5f5a53;font-size:10px;line-height:1.5}.register-login{margin:26px 0 0;color:#716c65;font-size:10px}.register-login a{color:#a94732;font-weight:800}.register-back{display:inline-block;margin-top:10px;color:#716c65;font-size:10px}@media(max-width:700px){.auth-page{padding:14px}.register-shell{grid-template-columns:1fr}.register-aside{display:none}.register-card{padding:32px 24px}.register-card h2{font-size:28px}} `}</style>
      <section className="register-shell">
        <aside className="register-aside">
          <div className="register-brand">LOJA<span>.</span></div>
          <div><p className="eyebrow" style={{ color: '#c87863' }}>BEM-VINDO À LOJA</p><h1>Uma conta.<br />Mais praticidade.</h1><p>Salve seus pedidos, acompanhe compras e tenha tudo organizado em um só lugar.</p></div>
          <p className="register-note">Uma experiência simples, pensada para o dia a dia.</p>
        </aside>
        <div className="register-card">
          <p className="eyebrow">MINHA CONTA</p><h2>Criar conta</h2><p className="register-subtitle">Preencha seus dados para começar.</p>
          <form className="register-form" onSubmit={submit}>
            <label>Nome<input required autoComplete="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>E-mail<input required type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label>Senha<input required minLength={8} type="password" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <button className="register-submit" type="submit" disabled={loading}>{loading ? 'Criando conta...' : 'Criar conta'}</button>
          </form>
          {msg && <p className="register-message" role="status" aria-live="polite">{msg}</p>}
          <p className="register-login">Já tem uma conta? <a href="/login">Entrar</a></p>
          <a className="register-back" href="/">← Voltar para a loja</a>
        </div>
      </section>
    </main>
  );
}
