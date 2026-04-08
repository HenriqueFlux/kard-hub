import { createClient } from '@/lib/supabase/server'
import ContentCard from '@/components/content/ContentCard'
import type { ContentItem } from '@/lib/types'

export const metadata = { title: 'Instruções Operacionais — Kard Hub' }

export default async function InstrucoesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_items')
    .select('*')
    .eq('section', 'instrucoes')
    .eq('active', true)
    .order('order')

  const items = (data ?? []) as ContentItem[]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Instruções Operacionais</h2>
        <p className="mt-1 text-sm text-gray-500">
          Processos internos e procedimentos operacionais
        </p>
      </div>

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
      <p className="text-sm font-semibold text-gray-400">Nenhuma instrução disponível</p>
    </div>
  )
}
