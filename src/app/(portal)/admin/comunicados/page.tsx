export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import AnnouncementsManager from './AnnouncementsManager'
import type { Announcement } from '@/lib/types'

export const metadata = { title: 'Admin — Comunicados — Kard Hub' }

export default async function AdminComunicadosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return <AnnouncementsManager items={(data ?? []) as Announcement[]} />
}
