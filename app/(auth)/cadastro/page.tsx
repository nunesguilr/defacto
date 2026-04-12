'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function CadastroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta.')
        return
      }

      // Login automático após cadastro
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        router.push('/entrar')
      } else {
        router.push('/minha-conta')
        router.refresh()
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Ornamento */}
        <div className={styles.ornamentTop} aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.75"/>
            <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="0.75"/>
            <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
            <line x1="20" y1="2" x2="20" y2="38" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className={styles.header}>
          <Link href="/" className={styles.brand}>De Facto</Link>
          <h1 className={styles.title}>Junte-se à comunidade</h1>
          <p className={styles.subtitle}>Crie sua conta para ler, salvar e publicar artigos.</p>
        </div>

        {error && (
          <div className={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nome Completo</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-cadastro" className="form-label">Endereço de E-mail</label>
            <input
              id="email-cadastro"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-cadastro" className="form-label">Senha</label>
            <input
              id="password-cadastro"
              type="password"
              className="form-input"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de conta</label>
            <div className={styles.roleOptions}>
              <label className={`${styles.roleOption} ${form.role === 'MEMBER' ? styles.roleOptionActive : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="MEMBER"
                  checked={form.role === 'MEMBER'}
                  onChange={() => update('role', 'MEMBER')}
                />
                <div>
                  <span className={styles.roleTitle}>Leitor / Membro</span>
                  <span className={styles.roleDesc}>Leia, salve artigos e comente.</span>
                </div>
              </label>
              <label className={`${styles.roleOption} ${form.role === 'WRITER' ? styles.roleOptionActive : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="WRITER"
                  checked={form.role === 'WRITER'}
                  onChange={() => update('role', 'WRITER')}
                />
                <div>
                  <span className={styles.roleTitle}>Escritor</span>
                  <span className={styles.roleDesc}>Escreva e publique artigos na plataforma.</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            id="btn-cadastro"
            className={`btn btn--primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Já tem uma conta?{' '}
            <Link href="/entrar" className={styles.link}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
