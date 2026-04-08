import { createClient } from '@/lib/supabase/server'
import ContentCard from '@/components/content/ContentCard'
import FilterBar from '@/components/content/FilterBar'
import type { ContentItem } from '@/lib/types'

export const metadata = { title: 'Materiais de Suporte — Kard Hub' }

export default async function MateriaisPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('content_items')
    .select('*')
    .eq('section', 'materiais')
    .eq('active', true)
    .order('order')

  if (tipo && tipo !== 'todos') {
    query = query.eq('type', tipo)
  }

  const { data } = await query
  const items = (data ?? []) as ContentItem[]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Materiais de Suporte</h2>
        <p className="mt-1 text-sm text-gray-500">
          PDFs, planilhas e documentos operacionais
        </p>
      </div>

      <FilterBar
        options={[
          { value: 'todos', label: 'Todos' },
          { value: 'pdf', label: 'PDF' },
          { value: 'planilha', label: 'Planilha' },
          { value: 'imagem', label: 'Imagem' },
        ]}
        paramKey="tipo"
        current={tipo ?? 'todos'}
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} actionLabel="Acessar" />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white py-16 text-center">
      <p className="text-sm font-semibold text-gray-400">Nenhum material disponível</p>
      <p className="mt-1 text-xs text-gray-300">Os conteúdos aparecerão aqui quando cadastrados pelo admin</p>
    </div>
  )
}
