/**
 * LoginForm – Neumorphic Console Input
 * Authentication form with tactile glass aesthetic
 */
import { useState, FormEvent } from 'react'
import Input from '@/components/Common/Input'
import Button from '@/components/Common/Button'
import { LockIcon } from '@/components/Common/Icons'

interface FormData {
  username: string
  password: string
  rememberMe: boolean
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    setLoginError(null)
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!formData.username.trim()) newErrors.username = 'El email es requerido'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setLoginError(null)
    try {
      // TODO: Phase 2 – Real API integration
      await new Promise(resolve => setTimeout(resolve, 1500))
      window.location.href = '/dashboard'
    } catch {
      setLoginError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      {/* ── Header ── */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
          Iniciar Sesión
        </h2>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Ingrese sus credenciales para acceder al sistema
        </p>
      </div>

      {/* ── Error Banner ── */}
      {loginError && (
        <div className="neu-pressed p-4 flex items-center gap-3 animate-fade-in">
          <div className="glow-dot glow-dot-rose flex-shrink-0" />
          <p className="text-sm text-rose-600 dark:text-rose-400">{loginError}</p>
        </div>
      )}

      {/* ── Fields ── */}
      <div className="space-y-5">
        <Input
          label="Email"
          name="username"
          type="email"
          placeholder="usuario@diagnosticlab.com"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="email"
          required
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
        />
      </div>

      {/* ── Remember & Forgot ── */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded-md neu-pressed peer-checked:bg-emerald-500
                           peer-checked:shadow-glow-emerald transition-all duration-200
                           flex items-center justify-center">
              {formData.rememberMe && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-surface-600 dark:text-surface-400 group-hover:text-surface-800 dark:group-hover:text-surface-200 transition-colors">
            Recordar sesión
          </span>
        </label>

        <button type="button"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700
                          dark:hover:text-emerald-300 transition-colors font-medium">
          ¿Olvidó su contraseña?
        </button>
      </div>

      {/* ── Submit ── */}
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        {loading ? 'Autenticando...' : 'Acceder al Sistema'}
      </Button>

      {/* ── Secure Badge ── */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <LockIcon className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-mono text-[10px] tracking-wider text-surface-400 uppercase">
          Conexión Encriptada · TLS 1.3
        </span>
      </div>
    </form>
  )
}
