import { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Button Component
 * 
 * Reusable button with multiple variants, sizes, and dark mode support
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - loading: boolean - Shows loading spinner
 * - fullWidth: boolean - Makes button full width
 * - children: Button content
 * 
 * Note: Supports dark mode with complementary colors
 * 
 * Usage:
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variantClasses = {
  primary: `
    bg-gradient-to-r from-brand-600 to-brand-700 
    dark:from-brand-500 dark:to-brand-600
    text-white 
    hover:from-brand-700 hover:to-brand-800 
    dark:hover:from-brand-600 dark:hover:to-brand-700
    shadow-md hover:shadow-lg 
    hover:shadow-brand-600/30 dark:hover:shadow-brand-500/30
    active:scale-[0.98]
    focus:ring-brand-500 dark:focus:ring-brand-400
  `,
  secondary: `
    bg-gradient-to-r from-secondary-600 to-secondary-700
    dark:from-secondary-500 dark:to-secondary-600
    text-white
    hover:from-secondary-700 hover:to-secondary-800
    dark:hover:from-secondary-600 dark:hover:to-secondary-700
    shadow-md hover:shadow-lg
    hover:shadow-secondary-600/30 dark:hover:shadow-secondary-500/30
    active:scale-[0.98]
    focus:ring-secondary-500 dark:focus:ring-secondary-400
  `,
  outline: `
    bg-transparent 
    border-2 border-brand-600 dark:border-brand-500
    text-brand-600 dark:text-brand-400
    hover:bg-brand-50 dark:hover:bg-brand-900/20
    active:scale-[0.98]
    focus:ring-brand-500 dark:focus:ring-brand-400
  `,
  ghost: `
    bg-transparent 
    text-gray-700 dark:text-slate-300
    hover:bg-gray-100 dark:hover:bg-slate-800
    active:scale-[0.98]
    focus:ring-gray-500 dark:focus:ring-slate-400
  `,
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
