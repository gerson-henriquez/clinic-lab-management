import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import ErrorBoundary from '@/components/Common/ErrorBoundary'
import { useEffect, useState } from 'react'

/**
 * Custom App Component – Neumorphic Precision
 * Root wrapper with theme provider and loading state
 */
export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-200 dark:bg-surface-900">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500
                         shadow-glow-emerald" />
          <div className="w-24 h-1 bg-surface-300 dark:bg-surface-700 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        {/* TODO Phase 2: Add AuthProvider, NotificationProvider here */}
        <Component {...pageProps} />
      </ErrorBoundary>
    </ThemeProvider>
  )
}
