import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const staticRoutes = ['', '/login', '/cadastro', '/carrinho', '/pedidos'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' as const : 'weekly' as const,
    priority: path === '' ? 1 : 0.5,
  }));

  try {
    const supabase = await createClient();
    const { data } = await supabase.from('products').select('id,created_at').eq('active', true);
    const products = (data ?? []).map((product) => ({
      url: `${baseUrl}/produto/${product.id}`,
      lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...products];
  } catch {
    return staticRoutes;
  }
}
