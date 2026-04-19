import type { Metadata } from 'next'
import { EB_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-body',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
})

export const metadata: Metadata = {
  title: {
    template: '%s — De Facto',
    default: 'De Facto — Plataforma Editorial',
  },
  description:
    'Uma plataforma de escrita e publicação intelectual da comunidade De Facto. Artigos, ensaios e reflexões com a seriedade de uma publicação de época.',
  keywords: ['De Facto', 'artigos', 'ensaios', 'editorial', 'humanismo'],
  authors: [{ name: 'De Facto' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${ebGaramond.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
