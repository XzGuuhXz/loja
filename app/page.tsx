import { createClient } from '@/lib/supabase/server';
import Storefront from './components/Storefront';

export default async function Home() {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from('products').select('id,name,description,price,stock,categories(name)').eq('active', true).order('created_at', { ascending: false });
  return <Storefront products={error ? [] : (products ?? [])} />;
}
