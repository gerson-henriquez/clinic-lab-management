/**
 * ErrorBoundary – Catches unhandled React errors
 *
 * Wraps component trees to prevent a single component crash from
 * taking down the entire application. Shows a user-friendly
 * recovery UI instead.
 *
 * Usage in _app.tsx:
 *   <ErrorBoundary>
 *     <Component {...pageProps} />
 *   </ErrorBoundary>
 */
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional custom fallback UI */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: Send to error monitoring service (Sentry, etc.)
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30
                         flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-1">
            Algo salió mal
          </h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 max-w-sm">
            Ha ocurrido un error inesperado. Puede intentar recargar esta sección.
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                      bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 p-3 rounded-lg bg-surface-100 dark:bg-surface-800
                          text-xs text-left text-rose-600 dark:text-rose-400
                          max-w-lg overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
