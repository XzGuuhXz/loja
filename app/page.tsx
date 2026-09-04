import { createClient } from '@/lib/supabase/server';
import { signOut } from './actions';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: products, error } = await supabase.from('products').select('id,name,description,price,stock,categories(name)').eq('active', true).order('created_at', { ascending: false });
  return <main style={{maxWidth:1100,margin:'0 auto',padding:32}}><header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}><h1 style={{fontSize:32,margin:0}}>Loja</h1><nav style={{display:'flex',gap:16,alignItems:'center'}}><a href="/carrinho">Carrinho</a>{user?<><a href="/pedidos">Meus pedidos</a><form action={signOut}><button type="submit">Sair</button></form></>:<><a href="/login">Entrar</a><a href="/cadastro">Criar conta</a></>}</nav></header><section><h2>Produtos</h2>{error?<p>Não foi possível carregar os produtos.</p>:<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>{products?.map(p=><article key={p.id} style={{background:'white',borderRadius:12,padding:20,border:'1px solid #e4e4e7'}}><small>{Array.isArray(p.categories)?p.categories[0]?.name:p.categories?.name}</small><h3>{p.name}</h3><p>{p.description}</p><strong>R$ {Number(p.price).toFixed(2).replace('.',',')}</strong><p>{p.stock>0?`${p.stock} em estoque`:'Esgotado'}</p><a href={`/produto/${p.id}`}>Ver produto</a></article>)}</div>}</section></main>;
}