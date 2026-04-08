'use client'

import { useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import Sidebar from '@/components/sidebar/Sidebar'
import type { MenuItem, Profile } from '@/lib/types'

interface PortalLayoutProps {
  profile: Profile
  menuItems: MenuItem[]
  children: React.ReactNode
  pageTitle?: string
  pageAction?: React.ReactNode
}

export default function PortalLayout({
  profile,
  menuItems,
  children,
  pageTitle,
  pageAction,
}: PortalLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA]">
      <Sidebar
        profile={profile}
        menuItems={menuItems}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="text-gray-500 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            {pageTitle && (
              <h1 className="text-[15px] font-extrabold text-[#192547]">
                {pageTitle}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            {pageAction && <div>{pageAction}</div>}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                title="Sair"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-400 transition hover:bg-gray-100 hover:text-[#192547]"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
