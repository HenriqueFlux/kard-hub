export const runtime = 'edge'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { name, role, active, password } = await req.json()

  const adminClient = createAdminClient()

  // Atualiza senha se fornecida
  if (password) {
    const { error } = await adminClient.auth.admin.updateUserById(id, { password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Atualiza perfil
  const profileUpdate: Record<string, unknown> = {}
  if (name !== undefined) profileUpdate.name = name
  if (role !== undefined) profileUpdate.role = role
  if (active !== undefined) profileUpdate.active = active

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await adminClient.from('profiles').update(profileUpdate).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return new NextResponse(null, { status: 204 })
}
