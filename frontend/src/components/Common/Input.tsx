import { InputHTMLAttributes, forwardRef } from 'react'

/**
 * Input Component
 * 
 * Reusable input field with label and error support
 * 
 * Props:
 * - label: Input label text
 * - error: Error message to display
 * - helperText: Helper text below input
 * - fullWidth: Makes input full width
 * 
 * Usage:
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 * />
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : ''
    
    return (
      <div className={widthClass}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`
            ${widthClass}
            px-4 py-2.5
            border-2 rounded-lg
            text-gray-900
            placeholder-gray-400
            transition-all duration-200
            focus:outline-none
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100'
            }
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
