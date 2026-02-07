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
 * 
 * Note: UI text in Spanish, code/comments in English
 */

export default function LoginHero() {
  return (
    <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-gradient-brand p-12 text-white flex-col justify-center items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-float" />
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-white rounded-full opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full opacity-50 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo with glow effect - ABOVE the name */}
        <div className="mb-10 flex justify-center">
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl scale-150 animate-pulse" />
            <div className="relative p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Logo size="xl" variant="icon" className="relative" />
            </div>
          </div>
        </div>

        {/* Lab Name - More visible with better contrast and shadow */}
        <h1 className="text-3xl font-bold mb-6 tracking-tight">
          <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] text-white [text-shadow:_2px_2px_8px_rgb(0_0_0_/_40%)]">
            DiagnosticLab
          </span>
        </h1>

        {/* Tagline - Spanish */}
        <div className="space-y-3">
          <p className="text-2xl font-bold text-white drop-shadow-lg">
            Bienvenido
          </p>
          <p className="text-xl text-white/95 max-w-md mx-auto leading-relaxed drop-shadow-md">
            Sistema Integral de Gestión de Información de Laboratorio
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-16 h-0.5 bg-white/50" />
          <div className="w-3 h-3 rounded-full bg-white/70" />
          <div className="w-16 h-0.5 bg-white/50" />
        </div>
      </div>

      {/* Footer - Spanish */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/70 text-sm">
        <p>&copy; 2026 DiagnosticLab. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
