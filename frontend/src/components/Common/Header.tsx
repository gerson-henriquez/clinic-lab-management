import { ReactNode, useState } from 'react'
import Logo from '../Common/Logo'
import ThemeToggle from '../ThemeToggle'
import { UserProfile } from '@/types/dashboard'

/**
 * Header Component
 * 
 * Top navigation bar with:
 * - DiagnosticLab logo
 * - Search bar (placeholder for Phase 2)
 * - Notifications bell
 * - User profile dropdown
 * - Branch selector
 * 
 * Note: UI text in Spanish, code/comments in English
 * Responsive: Collapses to hamburger menu on mobile
 */

interface HeaderProps {
  user?: UserProfile
  onMenuToggle?: () => void
}

export default function Header({ user, onMenuToggle }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Mock user data for Phase 1
  const mockUser: UserProfile = user || {
    id: '1',
    name: 'Dr. Juan Pérez',
    email: 'juan.perez@diagnosticlab.com',
    role: 'doctor',
    branch: 'Sucursal Principal',
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      superadmin: 'Super Administrador',
      doctor: 'Doctor',
      lab_technician: 'Técnico de Laboratorio',
      finance_user: 'Usuario Financiero',
      manager: 'Gerente',
    }
    return roleLabels[role] || role
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm theme-transition">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Alternar menú"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Logo size="md" imageSrc="/images/logo_icon.png" variant="full" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Bar (Desktop) - Placeholder for Phase 2 */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar órdenes, pacientes..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition-all"
                disabled
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative"
              aria-label="Notificaciones"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></span>
            </button>

            {/* Notifications Dropdown - Phase 2 */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-2">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">Notificaciones</h3>
                </div>
                <div className="py-2 text-center text-gray-500 dark:text-slate-400 text-sm">
                  No hay nuevas notificaciones
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-r from-brand-600 to-secondary-600 dark:from-brand-500 dark:to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {mockUser.name.charAt(0)}
              </div>
              {/* User Info (Hidden on mobile) */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{mockUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{getRoleLabel(mockUser.role)}</p>
              </div>
              {/* Dropdown Icon */}
              <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-2">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <p className="font-semibold text-gray-900 dark:text-slate-100">{mockUser.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{mockUser.email}</p>
                  {mockUser.branch && (
                    <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">{mockUser.branch}</p>
                  )}
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Configuración de Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Cambiar Contraseña
                </a>
                <div className="border-t border-gray-200 dark:border-slate-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      // TODO Phase 2: Implement logout
                      alert('Funcionalidad de cerrar sesión disponible en Fase 2')
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
