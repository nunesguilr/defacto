import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // If authenticated user tries to access login/register, redirect to account
  if (session && (pathname === '/entrar' || pathname === '/cadastro')) {
    return NextResponse.redirect(new URL('/minha-conta', request.url))
  }

  // Protect member area
  if (!session && pathname.startsWith('/minha-conta')) {
    return NextResponse.redirect(new URL('/entrar', request.url))
  }

  // Protect writer area
  if (pathname.startsWith('/escritor')) {
    if (!session) {
      return NextResponse.redirect(new URL('/entrar', request.url))
    }
    const role = (session.user as any)?.role
    if (role !== 'WRITER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/minha-conta', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/entrar', '/cadastro', '/minha-conta/:path*', '/escritor/:path*'],
}
