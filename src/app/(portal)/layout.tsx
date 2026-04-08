import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalLayout from '@/components/layout/PortalLayout'
import type { Profile, MenuItem } from '@/lib/types'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, menuResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('menu_items').select('*').order('order'),
  ])

  // Se não encontrou o perfil por erro de RLS ou outro motivo, não faz sign-out
  if (profileResult.error && !profileResult.data) {
    console.error('Profile query error:', profileResult.error.message)
    redirect('/login?error=perfil_nao_encontrado')
  }

  if (profileResult.data && !profileResult.data.active) {
    await supabase.auth.signOut()
    redirect('/login?error=conta_inativa')
  }

  return (
    <PortalLayout
      profile={profileResult.data as Profile}
      menuItems={(menuResult.data ?? []) as MenuItem[]}
    >
      {children}
    </PortalLayout>
  )
}
