import { prisma } from '@/lib/prisma'
import ArticleEditorForm from '@/components/editor/ArticleEditorForm'
import type { Metadata } from 'next'
import styles from './novo.module.css'

export const metadata: Metadata = { title: 'Novo Artigo' }

export default async function NovoArtigoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  if (categories.length === 0) {
    return (
      <div style={{ padding: 'var(--space-12)' }} className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>
          Nenhuma categoria disponível
        </h1>
        <p style={{ color: 'var(--color-stone)', fontStyle: 'italic' }}>
          Para publicar um artigo, é necessário criar pelo menos uma categoria no banco de dados.
          Execute o seed com <code>npx prisma db seed</code>.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Novo Artigo</h1>
        </div>
        <ArticleEditorForm categories={categories} />
      </div>
    </div>
  )
}
