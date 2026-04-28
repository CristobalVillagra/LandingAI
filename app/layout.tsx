import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Páginas web para negocios | Diseño web simple y rápido en Chile',
  
  description: 'Creamos tu página web para tu negocio usando tu información o Instagram. Lista en pocos días, con WhatsApp y pensada para que te lleguen clientes.',
  
  keywords: [
    'pagina web para negocio',
    'paginas web chile',
    'diseño de pagina web',
    'creacion de pagina web',
    'pagina web economica',
    'pagina web con whatsapp'
  ],

  authors: [{ name: 'AIntegration' }],

  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },

  openGraph: {
    title: 'Creamos tu página web para tu negocio | AIntegration',
    description: 'Diseñamos tu página web con la información de tu negocio y la dejamos lista para recibir clientes. Sin complicaciones.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
