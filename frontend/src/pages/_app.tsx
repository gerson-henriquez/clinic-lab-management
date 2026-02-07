import type { AppProps } from 'next/app'
import '@/styles/globals.css'

/**
 * Custom App Component
 * 
 * This is the root component that wraps all pages in the Next.js application.
 * 
 * Purpose:
 * - Add global providers (AuthContext, NotificationContext)
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
  return (
    <>
      {/* TODO: Add AuthProvider, NotificationProvider here */}
      <Component {...pageProps} />
    </>
  )
}
