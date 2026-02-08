'use client'

import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

/**
 * ThemeToggle Component
 * 
 * Button to switch between light, dark, and system themes
 * Shows icon based on current theme
 * Smooth transitions between themes
 */

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
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
      className="relative p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group"
      aria-label="Toggle theme"
      title={`Current: ${theme} (${resolvedTheme})`}
    >
      {/* Sun Icon - Light Mode */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          resolvedTheme === 'light'
            ? 'rotate-0 scale-100 text-amber-500'
            : 'rotate-90 scale-0 text-slate-400 absolute inset-0 m-auto'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon - Dark Mode */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          resolvedTheme === 'dark'
            ? 'rotate-0 scale-100 text-indigo-400'
            : '-rotate-90 scale-0 text-slate-400 absolute inset-0 m-auto'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* Theme indicator badge */}
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-r from-brand-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}