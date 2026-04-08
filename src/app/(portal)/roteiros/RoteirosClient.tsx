'use client'

import { useState, useMemo } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import type { ContentItem } from '@/lib/types'

const CATEGORIES = ['Governos', 'Prefeituras', 'Tribunais', 'Previdências']

export default function RoteirosClient({ items }: { items: ContentItem[] }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = items
    if (activeCategory) {
      result = result.filter((i) => i.category === activeCategory)
    }
    const q = search.toLowerCase().trim()
    if (!q) return result
    return result.filter(
      (i) =>
        i.convenio?.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.uf?.toLowerCase().includes(q)
    )
  }, [items, search, activeCategory])

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

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={['rounded-full px-3.5 py-1.5 text-xs font-bold transition', !activeCategory ? 'bg-[#192547] text-white' : 'bg-white border border-[#E2E8F0] text-gray-500 hover:border-[#192547]'].join(' ')}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={['rounded-full px-3.5 py-1.5 text-xs font-bold transition', activeCategory === cat ? 'bg-[#192547] text-white' : 'bg-white border border-[#E2E8F0] text-gray-500 hover:border-[#192547]'].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
          <p className="text-sm font-semibold text-gray-400">
            {items.length === 0 ? 'Nenhum roteiro disponível' : 'Nenhum convênio encontrado'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#01F767] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F6FA] transition group-hover:bg-[#01F767]/10">
                  <Search size={16} className="text-[#192547] transition group-hover:text-[#01C954]" />
                </div>
                {item.category && (
                  <span className="rounded-full bg-[#192547]/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#192547]">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#192547]">{item.convenio ?? item.title}</p>
                {item.uf && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-[#F4F6FA] px-2.5 py-0.5 text-[10px] font-semibold text-gray-500">
                    Estado: {item.uf}
                  </span>
                )}
                {item.description && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#01C954]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#01F767]" />
                  Ativo
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#192547] transition group-hover:text-[#01C954]">
                  Acessar <ExternalLink size={11} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
