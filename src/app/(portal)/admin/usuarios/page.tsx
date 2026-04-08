export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import UsersManager from './UsersManager'
import type { Profile } from '@/lib/types'

export const metadata = { title: 'Admin — Usuários — Kard Hub' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  return <UsersManager users={(data ?? []) as Profile[]} />
}
