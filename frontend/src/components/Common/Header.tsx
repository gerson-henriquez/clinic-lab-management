/**
 * Header – Neumorphic Control Bar
 * Rounded floating header with search, notifications, user profile
 */
import { useState, useCallback } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { SearchIcon, MenuIcon, BellIcon, UserIcon, LogoutIcon } from '@/components/Common/Icons'
import { MOCK_USER, ROLE_LABELS } from '@/constants/mockData'
import { UserProfile } from '@/types/user'

interface HeaderProps {
  user?: UserProfile
  onMenuToggle: () => void
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const currentUser = user || MOCK_USER

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev)
  }, [])

  const closeUserMenu = useCallback(() => {
    setShowUserMenu(false)
  }, [])

  return (
    <header className="bg-white dark:bg-surface-800 rounded-2xl
                       shadow-neu-sm dark:shadow-neu-dark-sm
                       px-3 sm:px-5 py-3 flex items-center justify-between gap-2 sm:gap-4">

      {/* ── Left: Mobile menu + Search ── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button onClick={onMenuToggle}
                aria-label="Abrir menú de navegación"
                className="lg:hidden p-2 rounded-xl text-surface-400
                          hover:bg-surface-100 dark:hover:bg-surface-700
                          transition-colors flex-shrink-0">
          <MenuIcon />
        </button>

        {/* Mobile search icon */}
        <button aria-label="Buscar"
                className="sm:hidden p-2 rounded-xl text-surface-400
                          hover:bg-surface-100 dark:hover:bg-surface-700
                          transition-colors flex-shrink-0">
          <SearchIcon />
        </button>

        {/* Desktop search bar */}
        <div className="hidden sm:flex items-center gap-2.5 flex-1 max-w-md
                       neu-pressed px-4 py-2.5 rounded-xl">
          <SearchIcon className="w-4 h-4 text-surface-400 flex-shrink-0" />
          <input type="text"
                 placeholder="Escaneo de ID o búsqueda..."
                 aria-label="Buscar por ID o texto"
                 className="bg-transparent text-sm text-surface-700 dark:text-surface-300
                           placeholder-surface-400 w-full outline-none" />
        </div>
      </div>

      {/* ── Right: Controls ── */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <ThemeToggle />

        {/* Notifications */}
        <button aria-label="Notificaciones"
                className="relative p-2.5 rounded-xl text-surface-400
                          hover:text-surface-600 dark:hover:text-surface-300
                          hover:bg-surface-100 dark:hover:bg-surface-700
                          transition-colors">
          <BellIcon />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"
                aria-label="Notificación nueva" />
        </button>

        {/* User */}
        <div className="relative">
          <button onClick={toggleUserMenu}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  aria-label="Menú de usuario"
                  className="flex items-center gap-3 p-1.5 rounded-xl
                            hover:bg-surface-100 dark:hover:bg-surface-700
                            transition-colors">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                           flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                {ROLE_LABELS[currentUser.role] || currentUser.role}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeUserMenu} />
              <div className="absolute right-0 mt-2 w-52 z-50 bg-white dark:bg-surface-800
                             rounded-xl shadow-glass-lg border border-surface-200 dark:border-surface-700
                             p-2 animate-fade-in"
                   role="menu">
                <div className="px-3 py-2 mb-1">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-100">{currentUser.name}</p>
                  <p className="text-xs text-surface-400 truncate">{currentUser.email}</p>
                </div>
                <div className="h-px bg-surface-200 dark:bg-surface-700 my-1" />
                <button role="menuitem"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                  text-surface-600 dark:text-surface-400
                                  hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <UserIcon className="w-4 h-4" strokeWidth={1.8} />
                  Mi Perfil
                </button>
                <button role="menuitem"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                  text-rose-600 dark:text-rose-400
                                  hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                  <LogoutIcon />
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
