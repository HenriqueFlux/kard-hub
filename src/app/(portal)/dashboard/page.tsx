export const runtime = 'edge'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  FileText,
  ClipboardList,
  Info,
  Image,
  PlayCircle,
  Megaphone,
  ExternalLink,
} from 'lucide-react'
import type { Announcement, Profile } from '@/lib/types'

const sections = [
  { href: '/materiais', label: 'Materiais de Suporte', icon: FileText, description: 'PDFs, planilhas e documentos operacionais' },
  { href: '/roteiros', label: 'Roteiros Operacionais', icon: ClipboardList, description: 'Roteiros por convênio' },
  { href: '/instrucoes', label: 'Instruções Operacionais', icon: Info, description: 'Processos e procedimentos internos' },
  { href: '/criativos', label: 'Criativos para Convênios', icon: Image, description: 'Artes prontas para campanhas' },
  { href: '/tutoriais', label: 'Tutoriais e Conteúdos', icon: PlayCircle, description: 'Vídeos de treinamento e capacitação' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, announcementsRes] = await Promise.all([
    supabase.from('profiles').select('name').eq('id', user.id).single(),
    supabase
      .from('announcements')
      .select('*')
      .eq('active', true)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const profile = profileRes.data as Pick<Profile, 'name'>
  const announcements = (announcementsRes.data ?? []) as Announcement[]
  const firstName = profile?.name?.split(' ')[0] ?? 'Parceiro'

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-black text-[#192547]">
          Olá, {firstName} 👋
        </h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Bem-vindo ao Kard Hub. Acesse os materiais e ferramentas abaixo.
        </p>
      </div>

      {/* Comunicados */}
      {announcements.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Megaphone size={14} className="text-[#192547]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#192547]">
              Comunicados
            </h3>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-[#01F767]/30 bg-[#01F767]/8 px-4 py-3.5"
              >
                <p className="text-sm font-bold text-[#192547]">{a.title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cards das seções */}
      <section>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ href, label, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#01F767] hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F6FA] transition group-hover:bg-[#01F767]/10">
                <Icon size={20} className="text-[#192547] transition group-hover:text-[#01C954]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#192547]">{label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{description}</p>
              </div>
              <ExternalLink
                size={14}
                className="mt-0.5 shrink-0 text-gray-300 transition group-hover:text-[#01F767]"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
