import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

function money(v:number|string){return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function catName(c:any){return Array.isArray(c)?c[0]?.name??'Geral':c?.name??'Geral';}

export default async function Products({searchParams}:{searchParams:Promise<{q?:string;category?:string;min?:string;max?:string}>}){
  const params=await searchParams;
  const q=(params.q||'').trim().toLowerCase();
  const category=params.category||'';
  const min=params.min?Number(params.min):0;
  const max=params.max?Number(params.max):Number.POSITIVE_INFINITY;
  let products:any[]=[];
  let categories:any[]=[];
  try{
    const s=await createClient();
    const [{data:p},{data:c}]=await Promise.all([
      s.from('products').select('id,name,slug,description,price,stock,active,categories(name)').eq('active',true).order('created_at',{ascending:false}),
      s.from('categories').select('id,name,slug').order('name')
    ]);
    products=p||[]; categories=c||[];
  }catch{}
  const filtered=products.filter(p=>(!q||`${p.name} ${p.description||''}`.toLowerCase().includes(q))&&(!category||catName(p.categories)===category)&&Number(p.price)>=min&&Number(p.price)<=max);
  return <main className="page-shell loja-page-enter">
    <Link href="/" className="back-link">← Loja</Link>
    <div className="section-heading"><div><p className="eyebrow">CATÁLOGO</p><h1>Todos os produtos</h1></div><span className="result-count">{filtered.length} resultados</span></div>
    <form className="loja-card" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:10,padding:16,marginBottom:22}} action="/produtos">
      <input name="q" defaultValue={params.q||''} placeholder="Buscar produtos..." aria-label="Buscar produtos" style={{padding:'11px 12px',border:'1px solid var(--line)',background:'#fff',outline:0}}/>
      <select name="category" defaultValue={category} aria-label="Categoria" style={{padding:'11px 12px',border:'1px solid var(--line)',background:'#fff'}}><option value="">Todas categorias</option>{categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><input name="min" inputMode="decimal" defaultValue={params.min||''} placeholder="Min" aria-label="Preço mínimo" style={{padding:'11px 10px',border:'1px solid var(--line)'}}/><input name="max" inputMode="decimal" defaultValue={params.max||''} placeholder="Max" aria-label="Preço máximo" style={{padding:'11px 10px',border:'1px solid var(--line)'}}/></div>
      <button className="loja-btn loja-btn-primary" type="submit">Filtrar</button>
    </form>
    {filtered.length===0?<div className="empty-state"><h2>Nenhum produto encontrado</h2><p>Ajuste a busca ou os filtros e tente novamente.</p><Link className="loja-btn loja-btn-primary" href="/produtos">Limpar filtros</Link></div>:
      <div className="product-grid">{filtered.map((p,i)=><article className="product-card" key={p.id}>
        <Link href={`/produto/${p.slug}`} className={`product-image ${['paper','sand','stone','clay','ink'][i%5]}`}><div className="abstract-product" aria-hidden="true">{['◈','◇','○','△','✦'][i%5]}</div><span className="category-pill">{catName(p.categories)}</span></Link>
        <div className="product-info"><p className="product-category">{catName(p.categories)}</p><Link href={`/produto/${p.slug}`}><h3>{p.name}</h3></Link><p className="product-description">{p.description||'Uma escolha especial para você.'}</p><div className="product-bottom"><div><strong>{money(p.price)}</strong><small>{p.stock>0?`${p.stock} disponíveis`:'Esgotado'}</small></div><Link className={p.stock>0?'buy-btn':'buy-btn disabled'} href={`/produto/${p.slug}`}>{p.stock>0?'Ver produto':'Esgotado'}</Link></div></div>
      </article>)}</div>}
  </main>;
}