/**
 * Dashboard – LabFlow Tactical Console
 * Neumorphic precision dashboard with glass panels
 */
import DashboardLayout from '@/components/Layout/DashboardLayout'

// Mock data – Phase 2: Replace with real API calls
const mockUser = {
  name: 'Dra. Valencia',
  role: 'superadmin',
  email: 'admin@lab.com',
  branch: 'Sucursal Principal',
}

const sampleOrders = [
  { id: 'ORD-7721', patient: 'Ana María Prada', exam: 'Perfil Bioquímico', progress: 65 },
  { id: 'ORD-7722', patient: 'Carlos Mendoza', exam: 'Hemograma Completo', progress: 90 },
  { id: 'ORD-7723', patient: 'Laura Restrepo', exam: 'TSH + T4 Libre', progress: 30 },
  { id: 'ORD-7724', patient: 'Pedro Gómez', exam: 'Perfil Lipídico', progress: 100 },
]

const supplies = [
  { name: 'Reactivos B-12', stock: 32 },
  { name: 'Placas PCR', stock: 85 },
  { name: 'Tubos EDTA', stock: 64 },
  { name: 'Agujas 21G', stock: 91 },
]

export default function DashboardPage() {
  return (
    <DashboardLayout user={mockUser}>
      <div className="flex flex-col gap-4">

        {/* ══════════ Stats Row ══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── Card 1: Carga de Trabajo (Green) ── */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />

            <p className="text-[11px] uppercase tracking-widest text-emerald-200 font-bold">
              Carga de Trabajo
            </p>
            <div className="flex items-baseline gap-2 mt-3 mb-5">
              <span className="text-5xl font-bold leading-none">142</span>
              <span className="text-lg text-emerald-200">Órdenes</span>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <button className="bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg
                               hover:bg-emerald-50 transition-colors">
                Ver Detalle
              </button>
              <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30
                               flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Card 2: Urgencias ── */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6
                         shadow-neu-sm dark:shadow-neu-dark-sm relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-surface-400 font-bold">
                  Urgencias
                </p>
                <p className="text-5xl font-bold text-surface-800 dark:text-surface-100 mt-3 leading-none">
                  07
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30
                             flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
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
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6
                         shadow-neu-sm dark:shadow-neu-dark-sm relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-surface-400 font-bold">
                  Eficiencia Sede
                </p>
                <p className="text-5xl font-bold text-surface-800 dark:text-surface-100 mt-3 leading-none">
                  98.4<span className="text-3xl">%</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30
                             flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
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
            <div className="flex items-center justify-between px-6 py-4
                           border-b border-surface-100 dark:border-surface-700">
              <div>
                <h2 className="text-sm font-bold text-surface-800 dark:text-surface-100 uppercase tracking-wide">
                  Consola de Muestras
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-surface-400 mt-0.5">
                  Sincronización en Tiempo Real Activa
                </p>
              </div>
              <button className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-700
                               flex items-center justify-center text-surface-400
                               hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                </svg>
              </button>
            </div>

            {/* Sample Rows */}
            <div className="divide-y divide-surface-100 dark:divide-surface-700/50">
              {sampleOrders.map((order) => (
                <div key={order.id}
                     className="flex items-center gap-4 px-6 py-4
                               hover:bg-surface-50 dark:hover:bg-surface-700/30
                               transition-colors cursor-pointer group">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                                 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>

                  {/* Order Badge */}
                  <div className="bg-surface-100 dark:bg-surface-700 rounded-lg px-2.5 py-1 flex-shrink-0">
                    <span className="text-[10px] font-bold text-surface-500 dark:text-surface-400 tracking-wide">
                      {order.id}
                    </span>
                  </div>

                  {/* Patient Info */}
                  <div className="min-w-0 flex-shrink-0">
                    <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">
                      {order.patient}
                    </p>
                    <p className="text-xs text-surface-400 truncate">{order.exam}</p>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 flex items-center gap-3 ml-auto">
                    <span className="text-[10px] uppercase tracking-widest text-surface-400 font-medium hidden sm:block">
                      Progreso
                    </span>
                    <div className="flex-1 max-w-[160px]">
                      <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500
                                       ${order.progress === 100 ? 'bg-emerald-500' : 'bg-emerald-500'}`}
                             style={{ width: `${order.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-surface-300 dark:text-surface-600
                                 group-hover:text-emerald-500 transition-colors flex-shrink-0"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* ── Red de Suministros ── */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6
                         shadow-neu-sm dark:shadow-neu-dark-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-surface-800 dark:text-surface-100 uppercase tracking-wide">
                Red de Suministros
              </h2>
            </div>

            <div className="space-y-5">
              {supplies.map((item) => (
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
                         style={{ width: `${item.stock}%` }} />
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
