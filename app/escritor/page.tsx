import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import styles from './escritor.module.css'

export const metadata: Metadata = { title: 'Painel do Escritor' }

export default async function EscritorPage() {
  const session = await auth()
  const authorId = session!.user!.id as string

  const [articles, totalViews] = await Promise.all([
    prisma.article.findMany({
      where: { authorId },
      orderBy: { updatedAt: 'desc' },
      include: { category: true },
      take: 10,
    }),
    prisma.article.aggregate({
      where: { authorId, status: 'PUBLISHED' },
      _sum: { views: true },
    }),
  ])

  const published = articles.filter(a => a.status === 'PUBLISHED').length
  const drafts = articles.filter(a => a.status === 'DRAFT').length

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Meu Painel</h1>
            <p className={styles.subtitle}>Gerencie seus artigos e rascunhos</p>
          </div>
          <Link href="/escritor/novo" className="btn btn--primary" id="btn-novo-artigo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Novo Artigo
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{published}</span>
            <span className={styles.statLabel}>Publicados</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{drafts}</span>
            <span className={styles.statLabel}>Rascunhos</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalViews._sum.views ?? 0}</span>
            <span className={styles.statLabel}>Visualizações</span>
          </div>
        </div>

        {/* Articles list */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Meus Artigos</h2>

          {articles.length === 0 ? (
            <div className={styles.empty}>
              <p>Você ainda não escreveu nenhum artigo.</p>
              <Link href="/escritor/novo" className="btn btn--primary">
                Escrever meu primeiro artigo
              </Link>
            </div>
          ) : (
            <div className={styles.articlesList}>
              {articles.map(article => (
                <div key={article.id} className={styles.articleRow}>
                  <div className={styles.articleInfo}>
                    <span className={`badge ${styles[`badge${article.status}`]}`}>
                      {article.status === 'PUBLISHED' ? 'Publicado' :
                       article.status === 'DRAFT' ? 'Rascunho' : 'Arquivado'}
                    </span>
                    <div>
                      <h3 className={styles.articleTitle}>{article.title}</h3>
                      <p className={styles.articleMeta}>
                        {article.category.name} · Atualizado em {formatDate(article.updatedAt)}
                        {article.status === 'PUBLISHED' && ` · ${article.views} visualizações`}
                      </p>
                    </div>
                  </div>
                  <div className={styles.articleActions}>
                    <Link href={`/escritor/editar/${article.id}`} className="btn btn--secondary">
                      Editar
                    </Link>
                    {article.status === 'PUBLISHED' && (
                      <Link href={`/artigos/${article.slug}`} className="btn btn--ghost" target="_blank">
                        Ver
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
