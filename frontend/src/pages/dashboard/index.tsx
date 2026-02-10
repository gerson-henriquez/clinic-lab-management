/**
 * Dashboard – LabFlow Tactical Console
 * Neumorphic precision dashboard with glass panels
 */
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { UserIcon, ChevronRightIcon, PlusIcon, HeartIcon, TrendUpIcon, FilterIcon } from '@/components/Common/Icons'
import { MOCK_USER, MOCK_ORDERS, MOCK_SUPPLIES } from '@/constants/mockData'

export default function DashboardPage() {
  return (
    <DashboardLayout user={MOCK_USER}>
      <div className="flex flex-col gap-4">

        {/* ══════════ Stats Row ══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── Card 1: Carga de Trabajo (Green) ── */}
          <div className="bg-emerald-600 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />

            <p className="text-[11px] uppercase tracking-widest text-emerald-200 font-bold">
              Carga de Trabajo
            </p>
            <div className="flex items-baseline gap-2 mt-3 mb-5">
              <span className="text-4xl sm:text-5xl font-bold leading-none">142</span>
              <span className="text-lg text-emerald-200">Órdenes</span>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <button aria-label="Ver detalle de carga de trabajo"
                      className="bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg
                               hover:bg-emerald-50 transition-colors">
                Ver Detalle
              </button>
              <button aria-label="Crear nueva orden"
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30
                               flex items-center justify-center transition-colors">
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* ── Card 2: Urgencias ── */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 sm:p-6
                         shadow-neu-sm dark:shadow-neu-dark-sm relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-surface-400 font-bold">
                  Urgencias
                </p>
                <p className="text-4xl sm:text-5xl font-bold text-surface-800 dark:text-surface-100 mt-3 leading-none">
                  07
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30
                             flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-[10px] uppercase tracking-widest text-rose-500 font-bold">
                Atención Inmediata Requerida
              </p>
            </div>
          </div>

          {/* ── Card 3: Eficiencia Sede ── */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 sm:p-6
                         shadow-neu-sm dark:shadow-neu-dark-sm relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-surface-400 font-bold">
                  Eficiencia Sede
                </p>
                <p className="text-4xl sm:text-5xl font-bold text-surface-800 dark:text-surface-100 mt-3 leading-none">
                  98.4<span className="text-2xl sm:text-3xl">%</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30
                             flex items-center justify-center">
                <TrendUpIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="mt-5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              +2.1% desde ayer
            </p>
          </div>
        </div>

        {/* ══════════ Bottom Row ══════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* ── Consola de Muestras ── */}
          <div className="xl:col-span-2 bg-white dark:bg-surface-800 rounded-2xl
                         shadow-neu-sm dark:shadow-neu-dark-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4
                           border-b border-surface-100 dark:border-surface-700">
              <div>
                <h2 className="text-sm font-bold text-surface-800 dark:text-surface-100 uppercase tracking-wide">
                  Consola de Muestras
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-surface-400 mt-0.5">
                  Sincronización en Tiempo Real Activa
                </p>
              </div>
              <button aria-label="Filtrar muestras"
                      className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-700
                               flex items-center justify-center text-surface-400
                               hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
                <FilterIcon />
              </button>
            </div>

            {/* Sample Rows */}
            <div className="divide-y divide-surface-100 dark:divide-surface-700/50">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id}
                     className="px-4 sm:px-6 py-4
                               hover:bg-surface-50 dark:hover:bg-surface-700/30
                               transition-colors cursor-pointer group"
                     role="button"
                     tabIndex={0}
                     aria-label={`Orden ${order.id}: ${order.patient}, ${order.exam}`}>
                  {/* Desktop: single row */}
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                                   flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="bg-surface-100 dark:bg-surface-700 rounded-lg px-2.5 py-1 flex-shrink-0">
                      <span className="text-[10px] font-bold text-surface-500 dark:text-surface-400 tracking-wide">
                        {order.id}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">
                        {order.patient}
                      </p>
                      <p className="text-xs text-surface-400 truncate">{order.exam}</p>
                    </div>
                    <div className="flex-1 flex items-center gap-3 ml-auto">
                      <span className="text-[10px] uppercase tracking-widest text-surface-400 font-medium hidden md:block">
                        Progreso
                      </span>
                      <div className="flex-1 max-w-[160px]">
                        <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                               style={{ width: `${order.progress}%` }}
                               role="progressbar"
                               aria-valuenow={order.progress}
                               aria-valuemin={0}
                               aria-valuemax={100} />
                        </div>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-surface-300 dark:text-surface-600
                                   group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  </div>

                  {/* Mobile: stacked card layout */}
                  <div className="sm:hidden">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                                     flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">
                          {order.patient}
                        </p>
                        <p className="text-xs text-surface-400 truncate">{order.exam}</p>
                      </div>
                      <div className="bg-surface-100 dark:bg-surface-700 rounded-lg px-2 py-0.5 flex-shrink-0">
                        <span className="text-[10px] font-bold text-surface-500 dark:text-surface-400">
                          {order.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                               style={{ width: `${order.progress}%` }}
                               role="progressbar"
                               aria-valuenow={order.progress}
                               aria-valuemin={0}
                               aria-valuemax={100} />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-surface-500 dark:text-surface-400 w-8 text-right">
                        {order.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Red de Suministros ── */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 sm:p-6
                         shadow-neu-sm dark:shadow-neu-dark-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-surface-800 dark:text-surface-100 uppercase tracking-wide">
                Red de Suministros
              </h2>
            </div>

            <div className="space-y-5">
              {MOCK_SUPPLIES.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-surface-600 dark:text-surface-300 font-medium">
                      {item.name}
                    </span>
                    <span className={`text-sm font-bold
                      ${item.stock < 50
                        ? 'text-amber-500'
                        : 'text-surface-800 dark:text-surface-100'}`}>
                      {item.stock}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500
                                   ${item.stock < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                         style={{ width: `${item.stock}%` }}
                         role="progressbar"
                         aria-valuenow={item.stock}
                         aria-valuemin={0}
                         aria-valuemax={100}
                         aria-label={`${item.name}: ${item.stock}%`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
