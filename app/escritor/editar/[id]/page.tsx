import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ArticleEditorForm from '@/components/editor/ArticleEditorForm'
import type { Metadata } from 'next'
import styles from '../novo/novo.module.css'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Editar Artigo' }

export default async function EditarArtigoPage({ params }: Props) {
  const { id } = await params

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!article) notFound()

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Editar Artigo</h1>
        </div>
        <ArticleEditorForm
          categories={categories}
          articleId={article.id}
          initialData={article}
        />
      </div>
    </div>
  )
}
