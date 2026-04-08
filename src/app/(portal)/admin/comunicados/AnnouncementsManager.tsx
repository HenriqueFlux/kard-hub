'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, X, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Announcement } from '@/lib/types'

export default function AnnouncementsManager({ items }: { items: Announcement[] }) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleActive(item: Announcement) {
    setLoading(item.id + '-toggle')
    await fetch(`/api/admin/announcements/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !item.active }),
    })
    setLoading(null)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este comunicado?')) return
    setLoading(id + '-del')
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    setLoading(null)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{items.length} comunicado(s)</p>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#01F767] px-4 py-2 text-xs font-bold text-[#192547] hover:opacity-90"
        >
          <Plus size={13} />
          Novo Comunicado
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-gray-400">Nenhum comunicado cadastrado</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={[
                'rounded-xl border bg-white p-5 transition',
                item.active ? 'border-[#01F767]/30' : 'border-[#E2E8F0] opacity-60',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#192547]">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.body}</p>
                  <div className="mt-2 flex items-center gap-3">
                    {item.expires_at && (
                      <span className="text-[10px] text-gray-400">
                        Expira: {new Date(item.expires_at).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    <span className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-bold',
                      item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400',
                    ].join(' ')}>
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(item)}
                    disabled={loading === item.id + '-toggle'}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#192547]"
                    title={item.active ? 'Desativar' : 'Ativar'}
                  >
                    {loading === item.id + '-toggle'
                      ? <Loader2 size={15} className="animate-spin" />
                      : item.active ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={loading === item.id + '-del'}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    {loading === item.id + '-del' ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); router.refresh() }} />
      )}
    </>
  )
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', body: '', expires_at: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, expires_at: form.expires_at || null }),
    })
    setLoading(false)
    if (res.ok) onCreated()
    else setError('Erro ao criar comunicado.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-sm font-extrabold text-[#192547]">Novo Comunicado</h3>
          <button onClick={onClose} className="text-gray-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">Título *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547]"
              placeholder="Título do comunicado"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">Mensagem *</label>
            <textarea
              required
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547] resize-none font-[inherit]"
              placeholder="Texto do comunicado..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">Data de expiração (opcional)</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm font-medium outline-none focus:border-[#192547]"
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-gray-500">Cancelar</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#01F767] px-5 py-2 text-xs font-bold text-[#192547] disabled:opacity-60">
              {loading && <Loader2 size={13} className="animate-spin" />}
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
