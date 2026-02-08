import Image from 'next/image'

/**
 * Logo Component
 * 
 * Reusable logo component with customizable size, variant, and image source
 * 
 * Props:
 * - size: Size of the logo (sm to 4xl)
 * - variant: 'full' (with text) or 'icon' (image only)
 * - imageSrc: Custom image path (optional, defaults to logo2_nobg.png)
 * - className: Additional CSS classes
 * 
 * Usage:
 * // Default logo
 * <Logo size="lg" variant="full" />
 * 
 * // Custom image
 * <Logo size="md" variant="icon" imageSrc="/images/custom_logo.png" />
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  variant?: 'full' | 'icon'
  imageSrc?: string  // Custom image path
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',      // 32px
  md: 'h-12 w-12',    // 48px
  lg: 'h-16 w-16',    // 64px
  xl: 'h-24 w-24',    // 96px
  '2xl': 'h-32 w-32', // 128px
  '3xl': 'h-40 w-40', // 160px
  '4xl': 'h-48 w-48', // 192px
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
  '3xl': 'text-6xl',
  '4xl': 'text-7xl',
}

export default function Logo({ 
  size = 'xl', 
  variant = 'full', 
  imageSrc = '/images/logo2_nobg.png',  // Default logo
  className = '' 
}: LogoProps) {
  return (
    <div className={`flex items-center  ${className}`}>
      {/* Logo Image */}
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <Image
          src={imageSrc}
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
