'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Info,
  Image,
  PlayCircle,
  Monitor,
  MessageCircle,
  Calculator,
  FolderOpen,
  Megaphone,
  Settings,
  X,
  Lock,
} from 'lucide-react'
import type { MenuItem, Profile } from '@/lib/types'

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/materiais', label: 'Materiais de Suporte', icon: FileText },
  { href: '/roteiros', label: 'Roteiros Operacionais', icon: ClipboardList },
  { href: '/instrucoes', label: 'Instruções Operacionais', icon: Info },
  { href: '/criativos', label: 'Criativos', icon: Image },
  { href: '/calculadora', label: 'Calculadora', icon: Calculator },
  { href: '/tutoriais', label: 'Tutoriais', icon: PlayCircle, comingSoon: true },
]

const defaultMenuIcons: Record<string, React.ElementType> = {
  sistema: Monitor,
  whatsapp: MessageCircle,
  marketing: Megaphone,
  calculadora: Calculator,
  drive: FolderOpen,
  indicacao: Megaphone,
}

interface SidebarProps {
  profile: Profile
  menuItems: MenuItem[]
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({
  profile,
  menuItems,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#192547] transition-transform duration-300',
          'lg:relative lg:translate-x-0 lg:flex',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg overflow-hidden">
            <img src="https://pub-51d74cef61734d03867257479ddd2aae.r2.dev/KL-logo-fundo-azul-RGB.png" alt="Kard" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-black leading-tight text-white">Kard Hub</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Portal de Parceiros
            </p>
          </div>
          <button
            className="ml-auto text-white/50 lg:hidden"
            onClick={onMobileClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav principal */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[2px] text-white/30">
            Menu Principal
          </p>
          {mainNavItems.map(({ href, label, icon: Icon, comingSoon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            if (comingSoon) {
              return (
                <span
                  key={href}
                  className="mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/30 cursor-not-allowed"
                >
                  <Lock size={15} />
                  {label}
                  <span className="ml-1 text-[10px] font-medium">(Em breve)</span>
                </span>
              )
            }
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose}
                className={[
                  'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-[#01F767] text-[#192547]'
                    : 'text-white/60 hover:bg-white/8 hover:text-white',
                ].join(' ')}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}

          {/* Links rápidos */}
          {menuItems.filter((m) => m.active).length > 0 && (
            <>
              <p className="mb-2 mt-5 px-2 text-[9px] font-bold uppercase tracking-[2px] text-white/30">
                Links Rápidos
              </p>
              {menuItems
                .filter((m) => m.active)
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  const Icon = defaultMenuIcons[item.icon] ?? Monitor
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/8 hover:text-white"
                    >
                      <Icon size={15} />
                      {item.label}
                    </a>
                  )
                })}
            </>
          )}

          {/* Admin */}
          {profile.role === 'admin' && (
            <>
              <p className="mb-2 mt-5 px-2 text-[9px] font-bold uppercase tracking-[2px] text-white/30">
                Administração
              </p>
              <Link
                href="/admin"
                onClick={onMobileClose}
                className={[
                  'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  pathname.startsWith('/admin')
                    ? 'bg-[#01F767] text-[#192547]'
                    : 'text-white/60 hover:bg-white/8 hover:text-white',
                ].join(' ')}
              >
                <Settings size={15} />
                Painel Admin
              </Link>
            </>
          )}
        </nav>

        {/* User info */}
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-sm font-bold leading-tight text-white">{profile.name}</p>
          <p className="text-[10px] font-medium text-white/40">
            {profile.role === 'admin' ? 'Administrador' : 'Parceiro'}
          </p>
        </div>
      </aside>
    </>
  )
}
