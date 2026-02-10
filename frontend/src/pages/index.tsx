/**
 * Login Page – DiagnosticLab Tactical Console
 * Split-screen: Console brand panel + Glass login form
 */
import Head from 'next/head'
import Image from 'next/image'
import LoginHero from '@/components/auth/LoginHero'
import LoginForm from '@/components/auth/LoginForm'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>DiagnosticLab · Iniciar Sesión</title>
        <meta name="description" content="Sistema de gestión de laboratorio clínico" />
      </Head>

      <div className="min-h-screen flex">
        {/* Left: Console Brand Panel */}
        <div className="hidden md:flex md:w-[45%] lg:w-[42%]">
          <LoginHero />
        </div>

        {/* Right: Glass Login Panel */}
        <div className="flex-1 relative flex flex-col items-center justify-center
                       bg-surface-200 dark:bg-surface-900 px-6 py-10">

          {/* Mesh grid background */}
          <div className="absolute inset-0 pointer-events-none"
               style={{
                 backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)',
                 backgroundSize: '24px 24px'
               }} />

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/3 rounded-full blur-3xl" />

          {/* Theme Toggle */}
          <div className="absolute top-5 right-5 z-20">
            <ThemeToggle />
          </div>

          {/* Mobile Logo */}
          <div className="md:hidden mb-8 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-3">
              <Image src="/images/logo_icon.png" alt="DiagnosticLab" fill className="object-contain" priority />
            </div>
            <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
              Diagnostic<span className="text-emerald-500">Lab</span>
            </h1>
          </div>

          {/* Glass Card */}
          <div className="relative z-10 w-full max-w-md glass-panel-solid p-8 sm:p-10
                         animate-fade-in shadow-glass-lg">
            <LoginForm />
          </div>

          {/* Bottom Status */}
          <div className="relative z-10 mt-8 flex items-center gap-3 text-surface-400 text-mono text-[11px]">
            <div className="glow-dot glow-dot-emerald" style={{ animationDuration: '5s' }} />
            <span>Sistema Operativo</span>
            <span className="text-surface-300 dark:text-surface-600">&middot;</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </>
  )
}
