import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddToCart from './AddToCart';

function LockIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>; }

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await createClient();
  const { data: p } = await s.from('products').select('id,name,description,price,stock,categories(name)').eq('id', id).eq('active', true).maybeSingle();
  if (!p) notFound();
  const { data: images } = await s.from('product_images').select('id,path,alt,position').eq('product_id', id).order('position');
  const gallery = (images ?? []).map((image) => ({ ...image, url: s.storage.from('product-images').getPublicUrl(image.path).data.publicUrl }));
  const primaryImage = gallery[0] ?? null;

  return <main className="product-detail">
    <a href="/" className="back-link">← Voltar para a loja</a>
    <div className="product-detail-grid">
      <section aria-label="Imagens do produto">{gallery.length ? <div className="detail-gallery">{gallery.map((image) => <img key={image.id} src={image.url} alt={image.alt || p.name} loading={image.position === 0 ? 'eager' : 'lazy'} />)}</div> : <div className="detail-placeholder" aria-label={`Imagem de ${p.name}`}>{p.name.slice(0, 1)}</div>}</section>
      <section className="product-detail-info">
        <p className="eyebrow">PRODUTO</p>
        <h1>{p.name}</h1>
        <p>{p.description || 'Uma escolha especial para você.'}</p>
        <strong>R$ {Number(p.price).toFixed(2).replace('.', ',')}</strong>
        <small>{p.stock > 0 ? `${p.stock} em estoque` : 'Esgotado'}</small>
        {p.stock > 0 ? <AddToCart product={{ id: p.id, name: p.name, price: Number(p.price), image: primaryImage?.url || null, alt: primaryImage?.alt || p.name }} /> : <b className="sold-out">Esgotado</b>}
        <p className="secure-note"><LockIcon /> Compra protegida · preço e estoque validados no servidor</p>
      </section>
    </div>
  </main>;
}
