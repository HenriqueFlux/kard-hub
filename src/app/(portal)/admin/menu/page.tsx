export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import MenuManager from './MenuManager'
import type { MenuItem } from '@/lib/types'

export const metadata = { title: 'Admin — Menu — Kard Hub' }

export default async function AdminMenuPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .order('order')

  return <MenuManager items={(data ?? []) as MenuItem[]} />
}
