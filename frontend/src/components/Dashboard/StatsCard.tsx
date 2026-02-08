import { StatCardData } from '@/types/dashboard'

/**
 * StatsCard Component
 * 
 * Displays a single statistic with:
 * - Icon
 * - Title and value
 * - Optional trend indicator
 * - Click action
 * - Dark mode support
 * 
 * Used in dashboard grid to show key metrics
 */

interface StatsCardProps {
  data: StatCardData
  onClick?: () => void
}

const colorClasses = {
  green: {
    bg: 'bg-brand-50 dark:bg-brand-900/20',
    icon: 'text-brand-600 dark:text-brand-400',
    border: 'border-brand-200 dark:border-brand-800',
    hover: 'hover:border-brand-400 dark:hover:border-brand-600',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:border-blue-400 dark:hover:border-blue-600',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:border-purple-400 dark:hover:border-purple-600',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    hover: 'hover:border-orange-400 dark:hover:border-orange-600',
  },
}

export default function StatsCard({ data, onClick }: StatsCardProps) {
  const colors = colorClasses[data.color]
  const isClickable = onClick || data.link

  return (
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-xl border-2 ${colors.border} p-6
        transition-all duration-300 theme-transition
        ${isClickable ? `cursor-pointer ${colors.hover} card-hover` : ''}
      `}
      onClick={onClick}
    >
      {/* Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <div className={colors.icon}>
            {data.icon}
          </div>
        </div>
        
        {data.trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            data.trend.direction === 'up' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {data.trend.direction === 'up' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {data.trend.value}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
          {data.value}
        </h3>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
          {data.title}
        </p>
        {data.trend && (
          <span className="text-xs text-gray-500 dark:text-slate-500">
            {data.trend.label}
          </span>
        )}
      </div>
    </div>
  )
}
