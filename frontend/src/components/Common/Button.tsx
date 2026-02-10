/**
 * Button – Neumorphic Tactile Control
 * Physical-feel button with depth and glow
 */
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-sm rounded-neu',
    lg: 'px-8 py-3.5 text-base rounded-neu',
  }

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-600 to-emerald-500
      dark:from-emerald-500 dark:to-emerald-400
      text-white font-semibold
      shadow-[0_4px_14px_rgba(16,185,129,0.35)]
      hover:shadow-glow-emerald
      hover:from-emerald-500 hover:to-emerald-400
      active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
      active:scale-[0.98]
    `,
    secondary: `
      bg-gradient-to-r from-cyan-600 to-cyan-500
      dark:from-cyan-500 dark:to-cyan-400
      text-white font-semibold
      shadow-[0_4px_14px_rgba(6,182,212,0.35)]
      hover:shadow-glow-cyan
      active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
      active:scale-[0.98]
    `,
    outline: `
      neu-btn
      text-surface-700 dark:text-surface-300
      border border-surface-300 dark:border-surface-600
      hover:text-emerald-600 dark:hover:text-emerald-400
      hover:border-emerald-400 dark:hover:border-emerald-500
    `,
    ghost: `
      text-surface-600 dark:text-surface-400
      hover:bg-surface-300/50 dark:hover:bg-surface-700/50
      hover:text-surface-800 dark:hover:text-surface-200
      rounded-neu
    `,
    danger: `
      bg-gradient-to-r from-rose-600 to-rose-500
      text-white font-semibold
      shadow-[0_4px_14px_rgba(244,63,94,0.3)]
      hover:shadow-glow-rose
      active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]
      active:scale-[0.98]
    `,
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
