import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { useEffect, useState } from 'react'

/**
 * Custom App Component
 * 
 * This is the root component that wraps all pages in the Next.js application.
 * 
 * Purpose:
 * - Add global providers (ThemeProvider, AuthContext, NotificationContext)
 * - Include global CSS
 * - Persist layout between page changes
 * - Add custom error handling
 * 
 * For teams new to Next.js:
 * - This file runs on every page
 * - Use it for app-wide state and configuration
 * - Component prop contains the active page component
 * - pageProps contains data fetched by getServerSideProps or getStaticProps
 */

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-brand-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      {/* TODO Phase 2: Add AuthProvider, NotificationProvider here */}
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
