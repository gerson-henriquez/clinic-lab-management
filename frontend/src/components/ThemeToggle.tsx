'use client'

import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

/**
 * ThemeToggle – Neumorphic Switch
 * Tactile toggle with glow feedback
 */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-700 animate-pulse" />
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <button
      onClick={cycleTheme}
      className="relative p-2.5 rounded-xl
                bg-surface-200/60 dark:bg-surface-700/40
                hover:bg-surface-300/60 dark:hover:bg-surface-600/40
                transition-all duration-300 group"
      aria-label="Toggle theme"
      title={`Tema: ${theme} (${resolvedTheme})`}
    >
      {/* Sun Icon */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          resolvedTheme === 'light'
            ? 'rotate-0 scale-100 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]'
            : 'rotate-90 scale-0 text-surface-400 absolute inset-0 m-auto'
        }`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          resolvedTheme === 'dark'
            ? 'rotate-0 scale-100 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]'
            : '-rotate-90 scale-0 text-surface-400 absolute inset-0 m-auto'
        }`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>

      {/* Glow indicator on hover */}
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full
                       bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]
                       opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
