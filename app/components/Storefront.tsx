'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  stock: number;
  categories?: { name?: string } | { name?: string }[] | null;
  image?: { url: string; alt: string | null } | null;
};

const accents = ['violet', 'blue', 'emerald', 'amber', 'rose'];
function categoryName(category: Product['categories']) { if (Array.isArray(category)) return category[0]?.name ?? 'Geral'; return category?.name ?? 'Geral'; }
function money(value: number | string) { return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function getCartCount() { try { const saved = JSON.parse(localStorage.getItem('loja-cart') || '[]'); if (!Array.isArray(saved)) return 0; return saved.reduce((total, item) => total + Math.max(0, Number(item?.quantity) || 0), 0); } catch { return 0; } }

export default function Storefront({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => { const syncCart = () => setCartCount(getCartCount()); syncCart(); window.addEventListener('storage', syncCart); window.addEventListener('loja-cart-updated', syncCart); return () => { window.removeEventListener('storage', syncCart); window.removeEventListener('loja-cart-updated', syncCart); }; }, []);
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map((p) => categoryName(p.categories))))], [products]);
  const filtered = useMemo(() => products.filter((p) => { const text = `${p.name} ${p.description ?? ''}`.toLowerCase(); return text.includes(query.toLowerCase()) && (category === 'Todos' || categoryName(p.categories) === category); }), [products, query, category]);
  const structuredData = useMemo(() => ({ '@context':'https://schema.org', '@type':'ItemList', itemListElement:filtered.slice(0,12).map((product,index) => ({ '@type':'ListItem', position:index+1, url:product.id.startsWith('demo-') ? '/' : `/produto/${product.id}`, name:product.name })) }), [filtered]);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="announcement" role="status">Frete grátis nas compras acima de R$ 199 <span aria-hidden="true">•</span> Compra segura e protegida</div>
      <header className="site-header"><div className="header-inner">
        <a className="brand" href="/" aria-label="Loja — página inicial"><span className="brand-mark" aria-hidden="true">L</span><span>LOJA<span className="brand-dot">.</span></span></a>
        <nav className="desktop-nav" aria-label="Navegação principal"><a href="#produtos">Produtos</a><a href="#beneficios">Sobre a loja</a><a href="#ofertas">Destaques</a></nav>
        <div className="header-actions"><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar produtos..." aria-label="Buscar produtos" type="search" enterKeyHint="search" autoComplete="off" /></label><a className="icon-action" href="/login" aria-label="Minha conta">♙</a><a className="cart-action" href="/carrinho" aria-label={`Carrinho, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}><span className="cart-icon" aria-hidden="true">🛒</span><span aria-hidden="true">{cartCount}</span></a></div>
      </div></header>

      <section className="hero" id="ofertas" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow">CURADORIA DA SEMANA</p><h1 id="hero-title">Escolhas para<br /><em>o dia a dia.</em></h1><p className="hero-text">Uma seleção de produtos úteis, bonitos e feitos para acompanhar sua rotina — sem excesso e sem complicação.</p><a className="primary-btn" href="#produtos">Ver produtos <span aria-hidden="true">→</span></a></div>
        <div className="hero-art" aria-hidden="true"><div className="product-silhouette"><span>✦</span></div><div className="floating-card">DESTAQUE<br /><strong>da semana</strong></div></div>
      </section>

      <section className="benefits" id="beneficios" aria-label="Benefícios da Loja"><div><span aria-hidden="true">↯</span><div><strong>Entrega rápida</strong><p>Receba sem complicação</p></div></div><div><span aria-hidden="true">✓</span><div><strong>Compra segura</strong><p>Seus dados protegidos</p></div></div><div><span aria-hidden="true">↺</span><div><strong>Troca fácil</strong><p>Sem burocracia</p></div></div><div><span aria-hidden="true">♡</span><div><strong>Atendimento humano</strong><p>Fale com a gente</p></div></div></section>

      <section className="catalog" id="produtos" aria-labelledby="catalog-title"><div className="section-heading"><div><p className="eyebrow">SELEÇÃO DA SEMANA</p><h2 id="catalog-title">Produtos em destaque</h2></div><p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}</p></div>
        <div className="category-row" role="group" aria-label="Filtrar por categoria">{categories.map((item)=><button key={item} type="button" className={category===item?'category active':'category'} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
        {filtered.length===0 ? <div className="empty-state" role="status"><div aria-hidden="true">⌕</div><h3>Nenhum produto encontrado</h3><p>Tente outra busca ou categoria.</p>{(query||category!=='Todos')&&<button type="button" className="primary-btn" onClick={()=>{setQuery('');setCategory('Todos')}}>Limpar filtros</button>}</div> : <div className="product-grid">{filtered.map((product,index)=>{ const out=product.stock<=0; const isDemo=product.id.startsWith('demo-'); const productHref=isDemo?'#produtos':`/produto/${product.id}`; return <article className="product-card" key={product.id}><a href={productHref} className={`product-image ${accents[index%accents.length]}`} aria-label={`Ver detalhes de ${product.name}`}>{product.image?<img src={product.image.url} alt={product.image.alt||product.name} loading={index<4?'eager':'lazy'}/>:<div className="abstract-product" aria-hidden="true">{['◈','◇','○','△','✦'][index%5]}</div>}<span className="category-pill">{categoryName(product.categories)}</span>{index<2&&<span className="new-pill">NOVO</span>}</a><div className="product-info"><p className="product-category">{categoryName(product.categories)}</p><a href={productHref}><h3>{product.name}</h3></a><p className="product-description">{product.description||'Uma escolha especial para você.'}</p><div className="product-bottom"><div><strong>{money(product.price)}</strong><small>{out?'Esgotado':`${product.stock} disponíveis`}</small></div><a className={out?'buy-btn disabled':'buy-btn'} href={productHref} aria-disabled={out}>{out?'Esgotado':'Comprar'}</a></div></div></article>;})}</div>}
      </section>

      <section className="trust-banner" aria-labelledby="trust-title"><div><p className="eyebrow">A EXPERIÊNCIA LOJA</p><h2 id="trust-title">Bom design.<br /><em>Compra simples.</em></h2><p>Uma experiência direta, sem distrações, para você encontrar o que procura e seguir o seu dia.</p></div><div className="trust-stat" aria-label="Experiência segura"><strong>100%</strong><span>experiência<br />segura</span></div></section>
      <footer><div className="footer-main"><a className="brand" href="/" aria-label="Loja — página inicial"><span className="brand-mark" aria-hidden="true">L</span><span>LOJA<span className="brand-dot">.</span></span></a><p>Escolhas simples para o dia a dia.</p><div className="footer-links"><a href="/pedidos">Meus pedidos</a><a href="/login">Minha conta</a><a href="/carrinho">Carrinho</a></div></div><div className="footer-bottom"><span>© 2026 Loja. Todos os direitos reservados.</span><span>Compra segura · Privacidade · Termos</span></div></footer>
    </main>
  );
}
