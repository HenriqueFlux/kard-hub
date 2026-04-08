export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import ContentCard from '@/components/content/ContentCard'
import FilterBar from '@/components/content/FilterBar'
import type { ContentItem } from '@/lib/types'

export const metadata = { title: 'Criativos para Convênios — Kard Hub' }

export default async function CriativosPage({
  searchParams,
}: {
  searchParams: Promise<{ convenio?: string }>
}) {
  const { convenio } = await searchParams
  const supabase = await createClient()

  const { data: allData } = await supabase
    .from('content_items')
    .select('*')
    .eq('section', 'criativos')
    .eq('active', true)
    .order('order')

  const allItems = (allData ?? []) as ContentItem[]

  // Gera opções únicas de convênio para o filtro
  const convenios = [...new Set(allItems.map((i) => i.convenio).filter(Boolean))] as string[]

  const filtered =
    convenio && convenio !== 'todos'
      ? allItems.filter((i) => i.convenio === convenio)
      : allItems

  const filterOptions = [
    { value: 'todos', label: 'Todos' },
    ...convenios.map((c) => ({ value: c, label: c })),
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Criativos para Convênios</h2>
        <p className="mt-1 text-sm text-gray-500">
          Banco de artes prontas para suas campanhas
        </p>
      </div>

      {convenios.length > 0 && (
        <FilterBar
          options={filterOptions}
          paramKey="convenio"
          current={convenio ?? 'todos'}
        />
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
          <p className="text-sm font-semibold text-gray-400">Nenhum criativo disponível</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              variant="image"
              actionLabel="Baixar / Acessar"
            />
          ))}
        </div>
      )}
    </div>
  )
}
