'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const isWriter = (session?.user as any)?.role === 'WRITER' || (session?.user as any)?.role === 'ADMIN'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logotipo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>De Facto</span>
          <span className={styles.logoTagline}>Plataforma Editorial</span>
        </Link>

        {/* Navegação central */}
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link href="/artigos" className={`${styles.navLink} ${pathname.startsWith('/artigos') ? styles.navLinkActive : ''}`}>
            Artigos
          </Link>
          <Link href="/autores" className={`${styles.navLink} ${pathname.startsWith('/autores') ? styles.navLinkActive : ''}`}>
            Autores
          </Link>
        </nav>

        {/* Ações de auth */}
        <div className={styles.actions}>
          {session ? (
            <>
              {isWriter && (
                <Link href="/escritor" className={`${styles.navLink} ${pathname.startsWith('/escritor') ? styles.navLinkActive : ''}`}>
                  Meu Painel
                </Link>
              )}
              <Link href="/minha-conta" className={`${styles.navLink} ${pathname.startsWith('/minha-conta') ? styles.navLinkActive : ''}`}>
                {session.user?.name?.split(' ')[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={`btn btn--secondary ${styles.signOutBtn}`}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/entrar" className={styles.navLink}>
                Entrar
              </Link>
              <Link href="/cadastro" className="btn btn--primary">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* Menu hambúrguer (mobile) */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen1 : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen2 : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen3 : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={styles.mobileMenu} aria-label="Menu mobile">
          <Link href="/artigos" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Artigos</Link>
          <Link href="/autores" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Autores</Link>
          {session ? (
            <>
              {isWriter && <Link href="/escritor" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Meu Painel</Link>}
              <Link href="/minha-conta" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Minha Conta</Link>
              <button onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }} className={styles.mobileLink}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/entrar" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link href="/cadastro" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cadastrar</Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
