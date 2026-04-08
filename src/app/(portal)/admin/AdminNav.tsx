'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/admin', label: 'Conteúdo' },
  { href: '/admin/usuarios', label: 'Usuários' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/comunicados', label: 'Comunicados' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 rounded-xl border border-[#E2E8F0] bg-white p-1">
      {tabs.map(({ href, label }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex-1 rounded-lg px-3 py-2 text-center text-xs font-bold transition',
              active
                ? 'bg-[#192547] text-[#01F767]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#192547]',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
