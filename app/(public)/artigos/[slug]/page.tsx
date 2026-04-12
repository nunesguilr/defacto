import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './artigo.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true },
  })
  if (!article) return { title: 'Artigo não encontrado' }
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    authors: [{ name: article.author.name }],
  }
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
      comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
    },
  })

  if (!article) notFound()

  // Incrementar views (fire and forget)
  prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  }).catch(() => {})

  return (
    <article className={styles.page}>
      {/* ── HEADER DO ARTIGO ─────────────────── */}
      <header className={styles.articleHeader}>
        <div className="container--prose">
          <Link href={`/artigos?categoria=${article.category.slug}`} className={styles.category}>
            {article.category.name}
          </Link>

          <h1 className={styles.title}>{article.title}</h1>

          {article.subtitle && (
            <p className={styles.subtitle}>{article.subtitle}</p>
          )}

          <div className={styles.meta}>
            <Link href={`/autores/${article.author.slug}`} className={styles.authorLink}>
              <div className={styles.authorAvatar}>
                {article.author.avatar ? (
                  <img src={article.author.avatar} alt={article.author.name} />
                ) : (
                  <span>{article.author.name[0]}</span>
                )}
              </div>
              <div>
                <span className={styles.authorName}>{article.author.name}</span>
                {article.publishedAt && (
                  <span className={styles.metaDate}>{formatDate(article.publishedAt)}</span>
                )}
              </div>
            </Link>
            <div className={styles.metaRight}>
              {article.readTime && (
                <span className={styles.readTime}>{article.readTime} min de leitura</span>
              )}
              <span className={styles.views}>{article.views} visualizações</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── IMAGEM DE CAPA ───────────────────── */}
      {article.coverImage && (
        <div className={styles.coverWrapper}>
          <div className="container">
            <img src={article.coverImage} alt={article.title} className={styles.coverImage} />
          </div>
        </div>
      )}

      {/* ── CORPO ────────────────────────────── */}
      <div className={styles.bodyWrapper}>
        <div className="container--prose">
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>
      </div>

      {/* ── TAGS ─────────────────────────────── */}
      {article.tags.length > 0 && (
        <div className={styles.tagsSection}>
          <div className="container--prose">
            <div className={styles.ornamentDivider} aria-hidden="true">
              <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
                <line x1="0" y1="6" x2="48" y2="6" stroke="currentColor" strokeWidth="0.75"/>
                <circle cx="54" cy="6" r="2" fill="currentColor"/>
                <circle cx="60" cy="6" r="3" stroke="currentColor" strokeWidth="0.75" fill="none"/>
                <circle cx="66" cy="6" r="2" fill="currentColor"/>
                <line x1="72" y1="6" x2="120" y2="6" stroke="currentColor" strokeWidth="0.75"/>
              </svg>
            </div>
            <div className={styles.tags}>
              {article.tags.map(at => (
                <span key={at.tagId} className={styles.tag}>{at.tag.name}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BIO DO AUTOR ─────────────────────── */}
      <div className={styles.authorBio}>
        <div className="container--prose">
          <div className={styles.authorBioCard}>
            <div className={styles.authorBioAvatar}>
              {article.author.avatar ? (
                <img src={article.author.avatar} alt={article.author.name} />
              ) : (
                <span>{article.author.name[0]}</span>
              )}
            </div>
            <div>
              <p className={styles.authorBioLabel}>Sobre o autor</p>
              <Link href={`/autores/${article.author.slug}`} className={styles.authorBioName}>
                {article.author.name}
              </Link>
              {article.author.bio && (
                <p className={styles.authorBioText}>{article.author.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMENTÁRIOS ──────────────────────── */}
      <section className={styles.comments}>
        <div className="container--prose">
          <h2 className={styles.commentsTitle}>
            Comentários ({article.comments.length})
          </h2>
          {article.comments.length === 0 ? (
            <p className={styles.commentsEmpty}>
              Seja o primeiro a comentar este artigo.
            </p>
          ) : (
            <div className={styles.commentsList}>
              {article.comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentAuthor}>
                    <span className={styles.commentAuthorName}>{comment.author.name}</span>
                    <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className={styles.commentBody}>{comment.body}</p>
                </div>
              ))}
            </div>
          )}
          <p className={styles.commentsNote}>
            <Link href="/entrar">Entre na sua conta</Link> para comentar.
          </p>
        </div>
      </section>
    </article>
  )
}
