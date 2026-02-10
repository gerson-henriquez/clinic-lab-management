/**
 * LoginHero – DiagnosticLab Console Panel
 * Left-side brand panel with biotech aesthetic
 */
import Image from 'next/image'

export default function LoginHero() {
  return (
    <div className="relative hidden md:flex flex-col justify-between overflow-hidden
                    bg-gradient-to-br from-surface-900 via-surface-800 to-emerald-900
                    dark:from-surface-950 dark:via-surface-900 dark:to-emerald-950
                    p-10 lg:p-14">

      {/* Mesh Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
           style={{
             backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
             backgroundSize: '32px 32px'
           }} />

      {/* Floating Glow Orbs */}
      <div className="absolute top-20 right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-breathe" />
      <div className="absolute bottom-32 left-10 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl animate-breathe"
           style={{ animationDelay: '2s' }} />

      {/* Top: System Status */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="glow-dot glow-dot-emerald" />
          <span className="text-mono text-xs text-emerald-400/80 tracking-wider uppercase">
            Sistema Activo
          </span>
        </div>
        <div className="flex items-center gap-2 text-surface-500 text-mono text-[11px] tracking-wide">
          <span>v1.0.0</span>
          <span className="text-surface-600">&bull;</span>
          <span>Clinical Lab Management</span>
        </div>
      </div>

      {/* Center: Brand Identity */}
      <div className="relative z-10 flex flex-col items-start">
        {/* Logo with glow */}
        <div className="relative mb-6">
          <div className="absolute -inset-6 bg-emerald-500/10 rounded-full blur-xl animate-breathe" />
          <div className="relative w-24 h-24">
            <Image src="/images/logo_icon.png" alt="DiagnosticLab" fill className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" priority />
          </div>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
          Diagnostic<span className="text-emerald-400">Lab</span>
        </h1>
        <p className="text-surface-400 text-lg leading-relaxed max-w-sm">
          Plataforma de gestión clínica con precisión quirúrgica y seguridad de grado médico.
        </p>

        <div className="w-24 h-px bg-gradient-to-r from-emerald-500 to-transparent mt-8 mb-6" />

        <div className="flex flex-wrap gap-2">
          {['RBAC', 'JWT Auth', 'Audit Log', 'Multi-Branch'].map((tag) => (
            <span key={tag}
                  className="text-mono text-[10px] tracking-widest uppercase px-3 py-1.5
                            rounded-full border border-surface-600 text-surface-400
                            bg-surface-800/50">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: Console Info */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-mono text-[11px] text-surface-500">
          <span className="text-emerald-500">$</span> secure_connection
          <span className="inline-block w-2 h-4 bg-emerald-500/60 ml-1 animate-pulse" />
        </div>
        <div className="text-surface-600 text-xs">
          &copy; {new Date().getFullYear()} DiagnosticLab
        </div>
      </div>
    </div>
  )
}
