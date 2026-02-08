import { ReactNode, useState } from 'react'
import Header from '../Common/Header'
import { UserProfile } from '@/types/dashboard'

/**
 * DashboardLayout Component
 * 
 * Main layout wrapper for dashboard pages
 * 
 * Structure:
 * - Top: Header with logo, search, notifications, user menu
 * - Left: Collapsible sidebar with navigation
 * - Main: Content area
 * - Footer: Optional footer
 * 
 * Features:
 * - Collapsible sidebar on desktop (toggle button)
 * - Responsive sidebar (drawer on mobile)
 * - Role-based navigation items
 * - Active link highlighting
 * - Dark mode support
 */

interface DashboardLayoutProps {
  children: ReactNode
  user?: UserProfile
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
  roles?: string[]  // If specified, only show for these roles
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Desktop sidebar

  const navigationItems: NavItem[] = [
    {
      label: 'Panel de Control',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Órdenes',
      href: '/orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Pacientes',
      href: '/patients',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      roles: ['doctor', 'manager', 'superadmin'],
    },
    {
      label: 'Reportes',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Facturación',
      href: '/billing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      roles: ['doctor', 'lab_technician', 'manager', 'superadmin'],
    },
    {
      label: 'Finanzas',
      href: '/finance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['finance_user', 'manager', 'superadmin'],
    },
  ]

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true
    if (!user) return true
    return item.roles.includes(user.role)
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 theme-transition">
      {/* Header */}
      <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Sidebar - Desktop (Collapsible) */}
        <aside 
          className={`
            hidden lg:block 
            bg-white dark:bg-slate-800 
            border-r border-gray-200 dark:border-slate-700 
            min-h-[calc(100vh-4rem)] 
            sticky top-16 
            theme-transition
            transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'w-20' : 'w-64'}
          `}
        >
          {/* Collapse Toggle Button */}
          <div className="flex justify-end p-2 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
              aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {filteredNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  text-gray-700 dark:text-slate-300 
                  hover:bg-brand-50 dark:hover:bg-brand-900/20 
                  hover:text-brand-700 dark:hover:text-brand-400 
                  transition-colors group
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="text-gray-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 flex-shrink-0">
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </a>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 z-50 lg:hidden overflow-y-auto theme-transition">
              <nav className="p-4 space-y-1">
                {filteredNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-700 dark:hover:text-brand-400 transition-colors group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-gray-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900 theme-transition">
          {children}
        </main>
      </div>
    </div>
  )
}
