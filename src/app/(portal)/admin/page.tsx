export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import ContentManager from './ContentManager'
import type { ContentItem, ContentSection } from '@/lib/types'

export const metadata = { title: 'Admin — Conteúdo — Kard Hub' }

const SECTIONS: { value: ContentSection; label: string }[] = [
  { value: 'materiais', label: 'Materiais de Suporte' },
  { value: 'roteiros', label: 'Roteiros Operacionais' },
  { value: 'instrucoes', label: 'Instruções Operacionais' },
  { value: 'criativos', label: 'Criativos para Convênios' },
  { value: 'tutoriais', label: 'Tutoriais e Conteúdos' },
]

export default async function AdminContentPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_items')
    .select('*')
    .eq('section', 'materiais')
    .order('order')

  return (
    <ContentManager
      sections={SECTIONS}
      initialSection="materiais"
      initialItems={(data ?? []) as ContentItem[]}
    />
  )
}
