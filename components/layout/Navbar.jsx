'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import posthog from 'posthog-js'

export default function Navbar({ onMenuClick }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    posthog.reset()
    await supabase.auth.signOut()
    router.push('/')
  }

  function getPageTitle() {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/applications') return 'Applications'
    if (pathname === '/applications/new') return 'New Application'
    if (pathname.includes('/edit')) return 'Edit Application'
    if (pathname.startsWith('/applications/')) return 'Application Details'
    return 'JobFlow'
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 right-0 left-0 md:left-64 z-10">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only (md:hidden), opens the sidebar overlay */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
      >
        Logout
      </button>
    </header>
  )
}