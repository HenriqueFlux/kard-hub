'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, UserCheck, UserX, KeyRound, Loader2, X, Pencil } from 'lucide-react'
import type { Profile, UserRole } from '@/lib/types'

export default function UsersManager({ users }: { users: Profile[] }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleActive(user: Profile) {
    setLoading(user.id + '-toggle')
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    })
    setLoading(null)
    router.refresh()
  }

  async function resetPassword(user: Profile) {
    if (!confirm(`Enviar e-mail de redefinição de senha para ${user.email}?`)) return
    setLoading(user.id + '-reset')
    await fetch('/api/admin/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
    setLoading(null)
    alert('E-mail enviado!')
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{users.length} usuário(s)</p>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#01F767] px-4 py-2 text-xs font-bold text-[#192547] hover:opacity-90"
        >
          <Plus size={13} />
          Novo Usuário
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Nome</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 md:table-cell">E-mail</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Perfil</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-semibold text-[#192547]">{user.name}</td>
                <td className="hidden px-4 py-3 text-xs text-gray-500 md:table-cell">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={['rounded-full px-2 py-0.5 text-[10px] font-bold', user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'].join(' ')}>
                    {user.role === 'admin' ? 'Admin' : 'Parceiro'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={['rounded-full px-2 py-0.5 text-[10px] font-bold', user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'].join(' ')}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditUser(user)}
                      title="Editar"
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#192547]"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => resetPassword(user)}
                      disabled={loading === user.id + '-reset'}
                      title="Resetar senha"
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#192547]"
                    >
                      {loading === user.id + '-reset' ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
                    </button>
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={loading === user.id + '-toggle'}
                      title={user.active ? 'Desativar' : 'Ativar'}
                      className={['rounded-lg p-1.5 hover:bg-gray-100', user.active ? 'text-green-500 hover:text-red-500' : 'text-gray-400 hover:text-green-500'].join(' ')}
                    >
                      {loading === user.id + '-toggle' ? <Loader2 size={13} className="animate-spin" /> : user.active ? <UserX size={13} /> : <UserCheck size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); router.refresh() }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={() => { setEditUser(null); router.refresh() }}
        />
      )}
    </>
  )
}

function EditUserModal({ user, onClose, onSaved }: { user: Profile; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: user.name, role: user.role, password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const body: Record<string, string> = { name: form.name, role: form.role }
    if (form.password) body.password = form.password

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setLoading(false)
    if (res.ok) {
      onSaved()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Erro ao salvar.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-sm font-extrabold text-[#192547]">Editar Usuário</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">Nome completo</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">E-mail</label>
            <input
              disabled
              value={user.email}
              className="w-full rounded-lg border border-[#E2E8F0] bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">Perfil</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547]"
            >
              <option value="user">Parceiro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Nova senha <span className="normal-case font-normal text-gray-400">(deixe em branco para não alterar)</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#01F767] px-5 py-2 text-xs font-bold text-[#192547] disabled:opacity-60">
              {loading && <Loader2 size={13} className="animate-spin" />}
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      onCreated()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Erro ao criar usuário.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-sm font-extrabold text-[#192547]">Novo Usuário</h3>
          <button onClick={onClose} className="text-gray-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {[
            { key: 'name', label: 'Nome completo', type: 'text', placeholder: 'João Silva' },
            { key: 'email', label: 'E-mail', type: 'email', placeholder: 'joao@email.com' },
            { key: 'password', label: 'Senha temporária', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</label>
              <input
                required
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
              />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">Perfil</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547]"
            >
              <option value="user">Parceiro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-gray-500">Cancelar</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#01F767] px-5 py-2 text-xs font-bold text-[#192547] disabled:opacity-60">
              {loading && <Loader2 size={13} className="animate-spin" />}
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
