'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [resetMode, setResetMode] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // Full page reload garante que o middleware lê o cookie de sessão corretamente
    window.location.href = '/dashboard'
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/reset`,
    })

    if (error) {
      setError('Erro ao enviar o e-mail. Tente novamente.')
    } else {
      setResetSent(true)
    }

    setLoading(false)
  }

  if (resetSent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-xl">✓</span>
        </div>
        <p className="text-sm font-semibold text-[#192547]">E-mail enviado!</p>
        <p className="mt-1 text-sm text-gray-500">
          Verifique sua caixa de entrada para redefinir a senha.
        </p>
        <button
          onClick={() => { setResetMode(false); setResetSent(false) }}
          className="mt-4 text-sm font-semibold text-[#192547] hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    )
  }

  if (resetMode) {
    return (
      <form onSubmit={handleReset} className="space-y-4">
        <p className="text-sm text-gray-500">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2.5 text-sm font-medium outline-none transition focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
            placeholder="seu@email.com"
          />
        </div>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#192547] py-2.5 text-sm font-bold text-[#01F767] transition hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          Enviar link de redefinição
        </button>
        <button
          type="button"
          onClick={() => setResetMode(false)}
          className="w-full text-center text-sm text-gray-400 hover:underline"
        >
          Voltar ao login
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
          E-mail
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2.5 text-sm font-medium outline-none transition focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
          Senha
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2.5 pr-10 text-sm font-medium outline-none transition focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#01F767] py-2.5 text-sm font-bold text-[#192547] transition hover:opacity-90 disabled:opacity-60"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        Entrar
      </button>

      <button
        type="button"
        onClick={() => setResetMode(true)}
        className="w-full text-center text-sm text-gray-400 hover:text-[#192547] hover:underline"
      >
        Esqueci minha senha
      </button>
    </form>
  )
}
