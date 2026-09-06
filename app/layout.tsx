import type { Metadata } from 'next';
import './globals.css';
import './modern.css';

export const metadata: Metadata = {
  title: {
    default: 'Loja — escolha melhor, viva melhor',
    template: '%s | Loja',
  },
  description: 'Uma experiência de e-commerce moderna, simples e segura.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Loja — escolha melhor, viva melhor',
    description: 'Produtos selecionados com uma experiência de compra simples e segura.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
