import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import styles from './conta.module.css'

export const metadata: Metadata = { title: 'Minha Conta' }

export default async function MinhaContaPage() {
  const session = await auth()
  const userId = session!.user!.id as string
  const userSlug = (session!.user as any).slug as string
  const role = (session!.user as any).role as string

  const [user, saved] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.savedArticle.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
      take: 5,
      include: { article: { include: { author: true, category: true } } },
    }),
  ])

  if (!user) return null

  return (
    <div className={styles.page}>
      <div className="container--md">
        {/* Profile header */}
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name[0]}</span>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
            <span className={`${styles.roleBadge} ${role === 'WRITER' ? styles.roleBadgeWriter : ''}`}>
              {role === 'WRITER' ? 'Escritor' : role === 'ADMIN' ? 'Admin' : 'Membro'}
            </span>
          </div>
          <div className={styles.profileActions}>
            <Link href="/minha-conta/perfil" className="btn btn--secondary">
              Editar perfil
            </Link>
            {role === 'WRITER' && (
              <Link href="/escritor" className="btn btn--primary">
                Meu Painel
              </Link>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className={styles.bio}>
            <p>{user.bio}</p>
          </div>
        )}

        {/* Saved articles */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Artigos Salvos</h2>
            {saved.length > 0 && (
              <Link href="/minha-conta/salvos" className={styles.seeAll}>Ver todos</Link>
            )}
          </div>

          {saved.length === 0 ? (
            <p className={styles.empty}>
              Você ainda não salvou nenhum artigo.{' '}
              <Link href="/artigos" className={styles.link}>Explorar artigos</Link>
            </p>
          ) : (
            <div className={styles.savedList}>
              {saved.map(sa => (
                <Link
                  key={sa.articleId}
                  href={`/artigos/${sa.article.slug}`}
                  className={styles.savedItem}
                >
                  <div>
                    <span className={styles.savedCategory}>{sa.article.category.name}</span>
                    <h3 className={styles.savedTitle}>{sa.article.title}</h3>
                    <p className={styles.savedMeta}>
                      {sa.article.author.name} · Salvo em {formatDate(sa.savedAt)}
                    </p>
                  </div>
                  {sa.article.coverImage && (
                    <img
                      src={sa.article.coverImage}
                      alt=""
                      className={styles.savedThumbnail}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
