'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'

export default function DashboardLayout({ children }) {
  // Coordination state — irrelevant on desktop (sidebar always shows there
  // regardless of this value), controls the mobile overlay.
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}