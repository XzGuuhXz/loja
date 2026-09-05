import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCart from './AddToCart';

export default async function Product({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const s=await createClient();
  const {data:p}=await s.from('products').select('id,name,description,price,stock,categories(name)').eq('id',id).eq('active',true).maybeSingle();
  if(!p)notFound();
  const {data:images}=await s.from('product_images').select('id,path,alt,position').eq('product_id',id).order('position');
  return <main className="product-detail"><a href="/" className="back-link">← Voltar para a loja</a><div className="product-detail-grid"><section>{images?.length?<div className="detail-gallery">{images.map((image)=><img key={image.id} src={s.storage.from('product-images').getPublicUrl(image.path).data.publicUrl} alt={image.alt||p.name} loading={image.position===0?'eager':'lazy'}/>)}</div>:<div className="detail-placeholder">{p.name.slice(0,1)}</div>}</section><section className="product-detail-info"><p className="eyebrow">PRODUTO</p><h1>{p.name}</h1><p>{p.description||'Uma escolha especial para você.'}</p><strong>R$ {Number(p.price).toFixed(2).replace('.',',')}</strong><small>{p.stock>0?`${p.stock} em estoque`:'Esgotado'}</small>{p.stock>0?<AddToCart product={{id:p.id,name:p.name,price:Number(p.price)}}/>:<b>Esgotado</b>}<p className="secure-note">🔒 Compra protegida · preço e estoque validados no servidor</p></section></div></main>
}
