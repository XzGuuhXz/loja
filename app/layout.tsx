import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
const inter=Inter({variable:"--font-inter",subsets:["latin"],display:"swap"});
const jakarta=Plus_Jakarta_Sans({variable:"--font-jakarta",subsets:["latin"],display:"swap"});
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000"),title:{default:"NovaVitrine | Tudo em um só lugar",template:"%s | NovaVitrine"},description:"E-commerce moderno com produtos variados e uma experiência de compra simples.",applicationName:"NovaVitrine"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body className={`${inter.variable} ${jakarta.variable} antialiased`}>{children}</body></html>}
