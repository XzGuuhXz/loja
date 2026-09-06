import { createClient } from '@/lib/supabase/server';
import Storefront from './components/Storefront';

type DemoProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: { name: string };
  image: null;
};

// Fallback visual para a versão de demonstração. A Home continua navegável
// mesmo quando a Vercel estiver sem as variáveis do Supabase.
const demoProducts: DemoProduct[] = [
  {
    id: 'demo-fone-air',
    name: 'Fone Air Pro',
    description: 'Som imersivo, design leve e bateria para o dia inteiro.',
    price: 349.9,
    stock: 18,
    categories: { name: 'Tecnologia' },
    image: null,
  },
  {
    id: 'demo-smartwatch-one',
    name: 'Smartwatch One',
    description: 'Seu dia organizado com estilo, praticidade e movimento.',
    price: 499.9,
    stock: 12,
    categories: { name: 'Tecnologia' },
    image: null,
  },
  {
    id: 'demo-mochila-urban',
    name: 'Mochila Urban',
    description: 'Espaço inteligente para acompanhar sua rotina.',
    price: 219.9,
    stock: 24,
    categories: { name: 'Acessórios' },
    image: null,
  },
  {
    id: 'demo-garrafa-termica',
    name: 'Garrafa Térmica',
    description: 'Temperatura ideal por mais tempo, onde você estiver.',
    price: 129.9,
    stock: 31,
    categories: { name: 'Casa & Vida' },
    image: null,
  },
  {
    id: 'demo-luminaria',
    name: 'Luminária Aura',
    description: 'Luz ambiente minimalista para deixar seu espaço especial.',
    price: 189.9,
    stock: 9,
    categories: { name: 'Casa & Vida' },
    image: null,
  },
  {
    id: 'demo-oculos',
    name: 'Óculos Essential',
    description: 'Visual marcante com uma estética limpa e contemporânea.',
    price: 159.9,
    stock: 16,
    categories: { name: 'Acessórios' },
    image: null,
  },
];

export default async function Home() {
  try {
    const supabase = await createClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('id,name,description,price,stock,categories(name)')
      .eq('active', true)
      .order('created_at', { ascending: false });

    // Para a demonstração, não deixamos a ausência do banco transformar a
    // vitrine em uma tela de erro. Se o Supabase não estiver configurado,
    // exibimos conteúdo visual local e a experiência continua navegável.
    if (error || !products?.length) return <Storefront products={demoProducts} />;

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
    return <Storefront products={demoProducts} />;
  }
}
