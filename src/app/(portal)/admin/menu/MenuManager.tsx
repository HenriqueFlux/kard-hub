'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import type { MenuItem } from '@/lib/types'

const ICON_OPTIONS = [
  { value: 'sistema', label: 'Sistema' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'calculadora', label: 'Calculadora' },
  { value: 'drive', label: 'Drive' },
  { value: 'indicacao', label: 'Indicação' },
]

export default function MenuManager({ items }: { items: MenuItem[] }) {
  const router = useRouter()
  const [local, setLocal] = useState<MenuItem[]>(items)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  function update(id: string, key: keyof MenuItem, value: unknown) {
    setLocal((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item))
    setSaved(null)
  }

  async function saveItem(item: MenuItem) {
    setSaving(item.id)
    await fetch(`/api/admin/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: item.label, url: item.url, icon: item.icon, active: item.active }),
    })
    setSaving(null)
    setSaved(item.id)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">
        Edite os links do menu lateral. As alterações são salvas item por item.
      </p>

      {local.map((item) => (
        <div key={item.id} className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-400">Label</label>
              <input
                value={item.label}
                onChange={(e) => update(item.id, 'label', e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium outline-none focus:border-[#192547]"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-400">URL</label>
              <input
                value={item.url}
                onChange={(e) => update(item.id, 'url', e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium outline-none focus:border-[#192547]"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-400">Ícone</label>
              <select
                value={item.icon}
                onChange={(e) => update(item.id, 'icon', e.target.value)}
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm font-medium outline-none focus:border-[#192547]"
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => update(item.id, 'active', e.target.checked)}
                className="h-4 w-4 rounded accent-[#01F767]"
              />
              <span className="text-xs font-medium text-gray-500">Visível no menu</span>
            </label>
            <button
              onClick={() => saveItem(item)}
              disabled={saving === item.id}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition',
                saved === item.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[#01F767] text-[#192547] hover:opacity-90',
              ].join(' ')}
            >
              {saving === item.id
                ? <Loader2 size={12} className="animate-spin" />
                : <Save size={12} />}
              {saved === item.id ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
