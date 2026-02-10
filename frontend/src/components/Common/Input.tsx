/**
 * Input – Neumorphic Recessed Field
 * Inset shadow input that feels physically carved into the surface
 */
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            {label}
            {props.required && (
              <span className="text-emerald-500 ml-1">*</span>
            )}
          </label>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          className={`
            w-full neu-input
            text-surface-800 dark:text-surface-100
            placeholder-surface-400 dark:placeholder-surface-500
            text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-rose-400 dark:border-rose-500 shadow-[inset_3px_3px_6px_var(--neu-shadow),inset_-3px_-3px_6px_var(--neu-light),0_0_0_2px_rgba(244,63,94,0.2)]'
              : ''}
            ${className}
          `}
          {...props}
        />

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1.5 mt-2 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 glow-dot-rose" style={{ animation: 'none' }} />
            <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
