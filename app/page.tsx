import { createClient } from '@/lib/supabase/server';
import Storefront from './components/Storefront';

export default async function Home() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from('products').select('id,name,description,price,stock,categories(name)').eq('active', true).order('created_at', { ascending: false });
  if (error || !products) return <Storefront products={[]} />;
  const ids = products.map((product) => product.id);
  const { data: images } = ids.length ? await supabase.from('product_images').select('id,product_id,path,alt,position').in('product_id', ids).order('position') : { data: [] };
  const imageByProduct = new Map<string, { path:string; alt:string|null }>();
  for (const image of images ?? []) if (!imageByProduct.has(image.product_id)) imageByProduct.set(image.product_id, { path:image.path, alt:image.alt });
  const withImages = products.map((product) => ({ ...product, image: imageByProduct.get(product.id) ?? null }));
  return <Storefront products={withImages} />;
}
