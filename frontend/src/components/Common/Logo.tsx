import Image from 'next/image'

/**
 * Logo Component
 * 
 * Displays the DiagnosticLab logo with multiple size variants
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - variant: 'full' | 'icon' (default: 'full')
 * - className: Additional CSS classes
 * 
 * Usage:
 * <Logo size="lg" />
 * <Logo size="sm" variant="icon" />
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
}

export default function Logo({ size = 'xl', variant = 'full', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <Image
          src="/images/logo2_nobg.png"
          alt="DiagnosticLab"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Logo Text */}
      {variant === 'full' && (
        <span className={`font-bold text-brand-700 ${textSizeClasses[size]}`}>
          DiagnosticLab
        </span>
      )}
    </div>
  )
}
