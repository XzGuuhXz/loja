import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductActions from './ProductActions';

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=await createClient();
  const {data:p,error}=await s.from('products').select('id,name,slug,description,price,stock,active,categories(name),product_images(path,alt,position)').eq('slug',slug).maybeSingle();
  if(error||!p||!p.active) notFound();
  const images=(p.product_images||[]).sort((a:any,b:any)=>a.position-b.position);
  const publicUrls=images.map((i:any)=>({url:s.storage.from('product-images').getPublicUrl(i.path).data.publicUrl,alt:i.alt||p.name}));
  return <main className="product-detail loja-page-enter">
    <a href="/produtos" className="back-link">← Catálogo</a>
    <div className="product-detail-grid">
      <div className="detail-gallery">{publicUrls.length?publicUrls.map((i:any)=><img key={i.url} src={i.url} alt={i.alt}/>):<div className="detail-placeholder" aria-hidden="true">✦</div>}</div>
      <div className="product-detail-info"><p className="eyebrow">{p.categories?.name||'PRODUTO'}</p><h1>{p.name}</h1><p>{p.description||'Produto selecionado para você.'}</p><strong>R$ {Number(p.price).toFixed(2).replace('.',',')}</strong><small>{p.stock>0?`${p.stock} unidades em estoque`:'Produto esgotado'}</small><ProductActions product={{id:p.id,name:p.name,price:Number(p.price),stock:p.stock,image:publicUrls[0]?.url||null,image_alt:publicUrls[0]?.alt||null}}/></div>
    </div>
  </main>;
}