export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import RoteirosClient from './RoteirosClient'
import type { ContentItem } from '@/lib/types'

export const metadata = { title: 'Roteiros Operacionais — Kard Hub' }

export default async function RoteirosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_items')
    .select('*')
    .eq('section', 'roteiros')
    .eq('active', true)
    .order('order')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Roteiros Operacionais</h2>
        <p className="mt-1 text-sm text-gray-500">
          Acesse o roteiro de cada convênio ativo
        </p>
      </div>
      <RoteirosClient items={(data ?? []) as ContentItem[]} />
    </div>
  )
}
