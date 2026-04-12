import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, truncate } from '@/lib/utils'
import type { Metadata } from 'next'
import styles from './Home.module.css'

export const metadata: Metadata = {
  title: 'De Facto — Plataforma Editorial',
  description: 'Artigos e ensaios da comunidade De Facto.',
}

async function getHomeData() {
  const [featured, articles, categories] = await Promise.all([
    prisma.article.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: { author: true, category: true },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      include: { author: true, category: true },
      skip: 1,
    }),
    prisma.category.findMany({
      include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    }),
  ])
  return { featured, articles, categories }
}

export default async function HomePage() {
  const { featured, articles, categories } = await getHomeData()

  return (
    <div className={styles.page}>
      {/* ── HERO ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroMasthead}>
            <span className={styles.heroKicker}>Plataforma Editorial</span>
            <h1 className={styles.heroTitle}>De&nbsp;Facto</h1>
            <p className={styles.heroSubtitle}>
              Escrita rigorosa. Pensamento livre. Uma comunidade intelectual
              dedicada à circulação de ideias com profundidade e integridade.
            </p>
            <div className={styles.heroActions}>
              <Link href="/artigos" className="btn btn--primary">
                Ler Artigos
              </Link>
              <Link href="/cadastro" className="btn btn--secondary">
                Tornar-se Membro
              </Link>
            </div>
          </div>

          {/* Ornamento decorativo */}
          <div className={styles.heroOrnament} aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" className={styles.heroSvg}>
              <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="0.75"/>
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.4"/>
              <path d="M100 4 L100 196M4 100 L196 100" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="100" cy="100" r="8" stroke="currentColor" strokeWidth="0.75"/>
              <circle cx="100" cy="100" r="3" fill="currentColor"/>
              {/* Marcações cardinais */}
              {[0,90,180,270].map(angle => {
                const rad = (angle * Math.PI) / 180
                const x1 = 100 + 80 * Math.sin(rad)
                const y1 = 100 - 80 * Math.cos(rad)
                const x2 = 100 + 96 * Math.sin(rad)
                const y2 = 100 - 96 * Math.cos(rad)
                return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5"/>
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ── ARTIGO EM DESTAQUE ────────────────────── */}
      {featured && (
        <section className={styles.featured}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Destaque</span>
              <div className={styles.sectionLine} aria-hidden="true" />
            </div>
            <Link href={`/artigos/${featured.slug}`} className={styles.featuredCard}>
              {featured.coverImage && (
                <div className={styles.featuredImageWrapper}>
                  <img src={featured.coverImage} alt={featured.title} className={styles.featuredImage} />
                </div>
              )}
              <div className={styles.featuredBody}>
                <span className={styles.featuredCategory}>{featured.category.name}</span>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                {featured.subtitle && (
                  <p className={styles.featuredSubtitle}>{featured.subtitle}</p>
                )}
                {featured.excerpt && (
                  <p className={styles.featuredExcerpt}>{truncate(featured.excerpt, 240)}</p>
                )}
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredAuthor}>{featured.author.name}</span>
                  <span className={styles.featuredDot}>·</span>
                  {featured.publishedAt && (
                    <span className={styles.featuredDate}>{formatDate(featured.publishedAt)}</span>
                  )}
                  {featured.readTime && (
                    <>
                      <span className={styles.featuredDot}>·</span>
                      <span className={styles.featuredDate}>{featured.readTime} min de leitura</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── CATEGORIAS ───────────────────────────── */}
      {categories.length > 0 && (
        <section className={styles.categories}>
          <div className="container">
            <div className={styles.categoryStrip}>
              {categories.map(cat => (
                <Link key={cat.id} href={`/artigos?categoria=${cat.slug}`} className={styles.categoryChip}>
                  {cat.name}
                  <span className={styles.categoryCount}>{cat._count.articles}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GRID DE ARTIGOS ──────────────────────── */}
      {articles.length > 0 && (
        <section className={styles.articlesSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Publicações Recentes</span>
              <div className={styles.sectionLine} aria-hidden="true" />
              <Link href="/artigos" className={styles.seeAll}>Ver todos</Link>
            </div>
            <div className="article-grid article-grid--3">
              {articles.map(article => (
                <Link key={article.id} href={`/artigos/${article.slug}`} className="article-card" style={{ textDecoration: 'none' }}>
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="article-card__image"
                    />
                  )}
                  <div className="article-card__body">
                    <span className="article-card__category">{article.category.name}</span>
                    <h3 className="article-card__title">{article.title}</h3>
                    {article.excerpt && (
                      <p className="article-card__excerpt">{truncate(article.excerpt, 140)}</p>
                    )}
                    <div className="article-card__meta">
                      <span>{article.author.name}</span>
                      {article.publishedAt && (
                        <>
                          <span>·</span>
                          <span>{formatDate(article.publishedAt)}</span>
                        </>
                      )}
                      {article.readTime && (
                        <>
                          <span>·</span>
                          <span>{article.readTime} min</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Estado vazio — sem artigos ainda */}
      {!featured && articles.length === 0 && (
        <section className={styles.emptyState}>
          <div className="container--md">
            <div className={styles.emptyInner}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ color: 'var(--color-gold)', margin: '0 auto' }}>
                <rect x="8" y="8" width="48" height="48" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="20" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="1"/>
                <line x1="20" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <h2 className={styles.emptyTitle}>A plataforma está pronta</h2>
              <p className={styles.emptyText}>
                Ainda não há artigos publicados. Cadastre-se como escritor e publique o primeiro.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/cadastro" className="btn btn--primary">Começar a escrever</Link>
                <Link href="/entrar" className="btn btn--secondary">Entrar</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
