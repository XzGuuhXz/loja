'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const authCss = `
.auth-page{min-height:100vh;display:grid;place-items:center;padding:48px 24px;background:radial-gradient(circle at 12% 18%,rgba(109,69,216,.1),transparent 30%),radial-gradient(circle at 90% 82%,rgba(109,69,216,.07),transparent 28%),#fbfafc;color:#17151f}.auth-shell{width:min(1040px,100%);min-height:650px;display:grid;grid-template-columns:1.05fr .95fr;overflow:hidden;border:1px solid #e9e6ec;border-radius:28px;background:#fff;box-shadow:0 28px 80px rgba(28,20,43,.12);animation:authIn .55s ease both}.auth-showcase{position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:42px;overflow:hidden;background:linear-gradient(145deg,#18151f,#25202f 58%,#4c367c);color:#fff}.auth-showcase:before,.auth-showcase:after{content:'';position:absolute;border-radius:50%;pointer-events:none}.auth-showcase:before{width:310px;height:310px;right:-120px;top:-110px;background:rgba(174,145,255,.22)}.auth-showcase:after{width:220px;height:220px;left:-110px;bottom:-90px;background:rgba(132,101,221,.24)}.auth-brand{position:relative;z-index:1;color:#fff!important}.auth-showcase-copy{position:relative;z-index:1;max-width:480px;margin:auto 0}.auth-showcase-copy .eyebrow,.auth-card-head .eyebrow{margin:0 0 14px;color:#6d45d8;font-size:10px;font-weight:900;letter-spacing:.18em}.auth-showcase-copy .eyebrow{color:#bca5ff}.auth-showcase-copy h1{margin:14px 0 20px;font-size:clamp(42px,5vw,68px);line-height:.96;letter-spacing:-.055em;font-weight:500}.auth-showcase-copy h1 em{color:#bca5ff;font-family:Georgia,serif;font-weight:400}.auth-showcase-copy p:last-child{max-width:410px;color:rgba(255,255,255,.68);line-height:1.7;font-size:14px}.auth-mini-card{position:relative;z-index:1;display:flex;align-items:center;gap:14px;width:max-content;max-width:100%;padding:14px 18px;border:1px solid rgba(255,255,255,.13);border-radius:16px;background:rgba(255,255,255,.08);backdrop-filter:blur(12px)}.auth-mini-card>span{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#bca5ff;color:#241a37}.auth-mini-card strong,.auth-mini-card small{display:block}.auth-mini-card strong{font-size:12px}.auth-mini-card small{margin-top:3px;color:rgba(255,255,255,.55);font-size:10px}.auth-card{align-self:center;width:min(390px,calc(100% - 64px));margin:auto;padding:20px 0}.auth-card-head h2{margin:0;font-size:38px;letter-spacing:-.04em}.auth-card-head>p:last-child{margin:8px 0 30px;color:#706d78;font-size:13px}.auth-form{display:grid;gap:9px}.auth-form label{color:#28242f;font-size:12px;font-weight:600}.auth-label-row{display:flex;align-items:center;justify-content:space-between;margin-top:5px}.auth-label-row span{color:#9a94a3;font-size:10px}.auth-form input{width:100%;box-sizing:border-box;border:1px solid #e4e0e9;border-radius:12px;padding:14px 15px;background:#fff;color:#17151f;font:inherit;font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s}.auth-form input:focus{border-color:#8d6ae0;box-shadow:0 0 0 4px rgba(109,69,216,.09)}.auth-form input::placeholder{color:#aaa5b0}.auth-submit{margin-top:10px;width:100%;display:flex;justify-content:center;align-items:center;gap:12px;border:0;border-radius:12px;padding:14px 16px;background:#18151f;color:#fff;font:inherit;font-size:13px;font-weight:700;cursor:pointer}.auth-submit:hover:not(:disabled){box-shadow:0 12px 25px rgba(24,21,31,.18);transform:translateY(-2px)}.auth-submit:disabled{opacity:.65;cursor:wait}.auth-message{margin:8px 0 0;padding:11px 12px;border-radius:10px;background:#fff3f5;color:#a33e52;font-size:11px;line-height:1.5}.auth-divider{display:flex;align-items:center;gap:12px;margin:24px 0 18px;color:#aaa5b0;font-size:10px}.auth-divider:before,.auth-divider:after{content:'';height:1px;flex:1;background:#eeeaf1}.auth-footer-text{margin:0 0 10px;text-align:center;color:#706d78;font-size:12px}.auth-secondary{display:block;width:100%;box-sizing:border-box;border:1px solid #ded9e5;border-radius:12px;padding:13px 16px;text-align:center;color:#211d28;font-size:12px;font-weight:700}.auth-secondary:hover{background:#f8f5fb;border-color:#cfc5e8}.auth-back{display:block;margin-top:24px;text-align:center;color:#777180;font-size:11px}.auth-back:hover{color:#6d45d8}@keyframes authIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}@media(max-width:900px){.auth-shell{grid-template-columns:1fr;max-width:560px}.auth-showcase{min-height:330px;padding:30px}.auth-showcase-copy{margin:55px 0 35px}.auth-showcase-copy h1{font-size:48px}.auth-card{padding:40px 0 48px}}@media(max-width:700px){.auth-page{padding:18px;place-items:start center}.auth-shell{border-radius:22px;min-height:auto;margin:10px 0}.auth-showcase{min-height:290px;padding:24px}.auth-showcase-copy{margin:40px 0 28px}.auth-showcase-copy h1{font-size:40px}.auth-showcase-copy p:last-child{font-size:12px}.auth-card{width:calc(100% - 44px);padding:34px 0 36px}.auth-card-head h2{font-size:34px}}
`;

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
      <style>{authCss}</style>
      <div className="auth-shell">
        <section className="auth-showcase" aria-label="Sobre a Loja">
          <a className="brand auth-brand" href="/" aria-label="Loja — página inicial"><span className="brand-mark" aria-hidden="true">L</span><span>LOJA<span className="brand-dot">.</span></span></a>
          <div className="auth-showcase-copy">
            <p className="eyebrow">BEM-VINDO DE VOLTA</p>
            <h1>Suas melhores escolhas, <em>em um só lugar.</em></h1>
            <p>Entre para acompanhar pedidos, salvar produtos e continuar sua experiência de compra.</p>
          </div>
          <div className="auth-mini-card"><span aria-hidden="true">✦</span><div><strong>Uma experiência simples.</strong><small>Feita para você.</small></div></div>
        </section>
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card-head"><p className="eyebrow">MINHA CONTA</p><h2 id="login-title">Entrar</h2><p>Acesse sua conta para continuar.</p></div>
          <form onSubmit={submit} className="auth-form">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" required type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <div className="auth-label-row"><label htmlFor="password">Senha</label><span>Seguro e protegido</span></div>
            <input id="password" name="password" required type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            {msg && <p className="auth-message" role="alert">{msg}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'} <span aria-hidden="true">→</span></button>
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
