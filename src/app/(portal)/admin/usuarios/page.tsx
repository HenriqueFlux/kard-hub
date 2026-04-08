export const runtime = 'edge'

import { createAdminClient } from '@/lib/supabase/server'
import UsersManager from './UsersManager'
import type { Profile } from '@/lib/types'

export const metadata = { title: 'Admin — Usuários — Kard Hub' }

export default async function AdminUsersPage() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
        Erro ao carregar usuários: {error.message}
      </div>
    )
  }

  return <UsersManager users={(data ?? []) as Profile[]} />
}
