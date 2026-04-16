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
  title: 'AIntegration - Soluciones de IA e Informatica',
  description: 'Transformamos tu empresa con soluciones tecnologicas inteligentes. Desarrollo web, integracion de IA y bases de datos.',
  keywords: ['IA', 'desarrollo web', 'integracion', 'tecnologia', 'bases de datos', 'automatizacion'],
  authors: [{ name: 'AIntegration' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'AIntegration - Soluciones de IA e Informatica',
    description: 'Transformamos tu empresa con soluciones tecnologicas inteligentes.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a2744',
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
