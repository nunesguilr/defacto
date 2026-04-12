'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('E-mail ou senha incorretos.')
      } else {
        router.push('/minha-conta')
        router.refresh()
      }
    } catch {
      setError('Erro ao tentar entrar. Tente novamente.')
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
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>Entre na sua conta para continuar lendo e escrevendo.</p>
        </div>

        {error && (
          <div className={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Endereço de E-mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            id="btn-login"
            className={`btn btn--primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Ainda não é membro?{' '}
            <Link href="/cadastro" className={styles.link}>Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
