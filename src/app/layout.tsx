import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Kard Hub — Portal de Parceiros',
  description: 'Central de operações para parceiros Kard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} h-full`}>
      <body className="h-full font-[family-name:var(--font-montserrat)] antialiased">
        {children}
      </body>
    </html>
  )
}
