import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Ornamento separador */}
      <div className={styles.ornament}>
        <svg width="180" height="16" viewBox="0 0 180 16" fill="none" aria-hidden="true">
          <line x1="0" y1="8" x2="72" y2="8" stroke="currentColor" strokeWidth="0.75"/>
          <circle cx="80" cy="8" r="2.5" fill="currentColor"/>
          <circle cx="90" cy="8" r="4" stroke="currentColor" strokeWidth="0.75" fill="none"/>
          <circle cx="100" cy="8" r="2.5" fill="currentColor"/>
          <line x1="108" y1="8" x2="180" y2="8" stroke="currentColor" strokeWidth="0.75"/>
        </svg>
      </div>

      <div className={styles.inner}>
        {/* Marca */}
        <div className={styles.brand}>
          <Link href="/" className={styles.brandName}>De Facto</Link>
          <p className={styles.brandDesc}>
            Uma plataforma editorial dedicada ao pensamento rigoroso,
            à escrita cuidadosa e à circulação de ideias com integridade.
          </p>
        </div>

        {/* Links */}
        <nav className={styles.links} aria-label="Links do rodapé">
          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Publicações</h3>
            <Link href="/artigos" className={styles.link}>Todos os Artigos</Link>
            <Link href="/autores" className={styles.link}>Autores</Link>
          </div>
          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Comunidade</h3>
            <Link href="/cadastro" className={styles.link}>Tornarse Membro</Link>
            <Link href="/entrar" className={styles.link}>Entrar</Link>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} De Facto — Todos os direitos reservados
        </p>
        <p className={styles.societyTag}>Membro da Sociedade Vera Cruz</p>
      </div>
    </footer>
  )
}
