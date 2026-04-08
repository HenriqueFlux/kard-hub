'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import type { ContentItem, ContentSection, ContentType } from '@/lib/types'
import ContentFormModal from './ContentFormModal'

interface SectionOption {
  value: ContentSection
  label: string
}

interface ContentManagerProps {
  sections: SectionOption[]
  currentSection: ContentSection
  items: ContentItem[]
}

export default function ContentManager({
  sections,
  currentSection,
  items,
}: ContentManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [modal, setModal] = useState<{ open: boolean; item?: ContentItem }>({
    open: false,
  })
  const [deleting, setDeleting] = useState<string | null>(null)

  function changeSection(section: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('secao', section)
    router.push(`${pathname}?${params.toString()}`)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este item?')) return
    setDeleting(id)
    const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' })
    setDeleting(null)
    if (res.ok) router.refresh()
    else alert('Erro ao excluir.')
  }

  return (
    <>
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.value}
            onClick={() => changeSection(s.value)}
            className={[
              'rounded-full px-4 py-1.5 text-xs font-bold transition',
              currentSection === s.value
                ? 'bg-[#192547] text-[#01F767]'
                : 'border border-[#E2E8F0] bg-white text-gray-500 hover:border-[#192547] hover:text-[#192547]',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{items.length} item(s)</p>
        <button
          onClick={() => setModal({ open: true })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#01F767] px-4 py-2 text-xs font-bold text-[#192547] transition hover:opacity-90"
        >
          <Plus size={13} />
          Novo Item
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-semibold text-gray-400">Nenhum item cadastrado</p>
            <p className="mt-1 text-xs text-gray-300">Clique em "Novo Item" para adicionar</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Título
                </th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 md:table-cell">
                  Tipo
                </th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 lg:table-cell">
                  Link
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#192547]">{item.title}</p>
                    {item.convenio && (
                      <p className="text-xs text-gray-400">{item.convenio}</p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-gray-500 md:table-cell capitalize">
                    {item.type}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                    >
                      Ver link
                      <ExternalLink size={10} />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={[
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        item.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-400',
                      ].join(' ')}
                    >
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModal({ open: true, item })}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#192547]"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal.open && (
        <ContentFormModal
          section={currentSection}
          item={modal.item}
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); router.refresh() }}
        />
      )}
    </>
  )
}
