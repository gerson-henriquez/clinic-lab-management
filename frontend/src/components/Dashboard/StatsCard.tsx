import { StatCardData } from '@/types/dashboard'

/**
 * StatsCard Component
 * 
 * Displays a single statistic with:
 * - Icon
 * - Title and value
 * - Optional trend indicator
 * - Click action
 * 
 * Used in dashboard grid to show key metrics
 */

interface StatsCardProps {
  data: StatCardData
  onClick?: () => void
}

const colorClasses = {
  green: {
    bg: 'bg-brand-50',
    icon: 'text-brand-600',
    border: 'border-brand-200',
    hover: 'hover:border-brand-400',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:border-blue-400',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200',
    hover: 'hover:border-purple-400',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-200',
    hover: 'hover:border-orange-400',
  },
}

export default function StatsCard({ data, onClick }: StatsCardProps) {
  const colors = colorClasses[data.color]
  const isClickable = onClick || data.link

  return (
    <div
      className={`
        bg-white rounded-xl border-2 ${colors.border} p-6
        transition-all duration-300
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
            data.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
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
        <h3 className="text-3xl font-bold text-gray-900">
          {data.value}
        </h3>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">
          {data.title}
        </p>
        {data.trend && (
          <span className="text-xs text-gray-500">
            {data.trend.label}
          </span>
        )}
      </div>
    </div>
  )
}
