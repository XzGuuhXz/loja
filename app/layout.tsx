import type { Metadata } from 'next';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import './globals.css';
import './modern.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

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
    <html lang="pt-BR" className={`${manrope.variable} ${dmSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
