/**
 * DashboardLayout – DiagnosticLab Tactical Console
 * Floating rounded sidebar + glass workspace
 */
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Common/Header'
import { UserProfile } from '@/types/user'

interface DashboardLayoutProps {
  children: ReactNode
  user?: UserProfile
}

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'DASHBOARD',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    label: 'PACIENTES',
    href: '/dashboard/patients',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: 'ÓRDENES',
    href: '/dashboard/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    label: 'LABORATORIO',
    href: '/dashboard/lab',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    label: 'FACTURACIÓN',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    label: 'REPORTES',
    href: '/dashboard/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
]

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) => router.pathname === href

  return (
    <div className="min-h-screen bg-surface-200 dark:bg-surface-900 p-3 md:p-4 flex gap-4">

      {/* ══════════ Mobile Overlay ══════════ */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-surface-900/50 backdrop-blur-sm lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══════════ Floating Sidebar ══════════ */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen lg:h-auto lg:self-start
        w-[220px] flex flex-col
        bg-white dark:bg-surface-800
        lg:rounded-2xl
        shadow-neu-flat dark:shadow-neu-dark-flat
        transition-transform duration-300 ease-out
        lg:translate-x-0 lg:my-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{ position: 'sticky', top: '1rem' }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src="/images/logo_icon.png" alt="DiagnosticLab" fill className="object-contain" priority />
          </div>
          <span className="font-bold text-surface-800 dark:text-surface-100 text-sm tracking-tight leading-tight">
            Diagnostic<span className="text-emerald-600">Lab</span>
          </span>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${active
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700/30'}
                `}>
                  <span className={active ? 'text-emerald-600 dark:text-emerald-400' : ''}>{item.icon}</span>
                  <span className="text-xs tracking-widest">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* ── Status Bar ── */}
        <div className="mx-3 mb-4 p-4 rounded-xl bg-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-200 font-medium">
                Status Sede
              </p>
              <p className="text-sm font-semibold mt-0.5">Conexión Segura</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════ Main Content ══════════ */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Header user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
