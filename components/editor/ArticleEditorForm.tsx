'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from './editor.module.css'

const TipTapEditor = dynamic(() => import('@/components/editor/TipTapEditor'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: '480px', borderRadius: '8px' }} />,
})

type Category = { id: string; name: string }

type Props = { categories: Category[]; articleId?: string; initialData?: any }

export default function ArticleEditorForm({ categories, articleId, initialData }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    subtitle: initialData?.subtitle ?? '',
    excerpt: initialData?.excerpt ?? '',
    coverImage: initialData?.coverImage ?? '',
    categoryId: initialData?.categoryId ?? (categories[0]?.id ?? ''),
    tags: initialData?.tags?.map((at: any) => at.tag.name).join(', ') ?? '',
    status: initialData?.status ?? 'DRAFT',
    body: initialData?.body ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function save(status?: string) {
    setError('')
    setSaving(true)
    const payload = { ...form, status: status ?? form.status }

    try {
      const url = articleId ? `/api/artigos/${articleId}` : '/api/artigos'
      const method = articleId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao salvar.')
        return
      }

      setSaved(true)
      if (!articleId) {
        router.push(`/escritor/editar/${data.id}`)
      } else {
        router.refresh()
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.editorLayout}>
      {/* ── MAIN PANEL ─────────────────────── */}
      <div className={styles.mainPanel}>
        {/* Title */}
        <div className={styles.titleArea}>
          <input
            id="article-title"
            type="text"
            className={styles.titleInput}
            placeholder="Título do artigo…"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />
          <input
            id="article-subtitle"
            type="text"
            className={styles.subtitleInput}
            placeholder="Subtítulo (opcional)…"
            value={form.subtitle}
            onChange={e => update('subtitle', e.target.value)}
          />
        </div>

        {/* Rich text editor */}
        <TipTapEditor
          content={form.body}
          onChange={html => update('body', html)}
        />
      </div>

      {/* ── SIDE PANEL ─────────────────────── */}
      <aside className={styles.sidePanel}>
        {/* Status actions */}
        <div className={styles.sideCard}>
          <h3 className={styles.sideTitle}>Publicação</h3>

          {error && <p className={styles.errorMsg}>{error}</p>}
          {saved && <p className={styles.successMsg}>✓ Salvo com sucesso</p>}

          <div className={styles.actionBtns}>
            <button
              type="button"
              onClick={() => save('DRAFT')}
              disabled={saving}
              className="btn btn--secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              id="btn-salvar-rascunho"
            >
              {saving ? 'Salvando…' : 'Salvar rascunho'}
            </button>
            <button
              type="button"
              onClick={() => save('PUBLISHED')}
              disabled={saving || !form.title || !form.body || !form.categoryId}
              className="btn btn--primary"
              style={{ width: '100%', justifyContent: 'center' }}
              id="btn-publicar"
            >
              {saving ? 'Publicando…' : 'Publicar'}
            </button>
          </div>

          <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="article-status" className="form-label">Status</label>
            <select
              id="article-status"
              className="form-select"
              value={form.status}
              onChange={e => update('status', e.target.value)}
            >
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="ARCHIVED">Arquivado</option>
            </select>
          </div>
        </div>

        {/* Metadata */}
        <div className={styles.sideCard}>
          <h3 className={styles.sideTitle}>Metadados</h3>

          <div className="form-group">
            <label htmlFor="article-category" className="form-label">Categoria *</label>
            <select
              id="article-category"
              className="form-select"
              value={form.categoryId}
              onChange={e => update('categoryId', e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="article-tags" className="form-label">Tags (separadas por vírgula)</label>
            <input
              id="article-tags"
              type="text"
              className="form-input"
              placeholder="filosofia, ensaio, política…"
              value={form.tags}
              onChange={e => update('tags', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="article-excerpt" className="form-label">Resumo / Excerto</label>
            <textarea
              id="article-excerpt"
              className="form-textarea"
              placeholder="Breve descrição do artigo…"
              value={form.excerpt}
              onChange={e => update('excerpt', e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="article-cover" className="form-label">URL da Imagem de Capa</label>
            <input
              id="article-cover"
              type="url"
              className="form-input"
              placeholder="https://…"
              value={form.coverImage}
              onChange={e => update('coverImage', e.target.value)}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
