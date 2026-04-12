import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

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
    <html lang="pt-BR">
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
