import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/entrar')

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
