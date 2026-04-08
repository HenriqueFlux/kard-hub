'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { ContentItem, ContentSection, ContentType } from '@/lib/types'

interface ContentFormModalProps {
  section: ContentSection
  item?: ContentItem
  onClose: () => void
  onSaved: () => void
}

const TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'pdf', label: 'PDF' },
  { value: 'planilha', label: 'Planilha' },
  { value: 'imagem', label: 'Imagem' },
  { value: 'video', label: 'Vídeo' },
  { value: 'link', label: 'Link' },
]

export default function ContentFormModal({
  section,
  item,
  onClose,
  onSaved,
}: ContentFormModalProps) {
  const isEdit = !!item

  const [form, setForm] = useState({
    title: item?.title ?? '',
    description: item?.description ?? '',
    url: item?.url ?? '',
    thumbnail_url: item?.thumbnail_url ?? '',
    type: item?.type ?? 'pdf' as ContentType,
    convenio: item?.convenio ?? '',
    uf: item?.uf ?? '',
    duration: item?.duration ?? '',
    category: item?.category ?? '',
    active: item?.active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const body = { ...form, section }
    const url = isEdit ? `/api/admin/content/${item.id}` : '/api/admin/content'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
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
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="text-sm font-extrabold text-[#192547]">
            {isEdit ? 'Editar Item' : 'Novo Item'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <Field label="Título *">
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="input"
                placeholder="Nome do material"
              />
            </Field>

            <Field label="Descrição">
              <input
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="input"
                placeholder="Descrição curta (opcional)"
              />
            </Field>

            <Field label="URL do arquivo (Google Drive) *">
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => set('url', e.target.value)}
                className="input"
                placeholder="https://drive.google.com/..."
              />
            </Field>

            <Field label="URL da thumbnail">
              <input
                type="url"
                value={form.thumbnail_url}
                onChange={(e) => set('thumbnail_url', e.target.value)}
                className="input"
                placeholder="https://..."
              />
            </Field>

            <Field label="Tipo *">
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                className="input"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            {(section === 'roteiros' || section === 'criativos') && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Convênio">
                  <input
                    value={form.convenio}
                    onChange={(e) => set('convenio', e.target.value)}
                    className="input"
                    placeholder="Ex: Pref. Luziânia"
                  />
                </Field>
                <Field label="UF">
                  <input
                    value={form.uf}
                    onChange={(e) => set('uf', e.target.value)}
                    className="input"
                    placeholder="GO"
                    maxLength={2}
                  />
                </Field>
              </div>
            )}

            {section === 'tutoriais' && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duração">
                  <input
                    value={form.duration}
                    onChange={(e) => set('duration', e.target.value)}
                    className="input"
                    placeholder="Ex: 18 min"
                  />
                </Field>
                <Field label="Categoria">
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="input"
                  >
                    <option value="">Sem categoria</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Operacional">Operacional</option>
                    <option value="Produtos">Produtos</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </Field>
              </div>
            )}

            <Field label="Status">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set('active', e.target.checked)}
                  className="h-4 w-4 rounded accent-[#01F767]"
                />
                <span className="text-sm font-medium text-gray-600">Ativo (visível para parceiros)</span>
              </label>
            </Field>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#01F767] px-5 py-2 text-xs font-bold text-[#192547] transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Criar item'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .input:focus {
          border-color: #192547;
          box-shadow: 0 0 0 3px rgba(25,37,71,0.08);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      {children}
    </div>
  )
}
