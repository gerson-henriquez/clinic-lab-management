/**
 * Header – Neumorphic Control Bar
 * Rounded floating header with search, notifications, user profile
 */
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { UserProfile } from '@/types/user'

interface HeaderProps {
  user?: UserProfile
  onMenuToggle?: () => void
}

const roleLabels: Record<string, string> = {
  superadmin: 'ADMIN',
  doctor: 'DOCTOR',
  lab_technician: 'TÉC. LAB',
  finance_user: 'FINANZAS',
  manager: 'GERENTE',
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const mockUser: UserProfile = user || {
    name: 'Dra. Valencia',
    role: 'superadmin',
    email: 'admin@lab.com',
    branch: 'Sucursal Principal',
  }

  return (
    <header className="bg-white dark:bg-surface-800 rounded-2xl
                       shadow-neu-sm dark:shadow-neu-dark-sm
                       px-5 py-3 flex items-center justify-between gap-4">

      {/* ── Left: Mobile menu + Search ── */}
      <div className="flex items-center gap-3 flex-1">
        <button onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-xl text-surface-400
                          hover:bg-surface-100 dark:hover:bg-surface-700
                          transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2.5 flex-1 max-w-md
                       neu-pressed px-4 py-2.5 rounded-xl">
          <svg className="w-4 h-4 text-surface-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input type="text"
                 placeholder="Escaneo de ID o búsqueda..."
                 className="bg-transparent text-sm text-surface-700 dark:text-surface-300
                           placeholder-surface-400 w-full outline-none" />
        </div>
      </div>

      {/* ── Right: Controls ── */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-surface-400
                          hover:text-surface-600 dark:hover:text-surface-300
                          hover:bg-surface-100 dark:hover:bg-surface-700
                          transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* User */}
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-1.5 rounded-xl
                            hover:bg-surface-100 dark:hover:bg-surface-700
                            transition-colors">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                           flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {mockUser.name.charAt(0)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 leading-tight">
                {mockUser.name}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                {roleLabels[mockUser.role] || mockUser.role}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-52 z-50 bg-white dark:bg-surface-800
                             rounded-xl shadow-glass-lg border border-surface-200 dark:border-surface-700
                             p-2 animate-fade-in">
                <div className="px-3 py-2 mb-1">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-100">{mockUser.name}</p>
                  <p className="text-xs text-surface-400 truncate">{mockUser.email}</p>
                </div>
                <div className="h-px bg-surface-200 dark:bg-surface-700 my-1" />
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                  text-surface-600 dark:text-surface-400
                                  hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Mi Perfil
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                  text-rose-600 dark:text-rose-400
                                  hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
