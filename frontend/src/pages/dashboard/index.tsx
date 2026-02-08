import type { NextPage } from 'next'
import Head from 'next/head'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import StatsCard from '@/components/Dashboard/StatsCard'
import QuickActions from '@/components/Dashboard/QuickActions'
import { StatCardData, UserProfile } from '@/types/dashboard'

/**
 * Dashboard Landing Page
 * 
 * Main page after login showing:
 * - Stats cards with key metrics
 * - Quick actions based on role
 * - Recent activity table
 * 
 * Features:
 * - Role-based content
 * - Responsive grid layout
 * - Real-time data (Phase 2)
 * 
 * Note: UI text in Spanish, code/comments in English
 * 
 * Phase 2 TODO:
 * - Connect to backend APIs for real data
 * - Add real-time updates
 * - Implement drill-down navigation
 * - Add data refresh
 */

const DashboardPage: NextPage = () => {
  // Mock user data - Phase 2 will fetch from auth context/API
  const mockUser: UserProfile = {
    id: '1',
    name: 'Dr. Juan Pérez',
    email: 'juan.perez@diagnosticlab.com',
    role: 'doctor',
    branch: 'Sucursal Principal',
  }

  // Mock stats data - Phase 2 will fetch from API
  const statsData: StatCardData[] = [
    {
      id: 'pending-orders',
      title: 'Órdenes Pendientes',
      value: '24',
      trend: {
        value: 12,
        direction: 'up',
        label: 'vs semana pasada',
      },
      color: 'orange',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '/orders?status=pending',
    },
    {
      id: 'completed-today',
      title: 'Completadas Hoy',
      value: '18',
      trend: {
        value: 8,
        direction: 'up',
        label: 'vs ayer',
      },
      color: 'green',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '/orders?status=completed',
    },
    {
      id: 'total-patients',
      title: 'Total Pacientes',
      value: '482',
      trend: {
        value: 5,
        direction: 'up',
        label: 'este mes',
      },
      color: 'blue',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: '/patients',
    },
    {
      id: 'revenue-month',
      title: 'Ingresos (Mes)',
      value: '$12,450',
      trend: {
        value: 15,
        direction: 'up',
        label: 'vs mes pasado',
      },
      color: 'purple',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '/finance',
    },
  ]

  // Mock recent activity - Phase 2 will fetch from API
  const recentActivity = [
    {
      id: '1',
      orderNumber: 'ORD-2026-001',
      patient: 'Juan García',
      status: 'Pendiente',
      time: 'hace 10 min',
      statusColor: 'text-orange-600 bg-orange-50',
    },
    {
      id: '2',
      orderNumber: 'ORD-2026-002',
      patient: 'María López',
      status: 'Completado',
      time: 'hace 25 min',
      statusColor: 'text-green-600 bg-green-50',
    },
    {
      id: '3',
      orderNumber: 'ORD-2026-003',
      patient: 'Carlos Rodríguez',
      status: 'En Progreso',
      time: 'hace 1 hora',
      statusColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: '4',
      orderNumber: 'ORD-2026-004',
      patient: 'Ana Martínez',
      status: 'Pendiente',
      time: 'hace 2 horas',
      statusColor: 'text-orange-600 bg-orange-50',
    },
  ]

  return (
    <>
      <Head>
        <title>Panel de Control - DiagnosticLab</title>
        <meta name="description" content="Panel de Control del Sistema de Gestión de Laboratorio" />
      </Head>

      <DashboardLayout user={mockUser}>
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            ¡Bienvenido de nuevo, {mockUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Aquí está lo que está pasando en su laboratorio hoy.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div 
              key={stat.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StatsCard
                data={stat}
                onClick={() => {
                  if (stat.link) {
                    window.location.href = stat.link
                  }
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 theme-transition">
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-600 dark:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Actividad Reciente
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Orden #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Paciente</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-slate-300">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-medium text-brand-600 dark:text-brand-400">{activity.orderNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-slate-100">{activity.patient}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.statusColor}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center">
                <a href="/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  Ver todas las órdenes →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions userRole={mockUser.role} />
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default DashboardPage
