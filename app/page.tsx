import { createClient } from '@/lib/supabase/server';
import Storefront from './components/Storefront';

export default async function Home() {
  try {
    const supabase = await createClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('id,name,description,price,stock,categories(name)')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error || !products) return <Storefront products={[]} />;

    const ids = products.map((product) => product.id);
    const { data: images } = ids.length
      ? await supabase
          .from('product_images')
          .select('id,product_id,path,alt,position')
          .in('product_id', ids)
          .order('position')
      : { data: [] };

    const imageByProduct = new Map<string, { url: string; alt: string | null }>();
    for (const image of images ?? []) {
      if (!imageByProduct.has(image.product_id)) {
        imageByProduct.set(image.product_id, {
          url: supabase.storage.from('product-images').getPublicUrl(image.path).data.publicUrl,
          alt: image.alt,
        });
      }
    }

    const withImages = products.map((product) => ({
      ...product,
      image: imageByProduct.get(product.id) ?? null,
    }));

    return <Storefront products={withImages} />;
  } catch (error) {
    console.error('Storefront initialization failed:', error);
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Loja</p>
          <h1 className="mt-2 text-2xl font-bold">A loja está sendo configurada</h1>
          <p className="mt-3 text-slate-600">
            O servidor não conseguiu inicializar o acesso ao banco de dados. Verifique as variáveis de ambiente do ambiente Production e faça um novo deploy.
          </p>
        </div>
      </main>
    );
  }
}
