import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, truncate } from '@/lib/utils'
import type { Metadata } from 'next'
import styles from './artigos.module.css'

export const metadata: Metadata = {
  title: 'Artigos',
  description: 'Todos os artigos publicados na plataforma De Facto.',
}

type SearchParams = { categoria?: string; autor?: string; tag?: string }

export default async function ArtigosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const where: any = { status: 'PUBLISHED' }
  if (params.categoria) {
    where.category = { slug: params.categoria }
  }
  if (params.autor) {
    where.author = { slug: params.autor }
  }

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: { author: true, category: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    }),
  ])

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Page header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Artigos</h1>
          <p className={styles.pageSubtitle}>
            {articles.length === 0
              ? 'Nenhum artigo encontrado'
              : `${articles.length} artigo${articles.length !== 1 ? 's' : ''} publicado${articles.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className={styles.filters}>
            <Link
              href="/artigos"
              className={`${styles.filter} ${!params.categoria ? styles.filterActive : ''}`}
            >
              Todos
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/artigos?categoria=${cat.slug}`}
                className={`${styles.filter} ${params.categoria === cat.slug ? styles.filterActive : ''}`}
              >
                {cat.name}
                <span className={styles.filterCount}>{cat._count.articles}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Articles grid */}
        {articles.length > 0 ? (
          <div className="article-grid article-grid--3">
            {articles.map(article => (
              <Link
                key={article.id}
                href={`/artigos/${article.slug}`}
                className="article-card"
                style={{ textDecoration: 'none' }}
              >
                {article.coverImage && (
                  <img src={article.coverImage} alt={article.title} className="article-card__image" />
                )}
                <div className="article-card__body">
                  <span className="article-card__category">{article.category.name}</span>
                  <h2 className="article-card__title">{article.title}</h2>
                  {article.excerpt && (
                    <p className="article-card__excerpt">{truncate(article.excerpt, 150)}</p>
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
        ) : (
          <div className={styles.empty}>
            <p>Nenhum artigo publicado nesta categoria ainda.</p>
            <Link href="/artigos" className={styles.emptyLink}>Ver todos os artigos</Link>
          </div>
        )}
      </div>
    </div>
  )
}
