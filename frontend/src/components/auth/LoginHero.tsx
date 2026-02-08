import Logo from '../Common/Logo'

/**
 * LoginHero Component
 * 
 * Elegant brand section displayed on the left side of login page
 * 
 * Features:
 * - Large logo display with animation
 * - Lab name and welcome message
 * - Beautiful gradient background with floating elements
 * - Minimalist, clean design
 * - Responsive design (hidden on small screens, shown on md+)
 * - Dark mode support with complementary teal colors
 * 
 * Colors: Brand green + Complementary teal
 * Note: UI text in Spanish, code/comments in English
 */

export default function LoginHero() {
  return (
    <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-gradient-to-br from-brand-600 via-brand-700 to-secondary-600 dark:from-brand-700 dark:via-brand-800 dark:to-secondary-800 p-12 text-white flex-col justify-center items-center relative overflow-hidden theme-transition">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white dark:bg-cyan-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 dark:bg-brand-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-300/20 dark:bg-secondary-500/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Particles Effect with teal accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-200 dark:bg-cyan-400 rounded-full opacity-60 animate-float" />
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-white dark:bg-cyan-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-300 dark:bg-white rounded-full opacity-50 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-white dark:bg-cyan-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Decorative Mesh Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo with enhanced glow effect - ABOVE the name */}
        <div className="mb-12 flex justify-center">
          <div className="relative transform hover:scale-110 transition-all duration-500 group">
            {/* Multi-layer glow effect */}
            <div className="absolute inset-0 bg-white/40 dark:bg-cyan-300/40 rounded-full blur-2xl scale-150 animate-pulse" />
            <div className="absolute inset-0 bg-cyan-300/30 dark:bg-white/30 rounded-full blur-xl scale-125 animate-pulse" style={{ animationDelay: '0.5s' }} />
            {/* Logo container with subtle background */}
            <div className="relative p-6 bg-white/10 dark:bg-slate-800/30 rounded-3xl backdrop-blur-sm border border-white/20 dark:border-cyan-400/20 shadow-2xl group-hover:shadow-cyan-500/50 dark:group-hover:shadow-brand-500/50 transition-all duration-500">
              <Logo size="3xl" variant="icon" className="relative" />
            </div>
          </div>
        </div>

        {/* Lab Name - More visible with better contrast and shadow */}
        <h1 className="text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span className="drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)] text-white [text-shadow:_3px_3px_12px_rgb(0_0_0_/_50%)]">
            DiagnosticLab
          </span>
        </h1>

        {/* Tagline - Spanish with teal accent */}
        <div className="space-y-4">
          <p className="text-4xl font-light text-white drop-shadow-lg tracking-wide">
            Bienvenido
          </p>
          <p className="text-xl text-cyan-50 dark:text-cyan-100 max-w-md mx-auto leading-relaxed drop-shadow-md font-light">
            Sistema Integral de Gestión de Información de Laboratorio
          </p>
        </div>

        {/* Enhanced decorative line with animated dots */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/60 to-cyan-300/60" />
          <div className="w-2 h-2 rounded-full bg-cyan-300 dark:bg-cyan-400 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-2 h-2 rounded-full bg-cyan-300 dark:bg-cyan-400 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="w-20 h-px bg-gradient-to-l from-transparent via-white/60 to-cyan-300/60" />
        </div>
      </div>

      {/* Footer - Spanish with subtle styling */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/70 dark:text-cyan-100/70 text-sm">
        <p className="font-light">&copy; 2026 DiagnosticLab. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
