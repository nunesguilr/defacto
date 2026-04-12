import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './autores.module.css'

export const metadata: Metadata = {
  title: 'Autores',
  description: 'Conheça os escritores da plataforma De Facto.',
}

export default async function AutoresPage() {
  const authors = await prisma.user.findMany({
    where: { role: { in: ['WRITER', 'ADMIN'] } },
    include: {
      _count: { select: { articles: { where: { status: 'PUBLISHED' } } } },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Autores</h1>
          <p className={styles.pageSubtitle}>
            Conheça os escritores que contribuem para a plataforma De Facto.
          </p>
        </div>

        {authors.length === 0 ? (
          <p className={styles.empty}>Nenhum escritor cadastrado ainda.</p>
        ) : (
          <div className={styles.grid}>
            {authors.map(author => (
              <Link key={author.id} href={`/autores/${author.slug}`} className={styles.authorCard}>
                <div className={styles.avatar}>
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} />
                  ) : (
                    <span>{author.name[0]}</span>
                  )}
                </div>
                <h2 className={styles.name}>{author.name}</h2>
                {author.bio && <p className={styles.bio}>{author.bio}</p>}
                <span className={styles.count}>
                  {author._count.articles} artigo{author._count.articles !== 1 ? 's' : ''}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
