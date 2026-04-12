'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import styles from './TipTapEditor.module.css'

type Props = {
  content?: string
  onChange: (html: string) => void
}

export default function TipTapEditor({ content = '', onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: 'Comece a escrever seu artigo aqui…',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      Image.configure({ inline: false }),
      CharacterCount,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        'aria-label': 'Editor de artigo',
      },
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  function toggleBold() { editor!.chain().focus().toggleBold().run() }
  function toggleItalic() { editor!.chain().focus().toggleItalic().run() }
  function toggleStrike() { editor!.chain().focus().toggleStrike().run() }
  function toggleH2() { editor!.chain().focus().toggleHeading({ level: 2 }).run() }
  function toggleH3() { editor!.chain().focus().toggleHeading({ level: 3 }).run() }
  function toggleBullet() { editor!.chain().focus().toggleBulletList().run() }
  function toggleOrdered() { editor!.chain().focus().toggleOrderedList().run() }
  function toggleBlockquote() { editor!.chain().focus().toggleBlockquote().run() }
  function undo() { editor!.chain().focus().undo().run() }
  function redo() { editor!.chain().focus().redo().run() }

  const chars = editor.storage.characterCount?.characters?.() ?? 0
  const words = editor.storage.characterCount?.words?.() ?? 0

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar} role="toolbar" aria-label="Formatação">
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleBold}
            className={`${styles.tool} ${editor.isActive('bold') ? styles.toolActive : ''}`}
            title="Negrito"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            className={`${styles.tool} ${editor.isActive('italic') ? styles.toolActive : ''}`}
            title="Itálico"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={toggleStrike}
            className={`${styles.tool} ${editor.isActive('strike') ? styles.toolActive : ''}`}
            title="Tachado"
          >
            <s>S</s>
          </button>
        </div>

        <div className={styles.toolbarSep} aria-hidden="true" />

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleH2}
            className={`${styles.tool} ${editor.isActive('heading', { level: 2 }) ? styles.toolActive : ''}`}
            title="Título H2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={toggleH3}
            className={`${styles.tool} ${editor.isActive('heading', { level: 3 }) ? styles.toolActive : ''}`}
            title="Título H3"
          >
            H3
          </button>
        </div>

        <div className={styles.toolbarSep} aria-hidden="true" />

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={toggleBullet}
            className={`${styles.tool} ${editor.isActive('bulletList') ? styles.toolActive : ''}`}
            title="Lista não ordenada"
          >
            •—
          </button>
          <button
            type="button"
            onClick={toggleOrdered}
            className={`${styles.tool} ${editor.isActive('orderedList') ? styles.toolActive : ''}`}
            title="Lista ordenada"
          >
            1.
          </button>
          <button
            type="button"
            onClick={toggleBlockquote}
            className={`${styles.tool} ${editor.isActive('blockquote') ? styles.toolActive : ''}`}
            title="Citação"
          >
            "
          </button>
        </div>

        <div className={styles.toolbarSep} aria-hidden="true" />

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={undo}
            className={styles.tool}
            title="Desfazer"
            disabled={!editor.can().undo()}
          >
            ↩
          </button>
          <button
            type="button"
            onClick={redo}
            className={styles.tool}
            title="Refazer"
            disabled={!editor.can().redo()}
          >
            ↪
          </button>
        </div>

        <div className={styles.wordCount} aria-live="polite">
          {words} palavras · {chars} caracteres
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className={styles.editor} />
    </div>
  )
}
