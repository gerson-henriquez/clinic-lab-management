import type { NextPage } from 'next'
import Head from 'next/head'
import LoginForm from '@/components/auth/LoginForm'
import LoginHero from '@/components/auth/LoginHero'
import Logo from '@/components/Common/Logo'
import ThemeToggle from '@/components/ThemeToggle'

/**
 * Login Page
 * 
 * Main entry point for the application
 * Features a split-screen layout:
 * - Left: Brand hero section with features (desktop only)
 * - Right: Login form
 * 
 * Design: Clinical Modern concept with DiagnosticLab brand colors
 * Responsive: Stacks vertically on mobile, side-by-side on desktop
 * 
 * Note: UI text in Spanish, code/comments in English
 * 
 * Phase 2 TODO:
 * - Integrate with Django authentication API
 * - Add session management
 * - Implement "Remember me" functionality
 * - Add password reset flow
 */

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>DiagnosticLab - Login</title>
        <meta name="description" content="Inicie sesión en DiagnosticLab - Sistema de Gestión de Laboratorio Clínico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/logo_icon.png" />
      </Head>

      <div className="min-h-screen flex relative">
        {/* Theme Toggle - Absolute positioned */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Left Panel - Brand Hero (Hidden on mobile) */}
        <LoginHero />

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-900 theme-transition">
          <div className="w-full max-w-md">
            {/* Mobile Logo (Shown only on small screens) */}
            <div className="md:hidden mb-8 text-center">
              <Logo size="lg" className="justify-center mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Bienvenido de Nuevo
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-2">
                Inicie sesión para acceder a su panel
              </p>
            </div>

            {/* Login Card with enhanced styling */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-950/50 p-8 sm:p-10 animate-fade-in border border-slate-200 dark:border-slate-700">
              {/* Desktop Header */}
              <div className="hidden md:block mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 text-center gradient-text">
                  Iniciar Sesión
                </h2>
                <p className="text-gray-600 dark:text-slate-400">
                  Ingrese sus credenciales para acceder a su cuenta
                </p>
              </div>

              {/* Login Form */}
              <LoginForm />
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
              <p>¿Tiene problemas para iniciar sesión?</p>
              <p className="mt-1">
                Contacte a su administrador de sistema o soporte técnico
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
