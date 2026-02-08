import { QuickAction } from '@/types/dashboard'

/**
 * QuickActions Component
 * 
 * Displays role-based quick action buttons
 * Shows common tasks based on user role
 * 
 * Note: UI text in Spanish, code/comments in English
 * 
 * Examples:
 * - Doctor: New Order, New Patient
 * - Lab Tech: Pending Orders, Submit Results
 * - Finance: View Invoices, Generate Report
 */

interface QuickActionsProps {
  userRole?: string
}

const colorClasses = {
  green: 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 border-brand-200 dark:border-brand-800',
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 border-orange-200 dark:border-orange-800',
}

export default function QuickActions({ userRole = 'doctor' }: QuickActionsProps) {
  const allActions: QuickAction[] = [
    {
      id: 'new-order',
      label: 'Nueva Orden',
      description: 'Crear una nueva orden de examen',
      href: '/orders/new',
      color: 'green',
      roles: ['doctor', 'lab_technician', 'manager', 'superadmin'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      id: 'new-patient',
      label: 'Nuevo Paciente',
      description: 'Registrar un nuevo paciente',
      href: '/patients/new',
      color: 'blue',
      roles: ['doctor', 'manager', 'superadmin'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      id: 'pending-orders',
      label: 'Órdenes Pendientes',
      description: 'Ver órdenes de exámenes pendientes',
      href: '/orders?status=pending',
      color: 'orange',
      roles: ['lab_technician', 'manager', 'superadmin'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'view-reports',
      label: 'Ver Reportes',
      description: 'Explorar resultados de exámenes',
      href: '/reports',
      color: 'purple',
      roles: ['doctor', 'lab_technician', 'manager', 'superadmin'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'invoices',
      label: 'Facturas',
      description: 'Gestionar facturación y cobros',
      href: '/billing',
      color: 'green',
      roles: ['doctor', 'lab_technician', 'finance_user', 'manager', 'superadmin'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'finance-dashboard',
      label: 'Panel Financiero',
      description: 'Ver reportes financieros',
      href: '/finance',
      color: 'blue',
      roles: ['finance_user', 'manager', 'superadmin'],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  const filteredActions = allActions.filter(action => action.roles.includes(userRole))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 theme-transition">
      <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-600 dark:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Acciones Rápidas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredActions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${colorClasses[action.color]}
              hover:shadow-md active:scale-95
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  {action.label}
                </h3>
                <p className="text-xs opacity-80">
                  {action.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
