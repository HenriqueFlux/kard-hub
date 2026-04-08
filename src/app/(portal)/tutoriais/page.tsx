export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import ContentCard from '@/components/content/ContentCard'
import FilterBar from '@/components/content/FilterBar'
import type { ContentItem } from '@/lib/types'

export const metadata = { title: 'Tutoriais e Conteúdos — Kard Hub' }

const CATEGORIES = [
  { value: 'todos', label: 'Todos' },
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'Operacional', label: 'Operacional' },
  { value: 'Produtos', label: 'Produtos' },
  { value: 'Marketing', label: 'Marketing' },
]

export default async function TutoriaisPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('content_items')
    .select('*')
    .eq('section', 'tutoriais')
    .eq('active', true)
    .order('order')

  if (categoria && categoria !== 'todos') {
    query = query.eq('category', categoria)
  }

  const { data } = await query
  const items = (data ?? []) as ContentItem[]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Tutoriais e Conteúdos</h2>
        <p className="mt-1 text-sm text-gray-500">
          Vídeos de treinamento e capacitação
        </p>
      </div>

      <FilterBar
        options={CATEGORIES}
        paramKey="categoria"
        current={categoria ?? 'todos'}
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
          <p className="text-sm font-semibold text-gray-400">Nenhum tutorial disponível</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} variant="video" />
          ))}
        </div>
      )}
    </div>
  )
}
