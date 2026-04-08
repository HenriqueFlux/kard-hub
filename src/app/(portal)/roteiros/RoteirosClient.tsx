'use client'

import { useState, useMemo } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import type { ContentItem } from '@/lib/types'

export default function RoteirosClient({ items }: { items: ContentItem[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter(
      (i) =>
        i.convenio?.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.uf?.toLowerCase().includes(q)
    )
  }, [items, search])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por convênio ou cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-[#192547] focus:ring-2 focus:ring-[#192547]/10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
          <p className="text-sm font-semibold text-gray-400">
            {items.length === 0 ? 'Nenhum roteiro disponível' : 'Nenhum convênio encontrado'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 transition hover:border-[#01F767]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#192547]">
                  {item.convenio ?? item.title}
                </p>
                {item.uf && (
                  <p className="mt-0.5 text-xs text-gray-400">{item.uf}</p>
                )}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#01F767] px-3.5 py-1.5 text-xs font-bold text-[#192547] transition hover:opacity-90"
              >
                Ver Roteiro
                <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
